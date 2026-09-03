import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = {
  admin: {
    email: 'admin@medisphere.com',
    password: 'admin123',
    role: 'Admin',
  },
  doctor: {
    email: 'doctor@medisphere.com',
    password: 'doctor123',
    role: 'Clinician',
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('medisphere_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (email, password) => {
    const match = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.password === password,
    )

    if (match) {
      const sessionUser = { email: match.email, role: match.role }
      localStorage.setItem('medisphere_user', JSON.stringify(sessionUser))
      localStorage.setItem('medisphere_token', 'demo-token')
      setUser(sessionUser)
      return { success: true }
    }

    return { success: false, message: 'Invalid email or password' }
  }, [])

  const loginAsDemo = useCallback((type) => {
    const demo = DEMO_USERS[type]
    if (!demo) return

    const sessionUser = { email: demo.email, role: demo.role }
    localStorage.setItem('medisphere_user', JSON.stringify(sessionUser))
    localStorage.setItem('medisphere_token', 'demo-token')
    setUser(sessionUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('medisphere_user')
    localStorage.removeItem('medisphere_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
