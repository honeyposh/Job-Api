const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "Remote"],
      default: "full-time",
    },
    status: {
      type: String,
      enum: ["open", "closed", "paused"],
      default: "open",
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Job", jobSchema);
