import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import { mockPredictions } from '../../data/insightsData'

const LEVEL_TINT = {
  High: '#d95c4f',
  Moderate: '#c98a2e',
  Low: '#1c9184',
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState(mockPredictions)
  const [runningId, setRunningId] = useState(null)

  const high = predictions.filter((p) => p.riskLevel === 'High').length
  const moderate = predictions.filter((p) => p.riskLevel === 'Moderate').length
  const low = predictions.filter((p) => p.riskLevel === 'Low').length

  function handleRerun(id) {
    setRunningId(id)
    setTimeout(() => {
      setPredictions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, lastRun: new Date().toISOString().slice(0, 10) } : p))
      )
      setRunningId(null)
    }, 900)
  }

  return (
    <DashboardLayout title="Predictions">
      <p className="text-muted mb-4">
        Twin-model risk predictions generated from live vitals, labs, and history. Simulated output for demo purposes.
      </p>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-exclamation-triangle-fill" label="High risk patients" value={high} tint="#d95c4f" />
        </div>
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-graph-up-arrow" label="Moderate risk patients" value={moderate} tint="#c98a2e" />
        </div>
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-shield-check" label="Low risk patients" value={low} tint="#1c9184" />
        </div>
      </div>

      <div className="ms-card p-3 p-md-4">
        <h6 className="brand-font mb-3">Patient risk predictions</h6>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted small">
                <th>Patient</th>
                <th>Condition</th>
                <th>Prediction</th>
                <th>Risk score</th>
                <th>Key factors</th>
                <th>Last run</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr key={p.id}>
                  <td className="fw-semibold">{p.patient}</td>
                  <td>{p.condition}</td>
                  <td>{p.riskType}</td>
                  <td>
                    <span
                      className="badge rounded-pill"
                      style={{
                        background: `${LEVEL_TINT[p.riskLevel]}17`,
                        color: LEVEL_TINT[p.riskLevel],
                        fontWeight: 500,
                      }}
                    >
                      {p.riskScore}% · {p.riskLevel}
                    </span>
                  </td>
                  <td className="small text-muted">{p.factors.join(', ')}</td>
                  <td className="small">{p.lastRun}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleRerun(p.id)}
                      disabled={runningId === p.id}
                    >
                      {runningId === p.id ? 'Running…' : 'Re-run'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
