import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

const ManageTests = () => {
  const { user } = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      const { data } = await axios.get((import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/tests/teacher", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTests(data);
    } catch (err) {
      console.error("Failed to fetch tests", err);
    }
  };

  useEffect(() => {
    if (user?.token) fetchTests();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test? All student attempts will be lost.")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/tests/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchTests();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <DashboardLayout>
      <h2>Manage Tests</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        {tests.length === 0 ? <p>No tests created yet.</p> : tests.map(test => (
          <div key={test._id} className="lms-card">
            <h3>{test.title}</h3>
            <p style={{ color: "#64748b", margin: "5px 0 15px 0" }}>{test.description}</p>
            <p><strong>Course:</strong> {test.course?.title}</p>
            <p><strong>Duration:</strong> {test.durationMinutes} minutes</p>
            <p><strong>Window:</strong> {new Date(test.startTime).toLocaleString()} - {new Date(test.endTime).toLocaleString()}</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button 
                onClick={() => navigate(`/teacher/edit-test/${test._id}`)} 
                className="btn-secondary">
                Edit Test
              </button>
              <button 
                onClick={() => navigate(`/teacher/test/${test._id}/review`)} 
                className="btn-primary">
                Review Submissions
              </button>
              <button 
                onClick={() => handleDelete(test._id)} 
                className="btn-danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ManageTests;
