import express from "express";
import {
  createTest,
  getTeacherTests,
  addQuestions,
  getAvailableTests,
  getTestById,
  deleteTest,
  updateTest,
} from "../controllers/testController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Teacher routes
router.post("/", protect, authorizeRoles("teacher"), createTest);
router.get("/teacher", protect, authorizeRoles("teacher"), getTeacherTests);
router.put("/:testId/questions", protect, authorizeRoles("teacher"), addQuestions);
router.delete("/:testId", protect, authorizeRoles("teacher"), deleteTest);
router.put("/:testId", protect, authorizeRoles("teacher"), updateTest);

// Shared/Student routes
router.get("/available", protect, authorizeRoles("student"), getAvailableTests);
router.get("/:testId", protect, getTestById);

export default router;
