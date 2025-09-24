// src/components/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ECGAnimation from "./ECGAnimation";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:8080/api/signup", form);
      console.log("Signup successful:", res.data);
      navigate("/"); // Redirect to login
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9ec] flex items-center justify-start px-16 py-10 relative overflow-hidden">
      {/* ECG animation */}
      <ECGAnimation />

      {/* Left Text */}
      <div className="absolute left-16 top-1/2 transform -translate-y-1/2 text-left w-[850px] z-10">
        <h1 className="text-8xl font-extrabold text-yellow-600 leading-tight mb-8">
          Smart Health AI
        </h1>
        <p className="text-5xl text-gray-700 leading-snug mb-6">
          Join the future of{" "}
          <span className="bg-yellow-200 px-1 italic">AI-driven</span>{" "}
          healthcare.
        </p>
        <p className="text-3xl text-gray-800 leading-relaxed">
          Create your account to access{" "}
          <span className="bg-yellow-200 px-1 italic">
            personalized health predictions
          </span>
          , symptom tracking, and expert-level insights — all powered by{" "}
          <span className="bg-yellow-200 px-1 italic">smart algorithms</span>.
        </p>
      </div>

      {/* Signup Form */}
      <div className="absolute right-40 top-1/2 transform -translate-y-1/2 w-[650px] bg-white p-12 rounded-3xl shadow-2xl border border-gray-200 z-10">
        <h2 className="text-5xl font-bold text-gray-800 mb-8 text-left">
          Create Your Account
        </h2>
        <form className="space-y-6" onSubmit={handleSignup}>
          <div>
            <label className="block text-gray-600 text-4xl mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={handleChange}
              className="w-full text-4xl px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
              placeholder="Enter your name"
            />
          </div>
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
              className="w-full text-4xl px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
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
              placeholder="Create a password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl text-2xl transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-xl mt-4 text-left">{error}</p>
        )}

        <p className="mt-6 text-left text-gray-500 text-2xl">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
