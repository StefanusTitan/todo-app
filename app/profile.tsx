// File: app/Profile.tsx (or your Profile component)

"use client"; // Marks this as a client component

import { useEffect, useState } from "react";
import Image from "next/image";

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicturePath, setProfilePicturePath] = useState<string | null>(null);

  // Fetch user data to check login status
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`, { method: "GET", credentials: "include" });
        if (response.ok) {
          const userData = await response.json();
          setIsLoggedIn(true);
          setProfilePicturePath(userData.profile_picture_path); // Assuming the path is in the response
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <a href={isLoggedIn ? "/profile" : "/login"}>
      {isLoggedIn ? (
        <div className="circular-image">
          <Image
            src={profilePicturePath || "/images/default-profile.jpg"} // Default fallback image
            alt="Profile Picture"
            width={64}
            height={64}
            className="profile-pic"
          />
        </div>
      ) : (
        <span>Login</span> // Display text if not logged in
      )}
    </a>
  );
};

export default Profile;