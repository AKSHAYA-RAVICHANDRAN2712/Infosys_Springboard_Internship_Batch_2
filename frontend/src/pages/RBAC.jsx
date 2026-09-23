import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function RBAC() {
  const [selectedRole, setSelectedRole] = useState("PROVIDER");
  const [testStatus, setTestStatus] = useState(null);

  const handleTestPermission = (action) => {
    if (selectedRole === "PROVIDER") {
      setTestStatus({
        status: "200 OK",
        success: true,
        message: `Authorized: [PROVIDER] granted permission to '${action}'.`
      });
    } else {
      if (action.includes("Mutate") || action.includes("Update") || action.includes("Acknowledge")) {
        setTestStatus({
          status: "403 FORBIDDEN",
          success: false,
          message: `Access Denied: [PATIENT] role cannot execute '${action}'. Write operations restricted to PROVIDER.`
        });
      } else {
        setTestStatus({
          status: "200 OK",
          success: true,
          message: `Authorized: [PATIENT] granted read access to personal health record.`
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="dashboard">
          <div className="dashboard-header">
            <h1>Role-Based Access Control (RBAC)</h1>
            <span className="badge badge-purple">Enterprise Security Engine</span>
          </div>

          <div className="glass-card">
            <div className="card-header-flex">
              <h2>Active Role Switcher &amp; Permission Verifier</h2>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => { setSelectedRole("PROVIDER"); setTestStatus(null); }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: selectedRole === "PROVIDER" ? "#0284c7" : "#1e293b",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Doctor / Provider
                </button>
                <button
                  onClick={() => { setSelectedRole("PATIENT"); setTestStatus(null); }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: selectedRole === "PATIENT" ? "#0284c7" : "#1e293b",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Patient
                </button>
              </div>
            </div>

            <p className="card-desc">
              Current Header Injected: <b style={{ color: "#38bdf8", fontFamily: "monospace" }}>X-User-Role: {selectedRole}</b>
            </p>

            {testStatus && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  backgroundColor: testStatus.success ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                  border: `1px solid ${testStatus.success ? "#10b981" : "#ef4444"}`,
                  color: testStatus.success ? "#34d399" : "#fca5a5"
                }}
              >
                <b>[{testStatus.status}]</b> {testStatus.message}
              </div>
            )}

            <div className="actions" style={{ marginTop: "12px" }}>
              <button onClick={() => handleTestPermission("Read Patient Records")}>
                Test Read Operation
              </button>
              <button onClick={() => handleTestPermission("Mutate / Save Patient Vitals")}>
                Test Write / Mutation Endpoint
              </button>
              <button onClick={() => handleTestPermission("Acknowledge Clinical Alert")}>
                Test Alert Triage Permission
              </button>
            </div>
          </div>

          <div className="rbac-roles-grid" style={{ marginTop: "24px" }}>
            <div className="role-box">
              <h3 className="text-cyan">👨‍⚕️ Provider (Doctor / Clinician)</h3>
              <ul>
                <li>Read and write access to all clinical records</li>
                <li>Manage patient health vitals and diagnostic summaries</li>
                <li>Execute model inference and view predictive risk scores</li>
                <li>Acknowledge and route clinical safety alerts</li>
              </ul>
            </div>

            <div className="role-box">
              <h3 className="text-blue">👤 Patient Role</h3>
              <ul>
                <li>Strict read-only access to individual health data</li>
                <li>View personalized care plans and medication instructions</li>
                <li>Read published diagnostic summaries</li>
                <li>Blocked from mutating records (403 Forbidden enforcement)</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default RBAC;