import { useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://import.meta.env.VITE_API_URL/courses",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Course Created Successfully!");
      navigate("/teacher/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error creating course");
    }
  };

  return (
    <DashboardLayout>
      <h2>Create Course</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button className="btn-primary" style={{ marginTop: "20px", width: "100%", padding: "14px", fontSize: "15px" }} type="submit">
          Create Course
        </button>
      </form>
    </DashboardLayout>
  );
};

export default CreateCourse;