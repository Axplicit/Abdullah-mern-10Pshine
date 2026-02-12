import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setMessage("");

    try {
      await api.post(`/auth/reset-password/${token}`, { password });

      setSuccess(true);
      setMessage("Password reset successful. Redirecting to login...");

      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setSuccess(false);
      setMessage("Token is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0f172a] dark:to-[#020617] px-6">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Enter a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PASSWORD FIELD */}
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="peer w-full border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg px-3 pt-6 pb-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label
              className="
              absolute left-3
              top-2
              text-xs
              text-gray-500 dark:text-gray-400
              transition-all
              peer-placeholder-shown:text-sm
              peer-placeholder-shown:top-4
              peer-placeholder-shown:text-gray-500
              peer-focus:top-2
              peer-focus:text-xs
              peer-focus:text-indigo-500
              "
            >
              New Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 text-center text-sm ${
              success
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
