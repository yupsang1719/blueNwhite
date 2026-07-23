const BASE = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:4001'

function getToken() {
  return sessionStorage.getItem('admin_token') || ''
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    sessionStorage.removeItem('admin_token')
    window.location.reload()
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export const adminApi = {
  // Contacts
  getContacts: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request('GET', `/api/admin/contacts${q ? `?${q}` : ''}`)
  },
  addContact: (body) => request('POST', '/api/admin/contacts', body),
  importContacts: (contacts, source) => request('POST', '/api/admin/contacts/import', { contacts, source }),
  updateContact: (id, body) => request('PATCH', `/api/admin/contacts/${id}`, body),
  deleteContact: (id) => request('DELETE', `/api/admin/contacts/${id}`),
  unsubscribeContact: (id) => request('PATCH', `/api/admin/contacts/${id}/unsubscribe`),

  // Lists
  getLists: () => request('GET', '/api/admin/lists'),
  getList: (id) => request('GET', `/api/admin/lists/${id}`),
  createList: (body) => request('POST', '/api/admin/lists', body),
  addToList: (listId, contactIds) => request('POST', `/api/admin/lists/${listId}/contacts`, { contactIds }),
  removeFromList: (listId, contactIds) => request('DELETE', `/api/admin/lists/${listId}/contacts`, { contactIds }),
  deleteList: (id) => request('DELETE', `/api/admin/lists/${id}`),

  // Templates
  getTemplates: () => request('GET', '/api/admin/templates'),
  previewUrl: (name, vars = {}) => {
    const q = new URLSearchParams(vars).toString()
    return `${BASE}/api/templates/${name}/preview${q ? `?${q}` : ''}`
  },

  // Campaigns
  getCampaigns: () => request('GET', '/api/admin/campaigns'),
  getCampaign: (id) => request('GET', `/api/admin/campaigns/${id}`),
  getCampaignContacts: (id) => request('GET', `/api/admin/campaigns/${id}/contacts`),
  createCampaign: (body) => request('POST', '/api/admin/campaigns', body),
  sendCampaign: (id) => request('POST', `/api/admin/campaigns/${id}/send`),
  sendSingle: (body) => request('POST', '/api/admin/campaigns/single', body),

  // Scraper — search for URLs via Brave
  searchUrls: (body) => request('POST', '/api/admin/scraper/search', body),

  // Scraper — returns a ReadableStream of NDJSON progress lines
  scrapeStream: (body) => fetch(`${BASE}/api/admin/scraper/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('admin_token') || ''}`,
    },
    body: JSON.stringify(body),
  }),
}
