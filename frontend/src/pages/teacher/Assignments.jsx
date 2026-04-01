import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

const Assignments = () => {
  const { user } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Fetch teacher courses
  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/courses/teacher/dashboard",
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

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:5000/api/assignments/${selectedCourse}`,
        { title, description, dueDate },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Assignment Created!");
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      alert("Error creating assignment");
    }
  };

  return (
    <DashboardLayout>
      <h2>Create Assignment</h2>

      <form onSubmit={handleCreate}>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          required
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <textarea
            placeholder="Assignment Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <button className="btn-primary" style={{ marginTop: "20px", width: "100%", padding: "14px", fontSize: "15px" }} type="submit">
          Create Assignment
        </button>
      </form>
    </DashboardLayout>
  );
};

export default Assignments;