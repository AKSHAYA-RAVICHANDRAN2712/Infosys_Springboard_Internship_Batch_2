import { useState, useEffect } from 'react';
import MediStorage from '../services/storage';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import AddDoctorForm from '../components/forms/AddDoctorForm';
import BookAppointmentForm from '../components/forms/BookAppointmentForm';

export default function DoctorsPage() {
  const { currentUser } = useAuth();
  const { open } = useModal();
  const toast = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState([]);
  
  function refresh() { setRefreshKey(k => k + 1); }

  useEffect(() => {
    async function loadDoctors() {
      const doctors = await MediStorage.fetchDoctors();
      setData(doctors);
    }
    loadDoctors();
  }, [refreshKey]);

  function deleteDoctor(id) {
    if (confirm(`Admin Action: Are you sure you want to delete doctor ${id}?`)) {
      MediStorage.deleteDoctor(id);
      toast.success(`Deleted doctor ${id}`);
      refresh();
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Physicians Directory</h1>
        {currentUser.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => open('Add New Doctor', <AddDoctorForm onSaved={refresh} />)}>+ Add Doctor</button>
        )}
      </div>

      <div key={refreshKey}>
        <DataTable
          title="Physicians & Specialist Roster"
          searchPlaceholder="Search Doctor Name, Department, Specialization..."
          data={data}
          columns={[
            { key: 'id', label: 'Doctor ID' },
            { key: 'name', label: 'Physician Name', render: v => <strong>{v}</strong> },
            { key: 'department', label: 'Department' },
            { key: 'specialization', label: 'Specialization' },
            { key: 'experience', label: 'Experience' },
            { key: 'rating', label: 'Rating', render: v => <strong style={{ color: '#F59E0B' }}>★ {v}</strong> },
            { key: 'status', label: 'Status', render: v => <Badge variant={v === 'Available' ? 'success' : 'warning'}>{v}</Badge> },
            { key: 'id', label: 'Actions', render: (id) => {
              const btns = [];
              if (['patient', 'receptionist', 'admin'].includes(currentUser.role)) {
                btns.push(<button key="book" className="btn btn-primary btn-sm" onClick={() => open('Book Appointment', <BookAppointmentForm defaultPatientName={currentUser.name} />)}>Book Consult</button>);
              }
              if (currentUser.role === 'admin') {
                btns.push(<button key="edit" className="btn btn-secondary btn-sm" onClick={() => open('Add New Doctor', <AddDoctorForm onSaved={refresh} />)}>Edit</button>);
                btns.push(<button key="del" className="btn btn-danger btn-sm" onClick={() => deleteDoctor(id)}>Delete</button>);
              }
              return btns.length ? <>{btns.map((b, i) => <span key={i}>{b} </span>)}</> : <span style={{ color: '#9CA3AF' }}>Read Only</span>;
            } }
          ]}
        />
      </div>
    </>
  );
}
