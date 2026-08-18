import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ROLES, roleHome } from './utils/roles'

import ProtectedRoute from './components/common/ProtectedRoute'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFound from './pages/NotFound'
import Patient360 from './pages/patients/Patient360'
import ConsentManagement from './pages/consent/ConsentManagement'
import TwinDashboard from './pages/twin/TwinDashboard'
import ConsentVerification from './pages/consent/ConsentVerification'

import AdminDashboard from './pages/dashboard/AdminDashboard'
import DoctorDashboard from './pages/dashboard/DoctorDashboard'
import PatientDashboard from './pages/dashboard/PatientDashboard'
import ReceptionistDashboard from './pages/dashboard/ReceptionistDashboard'

import PatientsPage from './pages/patients/PatientsPage'
import AppointmentsPage from './pages/appointments/AppointmentsPage'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? roleHome(user.role) : '/login'} replace />} />
      <Route path="/login" element={user ? <Navigate to={roleHome(user.role)} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={roleHome(user.role)} replace /> : <Register />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/patients" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><PatientsPage /></ProtectedRoute>
      } />
      <Route path="/patients/:id/360" element={
  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST,ROLES.PATIENT]}>
    <Patient360 />
  </ProtectedRoute>
} />

<Route path="/consent" element={
  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT]}>
    <ConsentManagement />
  </ProtectedRoute>
} />
<Route path="/twin-dashboard" element={
  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
    <TwinDashboard />
  </ProtectedRoute>
} />
      <Route path="/admin/appointments" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AppointmentsPage /></ProtectedRoute>
      } />
      <Route path="/consent/verify" element={
  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
    <ConsentVerification />
  </ProtectedRoute>
} />

      {/* Doctor */}
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}><DoctorDashboard /></ProtectedRoute>
      } />
      <Route path="/doctor/patients" element={
        <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}><PatientsPage /></ProtectedRoute>
      } />
      <Route path="/doctor/appointments" element={
        <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}><AppointmentsPage /></ProtectedRoute>
      } />

      {/* Patient */}
      <Route path="/patient/dashboard" element={
        <ProtectedRoute allowedRoles={[ROLES.PATIENT]}><PatientDashboard /></ProtectedRoute>
      } />
      <Route path="/patient/appointments" element={
        <ProtectedRoute allowedRoles={[ROLES.PATIENT]}><AppointmentsPage /></ProtectedRoute>
      } />

      {/* Receptionist */}
      <Route path="/receptionist/dashboard" element={
        <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}><ReceptionistDashboard /></ProtectedRoute>
      } />
      <Route path="/receptionist/patients" element={
        <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}><PatientsPage /></ProtectedRoute>
      } />
      <Route path="/receptionist/appointments" element={
        <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}><AppointmentsPage /></ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
