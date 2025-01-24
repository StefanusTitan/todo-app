"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { isLoggedIn, profilePicturePath, login, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          login(userData.profile_picture_path); // Update the global state
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [login]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        logout(); // Update the global state
        router.push("/login"); // Redirect to login page after logout
      } else {
        console.error("Failed to log out");
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred while logging out");
    }
  };

  return (
    <div className="profile-container">
      <a href={isLoggedIn ? "/profile" : "/login"}>
        {isLoggedIn ? (
          <div className="circular-image">
            <Image
              src={profilePicturePath || "/images/default-profile.jpg"}
              alt="Profile Picture"
              width={64}
              height={64}
              className="profile-pic"
            />
          </div>
        ) : (
          <span>Login</span>
        )}
      </a>
      {isLoggedIn && (
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      )}
    </div>
  );
};

export default Profile;