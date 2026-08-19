import { useState } from 'react';
import MediStorage from '../../services/storage';
import { generateId } from '../../services/utils';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';

export default function AddPatientForm({ onSaved }) {
  const toast = useToast();
  const { close } = useModal();
  const [form, setForm] = useState({
    name: '', email: '', age: 45, gender: 'Male', bloodGroup: 'O+',
    assignedDoctor: 'Dr. Ananthakrishna Bhat', conditions: ''
  });

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const p = {
      id: generateId('PAT'),
      name: form.name,
      email: form.email,
      age: parseInt(form.age, 10),
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      assignedDoctor: form.assignedDoctor,
      conditions: form.conditions.split(',').map(s => s.trim()).filter(Boolean),
      hospital: 'Kasturba Medical College Hospital, Manipal',
      vitals: { hr: 72, bp: '120/80', spo2: 98, temp: 98.6, resp: 16 },
      twinCompleteness: 90,
      onboardedDate: new Date().toISOString().split('T')[0]
    };
    MediStorage.savePatient(p);
    toast.success(`Patient ${p.name} registered successfully!`);
    close();
    if (onSaved) onSaved(p);
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label">Full Name</label>
        <input className="form-input" required placeholder="e.g. Anushree Naik" value={form.name} onChange={e => update('name', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Email</label>
        <input type="email" className="form-input" required placeholder="anushree@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Age</label>
        <input type="number" className="form-input" required value={form.age} onChange={e => update('age', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Gender</label>
        <select className="form-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-field">
        <label className="form-label">Blood Group</label>
        <select className="form-select" value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
          <option value="O+">O+</option>
          <option value="A+">A+</option>
          <option value="B+">B+</option>
          <option value="AB+">AB+</option>
        </select>
      </div>
      <div className="form-field">
        <label className="form-label">Assigned Doctor</label>
        <input className="form-input" value={form.assignedDoctor} onChange={e => update('assignedDoctor', e.target.value)} />
      </div>
      <div className="form-field full-width">
        <label className="form-label">Medical Conditions</label>
        <input className="form-input" placeholder="e.g. Essential Hypertension, Type 2 Diabetes" value={form.conditions} onChange={e => update('conditions', e.target.value)} />
      </div>
      <div className="form-field full-width" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
        <button type="submit" className="btn btn-primary">Register Patient</button>
      </div>
    </form>
  );
}
