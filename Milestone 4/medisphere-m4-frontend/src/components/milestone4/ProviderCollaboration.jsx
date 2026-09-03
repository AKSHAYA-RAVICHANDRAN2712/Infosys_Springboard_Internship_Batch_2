import { useState, useEffect, useCallback } from 'react'
import PatientSelect from './PatientSelect'
import {
  getPatients,
  getCollaborations,
  getCollaborationNotes,
  createCollaboration,
  addCollaborationNote,
  updateCollaborationStatus,
} from '../../services/milestone4Api'

const team = [
  { name: 'Dr. Sarah Chen', role: 'Primary Care Physician', status: 'online', action: 'Approved careplan v2.1', time: '10 min ago', initials: 'SC' },
  { name: 'Dr. James Wilson', role: 'Cardiologist', status: 'online', action: 'Reviewed CVD risk assessment', time: '1 hr ago', initials: 'JW' },
  { name: 'Nurse Maria Lopez', role: 'Care Coordinator', status: 'away', action: 'Scheduled patient follow-up call', time: '2 hrs ago', initials: 'ML' },
  { name: 'Pharm. David Park', role: 'Clinical Pharmacist', status: 'offline', action: 'Verified Metformin dosage adjustment', time: 'Yesterday', initials: 'DP' },
]

const NOTE_TYPES = ['COMMENT', 'OBSERVATION', 'RECOMMENDATION', 'DECISION', 'FOLLOW_UP']
const NOTE_ICON = {
  COMMENT: { icon: 'bi-chat-left-text', tone: 'blue' },
  OBSERVATION: { icon: 'bi-eye', tone: 'blue' },
  RECOMMENDATION: { icon: 'bi-lightbulb', tone: 'purple' },
  DECISION: { icon: 'bi-check2-square', tone: 'green' },
  FOLLOW_UP: { icon: 'bi-bell', tone: 'purple' },
}

function initialsOf(name) {
  return name.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function timeAgo(iso) {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`
  return `${Math.round(hrs / 24)} day(s) ago`
}

function ProviderCollaboration() {
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState('')

  const [patients, setPatients] = useState([])
  const [patientId, setPatientId] = useState('')
  const [collaborations, setCollaborations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [notes, setNotes] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const [showNewCollab, setShowNewCollab] = useState(false)
  const [newCollab, setNewCollab] = useState({ initiated_by: '', collaborating_provider: '', subject: '', priority: 'NORMAL' })
  const [noteDraft, setNoteDraft] = useState({ provider_name: '', note_type: 'COMMENT', note_text: '' })

  const notify = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2200)
  }

  useEffect(() => {
    getPatients()
      .then((list) => {
        setPatients(list)
        if (list.length > 0) setPatientId((prev) => prev || list[0])
      })
      .catch(() => setPatients([]))
  }, [])

  const loadCollaborations = useCallback((forPatient) => {
    if (!forPatient) return
    setStatus('loading')
    setError('')
    getCollaborations(forPatient)
      .then((list) => {
        setCollaborations(list)
        setStatus('ready')
        setSelectedId(list.length > 0 ? list[0].collaboration_id : null)
      })
      .catch((err) => {
        setStatus('error')
        setError(err?.response?.data?.error || 'Could not reach the Milestone 4 backend (is it running on :4001?)')
      })
  }, [])

  useEffect(() => {
    loadCollaborations(patientId)
  }, [patientId, loadCollaborations])

  useEffect(() => {
    if (!selectedId) {
      setNotes([])
      return
    }
    getCollaborationNotes(selectedId).then(setNotes).catch(() => setNotes([]))
  }, [selectedId])

  const selected = collaborations.find((c) => c.collaboration_id === selectedId)
  const openCount = collaborations.filter((c) => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length
  const totalNotes = collaborations.reduce((sum, c) => sum + Number(c.total_notes || 0), 0)

  const submitNewCollab = async (e) => {
    e.preventDefault()
    if (!patientId || !newCollab.initiated_by || !newCollab.collaborating_provider || !newCollab.subject) {
      notify('Fill in all fields to open a collaboration')
      return
    }
    try {
      await createCollaboration({ patient_id: patientId, ...newCollab })
      notify('Collaboration opened')
      setNewCollab({ initiated_by: '', collaborating_provider: '', subject: '', priority: 'NORMAL' })
      setShowNewCollab(false)
      loadCollaborations(patientId)
    } catch (err) {
      notify(err?.response?.data?.error || 'Could not create the collaboration')
    }
  }

  const submitNote = async (e) => {
    e.preventDefault()
    if (!selectedId || !noteDraft.provider_name || !noteDraft.note_text) {
      notify('Choose a collaboration and fill in the note')
      return
    }
    try {
      await addCollaborationNote(selectedId, noteDraft)
      notify('Note added')
      setNoteDraft({ provider_name: '', note_type: 'COMMENT', note_text: '' })
      getCollaborationNotes(selectedId).then(setNotes)
      loadCollaborations(patientId)
    } catch (err) {
      notify(err?.response?.data?.error || 'Could not add the note')
    }
  }

  const resolveCollab = async () => {
    if (!selectedId) return
    try {
      await updateCollaborationStatus(selectedId, 'RESOLVED')
      notify('Collaboration marked resolved')
      loadCollaborations(patientId)
    } catch (err) {
      notify(err?.response?.data?.error || 'Could not update status')
    }
  }

  return (
    <section className="m4-section m4-collaboration-section">
      <div className="m4-section-title-row">
        <div>
          <div className="m4-section-kicker"><i className="bi bi-people-fill" /> CARE TEAM</div>
          <h2 className="m4-section-heading">Provider Collaboration</h2>
          <p className="m4-section-subheading">Coordinate clinical decisions, tasks and patient communication in one shared workspace.</p>
        </div>
        <span className="m4-live-badge"><i className="bi bi-circle-fill" /> 3 providers active</span>
      </div>

      <div className="m4-collab-summary">
        <div><span>Care team</span><strong>4</strong><small>Assigned providers</small></div>
        <div><span>Open collaborations</span><strong>{openCount}</strong><small>for this patient</small></div>
        <div><span>Notes logged</span><strong>{totalNotes}</strong><small>across collaborations</small></div>
        <div><span>Last huddle</span><strong>Today</strong><small>09:30 AM · 18 min</small></div>
      </div>

      <div className="m4-collab-grid">
        <div className="m4-collab-team m4-elevated-card">
          <div className="m4-card-title-row"><div><h3>Care team</h3><p>Current members and recent activity</p></div><button type="button" className="m4-small-action" onClick={() => notify('Invite provider panel opened')}><i className="bi bi-person-plus" /> Add provider</button></div>
          {team.map((member) => (
            <div key={member.name} className="m4-team-member">
              <div className="m4-avatar m4-avatar-initials">{member.initials}<span className={`m4-status-dot status-${member.status}`} /></div>
              <div className="m4-member-info">
                <div className="m4-member-top"><div><div className="m4-member-name">{member.name}</div><div className="m4-member-role">{member.role}</div></div><span className={`m4-presence presence-${member.status}`}>{member.status}</span></div>
                <div className="m4-member-action"><i className="bi bi-check2-circle" /> {member.action}</div>
                <div className="m4-member-time">{member.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="m4-collab-messages m4-elevated-card">
          <div className="m4-card-title-row">
            <div><h3>Collaboration activity</h3><p>Live from provider_collaborations · collaboration_notes</p></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <PatientSelect patients={patients} value={patientId} onChange={setPatientId} />
            </div>
          </div>

          {status === 'loading' && <div className="m4-data-state">Loading collaborations…</div>}
          {status === 'error' && <div className="m4-data-state error"><i className="bi bi-exclamation-triangle" /> {error}</div>}

          {status === 'ready' && collaborations.length > 0 && (
            <div className="m4-filter-tabs" style={{ margin: '10px 0', flexWrap: 'wrap' }}>
              {collaborations.map((c) => (
                <button
                  key={c.collaboration_id}
                  type="button"
                  className={selectedId === c.collaboration_id ? 'active' : ''}
                  onClick={() => setSelectedId(c.collaboration_id)}
                >
                  {c.subject.length > 28 ? `${c.subject.slice(0, 28)}…` : c.subject}
                </button>
              ))}
            </div>
          )}

          {status === 'ready' && collaborations.length === 0 && (
            <div className="m4-data-state">No collaborations yet for this patient.</div>
          )}

          {selected && (
            <div className="m4-collab-summary" style={{ gridTemplateColumns: 'repeat(4,1fr)', margin: '4px 0 10px' }}>
              <div><span>Initiated by</span><strong style={{ fontSize: '.72rem' }}>{selected.initiated_by}</strong></div>
              <div><span>With</span><strong style={{ fontSize: '.72rem' }}>{selected.collaborating_provider}</strong></div>
              <div><span>Priority</span><strong style={{ fontSize: '.72rem' }}>{selected.priority}</strong></div>
              <div><span>Status</span><strong style={{ fontSize: '.72rem' }}>{selected.status}</strong></div>
            </div>
          )}

          <div className="m4-activity-feed">
            {notes.length === 0 && selected && <div className="m4-empty-note">No notes on this collaboration yet — add the first one below.</div>}
            {notes.map((n) => {
              const meta = NOTE_ICON[n.note_type] || NOTE_ICON.COMMENT
              return (
                <div className="m4-activity" key={n.note_id}>
                  <span className={`m4-activity-icon ${meta.tone}`}><i className={`bi ${meta.icon}`} /></span>
                  <div>
                    <strong>{n.provider_name} <em>· {n.note_type.replace('_', ' ').toLowerCase()}</em></strong>
                    <p>{n.note_text}</p>
                    <small>{timeAgo(n.created_at)}</small>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="m4-collab-actions">
            <button type="button" className="m4-collab-btn primary" onClick={() => { setMessage(''); notify('New message composer opened') }}><i className="bi bi-send" /> Send message</button>
            <button type="button" className="m4-collab-btn" onClick={() => notify('Task assignment opened')}><i className="bi bi-list-check" /> Assign task</button>
            <button type="button" className="m4-collab-btn" onClick={() => setShowNewCollab((s) => !s)}><i className="bi bi-plus-circle" /> New collaboration</button>
            {selected && selected.status !== 'RESOLVED' && selected.status !== 'CLOSED' && (
              <button type="button" className="m4-collab-btn" onClick={resolveCollab}><i className="bi bi-check2-circle" /> Mark resolved</button>
            )}
          </div>
          {message && <div className="m4-message-draft">{message}</div>}

          {showNewCollab && (
            <form className="m4-inline-form" onSubmit={submitNewCollab}>
              <input placeholder="Initiated by (e.g. Dr. Priya Sharma)" value={newCollab.initiated_by} onChange={(e) => setNewCollab({ ...newCollab, initiated_by: e.target.value })} />
              <input placeholder="Collaborating provider" value={newCollab.collaborating_provider} onChange={(e) => setNewCollab({ ...newCollab, collaborating_provider: e.target.value })} />
              <select value={newCollab.priority} onChange={(e) => setNewCollab({ ...newCollab, priority: e.target.value })}>
                {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <textarea placeholder="Subject" value={newCollab.subject} onChange={(e) => setNewCollab({ ...newCollab, subject: e.target.value })} />
              <div className="m4-inline-form-actions">
                <button type="button" className="secondary-btn small" onClick={() => setShowNewCollab(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Open collaboration</button>
              </div>
            </form>
          )}

          {selected && (
            <form className="m4-inline-form" onSubmit={submitNote}>
              <input placeholder="Your name" value={noteDraft.provider_name} onChange={(e) => setNoteDraft({ ...noteDraft, provider_name: e.target.value })} />
              <select value={noteDraft.note_type} onChange={(e) => setNoteDraft({ ...noteDraft, note_type: e.target.value })}>
                {NOTE_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
              <textarea placeholder="Add a note to this collaboration…" value={noteDraft.note_text} onChange={(e) => setNoteDraft({ ...noteDraft, note_text: e.target.value })} />
              <div className="m4-inline-form-actions">
                <button type="submit" className="primary-btn">Add note</button>
              </div>
            </form>
          )}
        </div>
      </div>
      {toast && <div className="m4-toast"><i className="bi bi-check-circle-fill" /> {toast}</div>}
    </section>
  )
}

export default ProviderCollaboration
