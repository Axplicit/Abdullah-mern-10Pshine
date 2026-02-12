import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      setLoading(true);
      await register(name, email, password);
      navigate("/login");
    } catch {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0f172a] dark:to-[#020617] px-6">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Join Memora and start organizing your thoughts
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* NAME */}
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              Full Name
            </label>
          </div>

          {/* EMAIL */}
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
              Email
            </label>
          </div>

          {/* PASSWORD */}
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
              Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
