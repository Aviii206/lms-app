import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, default: Date.now },
    status: { type: String, enum: ["IN_PROGRESS", "SUBMITTED", "GRADED"], default: "IN_PROGRESS" },
    tabViolations: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

attemptSchema.index({ test: 1, student: 1 }, { unique: true });

export default mongoose.model("Attempt", attemptSchema);
