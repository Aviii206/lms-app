import React from "react";

const QuestionBuilder = ({ questions, setQuestions }) => {
  const addQuestion = (type) => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        type,
        text: "",
        marks: 1,
        options: type === "MCQ" ? [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] : [],
        correctTextAnswer: "",
      },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const newQ = [...questions];
    newQ[index][field] = value;
    setQuestions(newQ);
  };

  const updateOption = (qIndex, oIndex, field, value) => {
    const newQ = [...questions];
    newQ[qIndex].options[oIndex][field] = value;
    setQuestions(newQ);
  };

  const addOption = (qIndex) => {
    const newQ = [...questions];
    newQ[qIndex].options.push({ text: "", isCorrect: false });
    setQuestions(newQ);
  };

  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Questions</h3>
      <div style={{ marginBottom: "20px", gap: "10px", display: "flex" }}>
        <button type="button" className="btn-secondary" onClick={() => addQuestion("MCQ")}>+ Add MCQ</button>
        <button type="button" className="btn-secondary" onClick={() => addQuestion("SHORT_ANSWER")}>+ Add Short Answer</button>
      </div>

      {questions.map((q, qIndex) => (
        <div key={q.id} className="lms-card" style={{ marginBottom: "20px", background: "#f8fafc" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <strong style={{ fontSize: "16px", color: "#0f172a" }}>Question {qIndex + 1} ({q.type})</strong>
            <button type="button" className="btn-danger" style={{ padding: "6px 12px", fontSize: "12px" }} onClick={() => removeQuestion(qIndex)}>Remove</button>
          </div>
          <input
            type="text"
            placeholder="Question Text"
            value={q.text}
            onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
            style={{ width: "100%", margin: "5px 0" }}
            required
          />
          <input
            type="number"
            placeholder="Marks"
            value={q.marks}
            onChange={(e) => updateQuestion(qIndex, "marks", e.target.value)}
            min="1"
            style={{ margin: "5px 0" }}
          />

          {q.type === "MCQ" && (
            <div style={{ marginLeft: "15px", marginTop: "10px" }}>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={opt.isCorrect}
                    onChange={() => {
                      const newQ = [...questions];
                      newQ[qIndex].options.forEach((o, i) => o.isCorrect = (i === oIndex));
                      setQuestions(newQ);
                    }}
                  />
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOption(qIndex, oIndex, "text", e.target.value)}
                    required
                  />
                </div>
              ))}
              <button type="button" className="btn-secondary" style={{ marginTop: "10px", fontSize: "13px", padding: "6px 12px" }} onClick={() => addOption(qIndex)}>+ Add Option</button>
            </div>
          )}

          {q.type === "SHORT_ANSWER" && (
            <div style={{ marginLeft: "15px", marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Correct Answer (for auto-grading)"
                value={q.correctTextAnswer}
                onChange={(e) => updateQuestion(qIndex, "correctTextAnswer", e.target.value)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionBuilder;
