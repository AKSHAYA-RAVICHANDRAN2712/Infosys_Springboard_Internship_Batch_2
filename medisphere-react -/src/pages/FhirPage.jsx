import { useRef, useState, useEffect } from 'react';
import MediStorage from '../services/storage';
import { generateId, formatDateTime } from '../services/utils';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

export default function FhirPage() {
  const { open } = useModal();
  const toast = useToast();
  const [connected, setConnected] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(null); // null | 0-100
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef(null);

  const [resources, setResources] = useState([]);

  useEffect(() => {
    async function loadResources() {
      const data = await MediStorage.fetchFHIRResources();
      setResources(data);
    }
    loadResources();
  }, [refreshKey]);

  useEffect(() => {
    const status = localStorage.getItem("fhir_connected");

    if (status === "true") {
      setConnected(true);
    }
  }, []);

  function handleFile(file) {
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(async () => {
          setProgress(null);
          const newResource = {
            id: generateId('FHIR-RES'),
            patientId: 'PAT-2001',
            patientName: 'Anushree Naik',
            resourceType: 'Observation',
            fhirVersion: 'R4',
            sourceSystem: 'Manual Upload',
            importTime: new Date().toISOString(),
            status: 'Synced'
          };
          await MediStorage.addFHIRResource(newResource);
          toast.success(`Successfully validated and imported ${file.name} bundle!`, 'FHIR Ingestion Complete');
          setRefreshKey(k => k + 1);
        }, 400);
      }
    }, 200);
  }

  function inspectResource(id) {
    const res = resources.find(r => r.id === id) || resources[0];
    const jsonStr = JSON.stringify({
      resourceType: res.resourceType,
      id: res.id,
      meta: { versionId: '1', lastUpdated: res.importTime },
      status: 'final',
      subject: { reference: `Patient/${res.patientId}`, display: res.patientName },
      effectiveDateTime: res.importTime,
      performer: [{ display: res.sourceSystem }]
    }, null, 2);

    open(`FHIR Resource Details - ${res.id}`, (
      <pre style={{ background: '#0F172A', padding: 16, borderRadius: 8, color: '#4ADE80', fontSize: '0.85rem', overflowX: 'auto' }}>{jsonStr}</pre>
    ));
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Module 1: FHIR Integration Gateway</h1>
      </div>

      <div className="glass-card page-fade-in" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ color: '#FFF', fontSize: '1.2rem' }}>FHIR API Gateway Connection</h3>
            <p>Connect live HL7 FHIR v4 / DSTU3 endpoints from Epic, Cerner, or LabCorp.</p>
          </div>
          <Badge variant={connected ? 'success' : 'danger'}>{connected ? '● Connected' : '○ Disconnected'}</Badge>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input type="text" className="form-input" style={{ flex: 1 }} defaultValue="https://fhir.epic.com/interoperability/api/FHIR/R4" disabled={connected} />
          <button
            className={`btn ${connected ? 'btn-danger' : 'btn-primary'}`}
            onClick={async () => {

              if (!connected) {

                try {

                  const [patientsRes, doctorsRes, appointmentsRes] =
                    await Promise.all([
                      fetch("http://localhost:5000/api/patients/fhir"),
                      fetch("http://localhost:5000/api/doctors/fhir"),
                      fetch("http://localhost:5000/api/appointments/fhir")
                    ]);

                  const patients = await patientsRes.json();
                  const doctors = await doctorsRes.json();
                  const appointments = await appointmentsRes.json();

                  localStorage.setItem(
                    "medisphere_patients",
                    JSON.stringify(patients)
                  );

                  localStorage.setItem(
                    "medisphere_doctors",
                    JSON.stringify(doctors)
                  );

                  localStorage.setItem(
                    "medisphere_appointments",
                    JSON.stringify(appointments)
                  );

                  setConnected(true);
                  localStorage.setItem("fhir_connected", "true");
                  toast.success("FHIR API connected successfully.");
                  window.location.reload();

                } catch (err) {

                  console.error(err);

                  toast.error("Failed to connect to FHIR server.");

                }

              } else {


localStorage.removeItem("fhir_connected");

MediStorage.resetData();

setConnected(false);

setRefreshKey(k => k + 1);

toast.info("FHIR API disconnected. Switched back to local data.");

window.location.reload();

              }

            }}
          >
            {connected ? "Disconnect API" : "Connect FHIR Endpoint"}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 16, fontSize: '0.85rem', color: '#9CA3AF' }}>
          <div><strong>Last Sync:</strong> <span style={{ color: '#FFF' }}>Just now</span></div>
          <div><strong>API Response Time:</strong> <span style={{ color: '#4ADE80' }}>14 ms</span></div>
          <div><strong>Gateway Health:</strong> <span style={{ color: '#4ADE80' }}>99.98% Uptime</span></div>
        </div>
      </div>

      <div className="glass-card page-fade-in" style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 12 }}>Upload FHIR JSON Data Bundle</h3>

        <div
          className={`dropzone${dragOver ? ' dragover' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]); }}
        >
          <svg className="dropzone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          <div style={{ color: '#FFF', fontWeight: 600 }}>Drag and drop FHIR JSON bundle files here</div>
          <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Supports HL7 FHIR R4 & DSTU3 JSON Schema</div>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={(e) => { if (e.target.files.length) handleFile(e.target.files[0]); }} />
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current.click()}>Browse File</button>
        </div>

        {progress !== null && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
              <span style={{ color: '#FFF' }}>Validating JSON Bundle...</span>
              <span style={{ color: '#3B82F6' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: '#2563EB', transition: 'width 0.2s' }}></div>
            </div>
          </div>
        )}
      </div>

      <div key={refreshKey}>
        <DataTable
          title="Ingested FHIR Resource Store"
          searchPlaceholder="Search by Patient, Resource Type, Source..."
          data={resources}
          columns={[
            { key: 'id', label: 'Resource ID' },
            { key: 'patientName', label: 'Patient Name', render: (v, row) => <><strong>{v}</strong> <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>({row.patientId})</span></> },
            { key: 'resourceType', label: 'Resource Type', render: v => <Badge variant="purple">{v}</Badge> },
            { key: 'fhirVersion', label: 'FHIR Version' },
            { key: 'sourceSystem', label: 'Source System' },
            { key: 'importTime', label: 'Import Time', render: v => formatDateTime(v) },
            { key: 'status', label: 'Status', render: v => <Badge variant={v === 'Synced' ? 'success' : 'danger'}>{v}</Badge> },
            { key: 'id', label: 'Actions', render: (id) => <button className="btn btn-secondary btn-sm" onClick={() => inspectResource(id)}>Inspect JSON</button> }
          ]}
        />
      </div>
    </>
  );
}
