import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import StatCard from "../../components/common/StatCard";
import BookLoader from "../../components/common/BookLoader";
import "../../styles/dashboard.css";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data } = await axios.get(
        "https://lms-app-backend-ruzu.onrender.com/api/courses/student/dashboard",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setDashboard(data);
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <BookLoader message="Loading your enrolled courses..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h2>Student Dashboard</h2>

      {dashboard && (
        <>
          <div className="stats-container">
            <StatCard
              title="Enrolled Courses"
              value={dashboard.totalEnrolled}
            />
          </div>

          <h3 style={{ marginTop: "30px" }}>My Courses</h3>

          <div className="courses-grid">
            {dashboard.courses.map((course) => (
              <div key={course._id} className="course-card">
                <h4>{course.title}</h4>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;