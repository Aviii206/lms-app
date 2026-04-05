import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import StatCard from "../../components/common/Statcard";
import "../../styles/dashboard.css";

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data } = await axios.get(
        "https://lms-app-backend-ruzu.onrender.com/api/courses/teacher/dashboard",
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
      <h2>Teacher Dashboard</h2>

      {dashboard && (
        <>
          <div className="stats-container">
            <StatCard
              title="Total Courses"
              value={dashboard.totalCourses}
            />
            <StatCard
              title="Total Students"
              value={dashboard.totalStudents}
            />
          </div>

          <h3 style={{ marginTop: "30px" }}>My Courses</h3>

          <div className="courses-grid">
            {dashboard.courses.map((course) => (
              <div key={course._id} className="course-card">
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <p>Students: {course.students.length}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default TeacherDashboard;