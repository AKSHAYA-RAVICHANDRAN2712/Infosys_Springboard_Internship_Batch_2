import { getCurrentUser } from '../services/authService'

function Header() {
  const user = getCurrentUser()
  const name = user?.name || 'Current User'
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-brand__icon">
          <i className="bi bi-heart-pulse-fill"></i>
        </span>
        <span className="header-brand__text">
          Healthcare Management Platform
          <span className="header-brand__sub">Clinical Operations Suite</span>
        </span>
      </div>

      <div className="header-title">Federated Learning &amp; Risk Models</div>

      <div className="header-user">
        <button type="button" className="header-icon-btn" aria-label="Notifications">
          <i className="bi bi-bell-fill"></i>
          <span className="header-icon-btn__dot"></span>
        </button>
        <div className="header-user__divider"></div>
        <div className="header-user__avatar">{initials || 'U'}</div>
        <div className="header-user__meta">
          <span className="header-user__name">{name}</span>
          <span className="header-user__role">{user?.role || 'Member'}</span>
        </div>
      </div>
    </header>
  )
}

export default Header

