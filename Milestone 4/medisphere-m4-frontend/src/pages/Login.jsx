import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginAsDemo } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      navigate('/predictions')
    } else {
      setError(result.message)
    }
  }

  const handleDemoLogin = (type) => {
    loginAsDemo(type)
    navigate('/predictions')
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-brand">
          <span className="login-brand-icon">
            <i className="bi bi-shield-fill"></i>
            <i className="bi bi-heart-pulse login-pulse-icon"></i>
          </span>
          <span className="login-brand-text">MediSphere</span>
        </div>
      </header>

      <div className="login-center">
        <div className="login-card">
          <div className="login-card-icon">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">
            Sign in to manage patients, appointments and care.
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger login-error" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label login-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control login-input"
                placeholder="you@medisphere.com"
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="login-footer-text">
            New patient?{' '}
            <a href="#" className="login-link" onClick={(e) => e.preventDefault()}>
              Create an account
            </a>
          </p>
        </div>

        <div className="demo-access">
          <p className="demo-access-label">QUICK DEMO ACCESS</p>
          <div className="demo-access-buttons">
            <button
              type="button"
              className="btn demo-btn"
              onClick={() => handleDemoLogin('admin')}
            >
              <i className="bi bi-person-fill"></i>
              Admin
            </button>
            <button
              type="button"
              className="btn demo-btn"
              onClick={() => handleDemoLogin('doctor')}
            >
              <i className="bi bi-heart-pulse"></i>
              Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
