const express = require("express");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const {
  getAllApplications,
  editApplication,
  deleteApplication,
  applyForJob,
} = require("../controllers/application");
router.get("/", authMiddleware, getAllApplications);
router.post("/:jobId", authMiddleware, applyForJob);
router.delete("/:id", authMiddleware, deleteApplication);
router.patch("/:id", authMiddleware, editApplication);
module.exports = router;
