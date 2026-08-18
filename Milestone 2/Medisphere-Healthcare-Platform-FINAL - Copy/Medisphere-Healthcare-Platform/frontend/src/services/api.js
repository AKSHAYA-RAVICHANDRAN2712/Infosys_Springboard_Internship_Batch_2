import axios from 'axios'

// The Flask backend (Medisphere-ML) mounts its routes at root
// (e.g. /models, /predict, /explain/<id>), not under /api. Override
// with VITE_API_URL in a .env file if the backend runs elsewhere.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hmp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
