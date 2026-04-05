import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import BookLoader from "../../components/common/BookLoader";

const BrowseCourses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(
        "https://lms-app-backend-ruzu.onrender.com/api/courses",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        `https://lms-app-backend-ruzu.onrender.com/api/courses/${courseId}/enroll`,
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

  if (loading) {
    return (
      <DashboardLayout>
        <BookLoader message="Fetching available courses..." />
      </DashboardLayout>
    );
  }

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