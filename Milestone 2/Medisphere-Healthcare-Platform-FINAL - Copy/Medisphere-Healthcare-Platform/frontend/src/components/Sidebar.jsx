import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'bi-grid-1x2-fill' },
  { label: 'Patients', path: '/patients', icon: 'bi-people-fill' },
  { label: 'Models', path: '/models', icon: 'bi-cpu-fill' },
  { label: 'Federated Training', path: '/federated-training', icon: 'bi-diagram-3-fill' },
  { label: 'Analytics', path: '/analytics', icon: 'bi-bar-chart-line-fill' },
  { label: 'Reports', path: '/reports', icon: 'bi-file-earmark-text-fill' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
            }
          >
            <i className={`bi ${item.icon} sidebar-link__icon`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
