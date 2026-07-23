import { useState, useEffect } from 'react'
import {
  LuUsers, LuList, LuUpload, LuMegaphone, LuMail,
  LuLogOut, LuShield, LuChevronRight, LuGlobe,
  LuLayoutDashboard, LuTrendingUp, LuSend, LuArrowUpRight, LuFileText,
} from 'react-icons/lu'
import { ToastProvider } from '../components/admin/Toast'
import ContactsTab from '../components/admin/ContactsTab'
import ListsTab from '../components/admin/ListsTab'
import ImportTab from '../components/admin/ImportTab'
import CampaignsTab from '../components/admin/CampaignsTab'
import SingleSendTab from '../components/admin/SingleSendTab'
import ScraperTab from '../components/admin/ScraperTab'
import TemplatesTab from '../components/admin/TemplatesTab'
import { adminApi } from '../shared/adminApi'

const TABS = [
  { id: 'overview',   label: 'Overview',     Icon: LuLayoutDashboard },
  { id: 'contacts',   label: 'Contacts',     Icon: LuUsers },
  { id: 'lists',      label: 'Lists',        Icon: LuList },
  { id: 'import',     label: 'Import',       Icon: LuUpload },
  { id: 'campaigns',  label: 'Campaigns',    Icon: LuMegaphone },
  { id: 'templates',  label: 'Templates',    Icon: LuFileText },
  { id: 'send',       label: 'Single Send',  Icon: LuMail },
  { id: 'scraper',    label: 'Scraper',      Icon: LuGlobe },
]

/* ─── Login ─── */
function LoginGate({ onLogin }) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:4001'}/api/admin/contacts?limit=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) { sessionStorage.setItem('admin_token', token); onLogin() }
      else setError('Invalid token. Please try again.')
    } catch {
      setError('Cannot reach server. Is it running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4">
            <LuShield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">Admin Access</h1>
          <p className="text-sm text-gray-400 mt-1">Email outreach system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Admin Token</label>
            <input
              type="password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your admin token"
              value={token}
              onChange={e => setToken(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-500 disabled:opacity-40 cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying…' : <><span>Continue</span><LuChevronRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ─── KPI card ─── */
function KpiCard({ label, value, sub, color = 'blue', icon: Icon, onClick }) {
  const colors = {
    blue:   { ring: 'bg-blue-50 text-blue-600',   num: 'text-blue-700' },
    green:  { ring: 'bg-green-50 text-green-600',  num: 'text-green-700' },
    purple: { ring: 'bg-purple-50 text-purple-600', num: 'text-purple-700' },
    orange: { ring: 'bg-orange-50 text-orange-600', num: 'text-orange-700' },
  }
  const c = colors[color]
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-2xl p-6 flex items-start gap-4 hover:border-gray-300 hover:shadow-sm transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.ring}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-3xl font-bold ${c.num}`}>{value ?? '—'}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

/* ─── Quick action button ─── */
function QuickAction({ label, description, Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-sm hover:bg-blue-50/30 cursor-pointer transition-all group flex items-center gap-3"
    >
      <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors shrink-0">
        <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 truncate">{description}</p>
      </div>
      <LuArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
    </button>
  )
}

/* ─── Overview tab ─── */
function OverviewTab({ stats, onNavigate }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Your email outreach at a glance</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard
          label="Total Contacts"
          value={stats.contacts}
          sub="across all lists"
          color="blue"
          icon={LuUsers}
          onClick={() => onNavigate('contacts')}
        />
        <KpiCard
          label="Lists"
          value={stats.lists}
          sub="contact groups"
          color="purple"
          icon={LuList}
          onClick={() => onNavigate('lists')}
        />
        <KpiCard
          label="Campaigns Sent"
          value={stats.campaigns}
          sub="completed sends"
          color="green"
          icon={LuSend}
          onClick={() => onNavigate('campaigns')}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction
            label="Scrape websites"
            description="Find emails from business websites"
            Icon={LuGlobe}
            onClick={() => onNavigate('scraper')}
          />
          <QuickAction
            label="Import contacts"
            description="Upload CSV or paste JSON"
            Icon={LuUpload}
            onClick={() => onNavigate('import')}
          />
          <QuickAction
            label="Create campaign"
            description="Send bulk emails to a list"
            Icon={LuMegaphone}
            onClick={() => onNavigate('campaigns')}
          />
          <QuickAction
            label="Send single email"
            description="Reach out to one prospect"
            Icon={LuMail}
            onClick={() => onNavigate('send')}
          />
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <LuTrendingUp className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-800">Recommended workflow</h3>
        </div>
        <ol className="space-y-1.5 text-sm text-blue-700">
          <li className="flex items-start gap-2"><span className="font-bold mt-0.5 shrink-0">1.</span> Use <strong>Scraper</strong> to find business websites and extract emails</li>
          <li className="flex items-start gap-2"><span className="font-bold mt-0.5 shrink-0">2.</span> In <strong>Contacts</strong>, select the imported emails and add them to a <strong>List</strong></li>
          <li className="flex items-start gap-2"><span className="font-bold mt-0.5 shrink-0">3.</span> Create a <strong>Campaign</strong>, pick your list and template, then send</li>
        </ol>
      </div>
    </div>
  )
}

/* ─── Main Admin shell ─── */
export default function Admin() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('admin_token'))
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState({ contacts: null, lists: null, campaigns: null })

  useEffect(() => {
    if (!authed) return
    Promise.all([
      adminApi.getContacts({ limit: 1 }),
      adminApi.getLists(),
      adminApi.getCampaigns(),
    ]).then(([c, l, camp]) => {
      setStats({
        contacts: c.total,
        lists: l.length,
        campaigns: camp.filter(x => x.status === 'sent').length,
      })
    }).catch(() => {})
  }, [authed, tab])

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />

  const TAB_CONTENT = {
    overview:  <OverviewTab stats={stats} onNavigate={setTab} />,
    contacts:  <ContactsTab />,
    lists:     <ListsTab />,
    import:    <ImportTab />,
    campaigns: <CampaignsTab />,
    templates: <TemplatesTab />,
    send:      <SingleSendTab />,
    scraper:   <ScraperTab />,
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 flex">

        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 fixed inset-y-0 left-0 z-10">
          {/* Brand */}
          <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <LuMegaphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">Outreach</p>
              <p className="text-xs text-gray-400 leading-tight">Admin Panel</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {[
              { label: 'Main',  ids: ['overview', 'contacts', 'lists', 'import'] },
              { label: 'Send',  ids: ['campaigns', 'templates', 'send'] },
              { label: 'Tools', ids: ['scraper'] },
            ].map(group => (
              <div key={group.label} className="mb-5">
                <p className="text-xs font-semibold text-gray-300 uppercase tracking-widest px-2 mb-1">{group.label}</p>
                {TABS.filter(t => group.ids.includes(t.id)).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl cursor-pointer transition-all ${
                      tab === id
                        ? 'bg-blue-600 text-white font-medium shadow-sm'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Sign out */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={() => { sessionStorage.removeItem('admin_token'); setAuthed(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl cursor-pointer transition-all"
            >
              <LuLogOut className="w-4 h-4 shrink-0" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content — offset for fixed sidebar */}
        <main className="flex-1 ml-56 min-h-screen">
          {/* Top bar */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-[5]">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 capitalize">
                {TABS.find(t => t.id === tab)?.label || 'Dashboard'}
              </h2>
              <p className="text-xs text-gray-400">bluenwhite.co.uk</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span><span className="font-semibold text-gray-700">{stats.contacts ?? '—'}</span> contacts</span>
                <span><span className="font-semibold text-gray-700">{stats.lists ?? '—'}</span> lists</span>
                <span><span className="font-semibold text-gray-700">{stats.campaigns ?? '—'}</span> sent</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="p-8">
            {TAB_CONTENT[tab]}
          </div>
        </main>

      </div>
    </ToastProvider>
  )
}
