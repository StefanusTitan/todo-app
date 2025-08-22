"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // Store the uploaded file
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePicture) {
        formData.append("profile_picture", profilePicture); // Append the file
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
        method: "POST",
        body: formData, // Send FormData object
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed.");
        setLoading(false);
        return;
      }

      // Registration successful, redirect to login page
      router.push("/login");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center text-slate-900 mb-3">Register</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="grid gap-4" noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="font-medium text-slate-700">Username</label>
          <input
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-200"
            aria-label="Username"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <div className="flex flex-col gap-1">
          <label htmlFor="profile_picture" className="font-medium text-slate-700">Profile Picture</label>
          <input
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900"
            type="file"
            id="profile_picture"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}