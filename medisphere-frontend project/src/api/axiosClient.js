import axios from 'axios'

// Points at the Java (Spring Boot) backend. Configure in .env as VITE_API_BASE_URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT issued by the Spring Security / JWT auth endpoint on every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ms_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Centralized handling for expired/invalid sessions
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('ms_token')
      localStorage.removeItem('ms_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient
