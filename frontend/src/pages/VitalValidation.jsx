import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function VitalValidation() {
  const [testVital, setTestVital] = useState({ heartRate: 78, sbp: 120, temp: 37.0, spo2: 98 });
  const [validationResult, setValidationResult] = useState(null);

  const vitalsTable = [
    { parameter: "Heart Rate", current: "78 BPM", range: "40 - 180 BPM", status: "Normal" },
    { parameter: "Systolic Blood Pressure (SBP)", current: "120 mmHg", range: "70 - 190 mmHg", status: "Normal" },
    { parameter: "Body Temperature", current: "37.0 °C (98.6 °F)", range: "35.0 - 41.0 °C", status: "Normal" },
    { parameter: "Oxygen Saturation (SpO2)", current: "98%", range: "70% - 100%", status: "Optimal" }
  ];

  const handleTestSave = () => {
    const hrValid = testVital.heartRate >= 40 && testVital.heartRate <= 180;
    const sbpValid = testVital.sbp >= 70 && testVital.sbp <= 190;
    const tempValid = testVital.temp >= 35.0 && testVital.temp <= 41.0;
    const spo2Valid = testVital.spo2 >= 70 && testVital.spo2 <= 100;

    if (hrValid && sbpValid && tempValid && spo2Valid) {
      setValidationResult({
        success: true,
        message: "200 OK: Vitals within safe physiological ranges. Record persisted."
      });
    } else {
      setValidationResult({
        success: false,
        message: "400 Bad Request: Vitals validation failed! Out-of-bounds telemetry rejected by guardrail."
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="dashboard">
          <div className="dashboard-header">
            <h1>Vitals Range Validation</h1>
            <span className="live-tag">● Safety Guardrail Active</span>
          </div>

          <div className="glass-card">
            <div className="card-header-flex">
              <h2>Physiological Telemetry Guardrails</h2>
              <span className="badge badge-info">Milestone 1 Core Rule</span>
            </div>
            <p className="card-desc">
              All streamed clinical telemetry is validated against acceptable clinical ranges before being admitted to PostgreSQL / MongoDB.
            </p>

            <table className="dark-table">
              <thead>
                <tr>
                  <th>Vital Parameter</th>
                  <th>Observed Value</th>
                  <th>Safe Medical Range</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vitalsTable.map((v, i) => (
                  <tr key={i}>
                    <td style={{ color: "#f1f5f9", fontWeight: "500" }}>{v.parameter}</td>
                    <td><b>{v.current}</b></td>
                    <td style={{ color: "#94a3b8" }}>{v.range}</td>
                    <td><span className="pill pill-green">{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-card" style={{ marginTop: "24px" }}>
            <div className="card-header-flex">
              <h2>Test Vitals Validation Guardrail (Live Simulator)</h2>
              <span className="badge badge-purple">Backend Logic Test</span>
            </div>

            {validationResult && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "18px",
                  backgroundColor: validationResult.success ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                  border: `1px solid ${validationResult.success ? "#10b981" : "#ef4444"}`,
                  color: validationResult.success ? "#34d399" : "#fca5a5",
                  fontWeight: "600"
                }}
              >
                {validationResult.message}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8" }}>Heart Rate (BPM)</label>
                <input
                  type="number"
                  value={testVital.heartRate}
                  onChange={(e) => setTestVital({ ...testVital, heartRate: Number(e.target.value) })}
                  style={{ width: "100%", padding: "8px 12px", marginTop: "6px", backgroundColor: "#061522", border: "1px solid #334155", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8" }}>Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={testVital.sbp}
                  onChange={(e) => setTestVital({ ...testVital, sbp: Number(e.target.value) })}
                  style={{ width: "100%", padding: "8px 12px", marginTop: "6px", backgroundColor: "#061522", border: "1px solid #334155", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8" }}>Body Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={testVital.temp}
                  onChange={(e) => setTestVital({ ...testVital, temp: Number(e.target.value) })}
                  style={{ width: "100%", padding: "8px 12px", marginTop: "6px", backgroundColor: "#061522", border: "1px solid #334155", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", color: "#94a3b8" }}>SpO2 (%)</label>
                <input
                  type="number"
                  value={testVital.spo2}
                  onChange={(e) => setTestVital({ ...testVital, spo2: Number(e.target.value) })}
                  style={{ width: "100%", padding: "8px 12px", marginTop: "6px", backgroundColor: "#061522", border: "1px solid #334155", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <button
              onClick={handleTestSave}
              style={{
                backgroundColor: "#0284c7",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Simulate Ingestion &amp; Validation Check
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default VitalValidation;