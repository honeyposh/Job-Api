const express = require("express");
const uploadDocuments = require("../middleware/multer");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const {
  getAllApplications,
  editApplication,
  deleteApplication,
  applyForJob,
} = require("../controllers/application");
router.get("/", authMiddleware, getAllApplications);
router.post("/:jobId", authMiddleware, uploadDocuments, applyForJob);
router.delete("/:id", authMiddleware, deleteApplication);
router.patch("/:id", authMiddleware, uploadDocuments, editApplication);
module.exports = router;
