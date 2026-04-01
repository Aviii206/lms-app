import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/navbar.css";

const Navbar = ({ toggle }) => {
  const { logout, user } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button onClick={toggle} className="btn-secondary" style={{ padding: "8px 12px", border: "none", background: "transparent", fontSize: "18px" }}>
          ☰
        </button>
        <h2 style={{ fontSize: "20px", color: "#0f172a", margin: 0 }}>LearnHub</h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ fontWeight: 600, color: "#475569" }}>{user.name}</span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;