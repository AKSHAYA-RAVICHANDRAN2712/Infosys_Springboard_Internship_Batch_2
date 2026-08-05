import { useState } from "react";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Registration Successful!");

    navigate("/login");
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

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Full Name */}

          <div>

            <label className="text-white">
              Full Name
            </label>

            <div className="relative mt-2">

              <FaUser className="absolute top-4 left-4 text-blue-600" />

              <input
                type="text"
                placeholder="Enter Full Name"
                className="w-full pl-12 py-3 rounded-xl outline-none"
                required
              />

            </div>

          </div>

          {/* Email */}

          <div>

            <label className="text-white">
              Email
            </label>

            <div className="relative mt-2">

              <FaEnvelope className="absolute top-4 left-4 text-blue-600" />

              <input
                type="email"
                placeholder="Enter Email"
                className="w-full pl-12 py-3 rounded-xl outline-none"
                required
              />

            </div>

          </div>

          {/* Phone */}

          <div>

            <label className="text-white">
              Mobile Number
            </label>

            <div className="relative mt-2">

              <FaPhone className="absolute top-4 left-4 text-blue-600" />

              <input
                type="tel"
                placeholder="Enter Mobile Number"
                className="w-full pl-12 py-3 rounded-xl outline-none"
                required
              />

            </div>

          </div>

          {/* Role */}

          <div>

            <label className="text-white">
              Register As
            </label>

            <div className="relative mt-2">

              <FaUserShield className="absolute top-4 left-4 text-blue-600" />

              <select
                className="w-full pl-12 py-3 rounded-xl outline-none"
              >
                <option>Patient</option>
                <option>Doctor</option>
              </select>

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="text-white">
              Password
            </label>

            <div className="relative mt-2">

              <FaLock className="absolute top-4 left-4 text-blue-600" />

              <input
                type={showPassword ? "text" : "password"}
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

            <label className="text-white">
              Confirm Password
            </label>

            <div className="relative mt-2">

              <FaLock className="absolute top-4 left-4 text-blue-600" />

              <input
                type={showConfirm ? "text" : "password"}
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

          {/* Button */}

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-white text-lg font-semibold transition"
          >
            Register
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