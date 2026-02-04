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
      }
    };

    if (token) fetchProfile();
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

  if (!profile) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  return (
    <div style={{ maxWidth: "720px", margin: "40px auto", padding: "20px" }}>
      {/* ===== TOP BAR ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>👤 Profile</h2>
        <div>
          <button onClick={() => navigate("/notes")} style={{ marginRight: "10px" }}>
            Back to Notes
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ===== PROFILE INFO ===== */}
      <div
        style={{
          background: "#fff",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <p><strong>Email:</strong> {profile.email}</p>
        <p>
          <strong>Joined:</strong>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* ===== UPDATE PROFILE ===== */}
      <form
        onSubmit={handleUpdateProfile}
        style={{
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Update Profile</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button disabled={profileLoading}>
          {profileLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* ===== CHANGE PASSWORD ===== */}
      <form
        onSubmit={handleChangePassword}
        style={{
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button disabled={passwordLoading}>
          {passwordLoading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
