import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

const ViewSubmissions = () => {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);

  const fetchSubmissions = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/assignments/teacher/submissions",
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setSubmissions(data);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleGrade = async (submissionId) => {
    const grade = prompt("Enter grade:");

    if (!grade) return;

    await axios.put(
      `http://localhost:5000/api/assignments/grade/${submissionId}`,
      { grade: Number(grade) },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    alert("Graded!");
    fetchSubmissions();
  };

  return (
    <DashboardLayout>
      <h2>Student Submissions</h2>

      {submissions.map((submission) => (
        <div key={submission._id} className="lms-card" style={{ marginBottom: "20px" }}>
          <h4 style={{ fontSize: "18px", color: "#0f172a", marginBottom: "5px" }}>{submission.assignment.title}</h4>
          <p style={{ color: "#475569", marginBottom: "10px" }}><strong>Student:</strong> {submission.student.name}</p>
          <div style={{ padding: "15px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "15px" }}>
            <p style={{ margin: 0, color: "#334155" }}>{submission.content}</p>
          </div>

          {submission.grade !== null ? (
            <span className="status-badge success" style={{ padding: "6px 12px", fontSize: "14px" }}>Grade: {submission.grade}</span>
          ) : (
            <button className="btn-success" onClick={() => handleGrade(submission._id)}>
              Grade Submission
            </button>
          )}
        </div>
      ))}
    </DashboardLayout>
  );
};

export default ViewSubmissions;