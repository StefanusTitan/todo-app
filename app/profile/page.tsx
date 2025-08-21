"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import Image from "next/image";
require("dotenv").config();

export default function Profile() {
    const { updateProfile, logout } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        profile_picture_path: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState<File | null>(null); // Store the uploaded file
    const [alert, setAlert] = useState({ message: "", type: "", show: false });
    const [error, setError] = useState<string | null>(null); // Store error messages

    // Fetch user data
    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const userData = await response.json();
                setFormData({
                    username: userData.username || "",
                    email: userData.email || "",
                    password: "", // Keep empty for security
                    profile_picture_path: userData.profile_picture_path || "",
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch user data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserData();
    }, []);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file upload input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Create FormData object
            const formDataToSend = new FormData();

            // Append text fields
            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);

            // Conditionally append password
            if (formData.password) {
                formDataToSend.append("password", formData.password);
            }

            // Append profile picture if one is selected
            if (profilePicture) {
                // Use 'profilePicture' to match the backend route's upload.single('profilePicture')
                formDataToSend.append("profilePicture", profilePicture);
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
                {
                    method: "PUT",
                    credentials: "include", // Add credentials to maintain session
                    body: formDataToSend, // Send FormData object
                }
            );

            if (!response.ok) {
                // Try to parse error message from server
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile");
            }

            const updatedUser = await response.json();
            // Update the profile picture path in the AuthContext
            if (updatedUser.profile_picture_path) {
                updateProfile(updatedUser.profile_picture_path); // Update profile in AuthContext
            }
            console.log("Profile updated:", updatedUser);
            setTimeout(() => {
                setAlert({
                  message: "Profile updated successfully!",
                  type: "success",
                  show: true,
                });
              }, 500);
            // Update the form data with the new profile picture path
            setFormData((prev) => ({
                ...prev,
                profile_picture_path: updatedUser.profile_picture_path || "",
            }));

            setError(null); // Clear any previous errors
        } catch (error) {
            console.error("Error updating profile:", error);
            setError(error instanceof Error ? error.message : "Failed to update profile. Please try again later.");
        }
    };

    // Handle user deletion
    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete account");
            }

            console.log("Account deleted successfully");
            logout(); // Log out the user after account deletion
        } catch (error) {
            console.error("Error deleting account:", error);
            setError(error instanceof Error ? error.message : "Failed to delete account. Please try again later.");
        }
    };

    return (
        <div style={formStyle}>
            <h1 style={{ textAlign: "center", color: "#333", marginBottom: "1.5rem" }}>
                Update Profile
            </h1>
            {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                {[
                    { id: "username", type: "text", label: "Username" },
                    { id: "email", type: "email", label: "Email" },
                    { id: "password", type: "password", label: "Password" },
                ].map(({ id, type, label }) => (
                    <div key={id} style={formGroupStyle}>
                        <label htmlFor={id} style={labelStyle}>{label}</label>
                        <input
                            type={type}
                            id={id}
                            name={id}
                            value={formData[id as keyof typeof formData]}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                ))}

                {/* File input for profile picture */}
                <div style={formGroupStyle}>
                    <label htmlFor="profilePicture" style={labelStyle}>Profile Picture</label>
                    <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={inputStyle}
                    />
                </div>

                {/* Preview the uploaded profile picture */}
                {formData.profile_picture_path && (
                    <div style={{position:"relative", textAlign: "center", marginBottom: "1rem", width: "auto", height: "320px"}}>
                        <Image
                            src={formData.profile_picture_path}
                            alt="Profile Preview"
                            fill
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                )}

                <button type="submit" style={buttonStyle}>
                    Save Changes
                </button>
            </form>
            <button
                type="button"
                style={{ ...buttonStyle, backgroundColor: "#dc3545", marginTop: "1rem" }}
                onClick={handleDeleteAccount}
            >
                Delete Account
            </button>
            {/* Alert Component */}
            <Alert
                message={alert.message}
                type={alert.type}
                show={alert.show}
                onClose={() => setAlert({ ...alert, show: false })}
            />
        </div>
    );
}

const formStyle = {
    margin: "2rem auto",
    maxWidth: "600px",
    padding: "1.5rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
};

const formGroupStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
};

const labelStyle = {
    flex: "0 0 30%",
    marginRight: "1rem",
    color: "#555",
    fontWeight: "bold",
};

const inputStyle = {
    flex: "1",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
};

const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "0.75rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
};