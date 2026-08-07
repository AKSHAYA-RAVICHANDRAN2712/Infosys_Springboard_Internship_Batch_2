// src/data/insightsData.js
// Mock data backing the Predictions / Alerts / Careplans / Reports nav
// items. Shapes are written to look like plausible future REST payloads
// (GET /api/predictions, GET /api/alerts, GET /api/careplans, GET /api/reports)
// so it's a straight swap once the backend endpoints exist.

export const mockPredictions = [
  {
    id: 'pr1',
    patientId: 101,
    patient: 'Priya Sharma',
    condition: 'Hypertension',
    riskType: '12-month cardiac event',
    riskScore: 14,
    riskLevel: 'Moderate',
    factors: ['Elevated BP trend', 'Family history', 'LDL 120'],
    lastRun: '2026-07-30',
  },
  {
    id: 'pr2',
    patientId: 102,
    patient: 'Arjun Verma',
    condition: 'Type 2 Diabetes',
    riskType: 'Diabetic complication (5-year)',
    riskScore: 32,
    riskLevel: 'High',
    factors: ['HbA1c 8.1%', 'eGFR declining', 'BMI 29.4'],
    lastRun: '2026-07-29',
  },
  {
    id: 'pr3',
    patientId: 103,
    patient: 'Kavita Iyer',
    condition: 'Post-surgery follow-up',
    riskType: 'Readmission (30-day)',
    riskScore: 6,
    riskLevel: 'Low',
    factors: ['Stable vitals', 'No prior readmissions'],
    lastRun: '2026-07-15',
  },
  {
    id: 'pr4',
    patientId: 105,
    patient: 'Neha Joshi',
    condition: 'Arthritis',
    riskType: 'Fall risk (6-month)',
    riskScore: 21,
    riskLevel: 'Moderate',
    factors: ['Age 61', 'Reduced mobility score'],
    lastRun: '2026-07-22',
  },
]

export const mockAlerts = [
  {
    id: 'al1',
    severity: 'Critical',
    patient: 'Arjun Verma',
    patientId: 102,
    message: 'Blood glucose reading 260 mg/dL — above critical threshold',
    time: '2026-07-31 08:12',
    acknowledged: false,
  },
  {
    id: 'al2',
    severity: 'Warning',
    patient: 'Priya Sharma',
    patientId: 101,
    message: 'BP trending upward over last 3 readings (128/82 → 138/90)',
    time: '2026-07-31 07:45',
    acknowledged: false,
  },
  {
    id: 'al3',
    severity: 'Info',
    patient: 'Neha Joshi',
    patientId: 105,
    message: 'Lab results synced from Epic EHR — HbA1c pending review',
    time: '2026-07-30 19:20',
    acknowledged: true,
  },
  {
    id: 'al4',
    severity: 'Warning',
    patient: 'Rohan Das',
    patientId: 104,
    message: 'Missed scheduled follow-up appointment',
    time: '2026-07-30 09:00',
    acknowledged: true,
  },
]

export const mockCareplans = [
  {
    id: 'cp1',
    patientId: 101,
    patient: 'Priya Sharma',
    title: 'Hypertension management plan',
    assignedDoctor: 'Dr. Rajesh Menon',
    status: 'Active',
    nextReview: '2026-08-28',
    tasks: ['BP check twice daily', 'Low-sodium diet', 'Lipid panel in 8 weeks'],
  },
  {
    id: 'cp2',
    patientId: 102,
    patient: 'Arjun Verma',
    title: 'Type 2 diabetes control plan',
    assignedDoctor: 'Dr. Rajesh Menon',
    status: 'Active',
    nextReview: '2026-08-14',
    tasks: ['HbA1c recheck', 'Nutrition counselling', 'Metformin dosage review'],
  },
  {
    id: 'cp3',
    patientId: 103,
    patient: 'Kavita Iyer',
    title: 'Post-surgical recovery plan',
    assignedDoctor: 'Dr. Sana Kapoor',
    status: 'Completed',
    nextReview: '2026-06-30',
    tasks: ['Wound check', 'Physiotherapy — 4 sessions'],
  },
  {
    id: 'cp4',
    patientId: 105,
    patient: 'Neha Joshi',
    title: 'Arthritis & mobility plan',
    assignedDoctor: 'Dr. Rajesh Menon',
    status: 'Active',
    nextReview: '2026-09-05',
    tasks: ['Physiotherapy — weekly', 'Pain management review'],
  },
]

export const mockReports = [
  {
    id: 'rp1',
    title: 'Monthly Patient Summary — July 2026',
    type: 'Patient Summary',
    generated: '2026-08-01',
    format: 'PDF',
  },
  {
    id: 'rp2',
    title: 'FHIR Sync & Data Quality Report',
    type: 'System',
    generated: '2026-07-31',
    format: 'PDF',
  },
  {
    id: 'rp3',
    title: 'Risk Trend Report — Cardiology Cohort',
    type: 'Predictions',
    generated: '2026-07-29',
    format: 'XLSX',
  },
  {
    id: 'rp4',
    title: 'Careplan Adherence Report',
    type: 'Careplans',
    generated: '2026-07-25',
    format: 'PDF',
  },
]
