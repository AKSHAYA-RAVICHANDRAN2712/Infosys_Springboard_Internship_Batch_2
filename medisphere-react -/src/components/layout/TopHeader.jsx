import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GlobalSearch from '../common/GlobalSearch';
import { homeForRole, PAGE_TITLES } from '../../utils/rbac';

export default function TopHeader() {
  const { currentUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const pageTitle = PAGE_TITLES[location.pathname] || 'MediSphere Healthcare Management System';

  function toggleTheme() {
    document.body.classList.toggle('light-theme');
    toast.info('Theme mode toggled');
  }

  function handleNotifications() {
    toast.info(`Logged in as ${currentUser.name} (${currentUser.role.toUpperCase()}). All permissions active.`, 'Role Session Status');
  }

  return (
    <header className="top-navbar">
      <div className="brand-section">
        <div className="brand-logo" style={{ cursor: 'pointer' }} onClick={() => navigate(homeForRole(currentUser.role))}>
          <div className="logo-icon-bg">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m-8-8h16"></path></svg>
          </div>
          <span>MediSphere</span>
        </div>
      </div>

      <div className="milestone-title">
        <span className="pulse-dot"></span>
        <span>{pageTitle}</span>
      </div>

      <div className="navbar-right">
        <GlobalSearch />

        <button className="icon-btn" title="Toggle Theme" onClick={toggleTheme}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </button>

        <button className="icon-btn" title="Notifications" onClick={handleNotifications}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span className="badge-dot"></span>
        </button>

        <div className="nav-user-info">
          <span>{currentUser.name || 'User'}</span>
          <span className="role-badge" style={{ textTransform: 'uppercase' }}>{currentUser.role || 'Admin'}</span>
          <span className="logout-link" onClick={logout}>Logout</span>
        </div>
      </div>
    </header>
  );
}
