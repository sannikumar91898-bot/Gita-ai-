import React from "react";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f081d", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyInbound: "center", justifyContent: "center", textAlign: "center", padding: "24px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "6rem", fontWeight: "bold", color: "#c084fc", margin: "0 0 8px 0" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#f3f4f6", margin: "0 0 16px 0" }}>Page Not Found</h2>
      <p style={{ color: "#9ca3af", fontSize: "0.875rem", maxWidth: "384px", margin: "0 0 32px 0", lineHeight: "1.5" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <a href="/" style={{ padding: "12px 24px", background: "linear-gradient(to right, #f59e0b, #d97706)", color: "black", borderRadius: "12px", fontWeight: "bold", fontSize: "0.875rem", textDecoration: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)" }}>
        Go Back Home
      </a>
    </div>
  );
}