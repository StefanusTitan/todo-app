// app/login/layout.tsx
import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>{children}</div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "75vh",
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    padding: "2rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
  },
};