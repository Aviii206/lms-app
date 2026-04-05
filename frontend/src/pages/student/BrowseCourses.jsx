import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

const BrowseCourses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(
        (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/courses",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Enrolled successfully!");
      fetchCourses();
    } catch (error) {
      alert("Already enrolled or error occurred");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <DashboardLayout>
      <h2>Browse Courses</h2>

      {courses.map((course) => (
        <div key={course._id} className="lms-card" style={{ marginBottom: "20px" }}>
          <h3>{course.title}</h3>
          <p style={{ color: "#64748b", margin: "8px 0 20px 0" }}>{course.description}</p>

          {course.students.includes(user._id) ? (
            <button disabled className="btn-disabled">
              Already Enrolled
            </button>
          ) : (
            <button onClick={() => handleEnroll(course._id)} className="btn-primary">
              Enroll
            </button>
          )}
        </div>
      ))}
    </DashboardLayout>
  );
};

export default BrowseCourses;