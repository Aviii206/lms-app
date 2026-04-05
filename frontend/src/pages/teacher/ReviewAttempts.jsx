import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

const ReviewAttempts = () => {
  const { user } = useContext(AuthContext);
  const { testId } = useParams();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const { data } = await axios.get(`https://lms-app-backend-ruzu.onrender.com/api/attempts/test/${testId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setAttempts(data);
      } catch (err) {
        console.error("Failed to load attempts", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchAttempts();
  }, [testId, user]);

  return (
    <DashboardLayout>
      <h2>Review Submissions</h2>
      {loading ? (
        <p>Loading attempts...</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {attempts.length === 0 ? (
            <p>No students have submitted this test yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Submitted At</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt._id}>
                    <td>{attempt.student?.name}</td>
                    <td>{attempt.student?.email}</td>
                    <td>{new Date(attempt.createdAt).toLocaleString()}</td>
                    <td><span className="status-badge blue">{attempt.score}</span></td>
                    <td><span className={`status-badge ${attempt.status === "GRADED" ? "success" : "warning"}`}>{attempt.status}</span></td>
                    <td>
                      <button
                        onClick={() => navigate(`/teacher/attempt/${attempt._id}/grade`)}
                        className="btn-success"
                      >
                        Grade / Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ReviewAttempts;
