import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ICONS = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  admin: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  doctors: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  patients: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  reception: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
  staff: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  appointments: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  records: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  fhir: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  twin: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  kafka: 'M13 10V3L4 14h7v7l9-11h-7z',
  reports: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  analytics: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
};

const MENUS = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/admin', label: 'Admin Portal', icon: 'admin' },
    { to: '/doctors', label: 'Doctors', icon: 'doctors' },
    { to: '/patients', label: 'Patients', icon: 'patients' },
    { to: '/receptionist', label: 'Receptionists', icon: 'reception' },
    { to: '/employee', label: 'Medical Staff', icon: 'staff' },
    { to: '/appointments', label: 'Appointments', icon: 'appointments' },
    { to: '/medical-records', label: 'Medical Records', icon: 'records' },
    { to: '/fhir', label: 'FHIR Integration', icon: 'fhir' },
    { to: '/digital-twin', label: 'Patient Twin Store', icon: 'twin' },
    { to: '/kafka-streaming', label: 'Kafka Streaming', icon: 'kafka' },
    { to: '/reports', label: 'Reports', icon: 'reports' },
    { to: '/analytics', label: 'Analytics', icon: 'analytics' },
    { to: '/settings', label: 'Settings', icon: 'settings' }
  ],
  doctor: [
    { to: '/doctor', label: 'Doctor Dashboard', icon: 'dashboard' },
    { to: '/patients', label: 'My Patients', icon: 'patients' },
    { to: '/appointments', label: 'Appointments', icon: 'appointments' },
    { to: '/medical-records', label: 'Medical Records', icon: 'records' },
    { to: '/digital-twin', label: 'Patient Twin Store', icon: 'twin' }
  ],
  patient: [
    { to: '/patient', label: 'Patient Dashboard', icon: 'twin' },
    { to: '/appointments', label: 'Book Appointment', icon: 'appointments' },
    { to: '/medical-records', label: 'Medical Records', icon: 'records' },
    { to: '/digital-twin', label: 'Digital Twin', icon: 'twin' }
  ],
  receptionist: [
    { to: '/receptionist', label: 'Reception Desk', icon: 'reception' },
    { to: '/appointments', label: 'Appointments Queue', icon: 'appointments' },
    { to: '/patients', label: 'Patients Registry', icon: 'patients' },
    { to: '/doctors', label: 'Doctors Directory', icon: 'doctors' }
  ],
  employee: [
    { to: '/employee', label: 'Medical Staff Portal', icon: 'staff' },
    { to: '/patients', label: 'Patient Vitals & Labs', icon: 'patients' },
    { to: '/medical-records', label: 'Medical Notes', icon: 'records' }
  ]
};

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  if (!currentUser) return null;
  const items = MENUS[currentUser.role] || [];

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        {items.map(item => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={ICONS[item.icon]} /></svg>
            <span>{item.label}</span>
          </NavLink>
        ))}
        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="nav-item" style={{ marginTop: 20, color: '#EF4444' }}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={ICONS.logout} /></svg>
          <span>Logout</span>
        </a>
      </nav>
    </div>
  );
}
