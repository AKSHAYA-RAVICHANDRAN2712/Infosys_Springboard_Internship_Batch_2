import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MILESTONE } from '../config/milestones'

export default function TopNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="top-navbar">
      <div className="top-navbar-inner">
        <Link to="/dashboard" className="brand-link"><span className="brand-mark"><i className="bi bi-heart-pulse-fill" /></span>MediSphere</Link>
        <div className="milestone-title"><span className="top-live-dot" />{MILESTONE.subtitle}</div>
        <div className="top-navbar-actions">
          <button className="top-icon-btn" title="Notifications"><i className="bi bi-bell" /><span className="top-notification-dot" /></button>
          <span className="user-role"><i className="bi bi-person-circle" /> {user?.role || 'Clinician'}</span>
          <span className="nav-divider">|</span>
          <button type="button" className="logout-btn" onClick={() => { logout(); navigate('/login') }}>Logout</button>
        </div>
      </div>
    </header>
  )
}
