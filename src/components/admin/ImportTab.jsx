import { useState } from 'react'
import { LuUpload, LuFileJson, LuFileText, LuCircleCheck } from 'react-icons/lu'
import { adminApi } from '../../shared/adminApi'
import { useToast } from './Toast'

const EXAMPLE = `[
  {
    "email": "owner@theredlion.co.uk",
    "name": "John Smith",
    "company": "The Red Lion",
    "location": "Aldershot",
    "tags": ["pub", "prospect"]
  },
  {
    "email": "info@venue.co.uk",
    "company": "The Venue",
    "location": "Farnham",
    "tags": ["venue"]
  }
]`

export default function ImportTab() {
  const toast = useToast()
  const [json, setJson] = useState('')
  const [source, setSource] = useState('import')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  function parseCSV(text) {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
    return lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const obj = {}
      headers.forEach((h, i) => { if (vals[i]) obj[h] = vals[i] })
      if (obj.tags) obj.tags = obj.tags.split(';').map(t => t.trim())
      return obj
    }).filter(c => c.email)
  }

  function loadFile(file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target.result
      try {
        const contacts = file.name.endsWith('.csv') ? parseCSV(text) : JSON.parse(text)
        setJson(JSON.stringify(contacts, null, 2))
        toast.info(`Loaded ${contacts.length} contacts from file`)
      } catch {
        toast.error('Could not parse file. Check format and try again.')
      }
    }
    reader.readAsText(file)
  }

  function handleFileInput(e) { if (e.target.files[0]) loadFile(e.target.files[0]) }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) loadFile(file)
  }

  async function handleImport() {
    setResult(null)
    let parsed
    try { parsed = JSON.parse(json) }
    catch { return toast.error('Invalid JSON — check your formatting.') }
    if (!Array.isArray(parsed)) return toast.error('Must be a JSON array of contacts.')

    setLoading(true)
    try {
      const res = await adminApi.importContacts(parsed, source)
      setResult(res)
      setJson('')
      toast.success(`Imported ${res.inserted} contacts${res.skipped > 0 ? `, ${res.skipped} duplicates skipped` : ''}`)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const contactCount = (() => { try { const p = JSON.parse(json); return Array.isArray(p) ? p.length : 0 } catch { return 0 } })()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Import Contacts</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upload a CSV or paste a JSON array. Duplicates are skipped automatically.</p>
      </div>

      {/* Format guide */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <LuFileJson className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-800">JSON Array</span>
          </div>
          <p className="text-xs text-gray-500">Fields: <code className="bg-gray-100 px-1 rounded">email</code> <code className="bg-gray-100 px-1 rounded">name</code> <code className="bg-gray-100 px-1 rounded">company</code> <code className="bg-gray-100 px-1 rounded">location</code> <code className="bg-gray-100 px-1 rounded">tags</code></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <LuFileText className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-800">CSV File</span>
          </div>
          <p className="text-xs text-gray-500">Same column headers. Separate multiple tags with semicolons <code className="bg-gray-100 px-1 rounded">pub;prospect</code></p>
        </div>
      </div>

      <div className="flex gap-4 mb-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">Source tag:</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
            value={source}
            onChange={e => setSource(e.target.value)}
          >
            <option value="import">Manual Import</option>
            <option value="scraper">Scraper</option>
            <option value="manual">Manual Entry</option>
          </select>
        </div>

        <label className="ml-auto flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors">
          <LuUpload className="w-4 h-4" />
          Upload file
          <input type="file" accept=".csv,.json" className="hidden" onChange={handleFileInput} />
        </label>
      </div>

      {/* Drop zone + textarea */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 rounded-xl transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300 bg-white'}`}
      >
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-blue-50/80 z-10">
            <p className="text-blue-600 font-medium text-sm">Drop file here</p>
          </div>
        )}
        <textarea
          className="w-full px-4 py-3 text-sm font-mono h-64 resize-y bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={EXAMPLE}
          value={json}
          onChange={e => { setJson(e.target.value); setResult(null) }}
        />
        {json && !dragOver && (
          <div className="absolute bottom-3 right-3 bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {contactCount} contact{contactCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <LuCircleCheck className="w-4 h-4 text-green-500 shrink-0" />
          <p className="text-sm text-green-700">
            <strong>{result.inserted}</strong> contacts imported
            {result.skipped > 0 && <>, <strong>{result.skipped}</strong> duplicates skipped</>}.
          </p>
        </div>
      )}

      <button
        onClick={handleImport}
        disabled={loading || !json.trim()}
        className="mt-4 bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors"
      >
        {loading ? 'Importing…' : `Import${contactCount > 0 ? ` ${contactCount} contacts` : ''}`}
      </button>
    </div>
  )
}
