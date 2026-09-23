import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Predictions() {
  const [prediction, setPrediction] = useState({
    diabetesRisk: "Low (12%)",
    heartDiseaseRisk: "Medium (44%)",
    recommendation: "Regular Monitoring & Dietary Consultation",
    complianceScore: "99.2% (AHA Guidelines Compliant)"
  });

  const [simulated, setSimulated] = useState(false);

  const runSimulation = () => {
    setSimulated(true);
    setPrediction({
      diabetesRisk: "Low (8%)",
      heartDiseaseRisk: "Low (18%)",
      recommendation: "Bi-annual Checkup & Maintenance Plan",
      complianceScore: "100% (Fully Compliant)"
    });
  };

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="dashboard">
          <h1>Clinical AI Predictions</h1>

          <div className="patient-card">
            <h2>Health Risk Prediction Engine (Milestone 2)</h2>
            <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
              <p><b>Diabetes Risk:</b> <span style={{ color: "#22c55e" }}>{prediction.diabetesRisk}</span></p>
              <p><b>Heart Disease Risk:</b> <span style={{ color: "#f59e0b" }}>{prediction.heartDiseaseRisk}</span></p>
              <p><b>Recommendation:</b> {prediction.recommendation}</p>
              <p><b>Clinical Guideline Alignment:</b> <span style={{ color: "#38bdf8" }}>{prediction.complianceScore}</span></p>
            </div>

            <button
              onClick={runSimulation}
              style={{
                marginTop: "16px",
                backgroundColor: "#0284c7",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              {simulated ? "Re-run Inference Model" : "Run Prediction Simulation"}
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default Predictions;