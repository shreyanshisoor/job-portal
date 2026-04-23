// routes/applications.js
const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const { protect, authorize } = require("../middleware/auth");

// @route  POST /api/applications/:jobId
// @access Job Seeker
router.post("/:jobId", protect, authorize("jobseeker"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const existing = await Application.findOne({ job: req.params.jobId, applicant: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: "Already applied" });

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter,
      resume: req.body.resume,
    });

    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicantsCount: 1 } });
    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route  GET /api/applications/my
// @access Job Seeker — their own applications
router.get("/my", protect, authorize("jobseeker"), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({ path: "job", populate: { path: "company", select: "name logo" } })
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/applications/job/:jobId
// @access Recruiter — see all applicants for a job
router.get("/job/:jobId", protect, authorize("recruiter"), async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email profile")
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/applications/:id/status
// @access Recruiter
router.put("/:id/status", protect, authorize("recruiter"), async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    res.json({ success: true, application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
