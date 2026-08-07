// src/pages/twin/TwinDashboard.jsx
//
// "Milestone 1: FHIR Integration & Twin Foundation" screen.
// Color scheme matches the reference screenshot exactly:
//   - Dark navy sidebar
//   - Solid blue topbar
//   - Light/white main content area
//   - White stat cards with a thin border
//   - The "Digital Health Twin" panel stays dark navy (the one accent block)
//
// Reuses the same live vitals feed as VitalsMonitor.jsx — no new service
// file needed.

import React, { useEffect, useState } from 'react'
import { subscribeToVitals } from '../../api/vitalsService'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'bi-grid-1x2', active: true },
  { label: 'Patients', icon: 'bi-people' },
  { label: 'Twins', icon: 'bi-diagram-3' },
  { label: 'Predictions', icon: 'bi-graph-up-arrow' },
  { label: 'Alerts', icon: 'bi-bell' },
  { label: 'Careplans', icon: 'bi-clipboard2-pulse' },
  { label: 'Reports', icon: 'bi-file-earmark-bar-graph' },
]

const TIMELINE_EVENTS = [
  { date: '2026-07-30', event: 'Vitals sync from bedside monitor' },
  { date: '2026-07-18', event: 'Lab results updated — HbA1c 7.2%' },
  { date: '2026-07-12', event: 'Follow-up consultation — Dr. Rajesh Menon' },
  { date: '2026-06-30', event: 'Prescription updated — Lisinopril 10mg added' },
  { date: '2026-06-02', event: 'FHIR patient record synced from Epic EHR' },
]

export default function TwinDashboard() {
  const [reading, setReading] = useState(null)
  const [panel, setPanel] = useState(null) // 'timeline' | 'prediction' | 'careplan' | null
  const [predicting, setPredicting] = useState(false)
  const [creatingPlan, setCreatingPlan] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToVitals('twin-demo-patient', setReading, 2500)
    return unsubscribe
  }, [])

  function handleRunPrediction() {
    setPanel('prediction')
    setPredicting(true)
    setTimeout(() => setPredicting(false), 1200)
  }

  function handleCreateCareplan() {
    setPanel('careplan')
    setCreatingPlan(true)
    setTimeout(() => setCreatingPlan(false), 1000)
  }

  return (
    <div className="twin360-shell">
      <style>{`
        .twin360-shell {
          display: flex;
          min-height: 100vh;
          background: #f4f6fb;
          color: #1c2540;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .twin360-sidebar {
          width: 200px;
          flex-shrink: 0;
          background: #0d1424;
          padding: 1.25rem 0.9rem;
        }
        .twin360-brand {
          font-weight: 700;
          font-size: 1.05rem;
          color: #ffffff;
          margin-bottom: 1.5rem;
          padding: 0 0.4rem;
        }
        .twin360-nav-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.55rem 0.7rem;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #8a94ad;
          margin-bottom: 2px;
          cursor: pointer;
        }
        .twin360-nav-item.active {
          background: #17335c;
          color: #6fa8ff;
        }
        .twin360-main { flex: 1; min-width: 0; }
        .twin360-topbar {
          background: #2f6fed;
          padding: 0.9rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
          color: #ffffff;
        }
        .twin360-body { padding: 1.5rem; }
        .twin360-heading { color: #12172a; font-weight: 700; }
        .twin360-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .twin360-stat-card {
          background: #ffffff;
          border: 1px solid #e2e6f0;
          border-radius: 10px;
          padding: 1rem 1.1rem;
        }
        .twin360-stat-label { font-size: 0.75rem; color: #7c8494; }
        .twin360-stat-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.2rem 0;
          color: #12172a;
        }
        .twin360-stat-sub { font-size: 0.72rem; color: #2f6fed; }

        /* This card intentionally stays dark navy — the one accent block */
        .twin360-card {
          background: #0d1424;
          border: 1px solid #1c2540;
          border-radius: 10px;
          padding: 1.4rem;
          color: #e7ecf5;
        }
        .twin360-card h6 { color: #cdd6ea; font-weight: 600; margin-bottom: 1rem; }
        .twin360-row { font-size: 0.88rem; margin-bottom: 0.65rem; color: #c4cce0; }
        .twin360-row b { color: #e7ecf5; }
        .twin360-live-dot {
          display: inline-block; width: 7px; height: 7px; border-radius: 50%;
          background: #3ddc97; margin-right: 6px;
          animation: twin360-pulse 1.4s infinite;
        }
        @keyframes twin360-pulse {
          0% { box-shadow: 0 0 0 0 rgba(61,220,151,0.5); }
          70% { box-shadow: 0 0 0 6px rgba(61,220,151,0); }
          100% { box-shadow: 0 0 0 0 rgba(61,220,151,0); }
        }
        .twin360-actions { margin-top: 1.1rem; display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .twin360-btn {
          background: #17335c;
          border: 1px solid #2a4d85;
          color: #a9c6ff;
          font-size: 0.82rem;
          padding: 0.45rem 0.9rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .twin360-btn:hover { background: #1e447a; }
        .twin360-panel {
          margin-top: 1rem;
          background: #101a30;
          border: 1px solid #1c2540;
          border-radius: 10px;
          padding: 1rem 1.2rem;
          font-size: 0.86rem;
          color: #c4cce0;
        }
        .twin360-panel h6 { color: #a9c6ff; margin-bottom: 0.6rem; }
      `}</style>

      {/* Sidebar */}
      <aside className="twin360-sidebar">
        <div className="twin360-brand">
          <i className="bi bi-heart-pulse-fill me-2" style={{ color: '#6fa8ff' }} />
          MediSphere
        </div>
        {NAV_ITEMS.map((item) => (
          <div key={item.label} className={`twin360-nav-item ${item.active ? 'active' : ''}`}>
            <i className={`bi ${item.icon}`} />
            {item.label}
          </div>
        ))}
      </aside>

      <div className="twin360-main">
        {/* Topbar */}
        <div className="twin360-topbar">
          <span>Milestone 1: FHIR Integration &amp; Twin Foundation</span>
          <span style={{ opacity: 0.9 }}>Clinician | Logout</span>
        </div>

        <div className="twin360-body">
          <h4 className="twin360-heading mb-3">Patient 360 Dashboard</h4>

          {/* Stat cards */}
          <div className="twin360-stat-grid">
            <div className="twin360-stat-card">
              <div className="twin360-stat-label">Patients Onboarded</div>
              <div className="twin360-stat-value">1,247</div>
              <div className="twin360-stat-sub">↑ 87 this week</div>
            </div>
            <div className="twin360-stat-card">
              <div className="twin360-stat-label">FHIR Resources</div>
              <div className="twin360-stat-value">2.4M</div>
              <div className="twin360-stat-sub">Synced from EHR</div>
            </div>
            <div className="twin360-stat-card">
              <div className="twin360-stat-label">Twins Created</div>
              <div className="twin360-stat-value">1,247</div>
              <div className="twin360-stat-sub">100% coverage</div>
            </div>
          </div>

          {/* Digital Health Twin card — stays dark navy */}
          <div className="twin360-card">
            <h6>Digital Health Twin — Patient John Doe</h6>
            <div className="twin360-row"><b>FHIR Patient Resource:</b> Loaded from Epic EHR</div>
            <div className="twin360-row"><b>Demographics:</b> 58M | Conditions: Hypertension, T2 Diabetes</div>
            <div className="twin360-row">
              <span className="twin360-live-dot" />
              <b>Vitals Stream:</b>{' '}
              {reading
                ? `HR ${reading.heartRate}, BP ${reading.systolic}/${reading.diastolic}, SpO2 ${reading.spo2}% | Last: just now`
                : 'connecting…'}
            </div>
            <div className="twin360-row"><b>Lab Results:</b> HbA1c 7.2% | eGFR 65 | LDL 120</div>
            <div className="twin360-row"><b>3D Body Model:</b> Organ systems with risk heatmap (planned — Phase 3)</div>
            <div className="twin360-row"><b>Active Medications:</b> Metformin 500mg, Lisinopril 10mg</div>

            <div className="twin360-actions">
              <button className="twin360-btn" onClick={() => setPanel(panel === 'timeline' ? null : 'timeline')}>
                <i className="bi bi-clock-history me-1" /> View Timeline
              </button>
              <button className="twin360-btn" onClick={handleRunPrediction}>
                <i className="bi bi-graph-up-arrow me-1" /> Run Prediction
              </button>
              <button className="twin360-btn" onClick={handleCreateCareplan}>
                <i className="bi bi-clipboard2-plus me-1" /> Create Careplan
              </button>
            </div>

            {panel === 'timeline' && (
              <div className="twin360-panel">
                <h6>Patient Timeline</h6>
                {TIMELINE_EVENTS.map((t, i) => (
                  <div key={i} className="twin360-row">
                    <span style={{ color: '#6fa8ff' }}>{t.date}</span> — {t.event}
                  </div>
                ))}
              </div>
            )}

            {panel === 'prediction' && (
              <div className="twin360-panel">
                <h6>Risk Prediction</h6>
                {predicting ? (
                  <div>Running model…</div>
                ) : (
                  <div>
                    <div className="twin360-row"><b>Predicted risk (12-month cardiac event):</b> 14% — Moderate</div>
                    <div className="twin360-row"><b>Key contributing factors:</b> Hypertension, elevated LDL, HbA1c trend</div>
                    <div style={{ fontSize: '0.75rem', color: '#8a94ad' }}>
                      Simulated output for demo purposes — not a real clinical model.
                    </div>
                  </div>
                )}
              </div>
            )}

            {panel === 'careplan' && (
              <div className="twin360-panel">
                <h6>Careplan</h6>
                {creatingPlan ? (
                  <div>Creating careplan…</div>
                ) : (
                  <div className="twin360-row">
                    ✅ Careplan created and assigned to <b>Dr. Rajesh Menon</b> — follow-up in 4 weeks, lipid panel recheck in 8 weeks.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
