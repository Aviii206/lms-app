import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

const MyAssignments = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await axios.get(
        (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/assignments/student",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setData(res.data);
    };

    fetchAssignments();
  }, []);

  const handleSubmit = async (assignmentId) => {
    const content = prompt("Enter your submission:");

    if (!content) return;

    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/assignments/submit/${assignmentId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    alert("Submitted!");
  };

  return (
    <DashboardLayout>
      <h2>My Assignments</h2>

      {data &&
        data.assignments.map((assignment) => {
          const submission = data.submissions.find(
            (s) => s.assignment === assignment._id
          );

          return (
            <div key={assignment._id} className="lms-card" style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", color: "#0f172a", marginBottom: "8px" }}>{assignment.title}</h3>
              <p style={{ color: "#64748b", marginBottom: "15px" }}>{assignment.description}</p>
              <p style={{ display: "inline-block", background: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", marginBottom: "20px" }}>⏰ Due: {assignment.dueDate?.slice(0, 10)}</p>
              
              <div style={{ marginTop: "5px" }}>
                {submission ? (
                  <div className="status-badge success" style={{ padding: "8px 16px", fontSize: "14px" }}>
                    ✓ Submitted {submission.grade !== null && `| Grade: ${submission.grade}`}
                  </div>
                ) : (
                  <button className="btn-primary" onClick={() => handleSubmit(assignment._id)}>
                    Submit Assignment
                  </button>
                )}
              </div>
            </div>
          );
        })}
    </DashboardLayout>
  );
};

export default MyAssignments;