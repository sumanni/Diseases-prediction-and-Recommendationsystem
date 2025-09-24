// src/components/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ECGAnimation from "./ECGAnimation";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:8080/api/login", form);
      console.log("Login successful:", res.data);
      navigate("/home");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9ec] flex items-start justify-start px-16 py-10 relative overflow-hidden">
      {/* ECG animation background */}
      <ECGAnimation />

      {/* Left text */}
      <div className="absolute left-16 top-1/2 transform -translate-y-1/2 text-left w-[850px] z-10">
        <h1 className="text-8xl font-extrabold text-yellow-600 leading-tight mb-8">
          Smart Health AI
        </h1>
        <p className="text-5xl text-gray-700 leading-snug mb-6">
          Fast, <span className="bg-yellow-200 px-1 italic">AI-powered</span>{" "}
          predictions
          <br />
          for smarter{" "}
          <span className="bg-yellow-200 px-1 italic">healthcare</span>.
        </p>
        <p className="text-3xl text-gray-800 leading-relaxed">
          Our system uses{" "}
          <span className="bg-yellow-200 px-1 italic">
            advanced machine learning
          </span>{" "}
          techniques to analyze your symptoms and provide
          <span className="bg-yellow-200 px-1 italic"> instant</span>,{" "}
          <span className="bg-yellow-200 px-1 italic">reliable</span>{" "}
          suggestions...
        </p>
      </div>

      {/* Login Form */}
      <div className="absolute right-40 top-1/2 transform -translate-y-1/2 w-[650px] bg-white p-12 rounded-3xl shadow-2xl border border-gray-200 z-10">
        <h2 className="text-5xl font-bold text-gray-800 mb-8 text-left">
          Login to Continue
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              className="block text-gray-600 text-4xl mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="w-full text-4xl px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              className="block text-gray-600 text-4xl mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl text-2xl transition duration-200"
          >
            Log In
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-xl mt-4 text-left">{error}</p>
        )}

        <p className="mt-6 text-left text-gray-500 text-2xl">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
