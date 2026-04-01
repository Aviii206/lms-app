import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

const GradeAttempt = () => {
  const { user } = useContext(AuthContext);
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualGrades, setManualGrades] = useState({});

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const { data } = await axios.get(`http://import.meta.env.VITE_API_URL/attempts/${attemptId}/review`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setAttempt(data.attempt);
        setAnswers(data.answers);
        
        // Initialize manual grades with current DB values
        const grades = {};
        data.answers.forEach(ans => {
          grades[ans._id] = ans.marksAwarded;
        });
        setManualGrades(grades);
      } catch (err) {
        console.error("Failed to load review", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchReview();
  }, [attemptId, user]);

  const handleGradeChange = (answerId, val) => {
    setManualGrades(prev => ({ ...prev, [answerId]: val }));
  };

  const handleSaveGrades = async () => {
    try {
      const gradesArray = Object.keys(manualGrades).map(ansId => ({
        answerId: ansId,
        marksGiven: Number(manualGrades[ansId])
      }));

      await axios.put(`http://import.meta.env.VITE_API_URL/attempts/${attemptId}/grade`, { manualGrades: gradesArray }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      alert("Grades updated successfully!");
      navigate(`/teacher/test/${attempt.test._id}/review`);
    } catch (err) {
      console.error("Failed to update grades", err);
      alert("Failed to update grades");
    }
  };

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  if (!attempt) return <DashboardLayout><p>Attempt not found</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h2>Grade Submission</h2>
      <div className="lms-card" style={{ marginBottom: "25px", background: "#f8fafc" }}>
        <p style={{ marginBottom: "6px" }}><strong>Student:</strong> {attempt.student?.name} <span style={{ color: "#64748b" }}>({attempt.student?.email})</span></p>
        <p style={{ marginBottom: "6px" }}><strong>Test:</strong> {attempt.test?.title}</p>
        <p style={{ marginBottom: "6px" }}><strong>Current Total Score:</strong> <span className="status-badge blue">{attempt.score}</span></p>
        <p><strong>Status:</strong> <span className={`status-badge ${attempt.status === "GRADED" ? "success" : "warning"}`}>{attempt.status}</span></p>
      </div>

      {answers.map((ans, idx) => (
        <div key={ans._id} className="lms-card" style={{ marginBottom: "20px" }}>
          <h4 style={{ fontSize: "18px", color: "#0f172a", marginBottom: "5px" }}>Q{idx + 1}: {ans.question.text} <em style={{ color: "#3b82f6", fontWeight: "normal" }}>({ans.question.marks} marks)</em></h4>
          <p><strong>Type:</strong> {ans.question.type}</p>

          {ans.question.type === "MCQ" && (
            <div style={{ margin: "10px 0" }}>
              {ans.question.options.map(opt => {
                let color = "#333";
                let bg = "transparent";
                if (opt.isCorrect) bg = "#dcfce7"; // green tint for true correct answer
                if (ans.selectedOptionId === opt._id) {
                   color = "#2563eb"; // Highlight what student picked
                   // If they picked wrong, make it red tint
                   if (!opt.isCorrect) bg = "#fee2e2"; 
                }

                return (
                  <div key={opt._id} style={{ padding: "5px", background: bg, color }}>
                    <input type="radio" checked={ans.selectedOptionId === opt._id} readOnly />
                    {opt.text} {opt.isCorrect && " ✔️ (Correct Answer)"}
                    {ans.selectedOptionId === opt._id && " ⬅️ (Student's Choice)"}
                  </div>
                );
              })}
            </div>
          )}

          {ans.question.type === "SHORT_ANSWER" && (
            <div style={{ margin: "10px 0" }}>
              <p><strong>Target Answer:</strong> {ans.question.correctTextAnswer || "N/A"}</p>
              <p><strong>Student Answer:</strong></p>
              <div style={{ padding: "10px", background: "#e0f2fe", borderRadius: "4px" }}>
                {ans.textResponse || "No response provided."}
              </div>
            </div>
          )}

          <div style={{ marginTop: "15px", padding: "10px", background: "#f1f5f9", borderRadius: "5px", display: "flex", alignItems: "center", gap: "10px" }}>
            <label><strong>Marks Awarded:</strong></label>
            <input 
              type="number" 
              value={manualGrades[ans._id] ?? 0}
              onChange={(e) => handleGradeChange(ans._id, e.target.value)}
              min="0"
              max={ans.question.marks}
              step="0.5"
              style={{ width: "80px", padding: "5px" }}
            />
            <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>out of {ans.question.marks}</span>
            {ans.question.type === "SHORT_ANSWER" && <span style={{ marginLeft: "10px", color: "#f59e0b", fontWeight: "bold" }}>Needs Manual Grading!</span>}
          </div>
        </div>
      ))}

      <button onClick={handleSaveGrades} className="btn-success" style={{ display: "flex", width: "100%", justifyContent: "center", padding: "14px", marginTop: "10px" }}>
        Save Grades & Recalculate Score
      </button>

    </DashboardLayout>
  );
};

export default GradeAttempt;
