import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';

/* Ported from modal.js openPrintAppointmentSlip() */
export default function AppointmentSlipView({ appt }) {
  const { close } = useModal();
  const toast = useToast();

  function handlePrint() {
    window.print();
    toast.success('Printing appointment slip...');
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 8, border: '1px dashed rgba(255,255,255,0.2)', color: '#FFF' }}>
      <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12, marginBottom: 16 }}>
        <h2 style={{ color: '#60A5FA', margin: 0 }}>MediSphere Hospital Management System</h2>
        <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: 4 }}>Kasturba Medical College Hospital & Regional Healthcare Network, Karnataka</p>
        <h4 style={{ color: '#10B981', marginTop: 8 }}>OUTPATIENT APPOINTMENT SLIP</h4>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.95rem' }}>
        <p><strong>Slip No:</strong> {appt.id}</p>
        <p><strong>Booking Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
        <p><strong>Patient Name:</strong> {appt.patientName}</p>
        <p><strong>Patient ID:</strong> {appt.patientId || 'PAT-1001'}</p>
        <p><strong>Doctor:</strong> {appt.doctorName}</p>
        <p><strong>Department:</strong> {appt.department}</p>
        <p><strong>Appt Date:</strong> {appt.date}</p>
        <p><strong>Slot Time:</strong> {appt.time}</p>
        <p><strong>Symptoms:</strong> {appt.symptoms}</p>
        <p><strong>Status:</strong> <span className="badge badge-success">{appt.status}</span></p>
      </div>
      <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.8rem', color: '#9CA3AF', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
        Please arrive 15 minutes prior to your scheduled slot. Present this slip at the reception desk.
      </div>
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button className="btn btn-secondary" onClick={close}>Close</button>
        <button className="btn btn-primary" onClick={handlePrint}>🖨️ Print Slip</button>
      </div>
    </div>
  );
}
