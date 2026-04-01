import Course from "../models/Course.js";

// CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.create({
      title,
      description,
      teacher: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL COURSES
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ENROLL COURSE
export const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.students.includes(req.user._id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.students.push(req.user._id);
    await course.save();

    res.json({ message: "Enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET STUDENT DASHBOARD
export const getStudentDashboard = async (req, res) => {
  try {
    const courses = await Course.find({
      students: req.user._id,
    }).populate("teacher", "name");

    res.json({
      totalEnrolled: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TEACHER DASHBOARD
export const getTeacherDashboard = async (req, res) => {
  try {
    const courses = await Course.find({
      teacher: req.user._id,
    });

    let totalStudents = 0;

    courses.forEach((course) => {
      totalStudents += course.students.length;
    });

    res.json({
      totalCourses: courses.length,
      totalStudents,
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};