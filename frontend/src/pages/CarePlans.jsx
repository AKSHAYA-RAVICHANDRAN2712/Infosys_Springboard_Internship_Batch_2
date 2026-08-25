import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function CarePlans() {
  const [plans, setPlans] = useState([
    { id: 1, title: "Cardiovascular Exercise Plan", detail: "30 mins light cardio 5x/week", status: "Ongoing" },
    { id: 2, title: "Medication Schedule", detail: "Metformin 500mg daily after breakfast", status: "Active" },
    { id: 3, title: "Clinician Follow-up", detail: "Biometric vitals review with DOC-501 in 14 days", status: "Scheduled" }
  ]);

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="dashboard">
          <h1>Patient Care Management</h1>

          <div className="patient-card">
            <h2>Active Clinical Care Pathways</h2>
            <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
              {plans.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: "14px",
                    backgroundColor: "#1e3e62",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>{p.title}</h3>
                    <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>{p.detail}</p>
                  </div>
                  <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default CarePlans;