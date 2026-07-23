import { Router } from 'express'
import { load } from 'cheerio'
import { extractEmails, extractMeta } from '../scraper/extract.js'

const router = Router()

// Pages to try within each domain, in priority order
const CONTACT_PATHS = [
  '/contact',
  '/contact-us',
  '/contacts',
  '/about',
  '/about-us',
  '/team',
  '/our-team',
  '/staff',
  '/reach-us',
  '/get-in-touch',
]

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-GB,en;q=0.9',
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    })
    if (!res.ok) return null
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('html')) return null
    return await res.text()
  } catch {
    return null
  }
}

async function fetchWithRetry(url) {
  const html = await fetchPage(url)
  if (html) return html
  // One retry after 2s
  await sleep(2000)
  return fetchPage(url)
}

// Simple concurrency limiter — runs `tasks` with at most `limit` in-flight at once
async function pLimit(limit, tasks) {
  const results = []
  const queue = [...tasks]
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const task = queue.shift()
      results.push(await task())
    }
  })
  await Promise.all(workers)
  return results
}

async function scrapeOne(url, { followContact, tags }) {
  const result = { url, emails: [], company: '', location: '', pagesChecked: 1, status: 'ok' }

  const html = await fetchWithRetry(url)
  if (!html) { result.status = 'failed'; return result }

  const $ = load(html)
  const meta = extractMeta($)
  result.company = meta.company
  result.location = meta.location

  let emails = extractEmails(html)

  // Multi-page crawl — try contact/about/team paths until we find emails
  if (followContact) {
    const base = new URL(url).origin
    for (const path of CONTACT_PATHS) {
      if (emails.length > 0) break
      const pageUrl = `${base}${path}`
      if (pageUrl === url) continue // don't re-fetch the page we already have

      const pageHtml = await fetchPage(pageUrl)
      if (!pageHtml) continue

      result.pagesChecked++
      const found = extractEmails(pageHtml)
      if (found.length > 0) {
        emails = found
        // Also update meta if main page had nothing
        if (!result.company || !result.location) {
          const page$ = load(pageHtml)
          const pageMeta = extractMeta(page$)
          if (!result.company) result.company = pageMeta.company
          if (!result.location) result.location = pageMeta.location
        }
      }
      // Small pause between sub-pages
      await sleep(400)
    }
  }

  result.emails = emails
  if (emails.length === 0) result.status = 'no-emails'
  return result
}

// POST /api/admin/scraper/search — find URLs via Serper.dev (if key set) or DuckDuckGo (free fallback)
router.post('/search', async (req, res) => {
  const { query, count = 10 } = req.body
  if (!query) return res.status(400).json({ error: 'query is required' })

  try {
    const results = process.env.SERPER_API_KEY
      ? await searchSerper(query, count)
      : await searchDuckDuckGo(query, count)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

async function searchSerper(query, count) {
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.SERPER_API_KEY,
    },
    body: JSON.stringify({ q: query, num: count, gl: 'gb', hl: 'en' }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Serper error: ${res.status}`)
  const data = await res.json()
  return (data.organic || []).map(r => ({
    title: r.title,
    url: r.link,
    description: r.snippet,
  }))
}

async function searchDuckDuckGo(query, count) {
  // DDG lite works better with POST + form encoding
  const body = new URLSearchParams({ q: query, kl: 'uk-en' })
  const res = await fetch('https://lite.duckduckgo.com/lite/', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-GB,en;q=0.5',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'https://lite.duckduckgo.com/',
    },
    body: body.toString(),
    signal: AbortSignal.timeout(12000),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`DuckDuckGo returned ${res.status}`)

  const html = await res.text()
  const $ = load(html)

  const results = []

  $('a.result-link').each((_, el) => {
    if (results.length >= count) return false
    let href = $(el).attr('href') || ''

    // DDG lite wraps real URLs in redirect: /l/?uddg=https%3A%2F%2F...
    if (href.includes('uddg=')) {
      try {
        const uddg = new URLSearchParams(href.split('?')[1]).get('uddg')
        if (uddg) href = decodeURIComponent(uddg)
      } catch { /* keep original */ }
    }

    const title = $(el).text().trim()
    if (!href || !title || href.includes('duckduckgo.com')) return
    const fullUrl = href.startsWith('http') ? href : href.startsWith('//') ? `https:${href}` : null
    if (!fullUrl) return

    const snippet = $(el).closest('tr').next('tr').find('td').text().trim()
    results.push({ title, url: fullUrl, description: snippet })
  })

  // Fallback: grab any external link in the result table
  if (results.length === 0) {
    $('table a[href]').each((_, el) => {
      if (results.length >= count) return false
      let href = $(el).attr('href') || ''
      if (href.includes('uddg=')) {
        try {
          const uddg = new URLSearchParams(href.split('?')[1]).get('uddg')
          if (uddg) href = decodeURIComponent(uddg)
        } catch { /* keep */ }
      }
      if (!href.startsWith('http')) return
      if (href.includes('duckduckgo.com')) return
      const title = $(el).text().trim()
      if (!title || title.length < 4) return
      results.push({ title, url: href, description: '' })
    })
  }

  console.log(`[DDG] query="${query}" → ${results.length} results (html length: ${html.length})`)
  return results
}

// POST /api/admin/scraper/run
router.post('/run', async (req, res) => {
  const {
    urls = [],
    followContact = true,
    tags = ['scraped'],
    delay = 1500,
    concurrency = 3,
  } = req.body

  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'urls array is required' })
  }
  if (urls.length > 100) {
    return res.status(400).json({ error: 'Max 100 URLs per run' })
  }

  res.setHeader('Content-Type', 'application/x-ndjson')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.flushHeaders()

  const allContacts = []
  const seen = new Set()
  const validUrls = urls.map(u => u.trim()).filter(Boolean)

  // Process in batches matching concurrency level
  const batchSize = Math.min(concurrency, 5)
  for (let i = 0; i < validUrls.length; i += batchSize) {
    const batch = validUrls.slice(i, i + batchSize)

    const tasks = batch.map(url => () => scrapeOne(url, { followContact, tags }))
    const results = await pLimit(batchSize, tasks)

    for (const result of results) {
      const contacts = result.emails.map(email => ({
        email,
        company: result.company || undefined,
        location: result.location || undefined,
        tags,
        source: 'scraper',
      })).filter(c => !seen.has(c.email) && seen.add(c.email))

      allContacts.push(...contacts)

      res.write(JSON.stringify({
        type: 'progress',
        url: result.url,
        status: result.status,
        found: contacts.length,
        pagesChecked: result.pagesChecked,
        company: result.company,
        location: result.location,
      }) + '\n')
    }

    // Delay between batches (not within a batch — concurrent requests handle their own timing)
    if (i + batchSize < validUrls.length) await sleep(delay)
  }

  res.write(JSON.stringify({
    type: 'done',
    total: allContacts.length,
    contacts: allContacts,
  }) + '\n')

  res.end()
})

export default router
