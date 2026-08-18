import api from './api'

const DEMO_USERS = {
  admin: {
    email: 'admin@clinicalops.com',
    password: 'admin123',
    role: 'Admin',
    name: 'Admin User',
  },
  doctor: {
    email: 'doctor@clinicalops.com',
    password: 'doctor123',
    role: 'Doctor',
    name: 'Dr. Smith',
  },
}

export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password })
    const { token, user } = response.data
    localStorage.setItem('hmp_token', token)
    localStorage.setItem('hmp_user', JSON.stringify(user))
    return user
  } catch {
    const demoUser = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.password === password,
    )

    if (demoUser) {
      const user = { email: demoUser.email, role: demoUser.role, name: demoUser.name }
      localStorage.setItem('hmp_token', `demo-${demoUser.role.toLowerCase()}`)
      localStorage.setItem('hmp_user', JSON.stringify(user))
      return user
    }

    throw new Error('Invalid email or password')
  }
}

export function demoLogin(role) {
  const demoUser = DEMO_USERS[role]
  if (!demoUser) return null

  const user = { email: demoUser.email, role: demoUser.role, name: demoUser.name }
  localStorage.setItem('hmp_token', `demo-${role}`)
  localStorage.setItem('hmp_user', JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem('hmp_token')
  localStorage.removeItem('hmp_user')
}

export function getCurrentUser() {
  const raw = localStorage.getItem('hmp_user')
  return raw ? JSON.parse(raw) : null
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('hmp_token'))
}
