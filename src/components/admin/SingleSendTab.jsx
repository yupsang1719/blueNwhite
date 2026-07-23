import { useState, useEffect } from 'react'
import { LuMail, LuSend, LuCircleCheck } from 'react-icons/lu'
import { adminApi } from '../../shared/adminApi'
import { useToast } from './Toast'

export default function SingleSendTab() {
  const toast = useToast()

  const [templates, setTemplates] = useState([])
  const [form, setForm] = useState({
    to: '', subject: '', templateId: '',
    name: '', company: '', location: '', customLine: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(null)
  const [debouncedUrl, setDebouncedUrl] = useState(null)

  useEffect(() => {
    adminApi.getTemplates().then(t => {
      setTemplates(t)
      if (t.length) setForm(f => ({ ...f, templateId: t[0].id }))
    })
  }, [])

  function set(key) { return e => setForm(f => ({ ...f, [key]: e.target.value })) }

  const previewUrl = form.templateId
    ? adminApi.previewUrl(form.templateId, {
        name: form.name, company: form.company,
        location: form.location, customLine: form.customLine,
      })
    : null

  // Debounce: only update the iframe src 350ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => setDebouncedUrl(previewUrl), 350)
    return () => clearTimeout(t)
  }, [previewUrl])

  async function handleSend(e) {
    e.preventDefault()
    if (!form.to || !form.subject || !form.templateId) return toast.error('To, subject and template are required.')
    setLoading(true); setSent(null)
    try {
      const res = await adminApi.sendSingle(form)
      setSent(res.id)
      toast.success(`Email sent to ${form.to}`)
      setForm(f => ({ ...f, to: '', name: '', company: '', location: '', customLine: '' }))
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Single Send</h1>
        <p className="text-sm text-gray-500 mt-0.5">Send to one address — perfect for individual outreach or testing templates.</p>
      </div>

      <div className="flex gap-6 items-start">

        {/* ── Left: form ── */}
        <div className="w-96 shrink-0">
          <form onSubmit={handleSend} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">To *</label>
              <div className="relative">
                <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="recipient@example.co.uk"
                  value={form.to}
                  onChange={set('to')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Template *</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
                value={form.templateId}
                onChange={set('templateId')}
              >
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject line *</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Had a look at your website — quick thought"
                value={form.subject}
                onChange={set('subject')}
              />
            </div>

            <div className="pt-1 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Personalisation</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Sarah"
                    value={form.name}
                    onChange={set('name')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Company</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Aldershot Dental Practice"
                    value={form.company}
                    onChange={set('company')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Location</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Aldershot"
                    value={form.location}
                    onChange={set('location')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Custom line</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="I noticed your website doesn't have an online booking system…"
                    value={form.customLine}
                    onChange={set('customLine')}
                  />
                </div>
              </div>
            </div>

            {sent && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <LuCircleCheck className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-sm text-green-700">Sent! ID: <code className="font-mono text-xs">{sent}</code></span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <LuSend className="w-4 h-4" />
              {loading ? 'Sending…' : 'Send Email'}
            </button>
          </form>
        </div>

        {/* ── Right: live preview ── */}
        <div className="flex-1 min-w-0 sticky top-20">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-medium text-gray-500">Live preview</span>
              <span className="text-xs text-gray-400">Updates as you type</span>
            </div>
            {debouncedUrl ? (
              <iframe
                src={debouncedUrl}
                className="w-full bg-white"
                style={{ height: 'calc(100% - 41px)', border: 'none' }}
                title="Email preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300 text-sm">
                Select a template to preview
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
