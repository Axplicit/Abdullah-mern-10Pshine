import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "80px auto",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>
        Welcome{user ? `, ${user.name}` : ""} 👋
      </h2>

      <p style={{ color: "#555", marginBottom: "30px" }}>
        This is your personal workspace. From here you can manage your notes.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Link
          to="/notes"
          style={{
            padding: "12px 24px",
            background: "#4f46e5",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Go to Notes
        </Link>

        <Link
          to="/login"
          style={{
            padding: "12px 24px",
            border: "1px solid #4f46e5",
            color: "#4f46e5",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Switch Account
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
