import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setToken(res.data.resetToken); // dev only
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0f172a] dark:to-[#020617] px-6">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Forgot Password
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EMAIL FIELD */}
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Email Address
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mt-6 text-center text-sm text-green-600 dark:text-green-400">
            {message}
          </div>
        )}

        {/* DEV RESET LINK */}
        {token && (
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Dev Reset Link:
            </span>{" "}
            <Link
              to={`/reset-password/${token}`}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Reset Password
            </Link>
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

export default ForgotPassword;
