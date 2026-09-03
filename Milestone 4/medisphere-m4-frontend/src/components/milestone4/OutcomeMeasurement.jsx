import { useEffect, useState, useCallback } from 'react'
import PatientSelect from './PatientSelect'
import {
  getPatients,
  getOutcomeMetrics,
  getOutcomes,
  getOutcomesSummary,
  createOutcome,
} from '../../services/milestone4Api'

const metrics = [
  { label: 'HbA1c', current: '7.4%', target: '< 7.0%', baseline: '8.2%', change: '−0.8%', progress: 78, status: 'Improving', icon: 'bi-droplet-half', tone: 'blue' },
  { label: 'Blood Pressure', current: '132/84', target: '< 130/80', baseline: '140/89', change: '−8/5 mmHg', progress: 72, status: 'Improving', icon: 'bi-heart-pulse', tone: 'purple' },
  { label: 'CVD Risk', current: '16.2%', target: '< 15%', baseline: '21.8%', change: '−5.6 pts', progress: 84, status: 'Trending down', icon: 'bi-activity', tone: 'green' },
  { label: 'Adherence', current: '87%', target: '> 85%', baseline: '75%', change: '+12 pts', progress: 87, status: 'Above target', icon: 'bi-check2-circle', tone: 'cyan' },
]

const trend = [
  { day: 'Day 0', value: 21.8 },
  { day: 'Day 15', value: 20.4 },
  { day: 'Day 30', value: 19.1 },
  { day: 'Day 45', value: 18.3 },
  { day: 'Day 60', value: 17.4 },
  { day: 'Day 75', value: 16.8 },
  { day: 'Day 90', value: 16.2 },
]

const STATUS_LABEL = {
  IMPROVED: 'Improved',
  STABLE: 'Stable',
  WORSENED: 'Worsened',
  NO_CHANGE: 'No change',
  UNKNOWN: 'Unknown',
}

const emptyForm = { metric_id: '', baseline_value: '', measured_value: '', outcome_status: 'IMPROVED', notes: '' }

function timeAgo(iso) {
  if (!iso) return null
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`
  return `${Math.round(hrs / 24)} day(s) ago`
}

function OutcomeMeasurement() {
  const [range, setRange] = useState('90 days')
  const [toast, setToast] = useState('')

  const [patients, setPatients] = useState([])
  const [patientId, setPatientId] = useState('')
  const [outcomeMetrics, setOutcomeMetrics] = useState([])
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  useEffect(() => {
    getPatients()
      .then((list) => {
        setPatients(list)
        if (list.length > 0) setPatientId((prev) => prev || list[0])
      })
      .catch(() => setPatients([]))
    getOutcomeMetrics()
      .then(setOutcomeMetrics)
      .catch(() => setOutcomeMetrics([]))
  }, [])

  const loadOutcomes = useCallback((forPatient) => {
    if (!forPatient) return
    setStatus('loading')
    setError('')
    Promise.all([getOutcomes(forPatient), getOutcomesSummary(forPatient)])
      .then(([outcomes, summaryData]) => {
        setRecords(outcomes)
        setSummary(summaryData)
        setStatus('ready')
      })
      .catch((err) => {
        setStatus('error')
        setError(err?.response?.data?.error || 'Could not reach the Milestone 4 backend (is it running on :4001?)')
      })
  }, [])

  useEffect(() => {
    loadOutcomes(patientId)
  }, [patientId, loadOutcomes])

  const submitOutcome = async (e) => {
    e.preventDefault()
    if (!patientId || !form.metric_id) {
      notify('Choose a patient and a metric first')
      return
    }
    try {
      await createOutcome({
        patient_id: patientId,
        metric_id: Number(form.metric_id),
        baseline_value: form.baseline_value === '' ? null : Number(form.baseline_value),
        measured_value: form.measured_value === '' ? null : Number(form.measured_value),
        outcome_status: form.outcome_status,
        notes: form.notes || null,
      })
      notify('Outcome measurement saved')
      setForm(emptyForm)
      setShowForm(false)
      loadOutcomes(patientId)
    } catch (err) {
      notify(err?.response?.data?.error || 'Could not save the measurement')
    }
  }

  return (
    <section className="m4-section m4-outcome-section">
      <div className="m4-section-title-row">
        <div>
          <div className="m4-section-kicker"><i className="bi bi-graph-up-arrow" /> PATIENT OUTCOMES</div>
          <h2 className="m4-section-heading">Outcome Measurement</h2>
          <p className="m4-section-subheading">Track measurable response to the careplan, compare against baseline values and identify whether clinical goals are moving toward target.</p>
        </div>
        <div className="m4-outcome-header-actions">
          <span className="m4-outcome-live"><i className="bi bi-circle-fill" /> {summary?.latestMeasurementDate ? `Updated ${timeAgo(summary.latestMeasurementDate)}` : 'No records yet'}</span>
          <button type="button" className="m4-small-action" onClick={() => notify('Outcome report prepared')}><i className="bi bi-download" /> Export</button>
        </div>
      </div>

      <div className="m4-outcome-kpis">
        {metrics.map((metric) => (
          <article className="m4-outcome-metric" key={metric.label}>
            <div className="m4-outcome-metric-top">
              <div className={`m4-outcome-icon ${metric.tone}`}><i className={`bi ${metric.icon}`} /></div>
              <span className="m4-outcome-status"><i className="bi bi-arrow-up-right" /> {metric.status}</span>
            </div>
            <span className="m4-outcome-label">{metric.label}</span>
            <div className="m4-outcome-value-row"><strong>{metric.current}</strong><span>{metric.change}</span></div>
            <div className="m4-outcome-target"><span>Target {metric.target}</span><span>Baseline {metric.baseline}</span></div>
            <div className="m4-outcome-progress"><i style={{ width: `${metric.progress}%` }} /></div>
            <div className="m4-outcome-progress-label"><span>Goal progress</span><b>{metric.progress}%</b></div>
          </article>
        ))}
      </div>

      <div className="m4-outcome-main-grid">
        <article className="m4-outcome-panel m4-trend-panel">
          <div className="m4-outcome-panel-head">
            <div><h3>CVD Risk Trajectory</h3><p>Observed progress against the 90-day prediction</p></div>
            <div className="m4-range-tabs">
              {['30 days', '60 days', '90 days'].map((item) => <button type="button" key={item} className={range === item ? 'active' : ''} onClick={() => setRange(item)}>{item}</button>)}
            </div>
          </div>
          <div className="m4-trend-legend"><span><i className="trend-dot actual" /> Actual risk</span><span><i className="trend-dot target" /> Target &lt;15%</span><b>16.2% <small>current</small></b></div>
          <div className="m4-trend-chart" aria-label="CVD risk decreasing from 21.8 percent to 16.2 percent over 90 days">
            <div className="m4-chart-grid"><span>22%</span><span>20%</span><span>18%</span><span>16%</span><span>14%</span></div>
            <svg viewBox="0 0 700 220" preserveAspectRatio="none" role="img">
              <defs><linearGradient id="outcomeArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" /><stop offset="100%" stopOpacity="0" /></linearGradient></defs>
              <line x1="0" y1="176" x2="700" y2="176" className="chart-target-line" />
              <path d="M20 20 L130 51 L240 81 L350 99 L460 119 L570 133 L680 145 L680 210 L20 210 Z" className="chart-area" />
              <polyline points="20,20 130,51 240,81 350,99 460,119 570,133 680,145" className="chart-line" />
              <circle cx="20" cy="20" r="4" className="chart-point" /><circle cx="130" cy="51" r="4" className="chart-point" /><circle cx="240" cy="81" r="4" className="chart-point" /><circle cx="350" cy="99" r="4" className="chart-point" /><circle cx="460" cy="119" r="4" className="chart-point" /><circle cx="570" cy="133" r="4" className="chart-point" /><circle cx="680" cy="145" r="5" className="chart-point current" />
            </svg>
            <div className="m4-chart-labels">{trend.map((item) => <span key={item.day}>{item.day}</span>)}</div>
          </div>
          <div className="m4-trend-callout"><i className="bi bi-stars" /><div><strong>Positive trajectory</strong><span>Risk has fallen 25.7% from baseline and is projected to reach 14.9% by the next assessment.</span></div><b>−25.7%</b></div>
        </article>

        <article className="m4-outcome-panel">
          <div className="m4-outcome-panel-head"><div><h3>Baseline vs Current</h3><p>Change since careplan activation</p></div><i className="bi bi-arrow-left-right m4-panel-icon" /></div>
          <div className="m4-comparison-list">
            <div><span>HbA1c</span><b>8.2%</b><i className="bi bi-arrow-right" /><strong>7.4%</strong><em>−0.8%</em></div>
            <div><span>Blood pressure</span><b>140/89</b><i className="bi bi-arrow-right" /><strong>132/84</strong><em>−8/5</em></div>
            <div><span>Weight</span><b>84.2 kg</b><i className="bi bi-arrow-right" /><strong>80.0 kg</strong><em>−4.2 kg</em></div>
            <div><span>Adherence</span><b>75%</b><i className="bi bi-arrow-right" /><strong>87%</strong><em>+12 pts</em></div>
          </div>
          <div className="m4-comparison-footer"><i className="bi bi-info-circle" /> Measurements are synchronized from EHR, patient app and wearable signals.</div>
        </article>
      </div>

      <div className="m4-outcome-bottom-grid">
        <article className="m4-outcome-panel">
          <div className="m4-outcome-panel-head"><div><h3>Careplan Milestones</h3><p>Progress toward intervention goals</p></div><span className="m4-milestone-count">3 of 4 on track</span></div>
          <div className="m4-milestones">
            <div className="m4-milestone complete"><span className="m4-milestone-icon"><i className="bi bi-check-lg" /></span><div><strong>Medication optimization</strong><small>Metformin adjustment completed</small></div><b>Complete</b></div>
            <div className="m4-milestone complete"><span className="m4-milestone-icon"><i className="bi bi-check-lg" /></span><div><strong>Daily BP monitoring</strong><small>92% wearable sync adherence</small></div><b>On track</b></div>
            <div className="m4-milestone active"><span className="m4-milestone-icon"><i className="bi bi-arrow-up" /></span><div><strong>HbA1c target</strong><small>7.4% current · target &lt;7.0%</small></div><b>In progress</b></div>
            <div className="m4-milestone pending"><span className="m4-milestone-icon"><i className="bi bi-clock" /></span><div><strong>CVD risk &lt;15%</strong><small>Projected 14.9% at next review</small></div><b>Projected</b></div>
          </div>
        </article>

        <article className="m4-outcome-panel m4-monitoring-panel">
          <div className="m4-outcome-panel-head"><div><h3>Monitoring & Next Review</h3><p>Upcoming outcome checkpoints</p></div><span className="m4-review-badge"><i className="bi bi-calendar-check" /> 14 days</span></div>
          <div className="m4-monitoring-items">
            <div><i className="bi bi-droplet" /><span><strong>Weekly glucose logs</strong><small>Next sync · Tomorrow</small></span><b>92%</b></div>
            <div><i className="bi bi-smartwatch" /><span><strong>Wearable BP sync</strong><small>Next sync · Today, 6 PM</small></span><b>96%</b></div>
            <div><i className="bi bi-clipboard2-pulse" /><span><strong>Outcome assessment</strong><small>Care team review · Sep 13</small></span><b>Scheduled</b></div>
          </div>
          <button type="button" className="m4-review-button" onClick={() => notify('Outcome review scheduled for the care team')}><i className="bi bi-calendar-plus" /> Schedule outcome review</button>
        </article>
      </div>

      {/* ---- Live data from the Milestone 4 backend ---- */}
      <article className="m4-outcome-panel m4-elevated-card" style={{ marginTop: 16 }}>
        <div className="m4-live-panel-head">
          <div>
            <h3>Outcome Records</h3>
            <p style={{ margin: '2px 0 0', fontSize: '.62rem', color: '#68778e' }}>Live data from the outcome_measurements table</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label>Patient</label>
            <PatientSelect patients={patients} value={patientId} onChange={setPatientId} />
            <button type="button" className="m4-small-action" onClick={() => setShowForm((s) => !s)}>
              <i className="bi bi-plus-lg" /> Log measurement
            </button>
          </div>
        </div>

        {summary && (
          <div className="m4-compliance-stats" style={{ marginBottom: 10 }}>
            <div><b>{summary.counts.IMPROVED}</b><span>Improved</span></div>
            <div><b>{summary.counts.STABLE}</b><span>Stable</span></div>
            <div><b>{summary.counts.WORSENED}</b><span>Worsened</span></div>
          </div>
        )}

        {status === 'loading' && <div className="m4-data-state">Loading outcome records…</div>}
        {status === 'error' && <div className="m4-data-state error"><i className="bi bi-exclamation-triangle" /> {error}</div>}
        {status === 'ready' && records.length === 0 && (
          <div className="m4-data-state">No outcome measurements logged for this patient yet.</div>
        )}
        {status === 'ready' && records.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Metric</th><th>Baseline</th><th>Measured</th><th>Status</th><th>Date</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.outcome_id}>
                    <td><strong>{r.metric_name}</strong><small>{r.unit}</small></td>
                    <td>{r.baseline_value ?? '—'}</td>
                    <td>{r.measured_value ?? '—'}</td>
                    <td><span className={`status-pill ${r.outcome_status === 'IMPROVED' ? 'confirmed' : r.outcome_status === 'WORSENED' ? 'waiting' : 'scheduled'}`}>{STATUS_LABEL[r.outcome_status] || r.outcome_status}</span></td>
                    <td>{new Date(r.measurement_date).toLocaleDateString()}</td>
                    <td>{r.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <form className="m4-inline-form" onSubmit={submitOutcome}>
            <select value={form.metric_id} onChange={(e) => setForm({ ...form, metric_id: e.target.value })} required>
              <option value="">Metric…</option>
              {outcomeMetrics.map((m) => (
                <option key={m.metric_id} value={m.metric_id}>{m.metric_name} ({m.unit})</option>
              ))}
            </select>
            <input type="number" step="0.01" placeholder="Baseline value" value={form.baseline_value} onChange={(e) => setForm({ ...form, baseline_value: e.target.value })} />
            <input type="number" step="0.01" placeholder="Measured value" value={form.measured_value} onChange={(e) => setForm({ ...form, measured_value: e.target.value })} />
            <select value={form.outcome_status} onChange={(e) => setForm({ ...form, outcome_status: e.target.value })}>
              {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div className="m4-inline-form-actions">
              <button type="button" className="secondary-btn small" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="primary-btn">Save measurement</button>
            </div>
          </form>
        )}
      </article>

      <div className="m4-outcome-summary m4-outcome-summary-enhanced">
        <div><span className="summary-icon"><i className="bi bi-stars" /></span><p><strong>Predicted outcome</strong><span>CVD risk ↓ to 16.2% over 90 days · Hospitalization risk ↓ 23%</span></p></div>
        <div><span className="summary-icon green"><i className="bi bi-graph-down-arrow" /></span><p><strong>Clinical response</strong><span>HbA1c ↓ 0.8% · BP ↓ 8/5 mmHg · Weight ↓ 4.2 kg since careplan start</span></p></div>
        <div><span className="summary-icon purple"><i className="bi bi-bell" /></span><p><strong>Next action</strong><span>14-day assessment scheduled · Results will be auto-shared with the care team</span></p></div>
      </div>

      {toast && <div className="m4-toast"><i className="bi bi-check-circle-fill" /> {toast}</div>}
    </section>
  )
}

export default OutcomeMeasurement
