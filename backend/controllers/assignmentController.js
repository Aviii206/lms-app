import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Course from "../models/Course.js";


// CREATE ASSIGNMENT (Teacher Only)
export const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only course creator can add assignment
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      course: course._id,
      createdBy: req.user._id,
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUBMIT ASSIGNMENT (Student Only)
export const submitAssignment = async (req, res) => {
  try {
    const { content } = req.body;

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const course = await Course.findById(assignment.course);

    // Check if student enrolled
    if (!course.students.includes(req.user._id)) {
      return res.status(403).json({ message: "Not enrolled in course" });
    }

    const submission = await Submission.create({
      assignment: assignment._id,
      student: req.user._id,
      content,
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GRADE SUBMISSION (Teacher Only)
export const gradeSubmission = async (req, res) => {
  try {
    const { grade } = req.body;

    const submission = await Submission.findById(req.params.submissionId)
      .populate("assignment");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const course = await Course.findById(submission.assignment.course);

    // Only course teacher can grade
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    submission.grade = grade;
    await submission.save();

    res.json({ message: "Graded successfully", submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET STUDENT ASSIGNMENTS
export const getStudentAssignments = async (req, res) => {
  try {
    const courses = await Course.find({
      students: req.user._id,
    });

    const courseIds = courses.map((course) => course._id);

    const assignments = await Assignment.find({
      course: { $in: courseIds },
    });

    const submissions = await Submission.find({
      student: req.user._id,
    });

    res.json({
      assignments,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SUBMISSIONS FOR TEACHER
export const getTeacherSubmissions = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      createdBy: req.user._id,
    });

    const assignmentIds = assignments.map(a => a._id);

    const submissions = await Submission.find({
      assignment: { $in: assignmentIds },
    })
      .populate("student", "name email")
      .populate("assignment", "title");

    res.json(submissions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};