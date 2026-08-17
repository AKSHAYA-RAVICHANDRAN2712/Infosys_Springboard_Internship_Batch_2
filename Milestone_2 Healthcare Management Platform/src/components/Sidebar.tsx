import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const Sidebar: React.FC<{ currentUser: any }> = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '⌂'
    },
    {
      path: '/patients',
      label: 'Patients',
      icon: '♙'
    },
    {
      path: '/models',
      label: 'Models',
      icon: '◈'
    },
    {
      path: '/federated-training',
      label: 'Federated Training',
      icon: '⇄'
    },
    {
      path: '/cvd-risk',
      label: 'CVD Risk',
      icon: '♥'
    },
    {
      path: '/diabetes-risk',
      label: 'Diabetes Risk',
      icon: '◉'
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: '▥'
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: '▤'
    }
  ];

  return (
    <aside id="app-left-sidebar" className="sidebar" aria-label="Main Navigation">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{
              fontSize: '0.95rem',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: 500
            }}
          >
            <span aria-hidden="true" style={{ width: '20px', textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};