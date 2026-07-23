import { useState, useEffect } from 'react'
import {
  LuMegaphone, LuPlus, LuSend, LuEye, LuClock,
  LuCircleCheck, LuCircleX, LuLoader, LuArrowLeft,
  LuList, LuMail, LuCalendar, LuTrendingUp, LuUsers,
  LuX, LuSearch,
} from 'react-icons/lu'
import { adminApi } from '../../shared/adminApi'
import { useToast } from './Toast'

const STATUS = {
  draft:   { label: 'Draft',   cls: 'bg-gray-100 text-gray-600',    Icon: LuClock },
  sending: { label: 'Sending', cls: 'bg-yellow-100 text-yellow-700', Icon: LuLoader },
  sent:    { label: 'Sent',    cls: 'bg-green-100 text-green-700',   Icon: LuCircleCheck },
  failed:  { label: 'Failed',  cls: 'bg-red-100 text-red-600',      Icon: LuCircleX },
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.draft
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>
      <s.Icon className="w-3 h-3" />
      {s.label}
    </span>
  )
}

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/* ── Email preview drawer ── */
function EmailDrawer({ contact, templateId, subject, onClose }) {
  const previewUrl = adminApi.previewUrl(templateId, {
    name: contact.name,
    company: contact.company,
    location: contact.location,
  })
  const sentBadge = contact.status === 'sent'
    ? <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">Delivered</span>
    : contact.status === 'failed'
    ? <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">Failed</span>
    : contact.status === 'skipped'
    ? <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">Skipped (unsubscribed)</span>
    : <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">Pending</span>

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl h-full flex flex-col shadow-2xl">
        {/* Drawer header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0 flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{contact.name || contact.email}</p>
              {sentBadge}
            </div>
            <p className="text-xs text-gray-400 font-mono">{contact.email}</p>
            {contact.company && <p className="text-xs text-gray-400">{contact.company}{contact.location ? ` · ${contact.location}` : ''}</p>}
            <p className="text-xs text-gray-500 mt-2"><span className="text-gray-400">Subject:</span> {subject}</p>
            {contact.resendId && (
              <p className="text-xs text-gray-400 mt-0.5">Resend ID: <span className="font-mono">{contact.resendId}</span></p>
            )}
            {contact.error && (
              <p className="text-xs text-red-500 mt-0.5">Error: {contact.error}</p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors shrink-0">
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* Email iframe */}
        <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
          {contact.status === 'failed' ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <LuCircleX className="w-12 h-12 text-red-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Email was not delivered</p>
                {contact.error && <p className="text-sm text-red-500 mt-1">{contact.error}</p>}
              </div>
            </div>
          ) : (
            <iframe
              src={previewUrl}
              className="w-full h-full rounded-xl border border-gray-200 bg-white"
              title={`Email to ${contact.email}`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Prospects tab ── */
function ProspectsTab({ campaignId, templateId, subject }) {
  const toast = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    adminApi.getCampaignContacts(campaignId)
      .then(setData)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [campaignId])

  const contacts = data?.contacts || []
  const filtered = contacts.filter(c => {
    const matchSearch = !search || [c.email, c.name, c.company].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  const counts = {
    all: contacts.length,
    sent: contacts.filter(c => c.status === 'sent').length,
    failed: contacts.filter(c => c.status === 'failed').length,
    pending: contacts.filter(c => c.status === 'pending').length,
    skipped: contacts.filter(c => c.status === 'skipped').length,
  }

  const statusStyle = {
    sent:    'bg-green-50 text-green-700',
    failed:  'bg-red-50 text-red-600',
    pending: 'bg-blue-50 text-blue-700',
    skipped: 'bg-gray-100 text-gray-500',
  }

  if (loading) return (
    <div className="space-y-2 animate-pulse">
      {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
    </div>
  )

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Search by name, email or company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {['all', 'sent', 'failed', 'pending', 'skipped'].filter(s => counts[s] > 0).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md cursor-pointer transition-all capitalize ${
                filter === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s} <span className="text-gray-400 ml-0.5">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No contacts match your filter.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setPreview(c)}
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 text-sm">{c.name || <span className="text-gray-400 italic">No name</span>}</p>
                    <p className="text-xs text-gray-400 font-mono">{c.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 text-xs">{c.company || <span className="text-gray-300">—</span>}</td>
                  <td className="px-5 py-3 text-gray-600 text-xs">{c.location || <span className="text-gray-300">—</span>}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle[c.status] || 'bg-gray-100 text-gray-500'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-auto cursor-pointer">
                      <LuEye className="w-3.5 h-3.5" /> View email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          {filtered.length} of {contacts.length} contacts
        </div>
      </div>

      {preview && (
        <EmailDrawer
          contact={preview}
          templateId={templateId}
          subject={subject}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  )
}

/* ── Campaign detail ── */
function CampaignDetail({ campaign: stub, onBack, onResend }) {
  const toast = useToast()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    adminApi.getCampaign(stub._id)
      .then(setCampaign)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [stub._id])

  async function handleSend() {
    setSending(true)
    try {
      await adminApi.sendCampaign(stub._id)
      toast.success('Sending started — stats will update shortly.')
      setTimeout(() => {
        adminApi.getCampaign(stub._id).then(setCampaign).catch(() => {})
        onResend()
      }, 3000)
    } catch (e) { toast.error(e.message) }
    finally { setSending(false) }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${50 + i * 10}%` }} />)}
        </div>
      </div>
    )
  }

  if (!campaign) return null

  const { stats } = campaign
  const deliveryRate = stats.total > 0 ? Math.round((stats.sent / stats.total) * 100) : 0
  const isSent = campaign.status === 'sent' || campaign.status === 'failed'

  return (
    <div>
      {/* Back + title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors shrink-0">
            <LuArrowLeft className="w-4 h-4" /> All Campaigns
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-semibold text-gray-900 truncate">{campaign.name}</h1>
          <StatusBadge status={campaign.status} />
        </div>
        {campaign.status === 'draft' && (
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-40 cursor-pointer transition-colors shrink-0"
          >
            {sending ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuSend className="w-4 h-4" />}
            {sending ? 'Sending…' : 'Send Campaign'}
          </button>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {[
          { id: 'overview',   label: 'Overview' },
          { id: 'prospects',  label: `Prospects${stats.total ? ` (${stats.total})` : ''}` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-sm font-medium px-5 py-2 rounded-lg cursor-pointer transition-all ${
              tab === t.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {isSent ? (
              <>
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Delivered</p>
                  <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
                  <p className="text-xs text-gray-400 mt-1">of {stats.total} total</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Failed</p>
                  <p className={`text-3xl font-bold ${stats.failed > 0 ? 'text-red-500' : 'text-gray-300'}`}>{stats.failed}</p>
                  <p className="text-xs text-gray-400 mt-1">{stats.failed > 0 ? 'click Prospects to see which' : 'clean send'}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Delivery rate</p>
                  <p className={`text-3xl font-bold ${deliveryRate === 100 ? 'text-green-600' : deliveryRate > 80 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {deliveryRate}%
                  </p>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${deliveryRate === 100 ? 'bg-green-500' : deliveryRate > 80 ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${deliveryRate}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-3 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-3">
                <LuClock className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-sm text-blue-700">This campaign is a <strong>draft</strong> — click Send to deliver it.</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700">Campaign details</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <Row icon={LuMail} label="Subject"><span className="font-medium text-gray-900">{campaign.subject}</span></Row>
              <Row icon={LuEye} label="Template">
                <div className="flex items-center gap-2">
                  <span className="capitalize">{campaign.templateId}</span>
                  <a href={adminApi.previewUrl(campaign.templateId)} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Preview →</a>
                </div>
              </Row>
              <Row icon={LuCalendar} label="Created">{fmt(campaign.createdAt)}</Row>
              {campaign.sentAt && <Row icon={LuSend} label="Sent at"><span className="text-green-700 font-medium">{fmt(campaign.sentAt)}</span></Row>}
              <Row icon={LuUsers} label="Total contacts"><span className="font-medium">{stats.total || '—'}</span></Row>
            </div>
          </div>

          {/* Lists */}
          {campaign.lists?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">Lists targeted</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {campaign.lists.map(l => (
                  <div key={l._id} className="flex items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <LuList className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-800">{l.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{l.contactCount} contact{l.contactCount !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'prospects' && (
        <ProspectsTab
          campaignId={campaign._id}
          templateId={campaign.templateId}
          subject={campaign.subject}
        />
      )}
    </div>
  )
}

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-4 px-6 py-3.5">
      <div className="flex items-center gap-2 w-36 shrink-0">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  )
}

/* ── Campaign list ── */
export default function CampaignsTab() {
  const toast = useToast()
  const [campaigns, setCampaigns] = useState([])
  const [lists, setLists] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [sending, setSending] = useState(null)
  const [form, setForm] = useState({ name: '', subject: '', templateId: '', listIds: [] })
  const [openCampaign, setOpenCampaign] = useState(null)
  const [debouncedFormUrl, setDebouncedFormUrl] = useState(null)

  const formPreviewUrl = form.templateId ? adminApi.previewUrl(form.templateId, {}) : null

  useEffect(() => {
    const t = setTimeout(() => setDebouncedFormUrl(formPreviewUrl), 300)
    return () => clearTimeout(t)
  }, [formPreviewUrl])

  async function load() {
    setLoading(true)
    try {
      const [c, l, t] = await Promise.all([adminApi.getCampaigns(), adminApi.getLists(), adminApi.getTemplates()])
      setCampaigns(c); setLists(l); setTemplates(t)
      if (!form.templateId && t.length) setForm(f => ({ ...f, templateId: t[0].id }))
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function toggleList(id) {
    setForm(f => ({
      ...f,
      listIds: f.listIds.includes(id) ? f.listIds.filter(x => x !== id) : [...f.listIds, id],
    }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.name || !form.subject || !form.templateId) return toast.error('Fill in all required fields.')
    if (form.listIds.length === 0) return toast.error('Select at least one list.')
    setCreating(true)
    try {
      await adminApi.createCampaign(form)
      setForm({ name: '', subject: '', templateId: templates[0]?.id || '', listIds: [] })
      setShowForm(false)
      toast.success('Campaign created')
      load()
    } catch (e) { toast.error(e.message) }
    finally { setCreating(false) }
  }

  async function handleSend(e, id, name) {
    e.stopPropagation()
    setSending(id)
    try {
      await adminApi.sendCampaign(id)
      toast.success(`"${name}" is sending — stats will update shortly.`)
      setTimeout(load, 3000)
    } catch (e) { toast.error(e.message) }
    finally { setSending(null) }
  }

  const totalContacts = form.listIds.reduce((sum, id) => {
    const list = lists.find(l => l._id === id)
    return sum + (list?.contactCount || 0)
  }, 0)

  if (openCampaign) {
    return (
      <CampaignDetail
        campaign={openCampaign}
        onBack={() => setOpenCampaign(null)}
        onResend={load}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and send bulk email campaigns</p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Create form — two-panel with live preview */}
      {showForm && (
        <div className="flex gap-6 items-start mb-6">
          {/* Left: form */}
          <div className="w-96 shrink-0">
            <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">New Campaign</h3>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Campaign name *</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g. Aldershot Dentists June"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject line *</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Had a look at your website — quick thought"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Template *</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
                  value={form.templateId}
                  onChange={e => setForm(f => ({ ...f, templateId: e.target.value }))}
                >
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Send to lists *
                  {form.listIds.length > 0 && (
                    <span className="ml-2 text-blue-600 font-normal">({totalContacts} contacts)</span>
                  )}
                </label>
                <div className="border border-gray-300 rounded-lg px-3 py-2 space-y-1.5 max-h-36 overflow-y-auto">
                  {lists.length === 0
                    ? <p className="text-xs text-gray-400">No lists — create one first.</p>
                    : lists.map(l => (
                      <label key={l._id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition-colors">
                        <input type="checkbox" checked={form.listIds.includes(l._id)} onChange={() => toggleList(l._id)} className="accent-blue-600" />
                        <span>{l.name}</span>
                        <span className="text-gray-400 text-xs ml-auto">({l.contactCount})</span>
                      </label>
                    ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors"
                >
                  {creating ? 'Creating…' : 'Create Campaign'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 cursor-pointer transition-colors">Cancel</button>
              </div>
            </form>
          </div>

          {/* Right: live preview */}
          <div className="flex-1 min-w-0 sticky top-20">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ height: 520 }}>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                <span className="text-xs font-medium text-gray-500">Template preview</span>
                <span className="text-xs text-gray-400">Sample data — real sends use each contact's details</span>
              </div>
              {debouncedFormUrl ? (
                <iframe
                  src={debouncedFormUrl}
                  className="w-full bg-white"
                  style={{ height: 'calc(100% - 41px)', border: 'none' }}
                  title="Template preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-sm">
                  Select a template to preview
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Campaign list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="h-6 bg-gray-100 rounded-full w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
          <LuMegaphone className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No campaigns yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first campaign to start sending</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div
              key={c._id}
              onClick={() => setOpenCampaign(c)}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{c.name}</h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {c.subject}
                    <span className="mx-1.5 text-gray-200">·</span>
                    <span className="capitalize">{c.templateId}</span> template
                    {c.sentAt && (
                      <>
                        <span className="mx-1.5 text-gray-200">·</span>
                        {fmt(c.sentAt)}
                      </>
                    )}
                  </p>
                  {c.status === 'sent' && (
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-green-600 font-medium">{c.stats.sent} delivered</span>
                      {c.stats.failed > 0 && <span className="text-xs text-red-500">{c.stats.failed} failed</span>}
                      <span className="text-xs text-gray-400">{c.stats.total} total</span>
                      {c.stats.total > 0 && (
                        <span className="text-xs text-gray-400">
                          {Math.round((c.stats.sent / c.stats.total) * 100)}% delivery
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {c.status === 'draft' && (
                    <button
                      onClick={(e) => handleSend(e, c._id, c.name)}
                      disabled={sending === c._id}
                      className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-40 cursor-pointer transition-colors"
                    >
                      <LuSend className="w-3.5 h-3.5" />
                      {sending === c._id ? 'Sending…' : 'Send'}
                    </button>
                  )}
                  <LuTrendingUp className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
