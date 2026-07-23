import { useState, useEffect, useRef } from 'react'
import {
  LuList, LuPlus, LuTrash2, LuUsers, LuArrowLeft,
  LuUserMinus, LuPencil, LuUserPlus, LuSearch,
  LuSend, LuX, LuEye, LuLoader,
} from 'react-icons/lu'
import { adminApi } from '../../shared/adminApi'
import { useToast } from './Toast'
import EditContactModal from './EditContactModal'

function Avatar({ name, email }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : email[0].toUpperCase()
  const colours = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700']
  const colour = colours[email.charCodeAt(0) % colours.length]
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${colour}`}>
      {initials}
    </span>
  )
}

/* ─── Add Contacts panel ─── */
function AddContactsPanel({ listId, existingIds, onClose, onAdded }) {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [adding, setAdding] = useState(false)
  const debounce = useRef(null)

  useEffect(() => {
    if (!search.trim()) { setResults([]); return }
    clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      setLoadingSearch(true)
      try {
        const data = await adminApi.getContacts({ search: search.trim(), limit: 30 })
        // exclude contacts already in the list
        const existing = new Set(existingIds)
        setResults(data.contacts.filter(c => !existing.has(c._id)))
      } catch (e) { toast.error(e.message) }
      finally { setLoadingSearch(false) }
    }, 300)
  }, [search])

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleAdd() {
    if (selected.size === 0) return
    setAdding(true)
    try {
      await adminApi.addToList(listId, [...selected])
      toast.success(`${selected.size} contact${selected.size !== 1 ? 's' : ''} added`)
      onAdded()
      onClose()
    } catch (e) { toast.error(e.message) }
    finally { setAdding(false) }
  }

  return (
    <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Search contacts by name, email or company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        {selected.size > 0 && (
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors shrink-0"
          >
            {adding ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuUserPlus className="w-4 h-4" />}
            Add {selected.size} contact{selected.size !== 1 ? 's' : ''}
          </button>
        )}
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
          <LuX className="w-4 h-4" />
        </button>
      </div>

      {loadingSearch && (
        <p className="text-xs text-gray-400 py-2">Searching…</p>
      )}

      {!loadingSearch && search.trim() && results.length === 0 && (
        <p className="text-xs text-gray-400 py-2">No matching contacts found outside this list.</p>
      )}

      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
          {results.map(c => (
            <label
              key={c._id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
            >
              <input
                type="checkbox"
                className="accent-blue-600 shrink-0"
                checked={selected.has(c._id)}
                onChange={() => toggle(c._id)}
              />
              <Avatar name={c.name} email={c.email} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{c.name || c.email}</p>
                <p className="text-xs text-gray-400 font-mono truncate">{c.name ? c.email : ''}{c.company ? ` · ${c.company}` : ''}</p>
              </div>
              {c.location && <span className="text-xs text-gray-400 shrink-0">{c.location}</span>}
            </label>
          ))}
        </div>
      )}

      {!search.trim() && (
        <p className="text-xs text-gray-400">Type to search all contacts not already in this list.</p>
      )}
    </div>
  )
}

/* ─── Send Campaign modal ─── */
function SendCampaignModal({ list, onClose }) {
  const toast = useToast()
  const [templates, setTemplates] = useState([])
  const [form, setForm] = useState({
    name: `${list.name} — ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
    subject: '',
    templateId: '',
  })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi.getTemplates()
      .then(t => { setTemplates(t); setForm(f => ({ ...f, templateId: t[0]?.id || '' })) })
      .catch(e => toast.error(e.message))
  }, [])

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  async function handleSend(e) {
    e.preventDefault()
    if (!form.subject.trim()) { setError('Subject line is required'); return }
    if (!form.templateId) { setError('Select a template'); return }
    setError(''); setSending(true)
    try {
      const campaign = await adminApi.createCampaign({
        name: form.name.trim(),
        subject: form.subject.trim(),
        templateId: form.templateId,
        listIds: [list._id],
      })
      await adminApi.sendCampaign(campaign._id)
      toast.success(`Campaign sent to ${list.contactCount} contact${list.contactCount !== 1 ? 's' : ''}!`)
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setSending(false)
    }
  }

  const previewUrl = form.templateId ? adminApi.previewUrl(form.templateId) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Send Campaign</h2>
            <p className="text-xs text-gray-400 mt-0.5">Sending to <strong>{list.name}</strong> · {list.contactCount} contact{list.contactCount !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <LuX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSend} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Campaign name</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={form.name}
              onChange={set('name')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject line *</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. Quick question about your website"
              value={form.subject}
              onChange={set('subject')}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Template *</label>
            <div className="flex gap-2">
              <select
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
                value={form.templateId}
                onChange={set('templateId')}
              >
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <LuEye className="w-4 h-4" />
                  Preview
                </a>
              )}
            </div>
          </div>

          {list.contactCount === 0 && (
            <p className="text-amber-600 text-xs bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              This list has no contacts yet — add some first.
            </p>
          )}

          {error && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={sending || list.contactCount === 0}
              className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-40 cursor-pointer transition-colors"
            >
              {sending ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuSend className="w-4 h-4" />}
              {sending ? 'Sending…' : `Send to ${list.contactCount} contact${list.contactCount !== 1 ? 's' : ''}`}
            </button>
            <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 px-4 cursor-pointer transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── List detail ─── */
function ListDetail({ list, onBack, onUpdate }) {
  const toast = useToast()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)
  const [editContact, setEditContact] = useState(null)
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  // keep a live copy of list metadata (contact count updates after adding)
  const [liveList, setLiveList] = useState(list)

  async function load() {
    setLoading(true)
    try {
      const data = await adminApi.getList(list._id)
      setDetail(data)
      setLiveList(l => ({ ...l, contactCount: data.contactIds.length }))
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [list._id])

  async function handleRemove(contactId, email) {
    setRemoving(contactId)
    try {
      await adminApi.removeFromList(list._id, [contactId])
      toast.success(`${email} removed from list`)
      load(); onUpdate()
    } catch (e) { toast.error(e.message) }
    finally { setRemoving(null) }
  }

  const contacts = detail?.contactIds || []
  const existingIds = contacts.map(c => c._id)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors shrink-0"
          >
            <LuArrowLeft className="w-4 h-4" />
            All Lists
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-semibold text-gray-900 truncate">{list.name}</h1>
          {list.description && <span className="text-sm text-gray-400 truncate hidden sm:block">{list.description}</span>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { setShowAddPanel(p => !p); }}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <LuUserPlus className="w-4 h-4" />
            Add Contacts
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
          >
            <LuSend className="w-4 h-4" />
            Send Campaign
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Count bar */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 text-sm text-gray-600">
          <LuUsers className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-gray-900">{loading ? '…' : contacts.length}</span>
          contact{contacts.length !== 1 ? 's' : ''}
        </div>

        {/* Add contacts panel */}
        {showAddPanel && (
          <AddContactsPanel
            listId={list._id}
            existingIds={existingIds}
            onClose={() => setShowAddPanel(false)}
            onAdded={() => { load(); onUpdate() }}
          />
        )}

        {/* Contacts table */}
        {loading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="py-16 text-center">
            <LuUsers className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No contacts in this list</p>
            <p className="text-gray-400 text-sm mt-1">Click "Add Contacts" above to get started</p>
          </div>
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
              {contacts.map(c => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} email={c.email} />
                      <div>
                        <div className="font-medium text-gray-900">{c.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-400 font-mono">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{c.company || <span className="text-gray-300">—</span>}</td>
                  <td className="px-5 py-3 text-gray-600">{c.location || <span className="text-gray-300">—</span>}</td>
                  <td className="px-5 py-3">
                    {c.unsubscribed
                      ? <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">Unsubscribed</span>
                      : <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Active</span>
                    }
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditContact(c)}
                        title="Edit contact"
                        className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <LuPencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(c._id, c.email)}
                        disabled={removing === c._id}
                        title="Remove from list"
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors disabled:opacity-40"
                      >
                        <LuUserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editContact && (
        <EditContactModal
          contact={editContact}
          onClose={() => setEditContact(null)}
          onSaved={load}
        />
      )}

      {showSendModal && (
        <SendCampaignModal
          list={liveList}
          onClose={() => setShowSendModal(false)}
        />
      )}
    </div>
  )
}

/* ─── Lists grid ─── */
export default function ListsTab() {
  const toast = useToast()
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [openList, setOpenList] = useState(null)

  async function load() {
    setLoading(true)
    try { setLists(await adminApi.getLists()) }
    catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    try {
      await adminApi.createList({ name, description })
      setName(''); setDescription(''); setShowForm(false)
      toast.success(`List "${name}" created`)
      load()
    } catch (e) { toast.error(e.message) }
    finally { setCreating(false) }
  }

  async function handleDelete(e, id, listName) {
    e.stopPropagation()
    try {
      await adminApi.deleteList(id)
      toast.success(`"${listName}" deleted`)
      load()
    } catch (e) { toast.error(e.message) }
  }

  if (openList) {
    return (
      <ListDetail
        list={openList}
        onBack={() => setOpenList(null)}
        onUpdate={load}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Lists</h1>
          <p className="text-sm text-gray-500 mt-0.5">Group contacts for targeted campaigns</p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          New List
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Create New List</h3>
          <div className="flex gap-3">
            <input
              className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="List name (e.g. Hampshire Pubs)"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
            <input
              className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3 cursor-pointer transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : lists.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
          <LuList className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No lists yet</p>
          <p className="text-gray-400 text-sm mt-1">Create a list to group contacts for campaigns</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {lists.map(l => (
            <div
              key={l._id}
              onClick={() => setOpenList(l)}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-700 transition-colors">{l.name}</h3>
                  {l.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{l.description}</p>}
                </div>
                <button
                  onClick={(e) => handleDelete(e, l._id, l.name)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-all ml-2"
                >
                  <LuTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-blue-600">
                <LuUsers className="w-4 h-4" />
                <span className="text-sm font-semibold">{l.contactCount}</span>
                <span className="text-xs text-gray-400">contact{l.contactCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
