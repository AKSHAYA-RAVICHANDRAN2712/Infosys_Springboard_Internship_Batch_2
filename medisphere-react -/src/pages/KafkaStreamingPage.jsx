import { useEffect, useState } from 'react';
import MediStorage from '../services/storage';
import { generateId, formatDateTime } from '../services/utils';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { useToast } from '../context/ToastContext';

export default function KafkaStreamingPage() {
  const toast = useToast();
  const [tick, setTick] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const data = await MediStorage.fetchKafkaEvents();
      setEvents(data);
    }
    loadEvents();
  }, [tick]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const patients = MediStorage.getPatients();
      const randomPatient = patients[Math.floor(Math.random() * patients.length)] || { id: 'PAT-2001', name: 'Anushree Naik' };
      const newEvt = {
        id: generateId('KFK-EVT'),
        patientId: randomPatient.id,
        patientName: randomPatient.name,
        metric: 'VitalsStream',
        hr: 60 + Math.floor(Math.random() * 35),
        bp: `${110 + Math.floor(Math.random() * 25)}/${70 + Math.floor(Math.random() * 15)}`,
        spo2: 96 + Math.floor(Math.random() * 4),
        temp: (98.2 + Math.random()).toFixed(1),
        resp: 14 + Math.floor(Math.random() * 5),
        timestamp: new Date().toISOString(),
        status: 'Processed',
        latencyMs: 2
      };
      await MediStorage.addKafkaEvent(newEvt);
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const processed = events.filter(e => e.status === 'Processed').length;
  const failed = events.filter(e => e.status === 'Failed').length;

  async function retryMessage(id) {
    await MediStorage.updateKafkaEvent(id, { status: 'Processed' });
    toast.success(`Re-processed Kafka event message ${id}`);
    setTick(t => t + 1);
  }

  async function deleteMessage(id) {
    await MediStorage.deleteKafkaEvent(id);
    toast.info(`Deleted event ${id}`);
    setTick(t => t + 1);
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Module 3: Kafka Streaming Telemetry</h1>
      </div>

      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: 24 }}>
        <div className="glass-card page-fade-in">
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Stream Status</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22C55E', display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span className="pulse-indicator"></span> Active
          </div>
          <div style={{ fontSize: '0.8rem', color: '#60A5FA', marginTop: 4 }}>Kafka Bus Topic: vitals-stream</div>
        </div>

        <div className="glass-card page-fade-in">
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Producer / Consumer</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFF', marginTop: 4 }}>Connected</div>
          <div style={{ fontSize: '0.8rem', color: '#4ADE80', marginTop: 4 }}>2,450 msg/sec</div>
        </div>

        <div className="glass-card page-fade-in">
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Messages Processed</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3B82F6', marginTop: 4 }}>{processed.toLocaleString()}</div>
          <div style={{ fontSize: '0.8rem', color: '#EF4444', marginTop: 4 }}>{failed} Failed</div>
        </div>

        <div className="glass-card page-fade-in">
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Avg Stream Latency</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B', marginTop: 4 }}>2 ms</div>
          <div style={{ fontSize: '0.8rem', color: '#4ADE80', marginTop: 4 }}>Optimal Broker Sync</div>
        </div>
      </div>

      <div key={tick}>
        <DataTable
          title="Live Streamed Patient Vitals Stream"
          searchPlaceholder="Search by Patient, Metric, Status..."
          data={events}
          columns={[
            { key: 'id', label: 'Message ID' },
            { key: 'patientName', label: 'Patient Name', render: (v, row) => <><strong>{v}</strong> <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>({row.patientId})</span></> },
            { key: 'hr', label: 'Heart Rate', render: v => <strong style={{ color: '#22C55E' }}>{v} bpm</strong> },
            { key: 'bp', label: 'Blood Pressure', render: v => <strong style={{ color: '#3B82F6' }}>{v}</strong> },
            { key: 'spo2', label: 'SpO&#8322;', render: v => `${v}%` },
            { key: 'temp', label: 'Temp', render: v => `${v} °F` },
            { key: 'timestamp', label: 'Timestamp', render: v => formatDateTime(v) },
            { key: 'status', label: 'Status', render: v => <Badge variant={v === 'Processed' ? 'success' : 'danger'}>{v}</Badge> },
            { key: 'id', label: 'Actions', render: (id, row) => row.status === 'Failed'
              ? <button className="btn btn-warning btn-sm" onClick={() => retryMessage(id)}>Retry</button>
              : <button className="btn btn-secondary btn-sm" onClick={() => deleteMessage(id)}>Delete</button> }
          ]}
        />
      </div>
    </>
  );
}
