const express = require("express");
const router = express.Router();

const { applyToJob, getApplications, downloadCV } = require("../controllers/applicationController");
const upload = require("../middleware/uploadMiddleware");

router.post("/:jobid", upload.single("cv"), applyToJob);

router.get("/", getApplications);

router.get("/download/:filename", downloadCV);

module.exports = router;