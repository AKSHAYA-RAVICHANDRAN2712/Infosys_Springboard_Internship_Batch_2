import { useState } from 'react';
import MediStorage from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';

/* Ported from MediModal.openRecordVitals (modal.js) */
export default function RecordVitalsForm({ patientId, patientName, onSaved }) {
  const toast = useToast();
  const { close } = useModal();
  const [form, setForm] = useState({ hr: 72, bp: '120/80', spo2: 98, temp: 98.6, notes: 'Patient comfortable, resting comfortably in triage' });

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    const patients = MediStorage.getPatients();
    const target = patients.find(p => p.id === patientId || p.name === patientName) || patients[0];
    if (target) {
      target.vitals = {
        hr: parseInt(form.hr, 10),
        bp: form.bp,
        spo2: parseInt(form.spo2, 10),
        temp: parseFloat(form.temp),
        resp: 16
      };
      MediStorage.savePatient(target);
      MediStorage.logActivity('Medical Staff recorded vitals', `Updated vitals for ${target.name}: BP ${target.vitals.bp}, HR ${target.vitals.hr}`);
      toast.success(`Vitals recorded for ${target.name}!`);
    }
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
        <label className="form-label">SpO2 Oxygen (%)</label>
        <input type="number" className="form-input" required value={form.spo2} onChange={e => update('spo2', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Body Temperature (°F)</label>
        <input type="number" step="0.1" className="form-input" required value={form.temp} onChange={e => update('temp', e.target.value)} />
      </div>
      <div className="form-field full-width">
        <label className="form-label">Nursing Observation Note</label>
        <input className="form-input" placeholder="Patient comfortable, resting comfortably in triage" value={form.notes} onChange={e => update('notes', e.target.value)} />
      </div>
      <div className="form-field full-width" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Vitals</button>
      </div>
    </form>
  );
}
