"use client";

import React, { useEffect } from "react";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // hide the global header while on register page (match login behavior)
    const header = document.querySelector("header") as HTMLElement | null;
    const prevDisplay = header?.style.display ?? "";
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = prevDisplay;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-sky-50">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        {children}
      </div>
    </div>
  );
}