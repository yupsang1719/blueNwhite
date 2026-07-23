// Email patterns to skip — generic/system addresses unlikely to reach a human
const SKIP_PATTERNS = /^(noreply|no-reply|donotreply|info|hello|contact|support|admin|help|sales|enquiries|enquiry|webmaster|postmaster|abuse|spam|marketing|newsletter|notifications?|feedback|press|media|privacy|legal|jobs|careers|recruitment)\b/i

// UK postcode regex for location detection
const UK_POSTCODE = /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/i

export function extractEmails(html) {
  const emails = new Set()

  // 1. mailto: links — most reliable
  for (const m of html.matchAll(/href=["']mailto:([^"'?&\s]+)/gi)) {
    const e = decodeHtmlEntities(m[1]).toLowerCase().trim()
    if (isValidEmail(e)) emails.add(e)
  }

  // 2. Plain email addresses in text/attributes
  for (const m of html.matchAll(/([a-zA-Z0-9._%+\-]+[@＠][a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g)) {
    const e = m[1].replace('＠', '@').toLowerCase().trim()
    if (isValidEmail(e)) emails.add(e)
  }

  // 3. HTML entity encoded — e.g. user&#64;domain&#46;com or user&#x40;domain
  const decoded = decodeHtmlEntities(html)
  for (const m of decoded.matchAll(/([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g)) {
    const e = m[1].toLowerCase().trim()
    if (isValidEmail(e)) emails.add(e)
  }

  // 4. Obfuscated: name [at] domain [dot] co [dot] uk  /  name(at)domain(dot)com
  const obfuscated = html
    .replace(/\s*\[at\]\s*|\s*\(at\)\s*|\s+at\s+/gi, '@')
    .replace(/\s*\[dot\]\s*|\s*\(dot\)\s*/gi, '.')
  for (const m of obfuscated.matchAll(/([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g)) {
    const e = m[1].toLowerCase().trim()
    if (isValidEmail(e)) emails.add(e)
  }

  // 5. CSS/JS obfuscated with data attributes — e.g. data-user="name" data-domain="domain.co.uk"
  const userMatches = [...html.matchAll(/data-user=["']([^"']+)["']/gi)]
  const domainMatches = [...html.matchAll(/data-domain=["']([^"']+)["']/gi)]
  for (let i = 0; i < Math.min(userMatches.length, domainMatches.length); i++) {
    const e = `${userMatches[i][1]}@${domainMatches[i][1]}`.toLowerCase()
    if (isValidEmail(e)) emails.add(e)
  }

  return [...emails].filter(e => !SKIP_PATTERNS.test(e.split('@')[0]))
}

export function extractMeta($) {
  const company =
    $('meta[property="og:site_name"]').attr('content') ||
    $('meta[property="og:title"]').attr('content') ||
    $('title').text().split(/[|\-–]/)[0].trim() ||
    ''

  // Try schema.org LocalBusiness/Organization for location
  let location = ''
  const schema = $('script[type="application/ld+json"]').toArray()
  for (const el of schema) {
    try {
      const raw = $(el).html()
      const data = JSON.parse(raw)
      const items = Array.isArray(data) ? data : [data]
      for (const item of items) {
        const address = item?.address || item?.location?.address
        if (address) {
          const city = address.addressLocality || address.addressRegion || ''
          if (city) { location = city; break }
        }
      }
      if (location) break
    } catch { /* ignore malformed JSON-LD */ }
  }

  // Fallback: look for UK postcode in visible text
  if (!location) {
    const bodyText = $('body').text()
    const match = bodyText.match(UK_POSTCODE)
    if (match) location = match[0].toUpperCase()
  }

  return {
    company: company.slice(0, 120),
    location: location.slice(0, 80),
  }
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&#64;|&#x40;/gi, '@')
    .replace(/&#46;|&#x2e;/gi, '.')
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) &&
    !email.includes('..') &&
    email.length < 100 &&
    !/\.(png|jpg|jpeg|gif|svg|webp|css|js)$/i.test(email)
}
