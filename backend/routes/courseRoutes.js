import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  createCourse,
  getAllCourses,
  enrollInCourse,
  getStudentDashboard,
  getTeacherDashboard,
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("teacher"), createCourse);
router.get("/", protect, getAllCourses);
router.post("/:id/enroll", protect, authorizeRoles("student"), enrollInCourse);

router.get("/student/dashboard", protect, authorizeRoles("student"), getStudentDashboard);
router.get("/teacher/dashboard", protect, authorizeRoles("teacher"), getTeacherDashboard);

export default router;