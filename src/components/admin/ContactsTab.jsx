import { useState, useEffect, useCallback } from 'react'
import {
  LuUsers, LuSearch, LuMapPin, LuTrash2, LuUserX,
  LuChevronLeft, LuChevronRight, LuListPlus, LuX, LuPencil,
} from 'react-icons/lu'
import { adminApi } from '../../shared/adminApi'
import { useToast } from './Toast'
import EditContactModal from './EditContactModal'

function Skeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-t border-gray-100">
          {[...Array(7)].map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-3.5 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + (i * j * 7) % 40}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

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

export default function ContactsTab() {
  const toast = useToast()
  const [data, setData] = useState({ contacts: [], total: 0, pages: 1 })
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [editContact, setEditContact] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [lists, setLists] = useState([])
  const [addingToList, setAddingToList] = useState(false)
  const [listPickerOpen, setListPickerOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [res, ls] = await Promise.all([
        adminApi.getContacts({ search, location, page, limit: 25 }),
        adminApi.getLists(),
      ])
      setData(res)
      setLists(ls)
      // clear selection when page changes
      setSelected(new Set())
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, location, page])

  useEffect(() => { load() }, [load])

  async function handleDelete(id) {
    try {
      await adminApi.deleteContact(id)
      toast.success('Contact deleted')
      setConfirmDelete(null)
      load()
    } catch (e) { toast.error(e.message) }
  }

  async function handleUnsub(id) {
    try {
      await adminApi.unsubscribeContact(id)
      toast.success('Marked as unsubscribed')
      load()
    } catch (e) { toast.error(e.message) }
  }

  async function handleAddToList(listId) {
    const listName = lists.find(l => l._id === listId)?.name || 'list'
    setAddingToList(true)
    try {
      await adminApi.addToList(listId, [...selected])
      toast.success(`${selected.size} contact${selected.size !== 1 ? 's' : ''} added to "${listName}"`)
      setSelected(new Set())
      setListPickerOpen(false)
      load()
    } catch (e) { toast.error(e.message) }
    finally { setAddingToList(false) }
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    const ids = data.contacts.map(c => c._id)
    const allSelected = ids.every(id => selected.has(id))
    if (allSelected) {
      setSelected(prev => {
        const next = new Set(prev)
        ids.forEach(id => next.delete(id))
        return next
      })
    } else {
      setSelected(prev => {
        const next = new Set(prev)
        ids.forEach(id => next.add(id))
        return next
      })
    }
  }

  const pageIds = data.contacts.map(c => c._id)
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selected.has(id))
  const someSelected = selected.size > 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.total} total contacts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Search name, email, company…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="relative">
          <LuMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Filter by location"
            value={location}
            onChange={e => { setLocation(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
          <span className="text-sm font-medium text-blue-800">{selected.size} selected</span>
          <div className="relative">
            <button
              onClick={() => setListPickerOpen(p => !p)}
              disabled={lists.length === 0}
              className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <LuListPlus className="w-4 h-4" />
              Add to List
            </button>
            {listPickerOpen && lists.length > 0 && (
              <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-44 z-20">
                {lists.map(l => (
                  <button
                    key={l._id}
                    onClick={() => handleAddToList(l._id)}
                    disabled={addingToList}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <span>{l.name}</span>
                    <span className="text-xs text-gray-400 ml-3">{l.contactCount}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => { setSelected(new Set()); setListPickerOpen(false) }}
            className="ml-auto flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
          >
            <LuX className="w-3.5 h-3.5" />
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    className="accent-blue-600 cursor-pointer"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tags</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading && <Skeleton />}

              {!loading && data.contacts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <LuUsers className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No contacts found</p>
                    <p className="text-gray-400 text-xs mt-1">Try adjusting your filters or import contacts</p>
                  </td>
                </tr>
              )}

              {!loading && data.contacts.map(c => (
                <tr
                  key={c._id}
                  className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${selected.has(c._id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="accent-blue-600 cursor-pointer"
                      checked={selected.has(c._id)}
                      onChange={() => toggleSelect(c._id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} email={c.email} />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{c.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-400 font-mono">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.company || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-gray-600">{c.location || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.tags?.map(t => (
                        <span key={t} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {c.unsubscribed
                      ? <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-full font-medium">Unsubscribed</span>
                      : <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">Active</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditContact(c)}
                        title="Edit contact"
                        className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <LuPencil className="w-4 h-4" />
                      </button>
                      {!c.unsubscribed && (
                        <button
                          onClick={() => handleUnsub(c._id)}
                          title="Mark unsubscribed"
                          className="p-1.5 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <LuUserX className="w-4 h-4" />
                        </button>
                      )}
                      {confirmDelete === c._id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(c._id)} className="text-xs text-red-600 font-medium px-2 py-1 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors">Confirm</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-xs text-gray-500 px-2 py-1 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(c._id)}
                          title="Delete"
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <LuTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-500">Page {page} of {data.pages}</span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white cursor-pointer transition-colors"
              >
                <LuChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                disabled={page === data.pages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white cursor-pointer transition-colors"
              >
                <LuChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {editContact && (
        <EditContactModal
          contact={editContact}
          onClose={() => setEditContact(null)}
          onSaved={load}
        />
      )}
    </div>
  )
}
