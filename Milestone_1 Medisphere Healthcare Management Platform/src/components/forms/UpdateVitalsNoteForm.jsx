import { useState } from 'react';
import MediStorage from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';

/* Ported from employee.js updateVitalsNote() inline modal form */
export default function UpdateVitalsNoteForm({ patient, onSaved }) {
  const toast = useToast();
  const { close } = useModal();
  const [form, setForm] = useState({
    hr: patient.vitals.hr,
    bp: patient.vitals.bp,
    spo2: patient.vitals.spo2,
    note: 'Patient resting comfortably. Vitals stable.'
  });

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    const updated = {
      ...patient,
      vitals: {
        ...patient.vitals,
        hr: parseInt(form.hr, 10),
        bp: form.bp,
        spo2: parseInt(form.spo2, 10)
      }
    };
    MediStorage.savePatient(updated);
    toast.success(`Updated clinical vitals for ${updated.name}!`);
    close();
    if (onSaved) onSaved();
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label">Heart Rate (bpm)</label>
        <input type="number" className="form-input" required value={form.hr} onChange={e => update('hr', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Blood Pressure (mmHg)</label>
        <input className="form-input" required value={form.bp} onChange={e => update('bp', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">SpO&#8322; (%)</label>
        <input type="number" className="form-input" required value={form.spo2} onChange={e => update('spo2', e.target.value)} />
      </div>
      <div className="form-field full-width">
        <label className="form-label">Nurse / Employee Clinical Note</label>
        <textarea className="form-textarea" required value={form.note} onChange={e => update('note', e.target.value)} />
      </div>
      <div className="form-field full-width" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Notes</button>
      </div>
    </form>
  );
}
