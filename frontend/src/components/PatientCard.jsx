import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function PatientCard() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    id: "MS10234",
    name: "John Doe",
    age: 45,
    gender: "Male",
    heartRate: "78 BPM",
    bloodPressure: "120/80",
    spo2: "98%",
    glucose: "Normal",
    cholesterol: "Normal",
    medications: ["Metformin", "Vitamin D"]
  });

  // Fetch registered patient from backend if available
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/patients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const p = data[0];
          setPatient((prev) => ({
            ...prev,
            id: `MS102${p.id || 34}`,
            name: p.name || "John Doe",
            age: p.age || 45
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="glass-card" style={{ marginTop: "20px" }}>
      <div className="card-header-flex">
        <h2>Digital Health Twin - {patient.name}</h2>
        <span className="pill pill-green">● Twin Active</span>
      </div>

      <div className="patient-grid">
        <div>
          <h3>FHIR Patient Resource</h3>
          <p>Patient ID: <b>{patient.id}</b></p>
          <p>Age: {patient.age}</p>
          <p>Gender: {patient.gender}</p>
        </div>

        <div>
          <h3>Vitals Stream</h3>
          <p>Heart Rate: <b>{patient.heartRate}</b></p>
          <p>Blood Pressure: <b>{patient.bloodPressure}</b></p>
          <p>SpO2: <b>{patient.spo2}</b></p>
        </div>

        <div>
          <h3>Lab Results</h3>
          <p>Glucose: {patient.glucose}</p>
          <p>Cholesterol: {patient.cholesterol}</p>
        </div>

        <div>
          <h3>Medications</h3>
          {patient.medications.map((m, idx) => (
            <p key={idx}>{m}</p>
          ))}
        </div>
      </div>

      {/* ACTIVE WORKING BUTTONS */}
      <div className="actions" style={{ marginTop: "18px", display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={() => navigate("/reports")}
          style={{
            backgroundColor: "#0284c7",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          View Timeline
        </button>

        <button
          type="button"
          onClick={() => navigate("/predictions")}
          style={{
            backgroundColor: "#0284c7",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Run Prediction
        </button>

        <button
          type="button"
          onClick={() => navigate("/careplans")}
          style={{
            backgroundColor: "#0f766e",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Create Careplan
        </button>
      </div>
    </div>
  );
}

export default PatientCard;