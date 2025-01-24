"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  profilePicturePath: string | null;
  login: (path: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicturePath, setProfilePicturePath] = useState<string | null>(null);

  const login = (path: string) => {
    setIsLoggedIn(true);
    setProfilePicturePath(path);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setProfilePicturePath(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, profilePicturePath, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};