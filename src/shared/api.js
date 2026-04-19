import axios from 'axios'

// If mocks are enabled, use relative URLs so MSW can intercept.
// Otherwise, use your real API URL.
const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
const baseURL = useMocks
  ? '/'                                  // <-- same-origin, MSW intercepts
  : (import.meta.env.VITE_API_URL || 'http://localhost:8080')

const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api