// models/Company.js
const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: String,
    website:     String,
    logo:        String,
    location:    String,
    industry:    String,
    size:        { type: String, enum: ["1-10", "11-50", "51-200", "201-500", "500+"] },
    owner:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
