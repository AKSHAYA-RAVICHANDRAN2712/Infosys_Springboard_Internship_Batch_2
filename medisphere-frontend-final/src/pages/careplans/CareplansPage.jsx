import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import { mockCareplans } from '../../data/insightsData'

export default function CareplansPage() {
  const [careplans] = useState(mockCareplans)
  const [expanded, setExpanded] = useState(null)

  const active = careplans.filter((c) => c.status === 'Active').length
  const completed = careplans.filter((c) => c.status === 'Completed').length

  return (
    <DashboardLayout title="Careplans">
      <p className="text-muted mb-4">Careplans assigned across your patients, generated from twin predictions and clinician review.</p>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-clipboard2-pulse-fill" label="Active careplans" value={active} tint="#1c9184" />
        </div>
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-clipboard2-check-fill" label="Completed careplans" value={completed} tint="#8a97a0" />
        </div>
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-clipboard2-data-fill" label="Total careplans" value={careplans.length} tint="#2f6fed" />
        </div>
      </div>

      <div className="ms-card p-3 p-md-4">
        <h6 className="brand-font mb-3">Careplans</h6>
        <div className="d-flex flex-column gap-2">
          {careplans.map((c) => {
            const isOpen = expanded === c.id
            return (
              <div key={c.id} className="border rounded p-3" style={{ borderColor: 'var(--line, #22304f)' }}>
                <div
                  className="d-flex justify-content-between align-items-center flex-wrap gap-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpanded(isOpen ? null : c.id)}
                >
                  <div>
                    <div className="fw-semibold">{c.title}</div>
                    <div className="small text-muted">
                      {c.patient} &middot; assigned by {c.assignedDoctor}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <Badge status={c.status} />
                    <span className="small text-muted">Next review: {c.nextReview}</span>
                    <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'} text-muted`} />
                  </div>
                </div>
                {isOpen && (
                  <ul className="small text-muted mt-3 mb-0 ps-3">
                    {c.tasks.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
