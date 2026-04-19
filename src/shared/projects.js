import { projects as mockProjects } from '../mocks/data'
import api from './api'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

export async function fetchProjects(limit) {
  if (useMocks) {
    return limit ? mockProjects.slice(0, limit) : [...mockProjects]
  }
  const { data } = await api.get(`/api/projects${limit ? `?limit=${limit}` : ''}`)
  return data.items || data
}

export async function fetchProject(slug) {
  if (useMocks) {
    return mockProjects.find(p => p.slug === slug) || null
  }
  const { data } = await api.get(`/api/projects/${slug}`)
  return data
}
