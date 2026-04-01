import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import StatCard from "../../components/common/Statcard";
import "../../styles/dashboard.css";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data } = await axios.get(
        "http://import.meta.env.VITE_API_URL/courses/student/dashboard",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setDashboard(data);
    };

    fetchDashboard();
  }, []);

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