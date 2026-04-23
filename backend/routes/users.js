// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// @route  PUT /api/users/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile: req.body.profile, name: req.body.name },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route  POST /api/users/save-job/:jobId
router.post("/save-job/:jobId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const alreadySaved = user.savedJobs.includes(req.params.jobId);

    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== req.params.jobId);
    } else {
      user.savedJobs.push(req.params.jobId);
    }
    await user.save();
    res.json({ success: true, savedJobs: user.savedJobs, action: alreadySaved ? "unsaved" : "saved" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route  GET /api/users/saved-jobs
router.get("/saved-jobs", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedJobs",
      populate: { path: "company", select: "name logo" },
    });
    res.json({ success: true, savedJobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
