import express from "express";
import {
  startAttempt,
  syncAttempt,
  submitAttempt,
  getAttemptsByTest,
  getAttemptReview,
  gradeAttempt
} from "../controllers/attemptController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/:testId/start", protect, authorizeRoles("student"), startAttempt);
router.patch("/:attemptId/sync", protect, authorizeRoles("student"), syncAttempt);
router.post("/:attemptId/submit", protect, authorizeRoles("student"), submitAttempt);

// Teacher routes
router.get("/test/:testId", protect, authorizeRoles("teacher"), getAttemptsByTest);
router.get("/:attemptId/review", protect, authorizeRoles("teacher"), getAttemptReview);
router.put("/:attemptId/grade", protect, authorizeRoles("teacher"), gradeAttempt);

export default router;
