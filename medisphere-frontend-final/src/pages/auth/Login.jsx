import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { roleHome } from '../../utils/roles'

const DEMO_ACCOUNTS = [
  { role: 'Admin', icon: 'bi-speedometer2', email: 'admin@medisphere.com', password: 'admin123' },
  { role: 'Doctor', icon: 'bi-clipboard2-pulse', email: 'doctor@medisphere.com', password: 'doctor123' },
  { role: 'Patient', icon: 'bi-person-heart', email: 'patient@medisphere.com', password: 'patient123' },
  { role: 'Reception', icon: 'bi-headset', email: 'reception@medisphere.com', password: 'reception123' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(email, password)
      navigate(roleHome(user.role))
    } catch (err) {
      setError(err.message || 'Unable to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  function fillDemo(account) {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  return (
    <div className="auth-login-shell">
      <style>{`
        .auth-login-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.5rem 1.25rem;
          background:
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px),
            var(--paper);
          background-size: 34px 34px, 34px 34px, auto;
          background-position: center;
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 55%, transparent 100%);
          mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 55%, transparent 100%);
        }
        .auth-login-back {
          width: 100%;
          max-width: 920px;
          margin-bottom: 1.5rem;
        }
        .auth-login-card {
          width: 100%;
          max-width: 440px;
          background: #101a30;
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 2.25rem 2rem;
          margin-top: 1rem;
          box-shadow: 0 20px 60px -20px rgba(0,0,0,0.6);
        }
        .auth-login-badge {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--mint-100);
          color: var(--teal-500);
          font-size: 1.3rem;
          margin-bottom: 1.1rem;
        }
        .auth-login-demo {
          width: 100%;
          max-width: 440px;
          margin-top: 1.5rem;
        }
        .auth-login-demo-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--ink-soft);
          text-align: center;
          margin-bottom: 0.7rem;
        }
        .auth-login-demo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.6rem;
        }
        .auth-login-demo-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #101a30;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 0.55rem 0.7rem;
          font-size: 0.8rem;
          color: var(--ink-soft);
          cursor: pointer;
          transition: border-color .15s ease, color .15s ease;
        }
        .auth-login-demo-chip:hover {
          border-color: var(--teal-500);
          color: var(--ink);
        }
        .auth-login-demo-chip i { color: var(--teal-500); }
      `}</style>

      <div className="auth-login-back">
        <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none">
          <i className="bi bi-heart-pulse-fill fs-4 text-primary"></i>
          <span className="fs-5 fw-bold brand-font" style={{ color: 'var(--ink)' }}>MediSphere</span>
        </Link>
      </div>

      <div className="auth-login-card">
        <div className="auth-login-badge">
          <i className="bi bi-shield-lock-fill"></i>
        </div>
        <h3 className="brand-font mb-1">Welcome back</h3>
        <p className="text-muted mb-4">Sign in to manage patients, appointments and care.</p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small text-muted">Email address</label>
            <input
              type="email" className="form-control" value={email}
              onChange={(e) => setEmail(e.target.value)} required placeholder="you@medisphere.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label small text-muted">Password</label>
            <input
              type="password" className="form-control" value={password}
              onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0">
          New patient? <Link to="/register">Create an account</Link>
        </p>
      </div>

      <div className="auth-login-demo">
        <div className="auth-login-demo-label">Quick demo access</div>
        <div className="auth-login-demo-grid">
          {DEMO_ACCOUNTS.map((account) => (
            <div key={account.role} className="auth-login-demo-chip" onClick={() => fillDemo(account)}>
              <i className={`bi ${account.icon}`}></i>
              {account.role}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
