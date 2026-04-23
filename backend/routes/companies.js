// routes/companies.js
const express = require("express");
const router = express.Router();
const Company = require("../models/Company");
const { protect, authorize } = require("../middleware/auth");

router.get("/", async (req, res) => {
  const companies = await Company.find().populate("owner", "name");
  res.json({ success: true, companies });
});

router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate("owner", "name email");
    if (!company) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", protect, authorize("recruiter"), async (req, res) => {
  try {
    const company = await Company.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, company });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/:id", protect, authorize("recruiter"), async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!company) return res.status(404).json({ success: false, message: "Not found or not authorized" });
    res.json({ success: true, company });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
