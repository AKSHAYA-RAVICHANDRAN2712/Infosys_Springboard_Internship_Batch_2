import { NavLink } from 'react-router-dom'
import { MILESTONE } from '../config/milestones'

const icons = { Dashboard:'speedometer2', Patients:'people', Tasks:'check2-square', Predictions:'graph-up-arrow', Alerts:'exclamation-triangle', Careplans:'clipboard2-pulse', Reports:'bar-chart-line' }

export default function Sidebar() {
  return <aside className="sidebar">
    <div className="sidebar-label">CLINICAL OPERATIONS</div>
    <nav className="sidebar-nav">
      {MILESTONE.navItems.map(item => <NavLink key={item.path} to={item.path} className={({isActive}) => `sidebar-link${isActive ? ' active':''}`}>
        <i className={`bi bi-${icons[item.label] || 'circle'}`} /><span>{item.label}</span>{item.label === 'Alerts' && <span className="sidebar-count">3</span>}
      </NavLink>)}
    </nav>
    <div className="sidebar-footer">
      <div className="sidebar-system"><span className="system-dot" /><div><strong>System status</strong><small>All services operational</small></div></div>
      <div className="sidebar-version">MediSphere v4.2 • Demo</div>
    </div>
  </aside>
}
