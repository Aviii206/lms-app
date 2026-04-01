import mongoose from "mongoose";
import dotenv from "dotenv";

import Course from "./models/Course.js";
import Test from "./models/Test.js";
import Attempt from "./models/Attempt.js";
import Assignment from "./models/Assignment.js";
import Submission from "./models/Submission.js";

dotenv.config();

const cleanDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected.");

    console.log("Purging all Test, Course, Attempt, and Assignment data...");

    // Wipe all content EXCEPT Users
    await Course.deleteMany({});
    await Test.deleteMany({});
    await Attempt.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});

    console.log("Cleanup completely finished!");
    console.log("All User accounts and credentials have been strictly preserved.");

    process.exit(0);
  } catch (error) {
    console.error("Failed to clean database:", error);
    process.exit(1);
  }
};

cleanDB();
