import { useState } from 'react'
import { LuX, LuSave } from 'react-icons/lu'
import { adminApi } from '../../shared/adminApi'
import { useToast } from './Toast'

export default function EditContactModal({ contact, onClose, onSaved }) {
  const toast = useToast()
  const [form, setForm] = useState({
    name: contact.name || '',
    email: contact.email || '',
    company: contact.company || '',
    location: contact.location || '',
    tags: (contact.tags || []).join(', '),
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email.trim()) { setError('Email is required'); return }
    setError('')
    setSaving(true)
    try {
      const tags = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
      await adminApi.updateContact(contact._id, {
        name: form.name.trim() || undefined,
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        location: form.location.trim() || undefined,
        tags,
      })
      toast.success('Contact updated')
      onSaved()
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Edit Contact</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono"
              value={form.email}
              onChange={set('email')}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. John Smith"
              value={form.name}
              onChange={set('name')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Company</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g. The Red Lion"
                value={form.company}
                onChange={set('company')}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Location</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g. Aldershot"
                value={form.location}
                onChange={set('location')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Tags
              <span className="font-normal text-gray-400 ml-1">(comma-separated)</span>
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. pubs, aldershot, scraped"
              value={form.tags}
              onChange={set('tags')}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <LuSave className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
