import { useState } from 'react';
import MediStorage from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';

/* Ported from doctor.js doctorConsultPatient() inline modal form */
export default function ConsultationForm({ patient, apptId, onSaved }) {
  const toast = useToast();
  const { close } = useModal();
  const [notes, setNotes] = useState('Patient presenting with mild hypertension symptoms. Prescribed Telmisartan 40mg (Telma 40) once daily.');

  function handleSubmit(e) {
    e.preventDefault();
    MediStorage.updateAppointmentStatus(apptId, 'Completed');
    toast.success('Consultation notes saved & appointment completed!');
    close();
    if (onSaved) onSaved();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#0F172A', padding: 16, borderRadius: 8 }}>
        <h4 style={{ color: '#FFF' }}>{patient.name} ({patient.id}) - {patient.gender}, {patient.age}y</h4>
        <p><strong>Vitals:</strong> HR {patient.vitals.hr}, BP {patient.vitals.bp}, SpO2 {patient.vitals.spo2}%</p>
        <p><strong>Known Conditions:</strong> {(patient.conditions || []).join(', ')}</p>
      </div>

      <form onSubmit={handleSubmit} className="form-field full-width">
        <label className="form-label">Clinical Diagnosis & Prescription Notes</label>
        <textarea className="form-textarea" required value={notes} onChange={e => setNotes(e.target.value)} placeholder="Enter clinical notes, diagnosis, and prescription medications..." />
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Diagnosis & Complete Appt</button>
        </div>
      </form>
    </div>
  );
}
