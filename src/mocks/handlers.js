import { http, HttpResponse } from 'msw'
import { projects } from './data'

export const handlers = [
  http.get('/api/projects', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const limit = Number(url.searchParams.get('limit') || 20)
    const start = (page - 1) * limit
    const end = start + limit
    return HttpResponse.json({ items: projects.slice(start, end), page, limit, total: projects.length })
  }),
  http.get('/api/projects/:slug', ({ params }) => {
    const item = projects.find(p => p.slug === params.slug)
    if (!item) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(item)
  }),
  http.post('/api/contact', async () => HttpResponse.json({ ok: true })),
]