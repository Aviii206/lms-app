import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { startAttempt, syncAttempt, submitAttempt } from "../../services/attemptService";
import TimerDisplay from "../../components/test/student/TimerDisplay";

const TestEnvironment = () => {
  const { id: testId } = useParams();
  const navigate = useNavigate();
  
  const [attemptData, setAttemptData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const initTest = async () => {
      try {
        const data = await startAttempt(testId);
        setAttemptData(data.attempt);
        setQuestions(data.questions);
        setViolationCount(data.attempt.tabViolations || 0);
      } catch (err) {
        alert("Cannot start test: " + (err.response?.data?.message || err.message));
        navigate("/student/available-tests");
      }
    };
    initTest();
  }, [testId, navigate]);

  useEffect(() => {
    if (!attemptData) return;
    const timeoutId = setTimeout(async () => {
      const syncData = Object.keys(answers).map(qId => ({
        questionId: qId,
        selectedOptionId: answers[qId].selectedOptionId,
        textResponse: answers[qId].textResponse
      }));
      if (syncData.length > 0) {
        try {
          await syncAttempt(attemptData._id, { answers: syncData, tabViolations: violationCount });
        } catch(e) {}
      }
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [answers, attemptData, violationCount]);

  useEffect(() => {
    const handleVisibility = async () => {
      if (document.hidden) {
        const newCount = violationCount + 1;
        setViolationCount(newCount);
        if (newCount >= 3) {
          alert("Maximum tab switches exceeded. Auto-submitting test.");
          await handleFinalSubmit();
        } else {
          setShowWarning(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [violationCount]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().catch(() => {
      alert("Please enable fullscreen to continue.");
    });
    setIsFullscreen(true);
  };

  const handleFinalSubmit = async () => {
    if (!attemptData) return;
    try {
      const syncData = Object.keys(answers).map(qId => ({
        questionId: qId,
        selectedOptionId: answers[qId].selectedOptionId,
        textResponse: answers[qId].textResponse
      }));
      await syncAttempt(attemptData._id, { answers: syncData, tabViolations: violationCount });
      
      const res = await submitAttempt(attemptData._id);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(()=>{});
      }
      navigate(`/student/test/${attemptData._id}/summary`, { state: { score: res.score } });
    } catch(err) {
      alert("Error submitting test");
    }
  };

  const handleAnswerChange = (qId, optionId, textValue) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { selectedOptionId: optionId, textResponse: textValue }
    }));
  };

  if (!attemptData || questions.length === 0) return <div>Loading Test...</div>;

  if (!isFullscreen) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2 style={{ fontSize: "28px", color: "#0f172a", marginBottom: "15px" }}>Strict Test Environment</h2>
        <p style={{ color: "#64748b", marginBottom: "25px" }}>You must enter full screen to proceed. Do not switch tabs!</p>
        <button onClick={enterFullscreen} className="btn-primary">
          Enter Fullscreen & Continue
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", height: "100vh" }}>
      
      {showWarning && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(239,68,68,0.95)", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>WARNING!</h1>
          <p style={{ fontSize: "20px" }}>You switched tabs. This is violation {violationCount} of 3.</p>
          <button onClick={() => setShowWarning(false)} className="btn-secondary" style={{ marginTop: "25px", color: "#0f172a" }}>I Understand</button>
        </div>
      )}

      <div className="lms-card" style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", padding: "20px 25px" }}>
        <h3 style={{ margin: 0, alignSelf: "center", color: "#0f172a" }}>Test In Progress</h3>
        <TimerDisplay expectedEndTime={attemptData.test?.endTime || new Date(new Date().getTime() + 60*60*1000)} onTimeUp={handleFinalSubmit} />
      </div>

      <div style={{ display: "flex", gap: "30px" }}>
        <div className="lms-card" style={{ width: "240px", padding: "20px" }}>
          <h4 style={{ marginBottom: "15px", color: "#475569" }}>Questions Grid</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {questions.map((q, idx) => (
              <button 
                key={q._id} 
                onClick={() => setCurrentIndex(idx)}
                style={{ 
                  width: "40px", height: "40px", fontSize: "14px",
                  background: currentIndex === idx ? "#3b82f6" : (answers[q._id] ? "#10b981" : "#f8fafc"),
                  color: currentIndex === idx ? "#fff" : (answers[q._id] ? "#fff": "#475569"),
                  border: currentIndex === idx || answers[q._id] ? "none" : "1px solid #cbd5e1", 
                  borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s"
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="lms-card" style={{ flex: 1, padding: "30px", minHeight: "400px", display: "flex", flexDirection: "column" }}>
          <h4 style={{ color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "13px", marginBottom: "10px" }}>Question {currentIndex + 1} of {questions.length}</h4>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "25px", lineHeight: "1.6" }}>{currentQ.text}</p>
          
          {currentQ.type === "MCQ" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              {currentQ.options.map((opt) => (
                <label key={opt._id} style={{ display: "flex", alignItems: "center", padding: "15px", border: "1px solid", borderColor: answers[currentQ._id]?.selectedOptionId === opt._id ? "#3b82f6" : "#e2e8f0", background: answers[currentQ._id]?.selectedOptionId === opt._id ? "#eff6ff" : "white", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" }}>
                  <input 
                    type="radio" 
                    name={`q-${currentQ._id}`} 
                    value={opt._id}
                    checked={answers[currentQ._id]?.selectedOptionId === opt._id}
                    onChange={() => handleAnswerChange(currentQ._id, opt._id, null)}
                    style={{ marginRight: "12px", width: "18px", height: "18px", accentColor: "#3b82f6" }}
                  />
                  <span style={{ fontSize: "15px", color: answers[currentQ._id]?.selectedOptionId === opt._id ? "#1d4ed8" : "#334155", fontWeight: answers[currentQ._id]?.selectedOptionId === opt._id ? "500" : "400" }}>{opt.text}</span>
                </label>
              ))}
            </div>
          )}

          {currentQ.type === "SHORT_ANSWER" && (
            <div style={{ flex: 1 }}>
              <textarea 
                rows="6" 
                placeholder="Type your answer here..."
                value={answers[currentQ._id]?.textResponse || ""}
                onChange={(e) => handleAnswerChange(currentQ._id, null, e.target.value)}
              />
            </div>
          )}

          <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
             <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)} className={currentIndex === 0 ? "btn-disabled" : "btn-secondary"}>Previous</button>
             {currentIndex < questions.length - 1 ? (
               <button onClick={() => setCurrentIndex(currentIndex + 1)} className="btn-primary">Next</button>
             ) : (
               <button onClick={handleFinalSubmit} className="btn-success">Submit Test</button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestEnvironment;
