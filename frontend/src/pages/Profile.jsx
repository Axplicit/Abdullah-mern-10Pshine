import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/userService";

const Profile = () => {
  const { token, user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(token);
        setProfile(data);
        setName(data.name);
      } catch (err) {
        console.error("Failed to load profile", err);
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
    else navigate("/login");
  }, [token]);

  // ================= UPDATE PROFILE =================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name is required");

    try {
      setProfileLoading(true);
      await updateProfile(token, { name });

      const updatedUser = { ...user, name };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("All password fields are required");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setPasswordLoading(true);
      await changePassword(token, { currentPassword, newPassword });

      alert("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Password change failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  // ================= UI STATES =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f172a] dark:to-[#020617] transition-colors duration-300">

      {/* HEADER */}
      <header className="sticky top-0 backdrop-blur-md bg-white/70 dark:bg-[#0f172a]/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            👤 Profile
          </h1>

          <div className="flex gap-4 text-sm">
            <button
              onClick={() => navigate("/notes")}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Back to Notes
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* ACCOUNT INFO CARD */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Info
          </h2>

          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong>Email:</strong> {profile.email}</p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* UPDATE PROFILE */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Update Profile
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-6">

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 focus:border-indigo-500 outline-none text-gray-900 dark:text-white py-2 transition"
              placeholder="Full Name"
            />

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Change Password
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-6">

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 focus:border-indigo-500 outline-none text-gray-900 dark:text-white py-2 transition"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 focus:border-indigo-500 outline-none text-gray-900 dark:text-white py-2 transition"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 focus:border-indigo-500 outline-none text-gray-900 dark:text-white py-2 transition"
            />

            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
};

export default Profile;
