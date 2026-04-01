import express from "express";
import {
  createAssignment,
  submitAssignment,
  gradeSubmission,
  getStudentAssignments,
  getTeacherSubmissions
} from "../controllers/assignmentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Teacher creates assignment
router.post(
  "/:courseId",
  protect,
  authorizeRoles("teacher"),
  createAssignment
);

// Student submits
router.post(
  "/submit/:assignmentId",
  protect,
  authorizeRoles("student"),
  submitAssignment
);

// Teacher grades
router.put(
  "/grade/:submissionId",
  protect,
  authorizeRoles("teacher"),
  gradeSubmission
);

router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentAssignments
);

router.get(
  "/teacher/submissions",
  protect,
  authorizeRoles("teacher"),
  getTeacherSubmissions
);

export default router;