// models/Job.js
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true },
    description:  { type: String, required: true },
    requirements: [String],
    company:      { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    postedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location:     { type: String, required: true },
    type:         { type: String, enum: ["Full-time", "Part-time", "Remote", "Internship", "Contract"], required: true },
    experience:   { type: String, enum: ["Entry", "Mid", "Senior", "Lead"] },
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: "INR" },
    },
    skills:    [String],
    deadline:  Date,
    isActive:  { type: Boolean, default: true },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Full-text search index
JobSchema.index({ title: "text", description: "text", skills: "text" });

module.exports = mongoose.model("Job", JobSchema);
