import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ROLES, roleHome } from './utils/roles'

import ProtectedRoute from './components/common/ProtectedRoute'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Landing from './pages/Landing'
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
import PredictionsPage from './pages/predictions/PredictionsPage'
import AlertsPage from './pages/alerts/AlertsPage'
import CareplansPage from './pages/careplans/CareplansPage'
import ReportsPage from './pages/reports/ReportsPage'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={roleHome(user.role)} replace /> : <Landing />} />
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
      <Route path="/admin/predictions" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><PredictionsPage /></ProtectedRoute>
      } />
      <Route path="/admin/alerts" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AlertsPage /></ProtectedRoute>
      } />
      <Route path="/admin/careplans" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><CareplansPage /></ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><ReportsPage /></ProtectedRoute>
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
      <Route path="/doctor/predictions" element={
        <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}><PredictionsPage /></ProtectedRoute>
      } />
      <Route path="/doctor/alerts" element={
        <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}><AlertsPage /></ProtectedRoute>
      } />
      <Route path="/doctor/careplans" element={
        <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}><CareplansPage /></ProtectedRoute>
      } />
      <Route path="/doctor/reports" element={
        <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}><ReportsPage /></ProtectedRoute>
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
      <Route path="/receptionist/predictions" element={
        <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}><PredictionsPage /></ProtectedRoute>
      } />
      <Route path="/receptionist/alerts" element={
        <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}><AlertsPage /></ProtectedRoute>
      } />
      <Route path="/receptionist/careplans" element={
        <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}><CareplansPage /></ProtectedRoute>
      } />
      <Route path="/receptionist/reports" element={
        <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}><ReportsPage /></ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
