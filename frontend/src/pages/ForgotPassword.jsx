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
    <div>
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <button type="submit">Send Reset Link</button>
      </form>

      {message && <p>{message}</p>}

      {token && (
        <p>
          Dev Reset Link:{" "}
          <Link to={`/reset-password/${token}`}>
            Reset Password
          </Link>
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
