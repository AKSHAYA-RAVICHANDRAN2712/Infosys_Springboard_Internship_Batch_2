import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import EmptyState from '../../components/common/EmptyState'
import { mockAlerts } from '../../data/insightsData'

const SEVERITY_TINT = {
  Critical: '#d95c4f',
  Warning: '#c98a2e',
  Info: '#2f6fed',
}

const SEVERITY_ICON = {
  Critical: 'bi-exclamation-octagon-fill',
  Warning: 'bi-exclamation-triangle-fill',
  Info: 'bi-info-circle-fill',
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [filter, setFilter] = useState('All')

  const critical = alerts.filter((a) => a.severity === 'Critical' && !a.acknowledged).length
  const warning = alerts.filter((a) => a.severity === 'Warning' && !a.acknowledged).length
  const unacknowledged = alerts.filter((a) => !a.acknowledged).length

  const visible = filter === 'All' ? alerts : alerts.filter((a) => a.severity === filter)

  function acknowledge(id) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))
  }

  return (
    <DashboardLayout title="Alerts">
      <p className="text-muted mb-4">Live clinical alerts generated from vitals streams, labs, and missed care events.</p>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-exclamation-octagon-fill" label="Critical (unacknowledged)" value={critical} tint="#d95c4f" />
        </div>
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-exclamation-triangle-fill" label="Warning (unacknowledged)" value={warning} tint="#c98a2e" />
        </div>
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-bell-fill" label="Total unacknowledged" value={unacknowledged} tint="#2f6fed" />
        </div>
      </div>

      <div className="ms-card p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <h6 className="brand-font mb-0">Alert feed</h6>
          <div className="btn-group btn-group-sm">
            {['All', 'Critical', 'Warning', 'Info'].map((s) => (
              <button
                key={s}
                className={`btn ${filter === s ? 'btn-secondary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState icon="bi-bell-slash" title="No alerts" subtitle="You're all caught up." />
        ) : (
          <div className="d-flex flex-column gap-2">
            {visible.map((a) => (
              <div
                key={a.id}
                className="d-flex align-items-start gap-3 p-3 rounded"
                style={{
                  background: a.acknowledged ? 'transparent' : `${SEVERITY_TINT[a.severity]}0d`,
                  border: `1px solid ${a.acknowledged ? 'var(--line, #22304f)' : SEVERITY_TINT[a.severity]}33`,
                  opacity: a.acknowledged ? 0.6 : 1,
                }}
              >
                <i
                  className={`bi ${SEVERITY_ICON[a.severity]}`}
                  style={{ color: SEVERITY_TINT[a.severity], fontSize: '1.1rem', marginTop: 2 }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between flex-wrap gap-1">
                    <span className="fw-semibold">{a.patient}</span>
                    <span className="small text-muted">{a.time}</span>
                  </div>
                  <div className="small">{a.message}</div>
                </div>
                {!a.acknowledged && (
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => acknowledge(a.id)}>
                    Acknowledge
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
