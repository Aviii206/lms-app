import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

const TestSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score ?? "Processing...";

  return (
    <DashboardLayout>
      <div style={{ textAlign: "center", marginTop: "50px", padding: "30px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
        <h2>Test Submitted Successfully!</h2>
        <p style={{ fontSize: "1.2rem", marginTop: "20px" }}>Your Objective Score: <strong>{score}</strong></p>
        <p style={{ color: "#666" }}>(Short answers may require manual review by the teacher)</p>
        <button onClick={() => navigate("/student/dashboard")} style={{ marginTop: "30px", padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Back to Dashboard
        </button>
      </div>
    </DashboardLayout>
  );
};

export default TestSummary;
