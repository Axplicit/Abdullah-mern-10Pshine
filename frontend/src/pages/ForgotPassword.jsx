import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setToken(res.data.resetToken); // dev only
    } catch (err) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "25px",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>Forgot Password</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Enter your email and we’ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Send Reset Link
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "15px", color: "#16a34a" }}>
          {message}
        </p>
      )}

      {token && (
        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Dev Reset Link:{" "}
          <Link to={`/reset-password/${token}`} style={{ color: "#4f46e5" }}>
            Reset Password
          </Link>
        </p>
      )}

      <p style={{ marginTop: "20px" }}>
        <Link to="/login" style={{ color: "#4f46e5" }}>
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
