import MediStorage from '../services/storage';

export default function SettingsPage() {
  function resetData() {
    if (confirm('Restore all mock datasets?')) {
      MediStorage.resetData();
      window.location.href = '/login';
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">System Settings & Infrastructure</h1>
      </div>

      <div className="glass-card page-fade-in" style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 16 }}>FHIR R4 Endpoint Configuration</h3>
        <div className="form-grid">
          <div className="form-field full-width">
            <label className="form-label">Primary FHIR Gateway URL</label>
            <input className="form-input" defaultValue="https://fhir.epic.com/interoperability/api/FHIR/R4" />
          </div>
          <div className="form-field">
            <label className="form-label">Client ID</label>
            <input className="form-input" defaultValue="epic_client_88921" />
          </div>
          <div className="form-field">
            <label className="form-label">FHIR Version</label>
            <select className="form-select" defaultValue="R4 (4.0.1)">
              <option>R4 (4.0.1)</option>
              <option>DSTU3 (3.0.2)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card page-fade-in" style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 16 }}>Kafka Telemetry Cluster Brokers</h3>
        <div className="form-grid">
          <div className="form-field full-width">
            <label className="form-label">Kafka Broker Cluster URL</label>
            <input className="form-input" defaultValue="kafka-broker.medisphere.internal:9092" />
          </div>
          <div className="form-field">
            <label className="form-label">Vitals Topic</label>
            <input className="form-input" defaultValue="vitals-stream" />
          </div>
          <div className="form-field">
            <label className="form-label">Max Batch Size</label>
            <input type="number" className="form-input" defaultValue={500} />
          </div>
        </div>
      </div>

      <div className="glass-card page-fade-in">
        <h3 style={{ color: '#EF4444', fontSize: '1.1rem', marginBottom: 8 }}>Danger Zone & System Reset</h3>
        <p style={{ marginBottom: 16 }}>Resetting system memory will restore original mock datasets (50 Doctors, 300 Patients, 1000 Appointments, FHIR resources, Kafka events).</p>
        <button className="btn btn-danger" onClick={resetData}>Restore Initial Mock Dataset</button>
      </div>
    </>
  );
}
