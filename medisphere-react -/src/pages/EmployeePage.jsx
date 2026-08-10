import { useState, useEffect } from 'react';
import MediStorage from '../services/storage';
import DataTable from '../components/common/DataTable';
import { useModal } from '../context/ModalContext';
import UpdateVitalsNoteForm from '../components/forms/UpdateVitalsNoteForm';

export default function EmployeePage() {
  const { open } = useModal();
  const [refreshKey, setRefreshKey] = useState(0);
  const [pats, setPats] = useState([]);
  
  function refresh() { setRefreshKey(k => k + 1); }

  useEffect(() => {
    async function loadPatients() {
      const data = await MediStorage.fetchPatients();
      setPats(data);
    }
    loadPatients();
  }, [refreshKey]);

  function updateVitalsNote(id) {
    const p = pats.find(x => x.id === id);
    if (!p) return;
    open(`Update Clinical Notes - ${p.name}`, <UpdateVitalsNoteForm patient={p} onSaved={refresh} />);
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Medical Staff & Nurse Portal</h1>
      </div>

      <div key={refreshKey}>
        <DataTable
          title="EHR Medical Records & Vitals Audit"
          searchPlaceholder="Search Patient Name, Conditions, Vitals..."
          data={pats}
          columns={[
  { key: 'id', label: 'Patient ID' },

  {
    key: 'name',
    label: 'Patient Name',
    render: v => <strong>{v}</strong>
  },

  {
    key: 'age',
    label: 'Age / Gender',
    render: (v, row) => `${v ?? "N/A"} / ${row.gender ?? "N/A"}`
  },

  {
    key: 'bloodGroup',
    label: 'Blood',
    render: v => (
      <strong style={{ color: '#EF4444' }}>
        {v || "N/A"}
      </strong>
    )
  },

  {
    key: 'vitals',
    label: 'Latest Vitals Stream',
    render: v =>
      v
        ? `HR: ${v.hr ?? "-"} | BP: ${v.bp ?? "-"} | SpO₂: ${v.spo2 ?? "-"}%`
        : "No vitals available"
  },

  {
    key: 'id',
    label: 'Actions',
    render: id => (
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => updateVitalsNote(id)}
      >
        Update Notes
      </button>
    )
  }
]}
        />
      </div>
    </>
  );
}
