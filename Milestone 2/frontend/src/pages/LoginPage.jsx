import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { login, demoLogin, isAuthenticated } from '../services/authService'
import '../styles/Login.css'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role) => {
    demoLogin(role)
    navigate('/dashboard')
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-logo">
          <span className="login-logo__icon">
            <i className="bi bi-heart-pulse-fill"></i>
          </span>
          <span className="login-logo__text">Healthcare Management Platform</span>
        </div>
      </header>

      <div className="login-center">
        <div className="login-card">
          <div className="login-card__shield">
            <i className="bi bi-shield-lock-fill"></i>
          </div>

          <h1 className="login-card__title">Welcome back</h1>
          <p className="login-card__subtitle">
            Sign in to manage patients, appointments and care.
          </p>

          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label login-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control login-input"
                placeholder="you@clinicalops.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label login-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn login-btn w-100"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="login-card__footer">
            New patient?{' '}
            <a href="#" className="login-link" onClick={(e) => e.preventDefault()}>
              Create an account
            </a>
          </p>
        </div>

        <div className="login-demo">
          <span className="login-demo__label">QUICK DEMO ACCESS</span>
          <div className="login-demo__buttons">
            <button
              type="button"
              className="login-demo__btn"
              onClick={() => handleDemoLogin('admin')}
            >
              <i className="bi bi-person-fill"></i>
              Admin
            </button>
            <button
              type="button"
              className="login-demo__btn"
              onClick={() => handleDemoLogin('doctor')}
            >
              <i className="bi bi-briefcase-fill"></i>
              Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
