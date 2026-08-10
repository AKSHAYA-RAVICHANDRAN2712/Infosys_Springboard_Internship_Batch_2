import { useState, useEffect } from 'react';
import MediStorage from '../services/storage';
import { downloadSimulatedPDF } from '../services/utils';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';

export default function MedicalRecordsPage() {
  const { currentUser } = useAuth();
  const { open } = useModal();
  const [patientsList, setPatientsList] = useState([]);

  useEffect(() => {
    async function loadRecords() {
      try {
        await MediStorage.fetchPatients();
        setPatientsList(MediStorage.getPatients());
      } catch (err) {
        console.error(err);
        setPatientsList(MediStorage.getPatients());
      }
    }
    loadRecords();
  }, []);

  const pats = currentUser.role === 'patient' 
    ? patientsList.filter(p => p.id === currentUser.id || p.name === currentUser.name)
    : patientsList;

  function inspectFullRecord(id) {
    const p = pats.find(x => x.id === id);

    if (!p) return;

    open(
      `EHR Complete File - ${p.name}`,
      <div style={{ color: "#FFF", display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <strong>Patient Name:</strong> {p.name} ({p.id})
        </div>

        <div>
          <strong>Age / Gender:</strong> {p.age ?? "N/A"} / {p.gender ?? "N/A"}
        </div>

        <div>
          <strong>Blood Group:</strong> {p.bloodGroup || "N/A"}
        </div>

        <div>
          <strong>Assigned Physician:</strong> {p.assignedDoctor || "N/A"}
        </div>

        <div>
          <strong>Clinical Conditions:</strong>{" "}
          {p.conditions?.length ? p.conditions.join(", ") : "Not Available"}
        </div>

        <div>
          <strong>Current Prescriptions:</strong>{" "}
          {p.medications?.length ? p.medications.join(", ") : "Not Available"}
        </div>

        <div>
          <strong>Allergies:</strong> {p.allergies || "None"}
        </div>

        <div>
          <strong>Insurance:</strong> {p.insurance || "N/A"}
        </div>

        <div>
          <strong>Emergency Contact:</strong> {p.emergencyContact || "N/A"}
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            className="btn btn-secondary"
            onClick={() =>
              downloadSimulatedPDF(
                `EHR_File_${p.id}`,
                JSON.stringify(p, null, 2)
              )
            }
          >
            Print / Export PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1>Electronic Health Records (EHR)</h1>

      <DataTable
        title="EHR Master Medical Records Directory"
        searchPlaceholder="Search by Patient Name, Diagnosis, Conditions, Insurance..."
        data={pats}
        columns={[
          {
            key: "id",
            label: "EHR Record ID"
          },
          {
            key: "name",
            label: "Patient Name",
            render: (v, row) => (
              <>
                <strong>{v}</strong>{" "}
                <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                  ({row.id})
                </span>
              </>
            )
          },
          {
            key: "conditions",
            label: "Diagnosed Conditions",
            render: v =>
              (v?.length ? v : ["N/A"]).map((c, i) => (
                <Badge key={i} variant="purple">
                  {c}
                </Badge>
              ))
          },
          {
            key: "medications",
            label: "Active Medications",
            render: v => (v?.length ? v.join(", ") : "N/A")
          },
          {
            key: "allergies",
            label: "Allergies",
            render: v => (
              <span style={{ color: "#EF4444" }}>
                {v || "None"}
              </span>
            )
          },
          {
            key: "insurance",
            label: "Insurance",
            render: v => v || "N/A"
          },
          {
            key: "id",
            label: "Actions",
            render: id => (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => inspectFullRecord(id)}
              >
                Full Record
              </button>
            )
          }
        ]}
      />
    </>
  );
}