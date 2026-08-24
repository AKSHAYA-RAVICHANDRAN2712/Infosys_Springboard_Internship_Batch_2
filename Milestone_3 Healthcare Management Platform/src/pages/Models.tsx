import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Models: React.FC = () => {
  const navigate = useNavigate();

  const modelsList = [
    {
      id: 'MOD-CVD-01',
      name: 'Cardiovascular Risk Prediction Engine (CVD-XG1)',
      type: 'Supervised Ensemble / Gradient Boosted Trees',
      accuracy: '91.6%',
      rocAuc: '0.942',
      status: 'Active / Production',
      statusColor: 'badge-success',
      lastTrained: '2 hours ago via Federated Round #48',
      features: ['Age', 'BMI', 'Blood Pressure', 'Cholesterol', 'Glucose', 'CRP (C-Reactive Protein)'],
      description: 'Predicts 5-year primary cardiovascular incident probability based on standardized multi-variate physiological and biomarker inputs.'
    },
    {
      id: 'MOD-DIA-02',
      name: 'Diabetes Complication Risk Model (DCR-NN2)',
      type: 'Deep Neural Network / Longitudinal Sequence',
      accuracy: 'Pending Validation',
      rocAuc: 'N/A',
      status: 'Model Development in Progress',
      statusColor: 'badge-warning',
      lastTrained: 'Training in local hospital clusters',
      features: ['HbA1c', 'Fasting Blood Sugar', 'eGFR', 'Microalbuminuria', 'Systolic BP', 'Neuropathy Score'],
      description: 'Assesses progressive microvascular and macrovascular complication timelines for type-2 diabetic patients.'
    },
    {
      id: 'MOD-READM-03',
      name: '30-Day Readmission Risk Classifier',
      type: 'Hierarchical Logistic Regression & Random Forest',
      accuracy: '89.4%',
      rocAuc: '0.912',
      status: 'Active / Operational',
      statusColor: 'badge-success',
      lastTrained: '1 day ago',
      features: ['Length of Stay', 'Prior Emergency Visits', 'Charlson Comorbidity Index', 'Medication Count'],
      description: 'Evaluates probability of unplanned readmission within 30 days post-discharge to optimize transition care protocols.'
    },
    {
      id: 'MOD-SEPSIS-04',
      name: 'Early Sepsis & Vitals Anomaly Detector',
      type: 'LSTM Temporal Autoencoder',
      accuracy: '93.1%',
      rocAuc: '0.965',
      status: 'Active / Operational',
      statusColor: 'badge-success',
      lastTrained: '3 days ago',
      features: ['Heart Rate Variance', 'Respiration Rate', 'Temperature Delta', 'WBC', 'Lactate'],
      description: 'Continuous real-time anomaly detection for ICU and emergency telemetry streams.'
    }
  ];

  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ color: '#FFFFFF', fontSize: '1.75rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            AI Predictive Models Directory
          </h1>
          <p style={{ color: '#94A3B8', marginTop: '6px', fontSize: '0.95rem' }}>
            Deployed clinical intelligence algorithms, ensemble benchmarks, and active federated model versions.
          </p>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/dashboard')}
          style={{ fontSize: '0.875rem', padding: '10px 18px' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Return to Dashboard
        </button>
      </div>

      {/* Model Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {modelsList.map((model) => (
          <div key={model.id} className="card-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.05em' }}>{model.id}</span>
                <span className={`badge ${model.statusColor}`} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>{model.status}</span>
              </div>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                {model.name}
              </h2>
              <div style={{ fontSize: '0.825rem', color: '#94A3B8', marginBottom: '12px' }}>
                Architecture: <span style={{ color: '#E2E8F0', fontWeight: 500 }}>{model.type}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#CBD5E1', lineHeight: '1.5', marginBottom: '16px' }}>
                {model.description}
              </p>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Input Feature Vectors
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {model.features.map((f, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', background: '#1E293B', color: '#E2E8F0', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.725rem', color: '#94A3B8', textTransform: 'uppercase' }}>Benchmark Accuracy</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: model.accuracy === 'Pending Validation' ? '#F59E0B' : '#10B981' }}>
                  {model.accuracy}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.725rem', color: '#94A3B8', textTransform: 'uppercase' }}>ROC-AUC Metric</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF' }}>
                  {model.rocAuc}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};