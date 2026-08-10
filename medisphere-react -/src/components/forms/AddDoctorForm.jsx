import { useState } from 'react';
import MediStorage from '../../services/storage';
import { generateId } from '../../services/utils';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';

export default function AddDoctorForm({ onSaved }) {
  const toast = useToast();
  const { close } = useModal();
  const [form, setForm] = useState({ name: '', department: 'Cardiology', specialization: '', experience: '10 Years' });

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    const d = {
      id: generateId('DOC'),
      name: form.name,
      email: `${form.name.toLowerCase().replace(/[^a-z]/g, '')}@medisphere.health`,
      department: form.department,
      specialization: form.specialization,
      experience: form.experience,
      phone: '+91 98450 19000',
      rating: '4.8',
      availability: 'Mon - Fri (08:00 - 17:00)',
      status: 'Available'
    };
    MediStorage.saveDoctor(d);
    toast.success(`${d.name} added to staff roster!`);
    close();
    if (onSaved) onSaved(d);
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label">Doctor Name</label>
        <input className="form-input" required placeholder="Dr. Veena Hegde" value={form.name} onChange={e => update('name', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Department</label>
        <select className="form-select" value={form.department} onChange={e => update('department', e.target.value)}>
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Oncology">Oncology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Orthopedics">Orthopedics</option>
        </select>
      </div>
      <div className="form-field">
        <label className="form-label">Specialization</label>
        <input className="form-input" required placeholder="Senior Specialist" value={form.specialization} onChange={e => update('specialization', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Experience</label>
        <input className="form-input" value={form.experience} onChange={e => update('experience', e.target.value)} />
      </div>
      <div className="form-field full-width" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
        <button type="submit" className="btn btn-primary">Add Doctor</button>
      </div>
    </form>
  );
}
