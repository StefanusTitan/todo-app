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
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Login</h1>
      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>
          {error}
        </p>
      )}
      <form onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button
        onClick={handleRegisterRedirect}
        style={{ ...styles.button, backgroundColor: "#ccc", marginTop: "1rem" }}
      >
        Register
      </button>
    </div>
  );
}

const styles = {
  inputGroup: {
    marginBottom: "1rem",
    display: "grid",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};