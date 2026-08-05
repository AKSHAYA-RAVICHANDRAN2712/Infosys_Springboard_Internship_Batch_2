import { Link } from "react-router-dom";
import {
  FaHospital,
  FaDatabase,
  FaHeartbeat,
  FaUserShield,
  FaUserMd,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="bg-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

          <div className="flex items-center gap-3">
            <FaHospital className="text-3xl" />
            <h1 className="text-3xl font-bold">
              MediSphere
            </h1>
          </div>

          <div className="flex gap-8 text-lg">

            <a href="#modules" className="hover:text-yellow-300">
              Modules
            </a>

            <Link to="/login" className="hover:text-yellow-300">
              Login
            </Link>

            <Link
              to="/register"
              className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100"
            >
              Register
            </Link>

          </div>

        </div>
      </nav>

      {/* Hero */}

      <section className="bg-gradient-to-r from-blue-900 to-slate-900 py-20">

        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between">

          <div className="md:w-1/2">

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Healthcare <br />
              Management Platform
            </h1>

            <p className="text-gray-300 text-lg leading-8 mb-8">
              MediSphere helps hospitals securely manage patient
              records, digital twins, vital validation and role-based
              access using a modern healthcare dashboard.
            </p>

            <Link
              to="/login"
              className="bg-blue-600 px-8 py-4 rounded-xl hover:bg-blue-500 font-semibold"
            >
              Get Started
            </Link>

          </div>

          <div className="md:w-1/2 flex justify-center mt-12 md:mt-0">

            <img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966489.png"
              alt="Healthcare"
              className="w-96"
            />

          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="max-w-7xl mx-auto py-14 px-8">

        <h2 className="text-4xl font-bold mb-8 text-center">
          Dashboard Overview
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          <StatCard
            icon={<FaUsers />}
            title="Patients"
            value="1247"
          />

          <StatCard
            icon={<FaUserMd />}
            title="Doctors"
            value="132"
          />

          <StatCard
            icon={<FaChartLine />}
            title="Digital Twins"
            value="1180"
          />

          <StatCard
            icon={<FaHeartbeat />}
            title="Vitals Checked"
            value="95%"
          />

        </div>

      </section>

      {/* Modules */}

      <section
        id="modules"
        className="max-w-7xl mx-auto px-8 py-16"
      >

        <h2 className="text-4xl text-center font-bold mb-12">
          Project Modules
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <ModuleCard
            icon={<FaDatabase />}
            title="Twin Data Completeness"
            desc="Ensures patient records are more than 95% complete before creating the Digital Twin."
            link="/twin"
          />

          <ModuleCard
            icon={<FaHeartbeat />}
            title="Vitals Range Validation"
            desc="Checks Heart Rate, Blood Pressure, Temperature and Oxygen Saturation."
            link="/vitals"
          />

          <ModuleCard
            icon={<FaUserShield />}
            title="Role Based Access"
            desc="Secure access for Admin, Doctor and Patient with permission management."
            link="/rbac"
          />

        </div>

      </section>

      {/* About */}

      <section className="bg-slate-900 py-16">

        <div className="max-w-6xl mx-auto px-8">

          <h2 className="text-4xl font-bold mb-6">
            About MediSphere
          </h2>

          <p className="text-gray-300 leading-8 text-lg">

            MediSphere is a Digital Healthcare Management Platform
            designed to improve hospital efficiency using secure
            patient management, Digital Health Twins, healthcare
            analytics and Role-Based Access Control.

          </p>

        </div>

      </section>

      {/* Footer */}

      <footer className="bg-blue-700 py-6 text-center text-lg">

        © 2026 MediSphere Healthcare Management Platform

      </footer>

    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-lg p-8 hover:scale-105 duration-300">

      <div className="text-4xl text-blue-400 mb-5">
        {icon}
      </div>

      <h3 className="text-xl">{title}</h3>

      <p className="text-4xl font-bold mt-3">
        {value}
      </p>

    </div>
  );
}

function ModuleCard({ icon, title, desc, link }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-blue-600 duration-300">

      <div className="text-5xl text-blue-400 mb-5">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4">
        {title}
      </h3>

      <p className="text-gray-300 mb-6">
        {desc}
      </p>

      <Link
        to={link}
        className="bg-blue-600 px-5 py-3 rounded-lg hover:bg-blue-500"
      >
        Open Module
      </Link>

    </div>
  );
}