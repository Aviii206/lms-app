import Attempt from "../models/Attempt.js";
import Answer from "../models/Answer.js";
import Test from "../models/Test.js";
import Question from "../models/Question.js";

// STUDENT: Start an attempt
export const startAttempt = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const now = new Date();
    if (now < test.startTime || now > test.endTime) {
      return res.status(403).json({ message: "Test not currently active" });
    }

    let attempt = await Attempt.findOneAndUpdate(
      { test: test._id, student: req.user._id },
      { $setOnInsert: { startTime: now, status: "IN_PROGRESS", score: 0 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (attempt.status === "SUBMITTED" || attempt.status === "GRADED") {
      return res.status(400).json({ message: "Attempt already submitted" });
    }

    // Fetch questions without showing correct answers
    const questions = await Question.find({ test: test._id }).select("-options.isCorrect -correctTextAnswer");

    res.status(201).json({ attempt, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STUDENT: Sync answers (autosave)
export const syncAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, tabViolations } = req.body;

    const attempt = await Attempt.findById(attemptId);
    if (!attempt || attempt.status === "SUBMITTED") {
      return res.status(403).json({ message: "Cannot sync: invalid attempt" });
    }

    if (tabViolations !== undefined) {
      attempt.tabViolations = tabViolations;
      await attempt.save();
    }

    if (answers && answers.length > 0) {
      for (let ans of answers) {
        await Answer.findOneAndUpdate(
          { attempt: attemptId, question: ans.questionId },
          { selectedOptionId: ans.selectedOptionId, textResponse: ans.textResponse },
          { upsert: true, new: true }
        );
      }
    }

    res.json({ message: "Synced" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STUDENT: Submit attempt
export const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await Attempt.findById(attemptId);
    if (!attempt || attempt.status === "SUBMITTED") {
      return res.status(400).json({ message: "Attempt already submitted" });
    }

    const answers = await Answer.find({ attempt: attemptId });
    let totalScore = 0;

    for (let ans of answers) {
      const question = await Question.findById(ans.question);
      if (question.type === "MCQ") {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        // Compare object ID strings
        if (
          correctOption &&
          ans.selectedOptionId &&
          correctOption._id.toString() === ans.selectedOptionId.toString()
        ) {
          ans.isCorrect = true;
          ans.marksAwarded = question.marks;
          totalScore += question.marks;
        } else {
          ans.isCorrect = false;
          ans.marksAwarded = 0;
        }
        await ans.save();
      }
    }

    attempt.status = "SUBMITTED";
    attempt.score = totalScore;
    await attempt.save();

    res.json({ message: "Submitted successfully", score: totalScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TEACHER: Get all attempts for a specific test
export const getAttemptsByTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test || test.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const attempts = await Attempt.find({ test: req.params.testId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TEACHER: Get specific attempt review details
export const getAttemptReview = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId)
      .populate("student", "name email")
      .populate("test", "title durationMinutes");

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    const test = await Test.findById(attempt.test._id);
    if (!test || test.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const answers = await Answer.find({ attempt: attempt._id }).populate("question");

    res.json({ attempt, answers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TEACHER: Submit manual grades for an attempt
export const gradeAttempt = async (req, res) => {
  try {
    const { manualGrades } = req.body; // Array of { answerId, marksGiven }
    const attempt = await Attempt.findById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    const test = await Test.findById(attempt.test);
    if (!test || test.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let scoreDelta = 0;

    for (let grade of manualGrades) {
      const answer = await Answer.findById(grade.answerId);
      if (answer) {
        const diff = grade.marksGiven - answer.marksAwarded;
        scoreDelta += diff;
        answer.marksAwarded = grade.marksGiven;
        answer.isCorrect = grade.marksGiven > 0;
        await answer.save();
      }
    }

    attempt.score += scoreDelta;
    attempt.status = "GRADED";
    await attempt.save();

    res.json({ message: "Grades updated successfully", attempt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
