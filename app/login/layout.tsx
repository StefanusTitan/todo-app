// app/login/layout.tsx
"use client";

import React, { useEffect } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // hide the global header while on login page
    const header = document.querySelector("header") as HTMLElement | null;
    const prevDisplay = header?.style.display ?? "";
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = prevDisplay;
    };
  }, []);

  return (
    <div className="login-page-outer">
      <div className="login-form-container">{children}</div>
    </div>
  );
}
