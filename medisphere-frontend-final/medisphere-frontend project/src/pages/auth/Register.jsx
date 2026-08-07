import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { roleHome } from '../../utils/roles'

const ROLE_OPTIONS = [
  {
    value: 'PATIENT',
    label: 'Patient',
    icon: 'bi-person-plus-fill',
    heading: 'Join as a patient',
    subtext: 'Create your account to start booking visits and managing your care.',
    benefits: [
      { icon: 'bi-calendar2-check', text: 'Book and manage appointments' },
      { icon: 'bi-file-medical', text: 'View your records and lab results' },
      { icon: 'bi-chat-heart', text: 'Stay connected with your care team' },
    ],
  },
  {
    value: 'RECEPTIONIST',
    label: 'Receptionist',
    icon: 'bi-headset',
    heading: 'Join as front-desk staff',
    subtext: 'Create a staff account to manage scheduling and patient check-ins.',
    benefits: [
      { icon: 'bi-calendar2-week', text: 'Manage the clinic appointment calendar' },
      { icon: 'bi-people', text: 'Register and check in patients' },
      { icon: 'bi-bell', text: 'Track alerts across the front desk' },
    ],
  },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('PATIENT')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const active = ROLE_OPTIONS.find((r) => r.value === role)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await register({ ...form, role })
      navigate(roleHome(user.role))
    } catch (err) {
      setError(err.message || 'Unable to create account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-register-shell">
      <style>{`
        .auth-register-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.5rem 1.25rem;
          background:
            radial-gradient(900px 460px at 50% -10%, rgba(242,120,106,0.16), transparent 60%),
            var(--paper);
        }
        .auth-register-back {
          width: 100%;
          max-width: 920px;
          margin-bottom: 1.5rem;
        }
        .auth-register-card {
          width: 100%;
          max-width: 460px;
          background: #101a30;
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 2.25rem 2rem;
          margin-top: 1rem;
        }
        .auth-register-badge {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--coral-100);
          color: var(--coral);
          font-size: 1.3rem;
          margin-bottom: 1.1rem;
        }
        .auth-register-benefits {
          width: 100%;
          max-width: 460px;
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .auth-register-benefit {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 0.85rem;
          color: var(--ink-soft);
        }
        .auth-register-benefit i {
          color: var(--coral);
          font-size: 1rem;
          width: 20px;
          text-align: center;
        }
        .btn-coral {
          background-color: var(--coral);
          border-color: var(--coral);
          color: #1c0f0c;
          font-weight: 600;
        }
        .btn-coral:hover {
          background-color: #ef6153;
          border-color: #ef6153;
          color: #1c0f0c;
        }
        .auth-register-role-toggle {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.4rem;
          background: #0b1424;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 4px;
        }
        .auth-register-role-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          border: none;
          background: transparent;
          color: var(--ink-soft);
          font-size: 0.82rem;
          font-weight: 500;
          padding: 0.5rem 0.4rem;
          border-radius: 7px;
          cursor: pointer;
          transition: background .15s ease, color .15s ease;
        }
        .auth-register-role-btn.active {
          background: var(--coral-100);
          color: var(--coral);
        }
      `}</style>

      <div className="auth-register-back">
        <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none">
          <i className="bi bi-heart-pulse-fill fs-4 text-primary"></i>
          <span className="fs-5 fw-bold brand-font" style={{ color: 'var(--ink)' }}>MediSphere</span>
        </Link>
      </div>

      <div className="auth-register-card">
        <div className="auth-register-role-toggle">
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              className={`auth-register-role-btn ${role === r.value ? 'active' : ''}`}
              onClick={() => setRole(r.value)}
            >
              <i className={`bi ${r.icon}`}></i>
              {r.label}
            </button>
          ))}
        </div>

        <div className="auth-register-badge">
          <i className={`bi ${active.icon}`}></i>
        </div>
        <h3 className="brand-font mb-1">{active.heading}</h3>
        <p className="text-muted mb-4">{active.subtext}</p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small text-muted">Full name</label>
            <input className="form-control" name="name" value={form.name} onChange={handleChange} required placeholder="Jane Doe" />
          </div>
          <div className="mb-3">
            <label className="form-label small text-muted">Email address</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
          </div>
          <div className="mb-3">
            <label className="form-label small text-muted">Password</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="At least 6 characters" />
          </div>
          <button type="submit" className="btn btn-coral w-100 py-2" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <div className="auth-register-benefits">
        {active.benefits.map((b) => (
          <div className="auth-register-benefit" key={b.text}>
            <i className={`bi ${b.icon}`}></i>
            {b.text}
          </div>
        ))}
      </div>
    </div>
  )
}
