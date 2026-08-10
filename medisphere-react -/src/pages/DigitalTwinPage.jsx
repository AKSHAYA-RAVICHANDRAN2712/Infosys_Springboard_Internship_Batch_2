import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MediStorage from '../services/storage';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import EditTwinForm from '../components/forms/EditTwinForm';
import { useAuth } from '../context/AuthContext';

export default function DigitalTwinPage() {
  const { currentUser } = useAuth();
  const { open } = useModal();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [patients, setPatients] = useState([]);
  
  // Set default selected patient based on logged-in role
  const isPatient = currentUser?.role === 'patient';
  const [selectedId, setSelectedId] = useState(
    isPatient ? currentUser.id : (searchParams.get('patient') || 'PAT-2001')
  );
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [p, setP] = useState(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        await MediStorage.fetchPatients();
        const data = MediStorage.getPatients();
        console.log("Digital Twin patients:", data);
        setPatients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Loading patients failed:", error);
        setPatients(MediStorage.getPatients());
      }
    };
    loadPatients();
  }, [refreshKey]);

  useEffect(() => {
    if (patients.length > 0) {
      const activeId = isPatient ? currentUser.id : selectedId;
      const patient =
        patients.find(x => x.id === activeId || x.name === currentUser?.name)
        || patients.find(x => x.id === selectedId)
        || patients[0];
      setP(patient);
    }
  }, [patients, selectedId, currentUser]);

  function editTwin() {
    open(`Edit Patient Digital Twin - ${p.id}`, <EditTwinForm patient={p} onSaved={(id) => { setSelectedId(id); setRefreshKey(k => k + 1); }} />);
  }
  if (!p) {
    return (
      <div style={{ color: "#fff" }}>
        Loading Digital Twin...
      </div>
    );
  }
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Module 2: Patient Digital Twin Store</h1>
      </div>

      {!isPatient && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
          <label style={{ color: '#FFF', fontWeight: 600, fontSize: '0.9rem' }}>Select Patient Digital Twin:</label>
          <select
            className="form-select"
            style={{ maxWidth: 360 }}
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {patients.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.name} ({pt.id}) - Twin Completeness: {pt.twinCompleteness ?? 0}%
              </option>
            ))}
          </select>
        </div>
      )}

      <div key={refreshKey} className="glass-card page-fade-in" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ width: 72, height: 72, background: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#FFF' }}>
              {p.name?.charAt(0) || "?"}
            </div>
            <div>
              <h2 style={{ color: '#FFF', marginBottom: 4 }}>{p.name} <span style={{ fontSize: '1rem', color: '#9CA3AF' }}>({p.id})</span></h2>
              <p>
                {p.gender || "N/A"}, {p.age || "N/A"} Years Old |
                Blood Group: <strong>{p.bloodGroup || "N/A"}</strong> |
                Hospital: {p.hospital || "N/A"}
              </p>
              <p style={{ marginTop: 4 }}>
                Assigned Physician:
                <strong style={{ color: "#3B82F6" }}>
                  {p.assignedDoctor || "N/A"}
                </strong>
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(15, 23, 42, 0.8)', padding: '16px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Twin Completeness</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#22C55E', margin: '4px 0' }}>
              {p.twinCompleteness ?? 0}%
            </div>
            <span className="badge badge-success">100% Coverage</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4" style={{ marginTop: 24 }}>
          <div
            style={{
              background: "#0F172A",
              padding: 16,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            <h4 style={{ color: "#22C55E", marginBottom: 8 }}>
              Vitals Stream
            </h4>

            <p>
              <strong>Heart Rate:</strong> {p.vitals?.hr ?? "N/A"} bpm
            </p>

            <p>
              <strong>Blood Pressure:</strong> {p.vitals?.bp ?? "N/A"} mmHg
            </p>

            <p>
              <strong>SpO₂:</strong> {p.vitals?.spo2 ?? "N/A"}%
            </p>
          </div>

          <div style={{ background: '#0F172A', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: '#22C55E', marginBottom: 8 }}>Vitals Stream</h4>
            <p><strong>Heart Rate:</strong> {p.vitals?.hr ?? "N/A"} bpm</p>
            <p><strong>Blood Pressure:</strong> {p.vitals?.bp ?? "N/A"} mmHg</p>
            <p><strong>SpO₂:</strong> {p.vitals?.spo2 ?? "N/A"}%</p>
          </div>

          <div style={{ background: '#0F172A', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: '#F59E0B', marginBottom: 8 }}>Lab & Medications</h4>
            <p><strong>HbA1c:</strong> 7.2% | <strong>eGFR:</strong> 65</p>
            <p>
              <strong>Active Meds:</strong>{" "}
              {(p.medications ?? []).length
                ? p.medications.join(", ")
                : "N/A"}
            </p>
            <p>
              <strong>Conditions:</strong>{" "}
              {(p.conditions ?? []).length
                ? p.conditions.join(", ")
                : "N/A"}
            </p>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 12 }}>Clinical Care Pathway Timeline</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #2563EB', paddingTop: 16, fontSize: '0.85rem', color: '#D1D5DB', flexWrap: 'wrap', gap: 8 }}>
            <div><strong style={{ color: '#60A5FA' }}>1. Admission</strong><br />10/01/2026</div>
            <div><strong style={{ color: '#60A5FA' }}>2. Diagnosis</strong><br />Hypertension</div>
            <div><strong style={{ color: '#60A5FA' }}>3. Lab Tests</strong><br />Blood & ECG</div>
            <div><strong style={{ color: '#60A5FA' }}>4. Medication</strong><br />Telmisartan 40mg</div>
            <div><strong style={{ color: '#60A5FA' }}>5. Follow-Up</strong><br />Monthly Sync</div>
            <div><strong style={{ color: '#22C55E' }}>6. Discharge</strong><br />Outpatient</div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          {!isPatient && <button className="btn btn-secondary" onClick={editTwin}>Edit Digital Twin Data</button>}
          <button className="btn btn-primary" onClick={() => toast.success('Digital Twin synchronized across FHIR & Kafka buses.')}>Sync Digital Twin</button>
        </div>
      </div>
    </>
  );
}
