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
    <div className="flex items-center gap-3">
      <a href={isLoggedIn ? "/profile" : "/login"}>
        {isLoggedIn ? (
          <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
            <Image
              src={profilePicturePath || "/images/default-profile.jpg"}
              alt="Profile Picture"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <span>Login</span>
        )}
      </a>
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="ml-3 bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Profile;