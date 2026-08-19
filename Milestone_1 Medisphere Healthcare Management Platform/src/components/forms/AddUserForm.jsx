import { useState } from 'react';
import MediStorage from '../../services/storage';
import { generateId } from '../../services/utils';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';

export default function AddUserForm({ onSaved }) {
  const toast = useToast();
  const { close } = useModal();
  const [form, setForm] = useState({ name: '', email: '', role: 'admin', password: 'medisphere2026' });

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    const u = {
      id: generateId('USR'),
      name: form.name,
      email: form.email,
      role: form.role,
      password: form.password,
      status: 'Active',
      token: 'token-' + Math.floor(10000 + Math.random() * 90000)
    };
    MediStorage.saveUser(u);
    toast.success(`User ${u.name} created as ${u.role.toUpperCase()}!`);
    close();
    if (onSaved) onSaved(u);
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label">Full Name</label>
        <input className="form-input" required placeholder="e.g. Shreya Shetty" value={form.name} onChange={e => update('name', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Email Address</label>
        <input type="email" className="form-input" required placeholder="shreya@medisphere.health" value={form.email} onChange={e => update('email', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">System Role</label>
        <select className="form-select" value={form.role} onChange={e => update('role', e.target.value)}>
          <option value="admin">Admin (Super Administrator)</option>
          <option value="doctor">Doctor (Attending Physician)</option>
          <option value="patient">Patient (Health Account)</option>
          <option value="receptionist">Receptionist (Intake Desk)</option>
          <option value="employee">Medical Staff (Nurse/Tech)</option>
        </select>
      </div>
      <div className="form-field">
        <label className="form-label">Initial Password</label>
        <input className="form-input" required value={form.password} onChange={e => update('password', e.target.value)} />
      </div>
      <div className="form-field full-width" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
        <button type="submit" className="btn btn-primary">Create User Account</button>
      </div>
    </form>
  );
}
