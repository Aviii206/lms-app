import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAvailableTests } from "../../services/testService";
import BookLoader from "../../components/common/BookLoader";

const AvailableTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchObj = async () => {
      try {
        const data = await getAvailableTests();
        setTests(data);
      } catch (err) {
        console.error("Error fetching available tests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchObj();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <BookLoader message="Scanning for active exams..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h2>Available Tests</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        {tests.length === 0 ? <p>No tests available at the moment.</p> : tests.map(test => (
          <div key={test._id} className="lms-card">
            <h3>{test.title}</h3>
            <p style={{ color: "#64748b", margin: "5px 0 15px 0" }}>{test.description}</p>
            <p><strong>Duration:</strong> {test.durationMinutes} mins</p>
            <p><strong>Window:</strong> {new Date(test.startTime).toLocaleString()} - {new Date(test.endTime).toLocaleString()}</p>
            
            {test.attempt && test.attempt.status === "GRADED" ? (
              <button disabled className="btn-success" style={{ marginTop: "15px", opacity: 0.9 }}>
                Graded | Score: {test.attempt.score}
              </button>
            ) : test.attempt && test.attempt.status === "SUBMITTED" ? (
              <button disabled className="btn-disabled" style={{ marginTop: "15px" }}>
                Submitted - Pending Review
              </button>
            ) : new Date() < new Date(test.startTime) ? (
              <button disabled className="btn-secondary" style={{ marginTop: "15px", opacity: 0.7 }}>
                Upcoming (Not started)
              </button>
            ) : new Date() > new Date(test.endTime) ? (
              <button disabled className="btn-danger" style={{ marginTop: "15px", opacity: 0.7 }}>
                Expired (Missed)
              </button>
            ) : (
              <button 
                onClick={() => navigate(`/student/test/${test._id}`)}
                className="btn-primary" style={{ marginTop: "15px" }}>
                {test.attempt && test.attempt.status === "IN_PROGRESS" ? "Resume Test" : "Start Test"}
              </button>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AvailableTests;
