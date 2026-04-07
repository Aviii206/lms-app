import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/navbar.css";

const Navbar = ({ toggle }) => {
  const { logout, user } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button onClick={toggle} className="btn-secondary sidebar-toggle" style={{ padding: "8px 12px", border: "none", background: "transparent", fontSize: "18px", cursor: "pointer" }}>
          ☰
        </button>
        <h2 className="mobile-brand" style={{ fontSize: "20px", color: "#111827", margin: 0, fontWeight: 800, letterSpacing: "-0.04em" }}>LearnHub</h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ fontWeight: 700, color: "#1f2937", fontSize: "15px" }}>{user.name}</span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;