import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';

/* Ported from dashboard.js createCarePlan() inline modal form */
export default function CarePlanForm() {
  const toast = useToast();
  const { close } = useModal();
  const [title, setTitle] = useState('Glycemic & Hypertension Management Plan');
  const [instructions, setInstructions] = useState('Low-sodium diet (<2000mg/day), 30 minutes daily moderate walking, morning glucose check.');

  function handleSubmit(e) {
    e.preventDefault();
    toast.success('Custom Care Plan Dispatched to Patient Portal');
    close();
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field full-width">
        <label className="form-label">Care Plan Title</label>
        <input className="form-input" required value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="form-field full-width">
        <label className="form-label">Dietary & Activity Instructions</label>
        <textarea className="form-textarea" required value={instructions} onChange={e => setInstructions(e.target.value)} />
      </div>
      <div className="form-field full-width" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
        <button type="submit" className="btn btn-primary">Dispatch Care Plan</button>
      </div>
    </form>
  );
}
