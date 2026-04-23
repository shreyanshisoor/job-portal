// backend/seed.js — Run: node seed.js
// Populates DB with demo companies, jobs, and users
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Company = require("./models/Company");
const Job = require("./models/Job");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // Clean existing
  await Promise.all([User.deleteMany(), Company.deleteMany(), Job.deleteMany()]);

  // Create users
  const seeker = await User.create({
    name: "Arjun Sharma", email: "seeker@test.com", password: "password123", role: "jobseeker",
    profile: { skills: ["React", "Node.js", "MongoDB"], location: "Bangalore", experience: "2 years" },
  });
  const recruiter = await User.create({
    name: "Priya Mehta", email: "recruiter@test.com", password: "password123", role: "recruiter",
  });

  // Create companies
  const companies = await Company.insertMany([
    { name: "TechCorp India", description: "Leading software company building next-gen SaaS products.", location: "Bangalore", industry: "Software", size: "201-500", owner: recruiter._id },
    { name: "FinStack", description: "Fintech startup revolutionizing payments in India.", location: "Mumbai", industry: "Fintech", size: "51-200", owner: recruiter._id },
    { name: "DataMinds", description: "AI & Data Science consulting firm.", location: "Hyderabad", industry: "AI/ML", size: "11-50", owner: recruiter._id },
  ]);

  // Create jobs
  await Job.insertMany([
    {
      title: "Senior React Developer", description: "Build scalable frontend applications using React and TypeScript. Work with a cross-functional team to ship features fast.",
      requirements: ["4+ years React experience", "TypeScript proficiency", "REST API integration"],
      company: companies[0]._id, postedBy: recruiter._id, location: "Bangalore",
      type: "Full-time", experience: "Senior", skills: ["React", "TypeScript", "Redux", "Node.js"],
      salary: { min: 1200000, max: 1800000 }, applicantsCount: 12,
    },
    {
      title: "Backend Engineer - Node.js", description: "Design and build RESTful APIs and microservices. Own the architecture of our payment processing systems.",
      requirements: ["3+ years Node.js", "MongoDB or PostgreSQL", "Microservices experience"],
      company: companies[1]._id, postedBy: recruiter._id, location: "Mumbai",
      type: "Full-time", experience: "Mid", skills: ["Node.js", "Express", "MongoDB", "Docker"],
      salary: { min: 900000, max: 1400000 }, applicantsCount: 8,
    },
    {
      title: "ML Engineer", description: "Build and deploy machine learning models. Work on NLP, recommendation systems, and predictive analytics.",
      requirements: ["Python & TensorFlow", "MLOps experience", "Strong math background"],
      company: companies[2]._id, postedBy: recruiter._id, location: "Hyderabad",
      type: "Full-time", experience: "Mid", skills: ["Python", "TensorFlow", "PyTorch", "SQL"],
      salary: { min: 1000000, max: 1600000 }, applicantsCount: 5,
    },
    {
      title: "Frontend Intern", description: "Join our frontend team for a 6-month internship. Learn from senior engineers and ship real features.",
      requirements: ["React basics", "CSS/HTML skills", "Eagerness to learn"],
      company: companies[0]._id, postedBy: recruiter._id, location: "Remote",
      type: "Internship", experience: "Entry", skills: ["React", "CSS", "JavaScript"],
      salary: { min: 25000, max: 40000 }, applicantsCount: 24,
    },
    {
      title: "DevOps Engineer", description: "Manage our cloud infrastructure on AWS. Set up CI/CD pipelines and ensure 99.9% uptime.",
      requirements: ["AWS certified", "Kubernetes experience", "Terraform knowledge"],
      company: companies[1]._id, postedBy: recruiter._id, location: "Remote",
      type: "Remote", experience: "Senior", skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
      salary: { min: 1400000, max: 2200000 }, applicantsCount: 3,
    },
    {
      title: "Full Stack Developer", description: "End-to-end feature development across our React frontend and Node.js backend. Startup environment — high ownership.",
      requirements: ["React + Node.js", "SQL or NoSQL", "Git workflow"],
      company: companies[2]._id, postedBy: recruiter._id, location: "Bangalore",
      type: "Full-time", experience: "Mid", skills: ["React", "Node.js", "MongoDB", "Git"],
      salary: { min: 700000, max: 1200000 }, applicantsCount: 17,
    },
  ]);

  console.log("✅ Seed complete!");
  console.log("  Job Seeker → seeker@test.com / password123");
  console.log("  Recruiter  → recruiter@test.com / password123");
  mongoose.disconnect();
};

seed().catch((e) => { console.error(e); process.exit(1); });
