import React from "react";

const TestSettingsForm = ({ testData, setTestData, courses }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setTestData((prev) => ({
        ...prev,
        settings: { ...prev.settings, [name]: checked },
      }));
    } else {
      setTestData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>Test Settings</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input name="title" placeholder="Test Title" value={testData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={testData.description} onChange={handleChange} />
        <select name="courseId" value={testData.courseId} onChange={handleChange} required>
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
        <input type="number" name="durationMinutes" placeholder="Duration (Minutes)" value={testData.durationMinutes} onChange={handleChange} required />
        <label>Start Time</label>
        <input type="datetime-local" name="startTime" value={testData.startTime} onChange={handleChange} required />
        <label>End Time</label>
        <input type="datetime-local" name="endTime" value={testData.endTime} onChange={handleChange} required />
        
        <label>
          <input type="checkbox" name="shuffleQuestions" checked={testData.settings.shuffleQuestions} onChange={handleChange} />
          Shuffle Questions
        </label>
        <label>
          <input type="checkbox" name="shuffleOptions" checked={testData.settings.shuffleOptions} onChange={handleChange} />
          Shuffle Options
        </label>
      </div>
    </div>
  );
};

export default TestSettingsForm;
