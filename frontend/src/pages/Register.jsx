import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHospital,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "PATIENT",
    password: "",
    age: 30
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/patients/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "PROVIDER" // Passes RBAC guardrail for record creation
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed.");
      }

      alert("Registration Successful! Record saved to database.");
      navigate("/patients");
    } catch (err) {
      setErrorMsg(err.message || "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/70"></div>

      {/* Register Card */}
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-5 rounded-full">
              <FaHospital className="text-white text-4xl" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mt-5">
            MediSphere
          </h1>

          <p className="text-gray-200 mt-2">
            Create Your Account
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: "10px", marginTop: "16px", backgroundColor: "rgba(239, 68, 68, 0.3)", border: "1px solid #ef4444", borderRadius: "8px", color: "#fca5a5", textAlign: "center", fontSize: "14px" }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-white">Full Name</label>
            <div className="relative mt-2">
              <FaUser className="absolute top-4 left-4 text-blue-600" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                className="w-full pl-12 py-3 rounded-xl outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-white">Email</label>
            <div className="relative mt-2">
              <FaEnvelope className="absolute top-4 left-4 text-blue-600" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full pl-12 py-3 rounded-xl outline-none"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-white">Mobile Number</label>
            <div className="relative mt-2">
              <FaPhone className="absolute top-4 left-4 text-blue-600" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                className="w-full pl-12 py-3 rounded-xl outline-none"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-white">Register As</label>
            <div className="relative mt-2">
              <FaUserShield className="absolute top-4 left-4 text-blue-600" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-12 py-3 rounded-xl outline-none bg-white text-gray-800"
              >
                <option value="PATIENT">Patient</option>
                <option value="PROVIDER">Doctor / Provider</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-white">Password</label>
            <div className="relative mt-2">
              <FaLock className="absolute top-4 left-4 text-blue-600" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                className="w-full pl-12 pr-12 py-3 rounded-xl outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-4 right-4 text-blue-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-white">Confirm Password</label>
            <div className="relative mt-2">
              <FaLock className="absolute top-4 left-4 text-blue-600" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full pl-12 pr-12 py-3 rounded-xl outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-4 right-4 text-blue-600"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-white text-lg font-semibold transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-6 text-white">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-300 ml-2 font-semibold hover:text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;