import { useState } from 'react';
import MediStorage from '../services/storage';
import { exportToCSV, downloadSimulatedPDF } from '../services/utils';
import { useToast } from '../context/ToastContext';

const PREVIEW = `MEDISPHERE ENTERPRISE HEALTHCARE SYSTEM REPORT
---------------------------------------------------------
Period: Monthly Executive Report (August 2026)
Hospital Network: MediSphere Central Hospital

KEY METRICS:
- Total Patients Onboarded: 1,247
- Digital Health Twins Synchronized: 1,247 (100% Coverage)
- FHIR Resources Ingested: 2,400,000+
- Kafka Stream Telemetry Volume: 2,450 msgs/sec
- Monthly Clinical Appointments Completed: 942

SYSTEM INTEGRITY:
- HL7 FHIR v4 Gateway Uptime: 99.98%
- Average Kafka Event Latency: 2 ms`;

export default function ReportsPage() {
  const toast = useToast();
  const [period, setPeriod] = useState('Monthly');
  const [focus, setFocus] = useState('FHIR & Digital Twin Integration');

  function exportCSV() {
    const data = MediStorage.getPatients().map(p => ({
      PatientID: p.id, Name: p.name, Age: p.age, BloodGroup: p.bloodGroup,
      TwinCompleteness: `${p.twinCompleteness}%`, Doctor: p.assignedDoctor
    }));
    exportToCSV('MediSphere_Monthly_Report.csv', data);
    toast.success('Exported report CSV successfully!');
  }

  function generatePDF() {
    downloadSimulatedPDF('Executive_Report_2026', PREVIEW);
    toast.success('PDF Report dispatched to browser print preview.');
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Executive Reports & Audits</h1>
      </div>

      <div className="glass-card page-fade-in" style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#FFF', fontSize: '1.2rem', marginBottom: 16 }}>Hospital Executive Report Generator</h3>

        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Report Period</label>
            <select className="form-select" value={period} onChange={e => setPeriod(e.target.value)}>
              <option value="Daily">Daily Summary</option>
              <option value="Weekly">Weekly Summary</option>
              <option value="Monthly">Monthly Executive Report</option>
              <option value="Yearly">Annual Audit</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Report Focus Module</label>
            <select className="form-select" value={focus} onChange={e => setFocus(e.target.value)}>
              <option value="FHIR & Digital Twin Integration">FHIR & Digital Twin Integration</option>
              <option value="Patient Inflow & Appointments">Patient Inflow & Appointments</option>
              <option value="Kafka Stream Vitals Health">Kafka Stream Vitals Health</option>
              <option value="Departmental Performance">Departmental Performance</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={exportCSV}>Download CSV</button>
          <button className="btn btn-primary" onClick={generatePDF}>Generate & Export PDF</button>
        </div>
      </div>

      <div className="glass-card page-fade-in">
        <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 16 }}>Generated Executive Summary Preview</h3>
        <div style={{ background: '#0F172A', padding: 20, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', color: '#D1D5DB', fontFamily: 'monospace', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {PREVIEW}
        </div>
      </div>
    </>
  );
}
