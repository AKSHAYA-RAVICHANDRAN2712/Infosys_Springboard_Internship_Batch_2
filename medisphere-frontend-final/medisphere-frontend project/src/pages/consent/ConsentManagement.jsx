// src/pages/consent/ConsentManagement.jsx

import React, { useEffect, useState } from 'react'
import { getConsents, updateConsent, getAuditLog } from '../../api/consentService'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function ConsentManagement({ patientId = 101 }) {
  const [consents, setConsents] = useState([])
  const [log, setLog] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getConsents(patientId), getAuditLog(patientId)]).then(([c, l]) => {
      setConsents(c)
      setLog(l)
      setLoading(false)
    })
  }, [patientId])

  async function handleToggle(consent) {
    if (consent.required) return // required consents can't be revoked from the UI
    const updated = await updateConsent(patientId, consent.id, !consent.granted)
    const [c, l] = await Promise.all([getConsents(patientId), getAuditLog(patientId)])
    setConsents(c)
    setLog(l)
  }

  if (loading) {
    return (
      <DashboardLayout title="Consent Management">
        <div className="text-muted small">Loading consent settings…</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Consent Management">
      <p className="text-muted mb-4" style={{ fontSize: '0.88rem' }}>
        Control how your health data is shared and used. Changes are logged for compliance.
      </p>

      <div className="ms-card p-3 p-md-4 mb-4">
        {consents.map((c, i) => (
          <div
            key={c.id}
            className={`d-flex align-items-start justify-content-between py-3 ${i !== consents.length - 1 ? 'border-bottom' : ''}`}
            style={{ borderColor: 'var(--line)' }}
          >
            <div className="pe-3">
              <div className="fw-medium" style={{ fontSize: '0.94rem' }}>
                {c.label}
                {c.required && <span className="text-muted ms-2" style={{ fontSize: '0.72rem' }}>(required)</span>}
              </div>
              <div className="text-muted" style={{ fontSize: '0.82rem' }}>{c.description}</div>
            </div>
            <div className="form-check form-switch flex-shrink-0 mt-1">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={c.granted}
                disabled={c.required}
                onChange={() => handleToggle(c)}
                style={{ width: '2.6em', height: '1.4em', cursor: c.required ? 'not-allowed' : 'pointer' }}
              />
            </div>
          </div>
        ))}
      </div>

      <h6 className="brand-font mb-3">Audit Trail</h6>
      <div className="ms-card p-0">
        <table className="table ms-table mb-0">
          <thead>
            <tr>
              <th>Action</th>
              <th>Consent</th>
              <th>By</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {log.map(entry => (
              <tr key={entry.id}>
                <td>
                  <span className="ms-badge-status">
                    <span className="dot" style={{ background: entry.action === 'Granted' ? 'var(--teal-500)' : 'var(--coral)' }} />
                    {entry.action}
                  </span>
                </td>
                <td>{entry.consent}</td>
                <td className="ms-mono-cell">{entry.by}</td>
                <td className="ms-mono-cell">{entry.ts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
