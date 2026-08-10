import { useState, useEffect } from 'react';
import MediStorage from '../services/storage';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import AddPatientForm from '../components/forms/AddPatientForm';

const statusVariant = (v) => v === 'Confirmed' ? 'success' : v === 'Pending' ? 'warning' : 'danger';

export default function ReceptionistPage() {
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

  function checkIn(id) {
    MediStorage.updateAppointmentStatus(id, 'Confirmed');
    toast.success(`Patient checked in for appointment ${id}! Dispatched notification to doctor.`);
    refresh();
  }

  function cancelAppt(id) {
    MediStorage.updateAppointmentStatus(id, 'Cancelled');
    toast.warning(`Cancelled appointment ${id}`);
    refresh();
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Reception & Intake Desk Portal</h1>
        <button className="btn btn-primary" onClick={() => open('Register New Patient', <AddPatientForm onSaved={refresh} />)}>+ Register New Patient</button>
      </div>

      <div key={refreshKey}>
        <DataTable
          title="Today's Patient Intake Queue"
          searchPlaceholder="Search by Patient Name, Doctor, Status..."
          data={appts}
          columns={[
            { key: 'id', label: 'Appt ID' },
            { key: 'patientName', label: 'Patient Name' },
            { key: 'doctorName', label: 'Assigned Doctor' },
            { key: 'date', label: 'Date' },
            { key: 'time', label: 'Time' },
            { key: 'status', label: 'Status', render: v => <Badge variant={statusVariant(v)}>{v}</Badge> },
            { key: 'id', label: 'Check-In Action', render: (id) => (
              <>
                <button className="btn btn-success btn-sm" onClick={() => checkIn(id)}>Check-In Patient</button>{' '}
                <button className="btn btn-danger btn-sm" onClick={() => cancelAppt(id)}>Cancel</button>
              </>
            ) }
          ]}
        />
      </div>
    </>
  );
}
