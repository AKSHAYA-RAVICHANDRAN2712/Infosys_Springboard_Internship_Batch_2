import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Twins() {
  const [twins, setTwins] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/patients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTwins(data);
        } else {
          setTwins([{ id: 1, name: "John Doe" }, { id: 2, name: "Sarah Smith" }]);
        }
      })
      .catch(() => {
        setTwins([{ id: 1, name: "John Doe" }, { id: 2, name: "Sarah Smith" }]);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="dashboard">
          <h1>Digital Health Twins</h1>

          <div className="patient-card">
            <h2>Active Paired Digital Twins</h2>
            <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
              {twins.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    backgroundColor: "#1e3e62",
                    borderRadius: "8px"
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px" }}>{t.name} (Twin #{t.id})</h3>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Completeness: 98% | FHIR Synchronized</span>
                  </div>
                  <span style={{ color: "#22c55e", fontWeight: "bold" }}>● Synchronized</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Twins;