#!/usr/bin/env node
/**
 * Email Scraper CLI
 *
 * Usage:
 *   node scraper/index.js --urls "https://site1.co.uk,https://site2.co.uk"
 *   node scraper/index.js --file urls.txt
 *   node scraper/index.js --urls "..." --out results.json --delay 2000 --follow-contact
 *
 * Output: JSON array ready to paste into the admin Import tab.
 */

import fs from 'fs'
import path from 'path'
import { load } from 'cheerio'
import { extractEmails, extractMeta } from './extract.js'

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
function arg(name) {
  const i = args.indexOf(name)
  return i !== -1 ? args[i + 1] : null
}
function flag(name) { return args.includes(name) }

const urlsArg     = arg('--urls')
const fileArg     = arg('--file')
const outArg      = arg('--out') || 'scraped-emails.json'
const delay       = parseInt(arg('--delay') || '1500', 10)
const followContact = flag('--follow-contact')
const tagArg      = arg('--tag') || ''

if (!urlsArg && !fileArg) {
  console.error(`
Usage:
  node scraper/index.js --urls "https://site1.co.uk,https://site2.co.uk"
  node scraper/index.js --file urls.txt [--out results.json] [--delay 2000] [--follow-contact] [--tag pub]
  `)
  process.exit(1)
}

// ── URL list ──────────────────────────────────────────────────────────────────

let urls = []
if (urlsArg) {
  urls = urlsArg.split(',').map(u => u.trim()).filter(Boolean)
} else {
  const raw = fs.readFileSync(fileArg, 'utf8')
  urls = raw.split('\n').map(u => u.trim()).filter(u => u && !u.startsWith('#'))
}

console.log(`\n🔍 Scraping ${urls.length} URL${urls.length !== 1 ? 's' : ''}...\n`)

// ── Core fetch ────────────────────────────────────────────────────────────────

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; OutreachBot/1.0; +https://bluenwhite.co.uk)',
  'Accept': 'text/html,application/xhtml+xml',
  'Accept-Language': 'en-GB,en;q=0.9',
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(10000) })
    if (!res.ok) return null
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('html')) return null
    return await res.text()
  } catch {
    return null
  }
}

async function checkRobots(baseUrl) {
  try {
    const robotsUrl = new URL('/robots.txt', baseUrl).href
    const res = await fetch(robotsUrl, { headers: HEADERS, signal: AbortSignal.timeout(5000) })
    if (!res.ok) return true // assume allowed if no robots.txt
    const text = await res.text()
    // Very simple check: if Disallow: / for * or our bot, skip
    const lines = text.split('\n').map(l => l.trim().toLowerCase())
    let inOurSection = false
    for (const line of lines) {
      if (line.startsWith('user-agent:')) {
        inOurSection = line.includes('*') || line.includes('outreachbot')
      }
      if (inOurSection && line === 'disallow: /') return false
    }
    return true
  } catch {
    return true
  }
}

// ── Scrape one URL ────────────────────────────────────────────────────────────

async function scrapeUrl(url) {
  const baseUrl = new URL(url).origin

  // Robots check
  const allowed = await checkRobots(baseUrl)
  if (!allowed) {
    console.log(`  ⛔ ${url} — blocked by robots.txt`)
    return []
  }

  const html = await fetchPage(url)
  if (!html) {
    console.log(`  ✗  ${url} — failed to fetch`)
    return []
  }

  const $ = load(html)
  const { company, location } = extractMeta($)
  let emails = extractEmails(html)

  // Optionally follow /contact page for more emails
  if (followContact && emails.length === 0) {
    const contactUrl = `${baseUrl}/contact`
    const contactHtml = await fetchPage(contactUrl)
    if (contactHtml) emails = extractEmails(contactHtml)
    await sleep(500)
  }

  if (emails.length === 0) {
    console.log(`  ○  ${url} — no emails found`)
    return []
  }

  console.log(`  ✓  ${url} — ${emails.length} email${emails.length !== 1 ? 's' : ''} (${company || 'unknown company'})`)

  const tags = tagArg ? tagArg.split(',').map(t => t.trim()) : ['scraped']

  return emails.map(email => ({
    email,
    company: company || undefined,
    location: location || undefined,
    tags,
    source: 'scraper',
  }))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function deduplicateByEmail(contacts) {
  const seen = new Set()
  return contacts.filter(c => {
    if (seen.has(c.email)) return false
    seen.add(c.email); return true
  })
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const allContacts = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const contacts = await scrapeUrl(url)
    allContacts.push(...contacts)

    // Rate limit — skip delay after last URL
    if (i < urls.length - 1) await sleep(delay)
  }

  const unique = deduplicateByEmail(allContacts)

  const outPath = path.resolve(outArg)
  fs.writeFileSync(outPath, JSON.stringify(unique, null, 2))

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Done
  Scraped:    ${allContacts.length} emails
  Unique:     ${unique.length} contacts
  Output:     ${outPath}

Next step: paste the JSON into Admin → Import
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
}

main().catch(err => { console.error(err); process.exit(1) })
