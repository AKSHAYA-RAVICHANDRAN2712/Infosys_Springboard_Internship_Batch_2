import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer, MediToast } from './Toast';
import { GlobalModalContainer } from './Modal';
import { MediStorage } from '../services/storage';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = MediStorage.getCurrentUser();
  const token = sessionStorage.getItem('medisphere_token');

  useEffect(() => {
    if (!currentUser || !token) {
      sessionStorage.setItem('medisphere_login_notice', 'Please login to continue.');
      navigate('/login');
      return;
    }

    // Access control mapper
    const path = location.pathname;
    const PAGE_PERMISSIONS: Record<string, string[]> = {
      '/dashboard': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/models': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/cvd-risk': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/diabetes-risk': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/continuous-monitoring': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/alerts': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/federated-training': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/patients': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/reports': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/analytics': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/admin': ['admin'],
      '/fhir': ['admin'],
      '/kafka-streaming': ['admin'],
      '/settings': ['admin'],
      '/doctor': ['admin', 'doctor'],
      '/patient': ['admin', 'patient'],
      '/receptionist': ['admin', 'receptionist'],
      '/employee': ['admin', 'employee'],
      '/doctors': ['admin', 'doctor', 'receptionist'],
      '/appointments': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
      '/medical-records': ['admin', 'doctor', 'patient', 'employee'],
      '/digital-twin': ['admin', 'doctor', 'patient']
    };

    const allowedRoles = PAGE_PERMISSIONS[path];
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      MediToast.error(`Access Denied: Your role (${currentUser.role.toUpperCase()}) cannot access ${path}`, 'Access Security Warning');
      navigate('/dashboard');
    }
  }, [location.pathname, currentUser, token, navigate]);

  if (!currentUser || !token) {
    return null;
  }

  return (
    <div className="app-shell">
      <Navbar currentUser={currentUser} />
      <div className="app-container">
        <Sidebar currentUser={currentUser} />
        <main className="main-content" style={{ padding: '32px 36px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
      <ToastContainer />
      <GlobalModalContainer />
    </div>
  );
};
