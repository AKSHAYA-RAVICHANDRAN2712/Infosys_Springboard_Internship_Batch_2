import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Patient 360</h2>

      <Link to="/dashboard">Dashboard</Link>
      <Link to="/patients">Patients</Link>
      {/* <Link to="/register">Register Patient</Link> */}
      <Link to="/twins">Twins</Link>
      <Link to="/predictions">Predictions</Link>
      <Link to="/alerts">Alerts</Link>
      <Link to="/careplans">Care Plans</Link>
      <Link to="/reports">Reports</Link>
    </aside>
  );
}

export default Sidebar;