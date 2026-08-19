import { useState } from 'react';
import MediStorage from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';

/* Ported from digital-twin.js editTwinPatient() inline modal form */
export default function EditTwinForm({ patient, onSaved }) {
  const toast = useToast();
  const { close } = useModal();
  const [form, setForm] = useState({
    name: patient.name,
    age: patient.age,
    conditions: (patient.conditions || []).join(', ')
  });

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    const updated = {
      ...patient,
      name: form.name,
      age: parseInt(form.age, 10),
      conditions: form.conditions.split(',').map(s => s.trim()).filter(Boolean)
    };
    MediStorage.savePatient(updated);
    toast.success(`Updated Digital Twin for ${updated.name}!`);
    close();
    if (onSaved) onSaved(updated.id);
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label">Patient Name</label>
        <input className="form-input" required value={form.name} onChange={e => update('name', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Age</label>
        <input type="number" className="form-input" required value={form.age} onChange={e => update('age', e.target.value)} />
      </div>
      <div className="form-field full-width">
        <label className="form-label">Active Conditions</label>
        <input className="form-input" value={form.conditions} onChange={e => update('conditions', e.target.value)} />
      </div>
      <div className="form-field full-width" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Twin Changes</button>
      </div>
    </form>
  );
}
