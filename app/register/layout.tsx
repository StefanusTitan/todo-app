"use client";

import React from "react";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.container}>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
  },
  main: {
    backgroundColor: "#f9f9f9",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};