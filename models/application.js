const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema(
  {
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Application", applicationSchema);
