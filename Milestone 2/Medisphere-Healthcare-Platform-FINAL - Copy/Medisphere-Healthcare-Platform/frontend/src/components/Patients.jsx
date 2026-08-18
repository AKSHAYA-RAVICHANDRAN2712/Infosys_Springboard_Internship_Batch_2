import { useMemo, useState } from 'react'
import MetricCard from './MetricCard'

// Mock patient registry. In production this would come from
// GET /patients?query=...&page=... on the clinical data service.
const PATIENTS = [
  { id: 'PT-10231', name: 'Margaret Chen', age: 67, condition: 'Coronary Artery Disease', risk: 'high', lastVisit: '12-AUG-2026', status: 'Active' },
  { id: 'PT-10244', name: 'James Okafor', age: 54, condition: 'Type 2 Diabetes', risk: 'moderate', lastVisit: '10-AUG-2026', status: 'Active' },
  { id: 'PT-10267', name: 'Priya Sharma', age: 41, condition: 'Hypertension', risk: 'low', lastVisit: '08-AUG-2026', status: 'Monitoring' },
  { id: 'PT-10289', name: 'Robert Alvarez', age: 72, condition: 'Congestive Heart Failure', risk: 'high', lastVisit: '05-AUG-2026', status: 'Active' },
  { id: 'PT-10305', name: 'Linda Petrova', age: 59, condition: 'Hyperlipidemia', risk: 'moderate', lastVisit: '02-AUG-2026', status: 'Active' },
  { id: 'PT-10318', name: 'David Kim', age: 63, condition: 'Coronary Artery Disease', risk: 'high', lastVisit: '30-JUL-2026', status: 'Discharged' },
  { id: 'PT-10332', name: 'Aisha Bello', age: 36, condition: 'Prediabetes', risk: 'low', lastVisit: '27-JUL-2026', status: 'Monitoring' },
  { id: 'PT-10347', name: 'Thomas Nguyen', age: 48, condition: 'Hypertension', risk: 'moderate', lastVisit: '24-JUL-2026', status: 'Active' },
]

const RISK_LABEL = { low: 'Low', moderate: 'Moderate', high: 'High' }

function Patients() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return PATIENTS
    return PATIENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q)
    )
  }, [query])

  const highRiskCount = PATIENTS.filter((p) => p.risk === 'high').length

  return (
    <main className="dashboard">
      <h1 className="dashboard__title">Patients</h1>

      <div className="row g-3 metrics-row">
        <div className="col-md-3">
          <MetricCard label="Total Patients" value="342" sublabel="Across 23 hospitals" />
        </div>
        <div className="col-md-3">
          <MetricCard label="High-Risk" value={highRiskCount} sublabel="Flagged by model" />
        </div>
        <div className="col-md-3">
          <MetricCard label="New Admissions" value="24" sublabel="Last 30 days" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Avg. Risk Score" value="0.31" sublabel="10-year CVD risk" />
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h3 className="panel__title">Patient Registry</h3>
          <input
            type="text"
            className="model-select patient-search"
            placeholder="Search by name, ID, or condition…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="panel__subtext">
          Showing {filtered.length} of {PATIENTS.length} loaded records.
        </p>

        <div className="data-table data-table--patients">
          <div className="data-table__row data-table__row--head">
            <span>Patient</span>
            <span>ID</span>
            <span>Age</span>
            <span>Primary Condition</span>
            <span>Risk Level</span>
            <span>Last Visit</span>
            <span>Status</span>
          </div>
          {filtered.map((p) => (
            <div className="data-table__row" key={p.id}>
              <span className="data-table__primary">{p.name}</span>
              <span>{p.id}</span>
              <span>{p.age}</span>
              <span>{p.condition}</span>
              <span>
                <span className={`risk-badge risk-badge--${p.risk}`}>
                  {RISK_LABEL[p.risk]}
                </span>
              </span>
              <span>{p.lastVisit}</span>
              <span>{p.status}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="prediction-panel__row" style={{ padding: '16px 8px' }}>
              No patients match "{query}".
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

export default Patients
