import { LineChart, BarChart } from '../components/common/Charts';

export default function AnalyticsPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Healthcare Analytics & Telemetry</h1>
      </div>

      <div className="grid grid-cols-2 gap-6" style={{ marginBottom: 24 }}>
        <div className="glass-card page-fade-in">
          <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 12 }}>Appointments Volume & Completion Trend</h3>
          <div style={{ height: 220, position: 'relative' }}>
            <LineChart labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']} dataset={[400, 520, 680, 750, 890, 950, 1000]} color="#2563EB" />
          </div>
        </div>

        <div className="glass-card page-fade-in">
          <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 12 }}>Patient EHR Onboarding Growth</h3>
          <div style={{ height: 220, position: 'relative' }}>
            <BarChart labels={['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics']} dataset={[320, 240, 180, 290, 210]} color="#22C55E" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card page-fade-in">
          <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 12 }}>FHIR Ingestion & Kafka Event Stream Telemetry</h3>
          <div style={{ height: 220, position: 'relative' }}>
            <LineChart labels={['12:00', '12:05', '12:10', '12:15', '12:20', '12:25']} dataset={[2200, 2450, 2300, 2600, 2450, 2550]} color="#F59E0B" />
          </div>
        </div>

        <div className="glass-card page-fade-in">
          <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 12 }}>Departmental Clinical Workload Distribution</h3>
          <div style={{ height: 220, position: 'relative' }}>
            <BarChart labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']} dataset={[85, 92, 110, 98, 120, 60]} color="#8B5CF6" />
          </div>
        </div>
      </div>
    </>
  );
}
