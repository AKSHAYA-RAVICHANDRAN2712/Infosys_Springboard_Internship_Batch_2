import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Models } from './pages/Models';
import { CvdRisk } from './pages/CVDRisk';
import { DiabetesRisk } from './pages/DiabetesRisk';
import { ContinuousMonitoring } from './pages/ContinuousMonitoring';
import { Alerts } from './pages/Alerts';
import { FederatedTraining } from './pages/FederatedTraining';
import { Patients } from './pages/Patients';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { Admin } from './pages/Admin';
import { Doctor } from './pages/Doctor';
import { Doctors } from './pages/Doctors';
import { Patient } from './pages/Patient';
import { Receptionist } from './pages/Receptionist';
import { Employee } from './pages/Employee';
import { Appointments } from './pages/Appointments';
import { MedicalRecords } from './pages/MedicalRecords';
import { Fhir } from './pages/Fhir';
import { DigitalTwinPage } from './pages/DigitalTwin';
import { KafkaStreaming } from './pages/KafkaStreaming';
import { Settings } from './pages/Settings';
import { MediStorage } from './services/storage';

const DefaultRedirect: React.FC = () => {
  const user = MediStorage.getCurrentUser();
  const token = sessionStorage.getItem('medisphere_token');

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/models" element={<Layout><Models /></Layout>} />
        <Route path="/cvd-risk" element={<Layout><CvdRisk /></Layout>} />
        <Route path="/diabetes-risk" element={<Layout><DiabetesRisk /></Layout>} />
        <Route path="/continuous-monitoring" element={<Layout><ContinuousMonitoring /></Layout>} />
        <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
        <Route path="/federated-training" element={<Layout><FederatedTraining /></Layout>} />
        <Route path="/patients" element={<Layout><Patients /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
        <Route path="/doctor" element={<Layout><Doctor /></Layout>} />
        <Route path="/doctors" element={<Layout><Doctors /></Layout>} />
        <Route path="/patient" element={<Layout><Patient /></Layout>} />
        <Route path="/receptionist" element={<Layout><Receptionist /></Layout>} />
        <Route path="/employee" element={<Layout><Employee /></Layout>} />
        <Route path="/appointments" element={<Layout><Appointments /></Layout>} />
        <Route path="/medical-records" element={<Layout><MedicalRecords /></Layout>} />
        <Route path="/fhir" element={<Layout><Fhir /></Layout>} />
        <Route path="/digital-twin" element={<Layout><DigitalTwinPage /></Layout>} />
        <Route path="/kafka-streaming" element={<Layout><KafkaStreaming /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </HashRouter>
  );
}