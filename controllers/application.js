const asyncWrapper = require("../middleware/ayncWrapper");
const { createCustomError } = require("../errors/customApiError");
const Application = require("../models/application");
exports.getAllApplications = asyncWrapper(async (req, res, next) => {
  const applications = await Application.find({ userId: req.user.id })
    .populate("jobId", "position company")
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .select("-resume -coverLetter");

  if (!applications.length) {
    return next(createCustomError("No applications found", 404));
  }
  res.status(200).json({ nbHit: applications.length, applications });
});
exports.applyForJob = asyncWrapper(async (req, res, next) => {
  const jobId = req.params.jobId;
  const resumeFile = req.files?.resume?.[0].filename;
  const coverLetterFile = req.files?.coverLetter?.[0].filename;
  if (!resumeFile || !coverLetterFile || !jobId) {
    return next(
      createCustomError("resume, coverletter, jobId are required", 400)
    );
  }
  const resumeUrl = `${process.env.BASE_URL}/files/${resumeFile}`;
  const coverLetterUrl = `${process.env.BASE_URL}/files/${coverLetterFile}`;
  const application = await Application.create({
    resume: resumeUrl,
    coverLetter: coverLetterUrl,
    userId: req.user.id,
    jobId,
  });
  res.json({ message: "Application Successful", application });
});
exports.editApplication = asyncWrapper(async (req, res, next) => {
  const applicationId = req.params.id;
  const userId = req.user.id;

  const updateData = {};
  // const resumeFile = req.files?.resume?.[0];
  // const coverLetterFile = req.files?.coverLetter?.[0];
  const resumeFile = req.files?.resume?.[0].filename;
  const coverLetterFile = req.files?.coverLetter?.[0].filename;
  const resumeUrl = `${process.env.BASE_URL}/files/${resumeFile}`;
  const coverLetterUrl = `${process.env.BASE_URL}/files/${coverLetterFile}`;
  if (resumeFile) {
    updateData.resume = resumeUrl;
  }

  if (coverLetterFile) {
    updateData.coverLetter = coverLetterUrl;
  }

  if (Object.keys(updateData).length === 0) {
    return next(createCustomError("No files provided to update", 400));
  }

  const application = await Application.findOneAndUpdate(
    { _id: applicationId, userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!application) {
    return next(createCustomError("No application found", 404));
  }

  res.status(200).json({
    message: "Application successfully updated",
    application,
  });
});

exports.deleteApplication = asyncWrapper(async (req, res, next) => {
  const application = await Application.findOneAndDelete({
    userId: req.user.id,
    _id: req.params.id,
  });
  if (!application) {
    return next(createCustomError("Application not found", 404));
  }
  res.status(200).send("Application Succesfully deleted");
});
