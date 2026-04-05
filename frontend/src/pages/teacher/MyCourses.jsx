import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await axios.get(
        (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/courses/teacher/dashboard",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setCourses(data.courses);
    };

    fetchCourses();
  }, []);

  return (
    <DashboardLayout>
      <h2>My Courses</h2>

      {courses.map((course) => (
        <div
          key={course._id}
          className="lms-card"
          style={{ marginBottom: "20px", cursor: "pointer" }}
          onClick={() => navigate(`/teacher/course/${course._id}`)}
        >
          <h4 style={{ fontSize: "18px", color: "#0f172a", marginBottom: "8px" }}>{course.title}</h4>
          <p style={{ color: "#64748b", marginBottom: "15px" }}>{course.description}</p>
          <div style={{ display: "inline-flex", background: "#f1f5f9", padding: "6px 12px", borderRadius: "8px", color: "#334155", fontWeight: "500", fontSize: "14px" }}>
            👥 Students Enrolled: {course.students.length}
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
};

export default MyCourses;