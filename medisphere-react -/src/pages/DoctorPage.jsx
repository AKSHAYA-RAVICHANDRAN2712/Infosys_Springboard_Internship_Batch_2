import { useState, useEffect } from 'react';
import MediStorage from '../services/storage';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import ConsultationForm from '../components/forms/ConsultationForm';

const statusVariant = (v) => v === 'Confirmed' ? 'success' : v === 'Pending' ? 'warning' : v === 'Completed' ? 'purple' : 'danger';

export default function DoctorPage() {
  const { currentUser } = useAuth();
  const { open } = useModal();
  const toast = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [appts, setAppts] = useState([]);
  
  function refresh() { setRefreshKey(k => k + 1); }

  useEffect(() => {
    async function loadData() {
      try {
        await MediStorage.fetchPatients();
        const data = await MediStorage.getAppointments();
        setAppts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [refreshKey]);

  function consult(patientId, apptId) {
    const patients = MediStorage.getPatients();
    const p = patients.find(x => x.id === patientId) || patients[0];
    open(`Clinical Consultation - ${p.name}`, <ConsultationForm patient={p} apptId={apptId} onSaved={refresh} />);
  }

  function markComplete(id) {
    MediStorage.updateAppointmentStatus(id, 'Completed');
    toast.success(`Appointment ${id} marked as Completed`);
    refresh();
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Attending Physician Portal</h1>
      </div>

      <div key={refreshKey}>
        <DataTable
          title={`Assigned Clinical Schedule - ${currentUser.name}`}
          searchPlaceholder="Search patient, symptoms, status..."
          data={appts}
          columns={[
            { key: 'id', label: 'Appt ID' },
            { key: 'patientName', label: 'Patient Name', render: (v, row) => <><strong>{v}</strong> <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>({row.patientId})</span></> },
            { key: 'date', label: 'Date' },
            { key: 'time', label: 'Time' },
            { key: 'symptoms', label: 'Chief Complaint / Symptoms' },
            { key: 'status', label: 'Status', render: v => <Badge variant={statusVariant(v)}>{v}</Badge> },
            { key: 'id', label: 'Actions', render: (id, row) => (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => consult(row.patientId, id)}>Consult</button>{' '}
                <button className="btn btn-success btn-sm" onClick={() => markComplete(id)}>Complete</button>
              </>
            ) }
          ]}
        />
      </div>
    </>
  );
}
