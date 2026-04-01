import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TestSettingsForm from "../../components/test/teacher/TestSettingsForm";
import QuestionBuilder from "../../components/test/teacher/QuestionBuilder";
import { AuthContext } from "../../context/AuthContext";

const CreateTest = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  
  const [testData, setTestData] = useState({
    title: "", description: "", courseId: "", durationMinutes: 60,
    startTime: "", endTime: "",
    settings: { shuffleQuestions: false, shuffleOptions: false, negativeMarking: false }
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("http://import.meta.env.VITE_API_URL/courses/teacher/dashboard", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setCourses(data.courses);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.token) fetchCourses();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (questions.length === 0) return alert("Add at least one question!");
      
      const testRes = await axios.post("http://import.meta.env.VITE_API_URL/tests", testData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const newTest = testRes.data;

      await axios.put(`http://import.meta.env.VITE_API_URL/tests/${newTest._id}/questions`, { questions }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      alert("Test Created Successfully!");
      navigate("/teacher/dashboard");
    } catch (error) {
      console.error("CREATE TEST ERROR", error);
      const msg = error.response ? error.response.data.message : error.message;
      alert("Error: " + msg);
    }
  };

  return (
    <DashboardLayout>
      <h2>Create New Test</h2>
      <form onSubmit={handleSubmit}>
        <TestSettingsForm testData={testData} setTestData={setTestData} courses={courses} />
        <QuestionBuilder questions={questions} setQuestions={setQuestions} />
        
        <button type="submit" className="btn-primary" style={{ marginTop: "25px", width: "100%", padding: "16px", fontSize: "16px" }}>
          Publish Test
        </button>
      </form>
    </DashboardLayout>
  );
};

export default CreateTest;
