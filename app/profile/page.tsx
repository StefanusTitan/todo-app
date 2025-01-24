"use client";

import React, { useEffect, useState } from 'react';
require('dotenv').config();

export default function Profile() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        profile_picture_path: '',
    });

    const formStyle = {
        margin: '2rem auto',
        maxWidth: '600px',
        padding: '1.5rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    };

    const formGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
    };

    const labelStyle = {
        flex: '0 0 30%',
        marginRight: '1rem',
        color: '#555',
        fontWeight: 'bold',
    };

    const inputStyle = {
        flex: '1',
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
    };

    const buttonStyle = {
        display: 'block',
        width: '100%',
        padding: '0.75rem',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: '#fff',
        fontSize: '1rem',
        cursor: 'pointer',
    };

    const [isLoading, setIsLoading] = useState(true); // State to track loading

    // Function to fetch user data when the component loads
    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/1`); // Replace `1` with dynamic user ID if necessary
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                setFormData({
                    username: userData.username || '',
                    email: userData.email || '',
                    password: '', // Keep empty for security
                    profile_picture_path: userData.profile_picture_path || '',
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        }

        fetchUserData();
    }, []); // Empty dependency array ensures it runs only once when the component mounts

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            console.log('Profile updated:', updatedUser);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };
    
    if (isLoading) {
        return <div>Loading...</div>; // Optional loading spinner or message
    }

    return (
        <div style={formStyle}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '1.5rem' }}>Update Profile</h1>
            <form onSubmit={handleSubmit}>
                {[
                    { id: 'username', type: 'text', label: 'Username', placeholder: 'Enter your username' },
                    { id: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email' },
                    { id: 'password', type: 'password', label: 'Password', placeholder: 'Enter a new password' },
                    { id: 'profile_picture_path', type: 'text', label: 'Profile Picture Path', placeholder: 'Profile picture URL' },
                ].map(({ id, type, label, placeholder }) => (
                    <div key={id} style={formGroupStyle}>
                        <label htmlFor={id} style={labelStyle}>{label}</label>
                        <input
                            type={type}
                            id={id}
                            name={id}
                            placeholder={placeholder}
                            value={formData[id as keyof typeof formData]}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                ))}
                <button type="submit" style={buttonStyle}>
                    Save Changes
                </button>
            </form>
        </div>
    );
}