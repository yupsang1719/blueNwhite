import { useState } from 'react'
import {
  LuGlobe, LuPlay, LuCircleCheck, LuCircleX, LuCircleDot,
  LuDownload, LuUpload, LuSearch, LuPlus, LuX, LuMail, LuBuilding2, LuMapPin,
} from 'react-icons/lu'
import { adminApi } from '../../shared/adminApi'
import { useToast } from './Toast'

const STATUS_ICON = {
  ok:          <LuCircleCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />,
  'no-emails': <LuCircleDot className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />,
  failed:      <LuCircleX className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />,
}

export default function ScraperTab() {
  const toast = useToast()

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCount, setSearchCount] = useState(10)
  const [searchResults, setSearchResults] = useState([])
  const [selectedUrls, setSelectedUrls] = useState(new Set())
  const [searching, setSearching] = useState(false)

  // Scraper state
  const [urlInput, setUrlInput] = useState('')
  const [tags, setTags] = useState('scraped')
  const [followContact, setFollowContact] = useState(true)
  const [delay, setDelay] = useState(1500)
  const [concurrency, setConcurrency] = useState(3)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState([])
  const [contacts, setContacts] = useState([])
  const [selectedContacts, setSelectedContacts] = useState(new Set())
  const [importing, setImporting] = useState(false)

  const urls = urlInput.split('\n').map(u => u.trim()).filter(Boolean)

  // ── Search ──────────────────────────────────────────────────────────────────

  async function handleSearch(e) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true); setSearchResults([]); setSelectedUrls(new Set())
    try {
      const results = await adminApi.searchUrls({ query: searchQuery, count: searchCount })
      setSearchResults(results)
      if (results.length === 0) toast.info('No results found — try a different query.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSearching(false)
    }
  }

  function toggleSelect(url) {
    setSelectedUrls(prev => {
      const next = new Set(prev)
      next.has(url) ? next.delete(url) : next.add(url)
      return next
    })
  }

  function toggleAll() {
    if (selectedUrls.size === searchResults.length) {
      setSelectedUrls(new Set())
    } else {
      setSelectedUrls(new Set(searchResults.map(r => r.url)))
    }
  }

  function addToQueue() {
    if (selectedUrls.size === 0) return
    const existing = urlInput.trim() ? urlInput.trim().split('\n') : []
    const combined = [...new Set([...existing, ...selectedUrls])]
    setUrlInput(combined.join('\n'))
    toast.success(`Added ${selectedUrls.size} URL${selectedUrls.size !== 1 ? 's' : ''} to queue`)
    setSelectedUrls(new Set())
  }

  // ── Scraper ─────────────────────────────────────────────────────────────────

  async function handleRun() {
    if (urls.length === 0) return toast.error('Enter at least one URL.')
    if (urls.length > 100) return toast.error('Max 100 URLs per run.')

    setRunning(true); setProgress([]); setContacts([]); setSelectedContacts(new Set())

    try {
      const res = await adminApi.scrapeStream({
        urls,
        followContact,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        delay,
        concurrency,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.trim()) continue
          const msg = JSON.parse(line)
          if (msg.type === 'progress') setProgress(p => [...p, msg])
          else if (msg.type === 'done') {
            setContacts(msg.contacts)
            // pre-select all by default
            setSelectedContacts(new Set(msg.contacts.map(c => c.email)))
            toast.success(`Found ${msg.total} contact${msg.total !== 1 ? 's' : ''} across ${urls.length} URL${urls.length !== 1 ? 's' : ''}`)
          }
        }
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setRunning(false)
    }
  }

  function toggleContact(email) {
    setSelectedContacts(prev => {
      const next = new Set(prev)
      next.has(email) ? next.delete(email) : next.add(email)
      return next
    })
  }

  function toggleAllContacts() {
    if (selectedContacts.size === contacts.length) {
      setSelectedContacts(new Set())
    } else {
      setSelectedContacts(new Set(contacts.map(c => c.email)))
    }
  }

  async function handleImport() {
    if (selectedContacts.size === 0) return
    setImporting(true)
    const toImport = contacts.filter(c => selectedContacts.has(c.email))
    try {
      const res = await adminApi.importContacts(toImport, 'scraper')
      toast.success(`Imported ${res.inserted} contact${res.inserted !== 1 ? 's' : ''}${res.skipped > 0 ? `, ${res.skipped} skipped (duplicates)` : ''}`)
      setContacts([]); setProgress([]); setSelectedContacts(new Set())
    } catch (e) {
      toast.error(e.message)
    } finally {
      setImporting(false)
    }
  }

  function handleDownload() {
    const toExport = contacts.filter(c => selectedContacts.has(c.email))
    const blob = new Blob([JSON.stringify(toExport, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'scraped-emails.json'
    a.click()
  }

  const found  = progress.filter(p => p.status === 'ok').length
  const empty  = progress.filter(p => p.status === 'no-emails').length
  const failed = progress.filter(p => p.status === 'failed').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Scraper</h1>
        <p className="text-sm text-gray-500 mt-0.5">Search for businesses to target, then scrape their emails.</p>
      </div>

      {/* ── Step 1: Search ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0">1</span>
          <h2 className="text-sm font-semibold text-gray-800">Find URLs via Search</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder='e.g. "pubs in Aldershot Hampshire" or "restaurants Farnham site:.co.uk"'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition w-32"
            value={searchCount}
            onChange={e => setSearchCount(Number(e.target.value))}
          >
            <option value={5}>5 results</option>
            <option value={10}>10 results</option>
            <option value={20}>20 results</option>
          </select>
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors shrink-0"
          >
            <LuSearch className="w-4 h-4" />
            {searching ? 'Searching…' : 'Search'}
          </button>
        </form>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <button onClick={toggleAll} className="text-xs text-blue-600 hover:underline cursor-pointer">
                {selectedUrls.size === searchResults.length ? 'Deselect all' : 'Select all'}
              </button>
              <span className="text-xs text-gray-400">{selectedUrls.size} selected</span>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 mb-3">
              {searchResults.map((r, i) => (
                <label key={i} className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${selectedUrls.has(r.url) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    checked={selectedUrls.has(r.url)}
                    onChange={() => toggleSelect(r.url)}
                    className="accent-blue-600 mt-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                    <p className="text-xs text-blue-600 truncate">{r.url}</p>
                    {r.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{r.description}</p>}
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={addToQueue}
              disabled={selectedUrls.size === 0}
              className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <LuPlus className="w-4 h-4" />
              Add {selectedUrls.size > 0 ? selectedUrls.size : ''} to scrape queue
            </button>
          </div>
        )}
      </div>

      {/* ── Step 2: Scrape ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0">2</span>
          <h2 className="text-sm font-semibold text-gray-800">Scrape emails from URLs</h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              URLs <span className="font-normal text-gray-400">(one per line, max 100)</span>
            </label>
            <div className="relative">
              <textarea
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono h-44 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder={"https://theredlion.co.uk\nhttps://bullbarkham.co.uk"}
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                disabled={running}
              />
              {urls.length > 0 && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    {urls.length} URL{urls.length !== 1 ? 's' : ''}
                  </span>
                  {!running && (
                    <button onClick={() => setUrlInput('')} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                      <LuX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tags</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="pub, aldershot"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Parallel requests</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
                value={concurrency}
                onChange={e => setConcurrency(Number(e.target.value))}
              >
                <option value={1}>1 — sequential</option>
                <option value={3}>3 — default</option>
                <option value={5}>5 — faster</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Delay between batches</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
                value={delay}
                onChange={e => setDelay(Number(e.target.value))}
              >
                <option value={1000}>1 second</option>
                <option value={1500}>1.5 seconds</option>
                <option value={2000}>2 seconds</option>
                <option value={3000}>3 seconds (polite)</option>
              </select>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={followContact} onChange={e => setFollowContact(e.target.checked)} className="accent-blue-600 w-4 h-4" />
              <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                Check contact/about/team pages
              </span>
            </label>
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={running || urls.length === 0}
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors"
        >
          <LuPlay className="w-4 h-4" />
          {running ? `Scraping ${progress.length} / ${urls.length}…` : 'Run Scraper'}
        </button>
      </div>

      {/* ── Progress ── */}
      {progress.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Progress</h3>
            <div className="flex gap-4 text-xs">
              <span className="text-green-600 font-medium">{found} with emails</span>
              <span className="text-gray-400">{empty} empty</span>
              {failed > 0 && <span className="text-red-500">{failed} failed</span>}
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(progress.length / urls.length) * 100}%` }}
            />
          </div>

          <div className="border border-gray-100 rounded-lg divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {progress.map((p, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                {STATUS_ICON[p.status]}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-gray-600 truncate">{p.url}</p>
                  {p.status === 'ok' && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.found} email{p.found !== 1 ? 's' : ''}
                      {p.pagesChecked > 1 && <span className="text-blue-400"> · {p.pagesChecked} pages checked</span>}
                      {p.company && ` · ${p.company}`}
                      {p.location && ` · ${p.location}`}
                    </p>
                  )}
                  {p.status === 'no-emails' && <p className="text-xs text-gray-400 mt-0.5">No emails found</p>}
                  {p.status === 'failed' && <p className="text-xs text-red-400 mt-0.5">Failed to fetch</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {contacts.length > 0 && !running && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <LuCircleCheck className="w-5 h-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {contacts.length} contact{contacts.length !== 1 ? 's' : ''} found
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select which ones to import
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={selectedContacts.size === 0}
                className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer transition-colors"
              >
                <LuDownload className="w-4 h-4" />
                Export JSON
              </button>
              <button
                onClick={handleImport}
                disabled={importing || selectedContacts.size === 0}
                className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors"
              >
                <LuUpload className="w-4 h-4" />
                {importing ? 'Importing…' : `Import ${selectedContacts.size} selected`}
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    className="accent-blue-600 cursor-pointer"
                    checked={selectedContacts.size === contacts.length && contacts.length > 0}
                    onChange={toggleAllContacts}
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <div className="flex items-center gap-1.5"><LuMail className="w-3.5 h-3.5" />Email</div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <div className="flex items-center gap-1.5"><LuBuilding2 className="w-3.5 h-3.5" />Company</div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <div className="flex items-center gap-1.5"><LuMapPin className="w-3.5 h-3.5" />Location</div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((c, i) => (
                <tr
                  key={i}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedContacts.has(c.email) ? 'bg-blue-50' : ''}`}
                  onClick={() => toggleContact(c.email)}
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      className="accent-blue-600 cursor-pointer"
                      checked={selectedContacts.has(c.email)}
                      onChange={() => toggleContact(c.email)}
                      onClick={e => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{c.email}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{c.company || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{c.location || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.tags?.map(t => (
                        <span key={t} className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0.5 rounded font-medium">{t}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {selectedContacts.size} of {contacts.length} selected
            </span>
            <button onClick={toggleAllContacts} className="text-xs text-blue-600 hover:underline cursor-pointer">
              {selectedContacts.size === contacts.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
