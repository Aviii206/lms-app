import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import StatCard from "../../components/common/StatCard";
import BookLoader from "../../components/common/BookLoader";
import DashboardBlogSection from "../../components/common/DashboardBlogSection";
import "../../styles/dashboard.css";

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <BookLoader message="Fetching your dashboard insights..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h2>Teacher Dashboard</h2>

      {dashboard && (
        <>
          <div className="dashboard-header">
            <h1>Welcome back, {user.name}!</h1>
            <p className="dashboard-subtitle">
              You are managing <strong>{dashboard.totalCourses} courses</strong> with a total of <strong>{dashboard.totalStudents} students</strong>.
            </p>
          </div>

          <div className="section-header">
            <h3>Active Courses</h3>
            <a href="/teacher/my-courses" className="view-all">View All</a>
          </div>

          <div className="courses-grid">
            {dashboard.courses.map((course, index) => (
              <div key={course._id} className="course-card ethereal-card">
                <div className={`course-icon icon-color-${index % 3}`}>
                  👨‍🏫
                </div>
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <div className="progress-bar-placeholder"></div>
                <p style={{ marginTop: "auto", fontSize: "13px", fontWeight: "600", color: "#1f2937" }}>
                  Students Enrolled: {course.students.length}
                </p>
              </div>
            ))}
          </div>

          <DashboardBlogSection />
        </>
      )}
    </DashboardLayout>
  );
};

export default TeacherDashboard;