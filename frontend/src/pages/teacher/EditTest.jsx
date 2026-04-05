import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TestSettingsForm from "../../components/test/teacher/TestSettingsForm";
import QuestionBuilder from "../../components/test/teacher/QuestionBuilder";
import { getTestById, updateTest } from "../../services/testService";
import { AuthContext } from "../../context/AuthContext";

const EditTest = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [testData, setTestData] = useState({
    title: "", description: "", courseId: "", durationMinutes: 60,
    startTime: "", endTime: "",
    settings: { shuffleQuestions: false, shuffleOptions: false, negativeMarking: false }
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const courseRes = await axios.get((import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/courses/teacher/dashboard", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setCourses(courseRes.data.courses);

        const testRes = await getTestById(id);
        const t = testRes.test;
        setTestData({
          title: t.title,
          description: t.description || "",
          courseId: t.course._id,
          durationMinutes: t.durationMinutes,
          startTime: t.startTime ? new Date(t.startTime).toISOString().slice(0, 16) : "",
          endTime: t.endTime ? new Date(t.endTime).toISOString().slice(0, 16) : "",
          settings: t.settings || { shuffleQuestions: false, shuffleOptions: false, negativeMarking: false }
        });
        setQuestions(testRes.questions || []);
      } catch (err) {
        console.error("Failed to load test data", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchInitData();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (questions.length === 0) return alert("Add at least one question!");
      const payload = { ...testData, questions };
      await updateTest(id, payload);
      alert("Test Updated Successfully!");
      navigate("/teacher/manage-tests");
    } catch (error) {
      console.error(error);
      alert("Error updating test");
    }
  };

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <h2>Edit Test</h2>
      <form onSubmit={handleSubmit}>
        <TestSettingsForm testData={testData} setTestData={setTestData} courses={courses} />
        <QuestionBuilder questions={questions} setQuestions={setQuestions} />
        
        <button type="submit" style={{ padding: "10px 20px", background: "#f59e0b", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
          Update Test
        </button>
      </form>
    </DashboardLayout>
  );
};

export default EditTest;
