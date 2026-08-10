import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ModalProvider } from './context/ModalContext';
import ProtectedLayout from './components/layout/ProtectedLayout';
import { homeForRole } from './utils/rbac';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import DoctorPage from './pages/DoctorPage';
import PatientPage from './pages/PatientPage';
import ReceptionistPage from './pages/ReceptionistPage';
import EmployeePage from './pages/EmployeePage';
import DoctorsPage from './pages/DoctorsPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import FhirPage from './pages/FhirPage';
import KafkaStreamingPage from './pages/KafkaStreamingPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function RootRedirect() {
  const { isAuthenticated, currentUser } = useAuth();
  if (isAuthenticated) return <Navigate to={homeForRole(currentUser.role)} replace />;
  return <Navigate to="/login" replace />;
}

function LoginRoute() {
  const { isAuthenticated, currentUser } = useAuth();
  if (isAuthenticated) return <Navigate to={homeForRole(currentUser.role)} replace />;
  return <LoginPage />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginRoute />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/patient" element={<PatientPage />} />
        <Route path="/receptionist" element={<ReceptionistPage />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/medical-records" element={<MedicalRecordsPage />} />
        <Route path="/digital-twin" element={<DigitalTwinPage />} />
        <Route path="/fhir" element={<FhirPage />} />
        <Route path="/kafka-streaming" element={<KafkaStreamingPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ModalProvider>
            <AppRoutes />
          </ModalProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
