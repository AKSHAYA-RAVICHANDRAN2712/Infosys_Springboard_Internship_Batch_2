import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import { mockReports } from '../../data/insightsData'

const FORMAT_ICON = {
  PDF: 'bi-file-earmark-pdf-fill',
  XLSX: 'bi-file-earmark-spreadsheet-fill',
}

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <p className="text-muted mb-4">Generated reports across patient summaries, system sync health, and predictive insights.</p>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-file-earmark-bar-graph-fill" label="Reports generated" value={mockReports.length} tint="#1c9184" />
        </div>
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-calendar2-week-fill" label="Latest report" value={mockReports[0].generated} tint="#c98a2e" />
        </div>
        <div className="col-sm-6 col-lg-4">
          <StatCard icon="bi-cloud-check-fill" label="Auto-generation" value="Weekly" tint="#2f6fed" />
        </div>
      </div>

      <div className="ms-card p-3 p-md-4">
        <h6 className="brand-font mb-3">Report library</h6>
        <div className="d-flex flex-column gap-2">
          {mockReports.map((r) => (
            <div
              key={r.id}
              className="d-flex align-items-center justify-content-between p-3 rounded"
              style={{ border: '1px solid var(--line, #22304f)' }}
            >
              <div className="d-flex align-items-center gap-3">
                <i className={`bi ${FORMAT_ICON[r.format]}`} style={{ fontSize: '1.3rem', color: '#1c9184' }} />
                <div>
                  <div className="fw-semibold">{r.title}</div>
                  <div className="small text-muted">
                    {r.type} &middot; generated {r.generated} &middot; {r.format}
                  </div>
                </div>
              </div>
              <button className="btn btn-sm btn-outline-secondary">
                <i className="bi bi-download me-1" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
