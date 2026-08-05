import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title, onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initials = (user?.name || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="ms-topbar d-flex align-items-center justify-content-between px-3 px-md-4 py-3">
      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-sm btn-light d-md-none" onClick={onToggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <h4 className="brand-font mb-0">{title}</h4>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted small d-none d-sm-inline">{ROLE_LABELS[user?.role]}</span>
        <div className="dropdown">
          <button
            className="btn btn-light d-flex align-items-center gap-2 rounded-pill px-2 py-1"
            data-bs-toggle="dropdown"
          >
            <span
              className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
              style={{ width: 34, height: 34, background: '#1c9184', color: '#fff', fontSize: '0.8rem' }}
            >
              {initials}
            </span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
            <li><span className="dropdown-item-text fw-semibold">{user?.name}</span></li>
            <li><span className="dropdown-item-text text-muted small">{user?.email}</span></li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
