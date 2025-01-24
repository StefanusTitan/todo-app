// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
require('dotenv').config();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter(); // Initialize the router

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error message
    setLoading(true); // Set loading to true

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false); // Reset loading state
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, { // Change to your actual API endpoint
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Login failed.");
        setLoading(false); // Reset loading state
        return;
      }

      // Redirect or handle success
      router.push("/"); // Use Next.js router for navigation
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false); // Reset loading state
    }
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
    </div>
  );
}

const styles = {
  inputGroup: {
    marginBottom: "1rem",
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