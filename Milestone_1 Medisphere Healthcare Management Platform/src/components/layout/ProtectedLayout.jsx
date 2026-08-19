import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { isAllowed, homeForRole } from '../../utils/rbac';
import TopHeader from './TopHeader';
import Sidebar from './Sidebar';

/* Security Page Guard (RBAC enforcer), ported from assets/js/app.js */
export default function ProtectedLayout() {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ notice: 'Please login to continue.' }} replace />;
  }

  if (!isAllowed(location.pathname, currentUser.role)) {
    const home = homeForRole(currentUser.role);
    return <Navigate to={home} state={{ denied: `Access Denied: Your role (${currentUser.role.toUpperCase()}) cannot access ${location.pathname}` }} replace />;
  }

  return (
    <div className="app-shell">
      <TopHeader />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <AccessDeniedNotice />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AccessDeniedNotice() {
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    if (location.state && location.state.denied) {
      toast.error(location.state.denied, 'Access Security Warning');
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
