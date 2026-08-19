import { useEffect, useRef, useState } from 'react';
import { LineChart, BarChart } from '../components/common/Charts';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import CarePlanForm from '../components/forms/CarePlanForm';

const ORGANS_TEMPLATE = [
  { name: 'Brain', dx: 0, dy: 30, radius: 16, risk: 'Normal', color: '#22C55E' },
  { name: 'Heart', dx: -12, dy: 75, radius: 18, risk: 'Moderate', color: '#F59E0B' },
  { name: 'Lungs', dx: 16, dy: 75, radius: 18, risk: 'Normal', color: '#22C55E' },
  { name: 'Liver', dx: -18, dy: 115, radius: 16, risk: 'Normal', color: '#22C55E' },
  { name: 'Pancreas / Kidneys', dx: 14, dy: 125, radius: 16, risk: 'High', color: '#EF4444' }
];

function BodyHeatmapCanvas() {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState('Hover over organs to inspect risk status');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 200;

    const organs = ORGANS_TEMPLATE.map(o => ({ ...o, x: width / 2 + o.dx, y: o.dy }));

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, 30, 20, 0, Math.PI * 2);
    ctx.moveTo(width / 2, 50);
    ctx.lineTo(width / 2, 160);
    ctx.stroke();

    organs.forEach(o => {
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
      ctx.fillStyle = o.color + '44';
      ctx.fill();
      ctx.strokeStyle = o.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(o.name, o.x, o.y + 3);
    });

    function handleMove(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let hovered = null;
      organs.forEach(o => {
        const dist = Math.hypot(mx - o.x, my - o.y);
        if (dist <= o.radius) hovered = o;
      });
      if (hovered) {
        setTooltip(`${hovered.name} System: Risk Status - ${hovered.risk}`);
      }
    }

    canvas.addEventListener('mousemove', handleMove);
    return () => canvas.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="body-model-box">
      <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: 8, fontWeight: 600 }}>INTERACTIVE ORGAN RISK HEATMAP</div>
      <canvas ref={canvasRef} className="body-model-canvas" />
      <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#60A5FA', fontWeight: 500 }}>{tooltip}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { open } = useModal();
  const toast = useToast();

  function viewPatientTimeline() {
    open('Clinical Timeline - PAT-2001', (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: 12 }}>
          <strong style={{ color: '#2563EB' }}>2026-08-01 09:30 AM</strong>
          <p style={{ marginTop: 4, color: '#FFF' }}>Routine Checkup: BP 130/85, HR 72. HbA1c Lab order dispatched.</p>
        </div>
        <div style={{ borderLeft: '3px solid #22C55E', paddingLeft: 12 }}>
          <strong style={{ color: '#22C55E' }}>2026-07-15 11:00 AM</strong>
          <p style={{ marginTop: 4, color: '#FFF' }}>Medication Adjustment: Metformin 500mg renewed for 90 days.</p>
        </div>
        <div style={{ borderLeft: '3px solid #F59E0B', paddingLeft: 12 }}>
          <strong style={{ color: '#F59E0B' }}>2026-06-10 02:15 PM</strong>
          <p style={{ marginTop: 4, color: '#FFF' }}>FHIR Ingestion from Epic EHR: Integrated 48 diagnostic resources.</p>
        </div>
      </div>
    ));
  }

  function runAIPrediction() {
    toast.info('Running Gemini Predictive Health Twin Analysis...', 'AI Predictive Engine');
    setTimeout(() => {
      toast.success('Prediction Complete: 30-Day Readmission Risk is 8% (Stable). Recommended Metformin continuation.');
    }, 1200);
  }

  function createCarePlan() {
    open('Create Customized Care Plan', <CarePlanForm />);
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Patient 360 Dashboard</h1>
      </div>

      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Patients Onboarded</div>
          <div className="stat-value">1,247</div>
          <div className="stat-subtext green">↑ 87 this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">FHIR Resources</div>
          <div className="stat-value">2.4M</div>
          <div className="stat-subtext">Synced from EHR</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Twins Created</div>
          <div className="stat-value">1,247</div>
          <div className="stat-subtext">100% coverage</div>
        </div>
      </div>

      <div className="digital-twin-container glass-panel page-fade-in">
        <div className="twin-header-title">
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Digital Health Twin - Patient Anushree Naik
        </div>

        <div className="twin-data-grid">
          <div className="twin-info-lines">
            <div className="twin-info-line"><strong>FHIR Patient Resource:</strong> Kasturba Medical College Hospital, Manipal</div>
            <div className="twin-info-line"><strong>Demographics:</strong> 58F | <strong>Conditions:</strong> Essential Hypertension, Type 2 Diabetes</div>
            <div className="twin-info-line"><strong>Vitals Stream:</strong> <span style={{ color: '#22C55E', fontWeight: 600 }}>HR 72, BP 130/85, SpO2 98%</span> | <strong>Last:</strong> 2 min ago</div>
            <div className="twin-info-line"><strong>Lab Results:</strong> HbA1c 7.2% | eGFR 65 | LDL 120</div>

            <div style={{ margin: '12px 0' }}>
              <strong style={{ color: '#60A5FA' }}>[3D Body Model: Organ systems with risk heatmap]</strong>
            </div>

            <div className="twin-info-line"><strong>Active Medications:</strong> Metformin 500mg (Glycomet), Telmisartan 40mg (Telma 40)</div>

            <div className="twin-actions">
              <button className="btn btn-secondary btn-sm" onClick={viewPatientTimeline}>View Timeline</button>
              <button className="btn btn-primary btn-sm" onClick={runAIPrediction}>Run Prediction</button>
              <button className="btn btn-secondary btn-sm" onClick={createCarePlan}>Create Careplan</button>
            </div>
          </div>

          <BodyHeatmapCanvas />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6" style={{ marginTop: 24 }}>
        <div className="glass-card page-fade-in">
          <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 12 }}>Weekly Appointments Trend</h3>
          <div style={{ height: 200, position: 'relative' }}>
            <LineChart labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} dataset={[42, 58, 65, 80, 72, 45, 30]} color="#3B82F6" />
          </div>
        </div>

        <div className="glass-card page-fade-in">
          <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: 12 }}>Monthly Patient Onboarding Growth</h3>
          <div style={{ height: 200, position: 'relative' }}>
            <BarChart labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} dataset={[850, 920, 1050, 1120, 1180, 1247]} color="#22C55E" />
          </div>
        </div>
      </div>
    </>
  );
}
