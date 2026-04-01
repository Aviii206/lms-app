import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/login.css";

const Signup = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(name, email, password, role);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (userInfo.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/teacher/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-page">
      <div className="logo-section">
        <div className="logo">🎓</div>
        <h1>LearnHub</h1>
        <p>Create your new account</p>
      </div>

      <div className="login-card">
        <h2>Join Us</h2>
        <p className="subtitle">Sign up to start learning or teaching</p>

        <p className="role-text">I want to register as a...</p>
        <div className="role-toggle">
          <button
            type="button"
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
          >
            📘 Student
          </button>
          <button
            type="button"
            className={role === "teacher" ? "active" : ""}
            onClick={() => setRole("teacher")}
          >
            👨‍🏫 Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Alex Carter"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="alex@student.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="signin-btn" type="submit">
            Create Account
          </button>
          <div className="auth-link-box">
            Already have an account? <a href="/">Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;