import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Reports() {
  const reports = [
    { title: "FHIR Diagnostic Report (JSON)", date: "2026-08-25", status: "Generated ✓" },
    { title: "Patient Longitudinal Health Summary", date: "2026-08-25", status: "Verified ✓" },
    { title: "Digital Twin Telemetry & FAR Audit (<3%)", date: "2026-08-25", status: "Compliant ✓" }
  ];

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="dashboard">
          <h1>Healthcare Reports & Audits</h1>

          <div className="patient-card">
            <h2>Clinical Documentation Repository</h2>
            <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
              {reports.map((r, i) => (
                <div
                  key={i}
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
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>{r.title}</h3>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Created: {r.date}</span>
                  </div>
                  <span style={{ color: "#22c55e", fontWeight: "bold" }}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Reports;