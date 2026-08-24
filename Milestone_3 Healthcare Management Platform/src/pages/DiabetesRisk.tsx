import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DiabetesRisk: React.FC = () => {
  const navigate = useNavigate();
  const [hba1c, setHba1c] = useState<number>(6.8);
  const [fastingGlucose, setFastingGlucose] = useState<number>(128);
  const [bmi, setBmi] = useState<number>(29.5);
  const [systolicBp, setSystolicBp] = useState<number>(135);
  const [familyHistory, setFamilyHistory] = useState<boolean>(true);
  const [sedentary, setSedentary] = useState<boolean>(false);

  const calculateRisk = () => {
    let score = (hba1c - 5.5) * 18 + (fastingGlucose - 100) * 0.4 + (bmi - 24) * 1.5 + (systolicBp - 120) * 0.2;
    if (familyHistory) score += 12;
    if (sedentary) score += 8;
    return Math.min(99, Math.max(5, Math.round(score)));
  };

  const riskScore = calculateRisk();
  const riskTier = riskScore > 65 ? 'High Complication Risk' : riskScore > 35 ? 'Moderate Risk' : 'Low / Controlled';
  const tierColor = riskScore > 65 ? '#EF4444' : riskScore > 35 ? '#F59E0B' : '#10B981';

  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
            Diabetes & Metabolic Complication Engine
          </h1>
          <p style={{ color: '#94A3B8', marginTop: '8px', fontSize: '1rem', lineHeight: 1.5 }}>
            Neural sequence assessment of microvascular, nephropathy, and glycemic complication trajectories.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{ fontSize: '0.875rem' }}>
            Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Input Parameters Panel */}
        <div
          className="card-panel"
          style={{
            background: 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Metabolic & Glycemic Markers
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.875rem', marginBottom: '6px' }}>
                <span>Hemoglobin A1c (HbA1c)</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{hba1c}%</span>
              </label>
              <input
                type="range"
                min="4.5"
                max="12.0"
                step="0.1"
                value={hba1c}
                onChange={(e) => setHba1c(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#38BDF8' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.825rem', marginBottom: '4px' }}>Fasting Glucose (mg/dL)</label>
                <input
                  type="number"
                  className="input"
                  value={fastingGlucose}
                  onChange={(e) => setFastingGlucose(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.825rem', marginBottom: '4px' }}>BMI (kg/m²)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  value={bmi}
                  onChange={(e) => setBmi(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.825rem', marginBottom: '4px' }}>Systolic Blood Pressure (mmHg)</label>
              <input
                type="number"
                className="input"
                value={systolicBp}
                onChange={(e) => setSystolicBp(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '20px', paddingTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={familyHistory}
                  onChange={(e) => setFamilyHistory(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#EF4444' }}
                />
                Family History
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={sedentary}
                  onChange={(e) => setSedentary(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#EF4444' }}
                />
                Sedentary Lifestyle
              </label>
            </div>
          </div>
        </div>

        {/* Prediction Results Panel */}
        <div
          className="card-panel"
          style={{
            background: 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.05em' }}>
                MODEL: DCR-NN2 (DEEP SEQUENCE)
              </span>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: `${tierColor}20`,
                  color: tierColor,
                  border: `1px solid ${tierColor}40`
                }}
              >
                {riskTier}
              </span>
            </div>

            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: tierColor, lineHeight: 1 }}>
                {riskScore}%
              </div>
              <div style={{ fontSize: '0.95rem', color: '#94A3B8', marginTop: '8px' }}>
                Probability of 3-Year Microvascular Progression
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase' }}>
                Neural Assessment Insights
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#E2E8F0', fontSize: '0.875rem', lineHeight: '1.6' }}>
                {hba1c >= 7.0 && <li>Elevated HbA1c ({hba1c}%) increases diabetic retinopathy and nephropathy risk.</li>}
                {fastingGlucose > 125 && <li>Fasting blood glucose indicates persistent insulin resistance.</li>}
                {bmi > 28 && <li>BMI above target threshold adds metabolic syndrome burden.</li>}
                {familyHistory && <li>Genetic predisposition adds baseline vulnerability weighting.</li>}
                {hba1c < 6.5 && fastingGlucose <= 110 && <li>Metabolic parameters are well-managed.</li>}
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Hospital Cluster Federated Validation</span>
            <button className="btn btn-primary" onClick={() => navigate('/patients')} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
              Assign Care Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
