"use client";

import { useAuth } from "../context/AuthContext";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
require('dotenv').config();

export default function LoginPage() {
  const { login } = useAuth(); // Access the AuthContext's state updater
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Login failed.");
        setLoading(false);
        return;
      }
  
      const userData = await response.json();
  
      // Use the login function from AuthContext
      login(userData.profile_picture_path);
  
      // Redirect or handle success
      router.push("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/register"); // Redirect to the register page
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center text-slate-900 mb-3">Login</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="grid gap-4" noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-medium text-slate-700">Email</label>
          <input
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-200"
            aria-label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-medium text-slate-700">Password</label>
          <input
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-200"
            aria-label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button
        onClick={handleRegisterRedirect}
        className="w-full mt-3 py-3 rounded-lg border border-slate-300"
      >
        Register
      </button>
    </div>
  );
}
