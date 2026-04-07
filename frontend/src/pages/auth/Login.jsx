import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BlogFeed from "../../components/common/BlogFeed";
import "../../styles/login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password, role);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (userInfo.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/teacher/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left-panel">
        {/* Logo + Title */}
        <div className="logo-section">
          <div className="logo">🎓</div>
          <h1>LearnHub</h1>
          <p>Your Learning Management System</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to continue learning</p>

          <p className="role-text">I am a...</p>

          {/* Role Toggle */}
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

            <button className="signin-btn" type="submit" disabled={loading}>
              {loading ? (
                <><span className="btn-spinner"></span> Signing In...</>
              ) : "Sign In"}
            </button>
            <div className="auth-link-box">
              Don't have an account? <a href="/signup">Sign up</a>
            </div>
          </form>
        </div>
      </div>

      <div className="login-right-panel">
        <BlogFeed />
      </div>
    </div>
  );
};

export default Login;