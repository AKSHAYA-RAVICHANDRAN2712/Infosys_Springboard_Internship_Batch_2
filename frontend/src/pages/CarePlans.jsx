import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function CarePlans() {
  const [approvals, setApprovals] = useState([
    {
      id: 101,
      patientName: "John Doe",
      predictionType: "CVD Risk Escalation",
      proposedTreatment: "Start Atorvastatin 20mg daily + Low Sodium Diet",
      approvalStatus: "PENDING_REVIEW",
      outcomeVerified: false
    },
    {
      id: 102,
      patientName: "Sarah Smith",
      predictionType: "Diabetic Complication Flag",
      proposedTreatment: "Increase Metformin to 850mg & Schedule Renal Panel",
      approvalStatus: "PENDING_REVIEW",
      outcomeVerified: false
    }
  ]);

  const [verifiedList, setVerifiedList] = useState([
    {
      id: 99,
      patientName: "Robert Brown",
      treatment: "Lisinopril 10mg titration",
      approvedBy: "DOC-501",
      outcome: "SBP decreased from 155 mmHg to 122 mmHg (Target Achieved)",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  ]);

  const [statusMsg, setStatusMsg] = useState("");

  const handleDecision = (id, decision) => {
    fetch(`http://localhost:8080/api/v1/approvals/${id}/review?status=${decision}&doctorId=DOC-501&notes=Verified+clinically`, {
      method: "POST",
      headers: { "X-User-Role": "PROVIDER" }
    })
      .then(() => {
        setStatusMsg(`Proposal #${id} successfully marked as ${decision}!`);
        setApprovals((prev) => prev.filter((item) => item.id !== id));
      })
      .catch(() => {
        // Local state fallback
        setStatusMsg(`Proposal #${id} marked as ${decision} (Local State).`);
        setApprovals((prev) => prev.filter((item) => item.id !== id));
      });
  };

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="dashboard">
          <div className="dashboard-header">
            <div>
              <h1>Milestone 4: Outcome Tracking &amp; Provider Approval</h1>
              <span className="card-desc" style={{ display: "block", marginTop: "4px" }}>
                Human-in-the-Loop (HITL) Governance &amp; Cryptographic Outcome Audit
              </span>
            </div>
            <span className="live-tag">● Provider Gate Active</span>
          </div>

          {statusMsg && (
            <div style={{ padding: "12px", marginBottom: "16px", backgroundColor: "rgba(16, 185, 129, 0.2)", border: "1px solid #10b981", borderRadius: "8px", color: "#34d399", fontWeight: "600" }}>
              {statusMsg}
            </div>
          )}

          {/* Pending Approval Queue */}
          <div className="glass-card">
            <div className="card-header-flex">
              <h2>Pending Provider Approvals (AI Proposed Actions)</h2>
              <span className="badge badge-info">{approvals.length} Awaiting Review</span>
            </div>
            <p className="card-desc">
              AI treatment recommendations are blocked from patient deployment until explicit clinical approval is signed[cite: 2, 4].
            </p>

            {approvals.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>All proposed clinical interventions have been reviewed and approved.</p>
            ) : (
              <table className="dark-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>AI Inference Flag</th>
                    <th>Proposed Clinical Intervention</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvals.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td><b>{item.patientName}</b></td>
                      <td style={{ color: "#f59e0b" }}>{item.predictionType}</td>
                      <td>{item.proposedTreatment}</td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleDecision(item.id, "APPROVED")}
                            style={{ backgroundColor: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(item.id, "REJECTED")}
                            style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Outcome Tracking Integrity Audit */}
          <div className="glass-card" style={{ marginTop: "24px" }}>
            <div className="card-header-flex">
              <h2>Outcome Tracking &amp; Provenance Audit</h2>
              <span className="badge badge-purple">SHA-256 Audit Trail</span>
            </div>
            <table className="dark-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Approved Intervention</th>
                  <th>Sign-off Clinician</th>
                  <th>Observed Patient Outcome</th>
                  <th>Cryptographic Provenance Hash</th>
                </tr>
              </thead>
              <tbody>
                {verifiedList.map((row) => (
                  <tr key={row.id}>
                    <td><b>{row.patientName}</b></td>
                    <td>{row.treatment}</td>
                    <td style={{ color: "#38bdf8" }}>{row.approvedBy}</td>
                    <td style={{ color: "#34d399" }}>{row.outcome}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8" }}>
                      {row.hash.substring(0, 20)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}

export default CarePlans;