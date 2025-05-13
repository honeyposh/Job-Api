const { createCustomError } = require("../errors/customApiError");
const Job = require("../models/job");
const asyncWrapper = require("../middleware/ayncWrapper");
const User = require("../models/user");
exports.createJob = asyncWrapper(async (req, res, next) => {
  const { title, company, location, description } = req.body;
  if (!title || !company || !location || !description) {
    return next(
      createCustomError(
        "title, company, location, description are require",
        400
      )
    );
  }
  const job = await Job.create({
    title,
    company,
    location,
    description,
    createdBy: req.user._id,
  });
  res.status(201).json({ job });
});
// exports.getAllJobs = asyncWrapper(async (req, res, next) => {
//   const job = await Job.find({ createdBy: req.user._id });
//   if (!job) {
//     return next(createCustomError("Job not found", 404));
//   }
//   res.status(201).json({ nbHit: job.length, job });
// });
exports.getAllJobs = asyncWrapper(async (req, res, next) => {
  const { title, company, location, description, sort } = req.query;
  const queryObject = {};
  if (title) {
    queryObject.title = { $regex: title, $options: "i" };
  }
  if (company) {
    queryObject.company = { $regex: company, $options: "i" };
  }
  if (location) {
    queryObject.location = { $regex: location, $options: "i" };
  }
  if (description) {
    queryObject.description = { $regex: description, $options: "i" };
  }
  let result = Job.find(queryObject);
  if (sort) {
    const sortList = sort.split(" , ").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("-createdAt");
  }

  const jobs = await result;
  res.status(200).json({ nbHit: jobs.length, jobs });
});
exports.getJob = asyncWrapper(async (req, res, next) => {
  const job = await Job.findOne({ _id: req.params.id });
  if (!job) {
    return next(createCustomError("Job not found", 404));
  }
  res.status(200).json(job);
});
exports.editJob = asyncWrapper(async (req, res, next) => {
  console.log(req.user.id);
  const { title, description, company, location } = req.body;
  const job = await Job.findOneAndUpdate(
    { createdBy: req.user.id, _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!job) {
    if (!job) {
      return next(createCustomError("Job not found", 404));
    }
  }
  res.status(200).json({ success: true, job });
});
exports.deleteJob = asyncWrapper(async (req, res, next) => {
  const job = await Job.findOneAndDelete({
    createdBy: req.user.id,
    _id: req.params.id,
  });
  if (!job) {
    return next(createCustomError("Job not found", 404));
  }
  res.status(200).send("Job Succesfully deleted");
});
