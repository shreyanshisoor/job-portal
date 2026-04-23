// routes/jobs.js — RESTful CRUD (Experiments 5, 7)
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { protect, authorize } = require("../middleware/auth");

// @route  GET /api/jobs
// @access Public — with search & filters
router.get("/", async (req, res) => {
  try {
    const { search, type, experience, location, minSalary, maxSalary, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (search)     query.$text = { $search: search };
    if (type)       query.type = type;
    if (experience) query.experience = experience;
    if (location)   query.location = new RegExp(location, "i");
    if (minSalary)  query["salary.min"] = { $gte: Number(minSalary) };
    if (maxSalary)  query["salary.max"] = { $lte: Number(maxSalary) };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate("company", "name logo location")
      .populate("postedBy", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/jobs/:id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("postedBy", "name email");

    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/jobs
// @access Recruiter only
router.post("/", protect, authorize("recruiter"), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/jobs/:id
// @access Recruiter (owner only)
router.put("/:id", protect, authorize("recruiter"), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route  DELETE /api/jobs/:id
// @access Recruiter (owner only)
router.delete("/:id", protect, authorize("recruiter"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    await job.deleteOne();
    res.json({ success: true, message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
