const asyncWrapper = require("../middleware/ayncWrapper");
const { createCustomError } = require("../errors/customApiError");
const Application = require("../models/application");
exports.getAllApplications = asyncWrapper(async (req, res, next) => {
  const applications = await Application.find({ userId: req.user.id })
    .populate("jobId", "position company")
    .populate("userId", "name")
    .sort({ createdAt: -1 });
  if (!applications.length) {
    return next(createCustomError("No applications found", 404));
  }
  res.status(200).json({ nbHit: applications.length, applications });
});
exports.applyForJob = asyncWrapper(async (req, res, next) => {
  const jobId = req.params.jobId;
  const { resume, coverLetter } = req.body;
  if (!resume || !coverLetter || !jobId) {
    return next(
      createCustomError("resume, coverletter, jobId are required", 400)
    );
  }
  const application = await Application.create({
    resume,
    coverLetter,
    userId: req.user.id,
    jobId,
  });
  res.json({ message: "Application Successful", application });
});
exports.editApplication = asyncWrapper(async (req, res, next) => {
  const { resume, coverLetter } = req.body;
  const application = await Application.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if ("jobId" in req.body) {
    return next(
      createCustomError("You cannot change the jobId of an application", 400)
    );
  }
  if (!application) {
    return next(createCustomError("No application", 404));
  }
  res
    .status(200)
    .json({ message: "Application successfully updataed", application });
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
