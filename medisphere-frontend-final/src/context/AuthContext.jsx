import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const rawUser = localStorage.getItem('ms_user')
    const token = localStorage.getItem('ms_token')
    if (rawUser && token) {
      setUser(JSON.parse(rawUser))
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const { token, user: loggedInUser } = await authService.login(email, password)
    localStorage.setItem('ms_token', token)
    localStorage.setItem('ms_user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    return loggedInUser
  }

  async function register(payload) {
    const { token, user: newUser } = await authService.register(payload)
    localStorage.setItem('ms_token', token)
    localStorage.setItem('ms_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  function logout() {
    localStorage.removeItem('ms_token')
    localStorage.removeItem('ms_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
