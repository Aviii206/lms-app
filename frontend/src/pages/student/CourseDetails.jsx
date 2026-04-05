import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data } = await axios.get(
        "https://lms-app-backend-ruzu.onrender.com/api/courses",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const selected = data.find((c) => c._id === id);
      setCourse(selected);
    };

    fetchCourse();
  }, [id]);

  return (
    <DashboardLayout>
      {course && (
        <>
          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <h3 style={{ marginTop: "20px" }}>Students Enrolled</h3>

          {course.students.length === 0 ? (
            <p>No students yet.</p>
          ) : (
            <p>Total Students: {course.students.length}</p>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default CourseDetails;