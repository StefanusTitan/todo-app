"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { isLoggedIn, profilePicturePath, login, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

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
        setOpen(false);
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

  // Close on outside click or Escape key
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const goToProfile = () => {
    setOpen(false);
    router.push("/profile");
  };

  return (
    <div className="relative inline-block" ref={ref}>
      {!isLoggedIn ? (
        <a href="/login" className="text-sm font-medium text-blue-600 hover:underline">
          Login
        </a>
      ) : (
        <>
          <button
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Open profile menu"
          >
            <span className="sr-only">Open profile menu</span>
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-300/40 dark:ring-blue-400/20">
              <Image
                src={profilePicturePath || "/images/default-profile.jpg"}
                alt="Profile Picture"
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
          </button>

          <div
            className={`origin-top-right absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden z-50 transform transition-all duration-150 ease-out ${
              open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}
            role="menu"
            aria-hidden={!open}
          >
            <button
              onClick={goToProfile}
              className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              role="menuitem"
            >
              View profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              role="menuitem"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
