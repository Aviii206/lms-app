import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    attempt: { type: mongoose.Schema.Types.ObjectId, ref: "Attempt", required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    selectedOptionId: { type: mongoose.Schema.Types.ObjectId },
    textResponse: String,
    isCorrect: { type: Boolean, default: null },
    marksAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Answer", answerSchema);
