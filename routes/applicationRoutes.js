const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
  applyToJob, 
  getMyApplications, 
  getApplicationsForJob,
  downloadCV 
} = require("../controllers/applicationController");
const upload = require("../middleware/uploadMiddleware");

// Apply to a job
router.post("/:jobId", protect, upload.single("cv"), applyToJob);

// Get my applications (for candidates)
router.get("/", protect, getMyApplications);

// Get applications for a specific job (for companies)
router.get("/job/:jobId", protect, getApplicationsForJob);

// Download CV
router.get("/download/:filename", protect, downloadCV);

module.exports = router;