import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    type: { type: String, enum: ["MCQ", "SHORT_ANSWER"], required: true },
    text: { type: String, required: true },
    marks: { type: Number, default: 1 },
    options: [
      {
        text: String,
        isCorrect: { type: Boolean, default: false },
      },
    ],
    correctTextAnswer: String,
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
