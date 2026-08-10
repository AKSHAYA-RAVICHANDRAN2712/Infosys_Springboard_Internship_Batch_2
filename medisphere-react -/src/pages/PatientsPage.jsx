import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediStorage from '../services/storage';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import AddPatientForm from '../components/forms/AddPatientForm';
import RecordVitalsForm from '../components/forms/RecordVitalsForm';

export default function PatientsPage() {
  const { currentUser } = useAuth();
  const { open } = useModal();
  const toast = useToast();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [patientsList, setPatientsList] = useState([]);
  
  function refresh() { setRefreshKey(k => k + 1); }

  useEffect(() => {
    async function loadPatients() {
      try {
        await MediStorage.fetchPatients();
        setPatientsList(MediStorage.getPatients());
      } catch (err) {
        console.error(err);
        setPatientsList(MediStorage.getPatients());
      }
    }
    loadPatients();
  }, [refreshKey]);

  let data = patientsList;
  if (currentUser.role === 'patient') {
    data = patientsList.filter(p => p.name === currentUser.name || p.id === currentUser.id);
  }

  function deletePatient(id) {
    if (confirm(`Admin Action: Are you sure you want to delete patient ${id}?`)) {
      MediStorage.deletePatient(id);
      toast.success(`Deleted patient ${id}`);
      refresh();
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Patient Directory</h1>
        {['admin', 'receptionist'].includes(currentUser.role) && (
          <button className="btn btn-primary" onClick={() => open('Register New Patient', <AddPatientForm onSaved={refresh} />)}>+ Register Patient</button>
        )}
      </div>

      <div key={refreshKey}>
        <DataTable
          title={currentUser.role === 'patient' ? 'My Health Profile' : 'Hospital Patient Master Directory'}
          searchPlaceholder="Search by Patient Name, ID, Doctor, Blood Group..."
          data={data}
          columns={[
            { key: 'id', label: 'Patient ID' },
            { key: 'name', label: 'Patient Name', render: v => <strong>{v}</strong> },
            { key: 'age', label: 'Age / Gender', render: (v, row) => `${v}y / ${row.gender}` },
            { key: 'bloodGroup', label: 'Blood', render: v => <strong style={{ color: '#EF4444' }}>{v}</strong> },
            { key: 'assignedDoctor', label: 'Assigned Doctor' },
            { key: 'twinCompleteness', label: 'Twin Coverage', render: v => <Badge variant="success">{v}%</Badge> },
            { key: 'id', label: 'Actions', render: (id, row) => {
              const btns = [<button key="twin" className="btn btn-primary btn-sm" onClick={() => navigate(`/digital-twin?patient=${id}`)}>Digital Twin</button>];
              if (['employee', 'admin', 'doctor'].includes(currentUser.role)) {
                btns.push(<button key="vitals" className="btn btn-info btn-sm" onClick={() => open(`Record Vitals - ${row.name}`, <RecordVitalsForm patientId={id} patientName={row.name} onSaved={refresh} />)}>Vitals</button>);
              }
              if (['admin', 'receptionist'].includes(currentUser.role)) {
                btns.push(<button key="edit" className="btn btn-secondary btn-sm" onClick={() => open('Register New Patient', <AddPatientForm onSaved={refresh} />)}>Edit</button>);
              }
              if (currentUser.role === 'admin') {
                btns.push(<button key="del" className="btn btn-danger btn-sm" onClick={() => deletePatient(id)}>Delete</button>);
              }
              return <>{btns.map((b, i) => <span key={i}>{b} </span>)}</>;
            } }
          ]}
        />
      </div>
    </>
  );
}
