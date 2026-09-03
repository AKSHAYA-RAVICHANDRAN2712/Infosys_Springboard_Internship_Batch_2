import api from './api'

// Thin wrappers around the Milestone 4 backend endpoints
// (outcome measurement, provider collaboration, guideline compliance).
// Every function returns the axios response's `.data`.

export const getPatients = () => api.get('/patients').then((r) => r.data)

export const getOutcomeMetrics = () => api.get('/outcome-metrics').then((r) => r.data)

export const getOutcomes = (patientId) =>
  api.get('/outcomes', { params: patientId ? { patient_id: patientId } : {} }).then((r) => r.data)

export const getOutcomesSummary = (patientId) =>
  api
    .get('/outcomes/summary', { params: patientId ? { patient_id: patientId } : {} })
    .then((r) => r.data)

export const createOutcome = (payload) => api.post('/outcomes', payload).then((r) => r.data)

export const getCollaborations = (patientId) =>
  api
    .get('/collaborations', { params: patientId ? { patient_id: patientId } : {} })
    .then((r) => r.data)

export const getCollaborationNotes = (collaborationId) =>
  api.get(`/collaborations/${collaborationId}/notes`).then((r) => r.data)

export const createCollaboration = (payload) =>
  api.post('/collaborations', payload).then((r) => r.data)

export const addCollaborationNote = (collaborationId, payload) =>
  api.post(`/collaborations/${collaborationId}/notes`, payload).then((r) => r.data)

export const updateCollaborationStatus = (collaborationId, status) =>
  api.patch(`/collaborations/${collaborationId}`, { status }).then((r) => r.data)

export const getGuidance = () => api.get('/guidance').then((r) => r.data)

export const getCompliance = (patientId) =>
  api.get('/compliance', { params: patientId ? { patient_id: patientId } : {} }).then((r) => r.data)

export const getComplianceSummary = (patientId) =>
  api
    .get('/compliance/summary', { params: patientId ? { patient_id: patientId } : {} })
    .then((r) => r.data)

export const updateCompliance = (complianceId, payload) =>
  api.patch(`/compliance/${complianceId}`, payload).then((r) => r.data)
