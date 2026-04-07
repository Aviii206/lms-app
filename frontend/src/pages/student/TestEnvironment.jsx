import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { startAttempt, syncAttempt, submitAttempt } from "../../services/attemptService";
import TimerDisplay from "../../components/test/student/TimerDisplay";
import "../../styles/testenv.css";

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
    <div className="test-env-wrapper">
      
      {showWarning && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(239,68,68,0.95)", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>WARNING!</h1>
          <p style={{ fontSize: "20px" }}>You switched tabs. This is violation {violationCount} of 3.</p>
          <button onClick={() => setShowWarning(false)} className="btn-secondary" style={{ marginTop: "25px", color: "#0f172a" }}>I Understand</button>
        </div>
      )}

      {/* Main Column */}
      <div className="test-main-area">
        <div className="test-header">
          <div className="test-header-title">Lumina Academy: Final Examination</div>
          <button onClick={handleFinalSubmit} className="btn-finish">Finish Test</button>
        </div>

        <div className="test-content-scroll">
          <div className="test-card">
            <div className="question-badge">
              Question {currentIndex + 1} of {questions.length}
            </div>
            
            <div className="question-text">
              {currentQ.text}
            </div>

            {currentQ.type === "MCQ" && (
              <div className="options-container">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ._id]?.selectedOptionId === opt._id;
                  const letter = String.fromCharCode(65 + idx); // A, B, C, D
                  return (
                    <label key={opt._id} className={`option-pill ${isSelected ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name={`q-${currentQ._id}`} 
                        value={opt._id}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(currentQ._id, opt._id, null)}
                        style={{ display: "none" }} /* Hidden native radio */
                      />
                      <div className="option-letter">{letter}</div>
                      <div className="option-text">{opt.text}</div>
                    </label>
                  );
                })}
              </div>
            )}

            {currentQ.type === "SHORT_ANSWER" && (
              <div style={{ flex: 1 }}>
                <textarea 
                  rows="6" 
                  placeholder="Type your answer here..."
                  style={{ width: "100%", background: "#f0f4f7", padding: "20px", borderRadius: "12px", border: "none", fontSize: "16px", outline: "none" }}
                  value={answers[currentQ._id]?.textResponse || ""}
                  onChange={(e) => handleAnswerChange(currentQ._id, null, e.target.value)}
                />
              </div>
            )}

            <div className="test-actions">
              <button 
                disabled={currentIndex === 0} 
                onClick={() => setCurrentIndex(currentIndex - 1)} 
                className="btn-nav-prev"
                style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
              >
                ← Previous Question
              </button>
              
              {currentIndex < questions.length - 1 ? (
                <button onClick={() => setCurrentIndex(currentIndex + 1)} className="btn-nav-next">
                  Next Question →
                </button>
              ) : (
                <div style={{width: '200px'}}></div> /* Spacer */
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Column */}
      <div className="test-sidebar">
        <div className="timer-box">
          <div className="timer-icon">⏱️</div>
          <div className="timer-time">
            <TimerDisplay expectedEndTime={attemptData.test?.endTime || new Date(new Date().getTime() + 60*60*1000)} onTimeUp={handleFinalSubmit} />
          </div>
          <div className="timer-label">TIME REMAINING</div>
        </div>

        <div className="grid-balls">
          {questions.map((q, idx) => {
            let status = "unvisited";
            if (currentIndex === idx) status = "current";
            else if (answers[q._id]) status = "answered";

            return (
              <div 
                key={q._id} 
                onClick={() => setCurrentIndex(idx)}
                className={`bubble ${status}`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default TestEnvironment;
