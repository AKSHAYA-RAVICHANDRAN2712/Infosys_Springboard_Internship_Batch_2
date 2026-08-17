import React, { useState } from 'react';
import { MediStorage } from '../services/storage';
import { MediModal } from '../components/Modal';
import { DataTable, Column } from '../components/DataTable';
import { Patient } from '../types';

export const Patients: React.FC = () => {
  const [patients, setPatients] = useState(MediStorage.getPatients());

  const columns: Column<Patient>[] = [
    { key: 'id', label: 'Patient ID' },
    { key: 'name', label: 'Patient Name' },
    { key: 'age', label: 'Age / Gender', render: (_, r) => `${r.age} yrs, ${r.gender}` },
    { key: 'bloodGroup', label: 'Blood Group', render: (v) => <span className="badge badge-primary">{v}</span> },
    { key: 'hospital', label: 'Hospital Unit' },
    { key: 'assignedDoctor', label: 'Assigned Doctor' },
    {
      key: 'twinCompleteness',
      label: 'Digital Twin %',
      render: (v) => <span style={{ fontWeight: 700, color: v >= 90 ? '#10B981' : '#F59E0B' }}>{v}%</span>
    },
    {
      key: 'vitals',
      label: 'Current Vitals',
      render: (v) => v ? `${v.bp} | HR ${v.hr}` : 'N/A'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, r) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => MediModal.openRecordVitals(r.id, r.name, () => setPatients(MediStorage.getPatients()))}>
            Vitals
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => MediModal.openBookAppointment(r.name)}>
            Book
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#FFF', fontSize: '1.6rem', margin: 0 }}>Patient Directory & Registry</h1>
          <p style={{ color: '#9CA3AF', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
            Registered Karnataka Patients, Health Profile Records & Vitals History
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => MediModal.openAddPatient(() => setPatients(MediStorage.getPatients()))}>
          + Register New Patient
        </button>
      </div>

      <div className="card-panel">
        <DataTable
          data={patients}
          columns={columns}
          pageSize={10}
          exportFilename="medisphere_patient_registry.csv"
        />
      </div>
    </div>
  );
};
