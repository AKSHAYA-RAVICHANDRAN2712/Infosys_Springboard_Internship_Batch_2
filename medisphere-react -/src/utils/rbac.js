/* Role-Based Access Control config, ported from assets/js/app.js */

export const PAGE_PERMISSIONS = {
  '/admin': ['admin'],
  '/fhir': ['admin'],
  '/kafka-streaming': ['admin'],
  '/reports': ['admin'],
  '/analytics': ['admin'],
  '/settings': ['admin'],
  '/doctor': ['admin', 'doctor'],
  '/patient': ['admin', 'patient'],
  '/receptionist': ['admin', 'receptionist'],
  '/employee': ['admin', 'employee'],
  '/doctors': ['admin', 'doctor', 'receptionist'],
  '/patients': ['admin', 'doctor', 'receptionist', 'employee'],
  '/appointments': ['admin', 'doctor', 'patient', 'receptionist', 'employee'],
  '/medical-records': ['admin', 'doctor', 'patient', 'employee'],
  '/digital-twin': ['admin', 'doctor', 'patient'],
  '/dashboard': ['admin', 'doctor', 'patient', 'receptionist', 'employee']
};

export const ROLE_HOMES = {
  admin: '/admin',
  doctor: '/doctor',
  patient: '/patient',
  receptionist: '/receptionist',
  employee: '/employee'
};

export const PAGE_TITLES = {
  '/admin': 'User & Access Management Portal',
  '/doctor': 'Doctor Clinical Portal',
  '/patient': 'Patient Health Dashboard',
  '/receptionist': 'Front Desk & Reception Portal',
  '/employee': 'Medical Staff Dashboard'
};

export function isAllowed(path, role) {
  const allowed = PAGE_PERMISSIONS[path];
  if (!allowed) return true;
  return allowed.includes(role);
}

export function homeForRole(role) {
  return ROLE_HOMES[role] || '/dashboard';
}
