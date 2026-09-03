import { useState, useEffect, useCallback } from 'react'
import PatientSelect from './PatientSelect'
import { getPatients, getCompliance, getComplianceSummary, updateCompliance } from '../../services/milestone4Api'

const GUIDANCE_ICON = {
  MONITORING: 'bi-activity',
  MEDICATION: 'bi-capsule-pill',
  FOLLOW_UP: 'bi-calendar-check',
  DIAGNOSTIC: 'bi-clipboard2-pulse',
  LIFESTYLE: 'bi-heart-pulse',
  REFERRAL: 'bi-diagram-3',
  OTHER: 'bi-shield-check',
}

// Map the DB's compliance_status onto the card styling this UI already
// ships with (badge-compliant / badge-review / badge-noncompliant).
function toUiStatus(dbStatus) {
  if (dbStatus === 'COMPLIANT') return 'compliant'
  if (dbStatus === 'NON_COMPLIANT') return 'noncompliant'
  return 'review' // PENDING, PARTIALLY_COMPLIANT, NOT_APPLICABLE
}

function ClinicalGuidelineCompliance() {
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState('')

  const [patients, setPatients] = useState([])
  const [patientId, setPatientId] = useState('')
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const showToast = (text) => { setToast(text); window.setTimeout(() => setToast(''), 2200) }

  useEffect(() => {
    getPatients()
      .then((list) => {
        setPatients(list)
        if (list.length > 0) setPatientId((prev) => prev || list[0])
      })
      .catch(() => setPatients([]))
  }, [])

  const load = useCallback((forPatient) => {
    if (!forPatient) return
    setStatus('loading')
    setError('')
    Promise.all([getCompliance(forPatient), getComplianceSummary(forPatient)])
      .then(([rows, summaryData]) => {
        setRecords(rows)
        setSummary(summaryData)
        setStatus('ready')
      })
      .catch((err) => {
        setStatus('error')
        setError(err?.response?.data?.error || 'Could not reach the Milestone 4 backend (is it running on :4001?)')
      })
  }, [])

  useEffect(() => {
    load(patientId)
  }, [patientId, load])

  const guidelines = records.map((r) => ({
    id: r.compliance_id,
    code: (r.guidance_type || 'GEN').slice(0, 3),
    icon: GUIDANCE_ICON[r.guidance_type] || 'bi-shield-check',
    guideline: r.guidance_title,
    requirement: r.guidance_type ? r.guidance_type.replace('_', ' ') : '',
    status: toUiStatus(r.compliance_status),
    dbStatus: r.compliance_status,
    detail: r.action_taken || r.remarks || 'No action recorded yet.',
    provider: r.provider_name,
    updated: r.compliance_date ? new Date(r.compliance_date).toLocaleDateString() : 'Pending',
  }))

  const filtered = filter === 'all' ? guidelines : guidelines.filter((item) => item.status === filter)

  const compliantCount = summary ? summary.counts.COMPLIANT : 0
  const reviewCount = summary
    ? summary.counts.PENDING + summary.counts.PARTIALLY_COMPLIANT + summary.counts.NOT_APPLICABLE
    : 0
  const noncompliantCount = summary ? summary.counts.NON_COMPLIANT : 0
  const total = compliantCount + reviewCount + noncompliantCount
  const overallScore = summary?.overallScore ?? 0

  const markCompliant = async (item) => {
    try {
      await updateCompliance(item.id, {
        compliance_status: 'COMPLIANT',
        action_taken: item.detail === 'No action recorded yet.' ? 'Reviewed and confirmed by care team.' : item.detail,
      })
      showToast(`${item.guideline} marked compliant`)
      load(patientId)
    } catch (err) {
      showToast(err?.response?.data?.error || 'Could not update this guideline')
    }
  }

  return (
    <section className="m4-section m4-guideline-section">
      <div className="m4-section-title-row">
        <div>
          <div className="m4-section-kicker"><i className="bi bi-shield-check" /> QUALITY & SAFETY</div>
          <h2 className="m4-section-heading">Clinical Guideline Compliance</h2>
          <p className="m4-section-subheading">Real-time validation of the careplan against established clinical protocols and quality measures.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <PatientSelect patients={patients} value={patientId} onChange={setPatientId} />
          <div className="m4-compliance-score"><strong>{total > 0 ? `${overallScore}%` : '—'}</strong><span>Overall compliance</span></div>
        </div>
      </div>

      {status === 'loading' && <div className="m4-data-state">Loading compliance records…</div>}
      {status === 'error' && <div className="m4-data-state error"><i className="bi bi-exclamation-triangle" /> {error}</div>}

      {status === 'ready' && (
        <div className="m4-compliance-overview">
          <div className="m4-compliance-progress">
            <div className="m4-ring-small"><strong>{compliantCount}/{total || 0}</strong><span>met</span></div>
            <div>
              <strong>Guideline readiness</strong>
              <p>{reviewCount > 0 || noncompliantCount > 0 ? `${reviewCount + noncompliantCount} careplan requirement(s) need review.` : 'All tracked requirements are currently satisfied.'}</p>
              <div className="m4-wide-progress"><i style={{ width: `${total > 0 ? Math.round((compliantCount / total) * 100) : 0}%` }} /></div>
            </div>
          </div>
          <div className="m4-compliance-stats">
            <div><b>{compliantCount}</b><span>Compliant</span></div>
            <div><b>{reviewCount}</b><span>Review needed</span></div>
            <div><b>{noncompliantCount}</b><span>Non-compliant</span></div>
          </div>
        </div>
      )}

      <div className="m4-filter-bar">
        <div className="m4-filter-tabs">
          {['all', 'compliant', 'review', 'noncompliant'].map((item) => (
            <button key={item} type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>
              {item === 'all' ? 'All guidelines' : item === 'review' ? 'Review needed' : item === 'noncompliant' ? 'Non-compliant' : 'Compliant'}
            </button>
          ))}
        </div>
        <span><i className="bi bi-clock-history" /> Live from guidance_compliance</span>
      </div>

      {status === 'ready' && filtered.length === 0 && (
        <div className="m4-data-state">No compliance records for this patient{filter !== 'all' ? ' in this filter' : ''} yet.</div>
      )}

      <div className="m4-compliance-grid">
        {filtered.map((item) => (
          <article key={item.id} className={`m4-compliance-card status-card-${item.status}`}>
            <div className="m4-compliance-card-top">
              <div className="m4-guideline-icon"><i className={`bi ${item.icon}`} /><span>{item.code.toUpperCase()}</span></div>
              <span className={`m4-compliance-badge badge-${item.status}`}>
                <i className={`bi ${item.status === 'compliant' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`} />
                {item.status === 'compliant' ? 'Compliant' : item.status === 'noncompliant' ? 'Non-compliant' : 'Review needed'}
              </span>
            </div>
            <h3>{item.guideline}</h3>
            <p className="m4-guideline-requirement">{item.requirement} · logged by {item.provider}</p>
            <div className="m4-guideline-detail"><i className="bi bi-info-circle" /> {item.detail}</div>
            <div className="m4-guideline-footer">
              <div><span>Status</span><strong>{item.dbStatus.replace('_', ' ')}</strong></div>
              <small>{item.updated}</small>
              {item.status !== 'compliant' && <button type="button" onClick={() => markCompliant(item)}>Mark compliant <i className="bi bi-arrow-right" /></button>}
            </div>
          </article>
        ))}
      </div>

      <div className="m4-audit-footer"><div><i className="bi bi-shield-lock" /><div><strong>Audit trail is active</strong><span>All guideline checks are logged with timestamp, provider and careplan version.</span></div></div><div className="m4-audit-actions"><button type="button" onClick={() => showToast('Full compliance audit opened')}>View full audit</button><button type="button" onClick={() => showToast('Compliance report prepared')}>Export report</button></div></div>
      {toast && <div className="m4-toast"><i className="bi bi-check-circle-fill" /> {toast}</div>}
    </section>
  )
}

export default ClinicalGuidelineCompliance
