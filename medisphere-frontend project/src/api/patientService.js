import axiosClient from './axiosClient'
import { mockPatients } from '../data/mockData'

const USE_MOCK = String(import.meta.env.VITE_USE_MOCK_DATA) === 'true'
let localPatients = [...mockPatients]

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Expected Spring Boot contract:
 *   GET    /api/patients            -> Patient[]
 *   GET    /api/patients/{id}       -> Patient
 *   POST   /api/patients            -> Patient
 *   PUT    /api/patients/{id}       -> Patient
 *   DELETE /api/patients/{id}       -> 204
 */
export async function getPatients() {
  if (USE_MOCK) {
    await delay()
    return [...localPatients]
  }
  const { data } = await axiosClient.get('/patients')
  return data
}

export async function getPatientById(id) {
  if (USE_MOCK) {
    await delay(200)
    return localPatients.find((p) => p.id === Number(id))
  }
  const { data } = await axiosClient.get(`/patients/${id}`)
  return data
}

export async function createPatient(payload) {
  if (USE_MOCK) {
    await delay()
    const newPatient = { id: Date.now(), status: 'Active', ...payload }
    localPatients = [newPatient, ...localPatients]
    return newPatient
  }
  const { data } = await axiosClient.post('/patients', payload)
  return data
}

export async function updatePatient(id, payload) {
  if (USE_MOCK) {
    await delay()
    localPatients = localPatients.map((p) => (p.id === Number(id) ? { ...p, ...payload } : p))
    return localPatients.find((p) => p.id === Number(id))
  }
  const { data } = await axiosClient.put(`/patients/${id}`, payload)
  return data
}

export async function deletePatient(id) {
  if (USE_MOCK) {
    await delay()
    localPatients = localPatients.filter((p) => p.id !== Number(id))
    return true
  }
  await axiosClient.delete(`/patients/${id}`)
  return true
}
