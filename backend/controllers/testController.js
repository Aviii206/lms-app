import Test from "../models/Test.js";
import Question from "../models/Question.js";
import Course from "../models/Course.js";
import Attempt from "../models/Attempt.js";

// TEACHER: Create a test
export const createTest = async (req, res) => {
  try {
    const { title, description, courseId, durationMinutes, startTime, endTime, settings } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const test = await Test.create({
      title,
      description,
      course: courseId,
      createdBy: req.user._id,
      durationMinutes,
      startTime,
      endTime,
      settings,
    });
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TEACHER: Get all tests created by teacher
export const getTeacherTests = async (req, res) => {
  try {
    const tests = await Test.find({ createdBy: req.user._id }).populate("course", "title");
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE TEST WITH QUESTIONS
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId).populate("course", "title");
    if (!test) return res.status(404).json({ message: "Test not found" });
    const questions = await Question.find({ test: test._id });
    res.json({ test, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TEST
export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test || test.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Question.deleteMany({ test: test._id });
    await Attempt.deleteMany({ test: test._id });
    await test.deleteOne();
    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TEST
export const updateTest = async (req, res) => {
  try {
    const { title, description, courseId, durationMinutes, startTime, endTime, settings, questions } = req.body;
    let test = await Test.findById(req.params.testId);
    if (!test || test.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    test.title = title;
    test.description = description;
    test.course = courseId;
    test.durationMinutes = durationMinutes;
    test.startTime = startTime;
    test.endTime = endTime;
    test.settings = settings;
    await test.save();

    await Question.deleteMany({ test: test._id });
    if (questions && questions.length > 0) {
       // Only insert fields from Question model, removing _id if it exists to let Mongoose generate new ones securely
       const cleanQs = questions.map(q => {
         const { _id, ...rest } = q;
         return { ...rest, test: test._id };
       });
       await Question.insertMany(cleanQs);
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// TEACHER: Add questions to a test
export const addQuestions = async (req, res) => {
  try {
    const { questions } = req.body; // Array of question objects
    const test = await Test.findById(req.params.testId);
    if (!test || test.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized or test not found" });
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({ ...q, test: test._id }))
    );
    res.status(201).json(createdQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STUDENT: Get tests available to them (enrolled courses & valid timeslot)
export const getAvailableTests = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user._id });
    const courseIds = courses.map((c) => c._id);

    const tests = await Test.find({
      course: { $in: courseIds }
    }).populate("course", "title").lean();

    // Attach attempts
    for (let test of tests) {
      const attempt = await Attempt.findOne({ test: test._id, student: req.user._id });
      test.attempt = attempt || null;
    }

    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
