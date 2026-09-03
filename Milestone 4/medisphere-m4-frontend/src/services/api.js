import axios from 'axios'

// A relative path works in both setups this project supports:
//  - dev mode: Vite's proxy (see vite.config.js) forwards /api to :4001
//  - production mode: the backend itself serves this app's build output,
//    so /api is already same-origin
// Override with VITE_API_URL in a .env file only if you need to point
// at a backend running somewhere else entirely.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medisphere_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
