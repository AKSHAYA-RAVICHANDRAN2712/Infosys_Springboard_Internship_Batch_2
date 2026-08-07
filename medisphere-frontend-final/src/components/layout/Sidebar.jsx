import React from 'react'
import { NavLink } from 'react-router-dom'
import { ROLES, ROLE_LABELS } from '../../utils/roles'

const NAV_BY_ROLE = {
  [ROLES.ADMIN]: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/admin/patients', label: 'Patients', icon: 'bi-people' },
    { to: '/admin/appointments', label: 'Appointments', icon: 'bi-calendar2-check' },
    { to: '/admin/predictions', label: 'Predictions', icon: 'bi-graph-up-arrow' },
    { to: '/admin/alerts', label: 'Alerts', icon: 'bi-bell' },
    { to: '/admin/careplans', label: 'Careplans', icon: 'bi-clipboard2-pulse' },
    { to: '/admin/reports', label: 'Reports', icon: 'bi-file-earmark-bar-graph' },
    { to: '/consent', label: 'Consent Settings', icon: 'bi-shield-check' },
    { to: '/consent/verify', label: 'Consent Verification', icon: 'bi-clipboard2-check' },
  ],
  [ROLES.DOCTOR]: [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/doctor/patients', label: 'My Patients', icon: 'bi-people' },
    { to: '/doctor/appointments', label: 'Appointments', icon: 'bi-calendar2-check' },
    { to: '/doctor/predictions', label: 'Predictions', icon: 'bi-graph-up-arrow' },
    { to: '/doctor/alerts', label: 'Alerts', icon: 'bi-bell' },
    { to: '/doctor/careplans', label: 'Careplans', icon: 'bi-clipboard2-pulse' },
    { to: '/doctor/reports', label: 'Reports', icon: 'bi-file-earmark-bar-graph' },
    { to: '/consent', label: 'Consent Settings', icon: 'bi-shield-check' },
    { to: '/consent/verify', label: 'Consent Verification', icon: 'bi-clipboard2-check' },
  ],
  [ROLES.PATIENT]: [
    { to: '/patient/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/patient/appointments', label: 'My Appointments', icon: 'bi-calendar2-check' },
    { to: '/consent', label: 'Consent Settings', icon: 'bi-shield-check' },
  ],
  [ROLES.RECEPTIONIST]: [
    { to: '/receptionist/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/receptionist/patients', label: 'Patients', icon: 'bi-people' },
    { to: '/receptionist/appointments', label: 'Appointments', icon: 'bi-calendar2-check' },
    { to: '/receptionist/predictions', label: 'Predictions', icon: 'bi-graph-up-arrow' },
    { to: '/receptionist/alerts', label: 'Alerts', icon: 'bi-bell' },
    { to: '/receptionist/careplans', label: 'Careplans', icon: 'bi-clipboard2-pulse' },
    { to: '/receptionist/reports', label: 'Reports', icon: 'bi-file-earmark-bar-graph' },
    { to: '/consent', label: 'Consent Settings', icon: 'bi-shield-check' },
    { to: '/consent/verify', label: 'Consent Verification', icon: 'bi-clipboard2-check' },
  ],
}

export default function Sidebar({ role, open }) {
  const links = NAV_BY_ROLE[role] || []

  return (
    <aside className={`ms-sidebar p-3 ${open ? 'open' : ''}`}>
      <div className="brand d-flex align-items-center gap-2 mb-1 px-1">
        <i className="bi bi-heart-pulse-fill" style={{ color: '#1c9184' }}></i>
        MediSphere
      </div>
      <div className="nav-section-label">{ROLE_LABELS[role] || 'Menu'}</div>
      <nav className="nav flex-column gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${link.icon}`}></i>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Signature: a hairline pulse line, echoing the heart-pulse mark */}
      <div className="ms-sidebar-pulse">
        <svg viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 20 H90 L104 20 L112 4 L124 36 L134 20 L146 20 L154 12 L162 20 H300"
            stroke="#1c9184" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"
          />
        </svg>
        <div className="label">MEDISPHERE · v1.0</div>
      </div>
    </aside>
  )
}
