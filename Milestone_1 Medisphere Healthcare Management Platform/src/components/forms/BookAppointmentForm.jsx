import { useState, useEffect } from 'react';
import MediStorage from '../../services/storage';
import { generateId, formatDate } from '../../services/utils';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';

const TIME_SLOTS = ['09:00 AM', '10:30 AM', '11:45 AM', '02:15 PM', '04:00 PM'];

/* Ported from MediModal.openBookAppointment (modal.js) */
export default function BookAppointmentForm({ defaultPatientName, onSaved }) {
  const toast = useToast();
  const { close } = useModal();
  const { currentUser } = useAuth();
 const [doctors, setDoctors] = useState([]);

const [form, setForm] = useState({
    patientName: defaultPatientName || currentUser?.name || 'Anushree Naik',
    doctorName: '',
    date: new Date().toISOString().split('T')[0],
    time: TIME_SLOTS[0],
    symptoms: ''
});


useEffect(() => {

    const loadDoctors = async () => {

        try {

            const data = await MediStorage.getDoctors();

            console.log("Doctors loaded in appointment:", data);

            const doctorList = Array.isArray(data) ? data : [];

            setDoctors(doctorList);


            if(doctorList.length > 0){

                setForm(prev => ({
                    ...prev,
                    doctorName: doctorList[0].name
                }));

            }

        } catch(error) {

            console.error("Failed loading doctors:", error);

            setDoctors([]);

        }

    };


    loadDoctors();

}, []);

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    const matchedDoc = doctors.find(d => d.name === form.doctorName) || { department: 'General Medicine', id: 'DOC-1001' };
    const appt = {
      id: generateId('APT'),
      patientId: currentUser?.role === 'patient' ? currentUser.id : 'PAT-1001',
      patientName: form.patientName,
      doctorId: matchedDoc.id || 'DOC-1001',
      doctorName: form.doctorName,
      department: matchedDoc.department,
      date: formatDate(form.date),
      time: form.time,
      symptoms: form.symptoms,
      status: 'Pending',
      type: 'Outpatient Consultation'
    };
    MediStorage.saveAppointment(appt);
    toast.success(`Appointment ${appt.id} booked successfully!`);
    close();
    if (onSaved) onSaved(appt);
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label">Patient Name</label>
        <input className="form-input" required value={form.patientName} onChange={e => update('patientName', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Select Doctor</label>
        <select className="form-select" value={form.doctorName} onChange={e => update('doctorName', e.target.value)}>
            {
            doctors.map(d => (
                <option key={d.id} value={d.name}>
                    {d.name} ({d.department})
                </option>
            ))
            }
      </select>
      </div>
      <div className="form-field">
        <label className="form-label">Appointment Date</label>
        <input type="date" className="form-input" required value={form.date} onChange={e => update('date', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Preferred Time Slot</label>
        <select className="form-select" value={form.time} onChange={e => update('time', e.target.value)}>
          {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="form-field full-width">
        <label className="form-label">Chief Complaints / Symptoms</label>
        <input className="form-input" required placeholder="e.g. Routine hypertension review, mild headache" value={form.symptoms} onChange={e => update('symptoms', e.target.value)} />
      </div>
      <div className="form-field full-width" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
        <button type="submit" className="btn btn-primary">Confirm Booking</button>
      </div>
    </form>
  );
}
