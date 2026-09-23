import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: 30,
    password: "Pass@123",
    role: "PATIENT"
  });

  const fetchPatients = () => {
    fetch("http://localhost:8080/api/v1/patients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
        } else {
          setPatients([
            { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "1234567890", age: 30 },
            { id: 2, name: "Sarah Smith", email: "sarah.smith@example.com", phone: "9876543210", age: 42 }
          ]);
        }
      })
      .catch(() => {
        setPatients([
          { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "1234567890", age: 30 },
          { id: 2, name: "Sarah Smith", email: "sarah.smith@example.com", phone: "9876543210", age: 42 }
        ]);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/patients/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "PROVIDER"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setStatusMsg("Patient onboarded successfully into database!");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", phone: "", age: 30, password: "Pass@123", role: "PATIENT" });
      fetchPatients();
    } catch (err) {
      alert(err.message || "Failed to save patient.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="dashboard">
          <div className="dashboard-header">
            <div>
              <h1>Registered Patients</h1>
              <span className="card-desc" style={{ display: "block", marginTop: "4px" }}>
                PostgreSQL Clinical Records &amp; Digital Twin Registry
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                backgroundColor: "#0284c7",
                color: "#ffffff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.4)"
              }}
            >
              + Add New Patient
            </button>
          </div>

          {statusMsg && (
            <div style={{ padding: "12px", marginBottom: "16px", backgroundColor: "rgba(16, 185, 129, 0.2)", border: "1px solid #10b981", borderRadius: "8px", color: "#34d399", fontWeight: "600" }}>
              {statusMsg}
            </div>
          )}

          <div className="glass-card">
            <div className="card-header-flex">
              <h2>Active Clinical Roster</h2>
              <span className="badge badge-success">{patients.length} Registered</span>
            </div>

            <table className="dark-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Twin Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td style={{ fontWeight: "600", color: "#f1f5f9" }}>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.phone || "N/A"}</td>
                    <td>{p.age || "N/A"}</td>
                    <td><span className="pill pill-green">Synchronized</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ADD PATIENT MODAL POPUP */}
          {isModalOpen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(6, 21, 34, 0.85)",
                backdropFilter: "blur(6px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
              }}
            >
              <div
                className="glass-card"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  margin: "20px",
                  padding: "30px",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)"
                }}
              >
                <div className="card-header-flex" style={{ marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "20px" }}>Onboard New Patient</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "22px", cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "13px", color: "#94a3b8" }}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Alex Martin"
                      value={formData.name}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "10px 14px", marginTop: "6px", backgroundColor: "#061522", border: "1px solid #334155", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", color: "#94a3b8" }}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. alex.martin@hospital.org"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "10px 14px", marginTop: "6px", backgroundColor: "#061522", border: "1px solid #334155", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "13px", color: "#94a3b8" }}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="1234567890"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "10px 14px", marginTop: "6px", backgroundColor: "#061522", border: "1px solid #334155", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "13px", color: "#94a3b8" }}>Age</label>
                      <input
                        type="number"
                        name="age"
                        required
                        value={formData.age}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "10px 14px", marginTop: "6px", backgroundColor: "#061522", border: "1px solid #334155", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", color: "#94a3b8" }}>Default Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "10px 14px", marginTop: "6px", backgroundColor: "#061522", border: "1px solid #334155", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{ flex: 1, padding: "10px", backgroundColor: "#334155", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ flex: 1, padding: "10px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
                    >
                      {loading ? "Saving..." : "Save Patient"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Patients;