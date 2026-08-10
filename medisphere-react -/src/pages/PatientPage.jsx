import { useState, useEffect } from 'react';
import MediStorage from '../services/storage';
import { downloadSimulatedPDF } from '../services/utils';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import BookAppointmentForm from '../components/forms/BookAppointmentForm';

const statusVariant = (v) => v === 'Confirmed' ? 'success' : v === 'Pending' ? 'warning' : 'danger';

export default function PatientPage() {
  const { currentUser } = useAuth();
  const { open } = useModal();
  const toast = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [appts, setAppts] = useState([]);
  
  function refresh() { setRefreshKey(k => k + 1); }

  useEffect(() => {
    async function loadData() {
      try {
        const data = await MediStorage.getAppointments();
        setAppts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [refreshKey]);

  const myAppts = appts.filter(a => a.patientName === currentUser.name || a.patientId === currentUser.id);

  function bookAppointment() {
    open('Book New Doctor Appointment', <BookAppointmentForm defaultPatientName={currentUser.name} onSaved={refresh} />);
  }

  function cancelAppointment(id) {
    MediStorage.updateAppointmentStatus(id, 'Cancelled');
    toast.warning(`Appointment ${id} has been cancelled.`);
    refresh();
  }

  function downloadPrescription(id) {
    const a = myAppts.find(x => x.id === id) || myAppts[0];
    const pdfContent = `
    OFFICIAL MEDICAL PRESCRIPTION
    -------------------------------------------------------
    Appointment Ref: ${a.id}
    Patient Name: ${a.patientName} (${currentUser.id})
    Attending Physician: ${a.doctorName} (${a.department})
    Date: ${a.date} at ${a.time}

    DIAGNOSIS:
    Essential Hypertension & Diabetes Follow-up.

    Rx MEDICATIONS:
    1. Metformin 500mg (Glycomet) - 1 Tablet Twice Daily (After meals)
    2. Telmisartan 40mg (Telma 40) - 1 Tablet Morning Daily

    SPECIAL INSTRUCTION:
    Monitor morning fasting blood glucose and daily BP log.
    Follow up in 30 days.

    Signed electronically by MediSphere EHR Engine.
    `;
    downloadSimulatedPDF(`Prescription_${a.id}`, pdfContent);
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Patient Portal - {currentUser.name}</h1>
        <button className="btn btn-primary" onClick={bookAppointment}>+ Book Appointment</button>
      </div>

      <div key={refreshKey}>
        <DataTable
          title="My Medical Appointments"
          searchPlaceholder="Search appointment date, doctor, symptoms..."
          data={myAppts}
          columns={[
            { key: 'id', label: 'Appt ID' },
            { key: 'doctorName', label: 'Doctor', render: (v, row) => <><strong>{v}</strong> <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>({row.department})</span></> },
            { key: 'date', label: 'Date' },
            { key: 'time', label: 'Time' },
            { key: 'symptoms', label: 'Symptoms / Purpose' },
            { key: 'status', label: 'Status', render: v => <Badge variant={statusVariant(v)}>{v}</Badge> },
            { key: 'id', label: 'Actions', render: (id, row) => (
              <>
                <button className="btn btn-secondary btn-sm" onClick={() => downloadPrescription(id)}>Prescription PDF</button>{' '}
                {row.status !== 'Cancelled' && <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(id)}>Cancel</button>}
              </>
            ) }
          ]}
        />
      </div>
    </>
  );
}
