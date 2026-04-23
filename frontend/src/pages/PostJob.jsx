// src/pages/PostJob.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createJob } from "../features/jobSlice";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./PostJob.css";

export default function PostJob() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", location: "", type: "Full-time",
    experience: "Entry", company: "", skills: [],
    requirements: "", salary: { min: "", max: "" }, deadline: "",
  });

  useEffect(() => {
    api.get("/companies").then((r) => setCompanies(r.data.companies));
  }, []);

  const handle = (e) => {
    const { name, value } = e.target;
    if (name === "salaryMin") return setForm({ ...form, salary: { ...form.salary, min: value } });
    if (name === "salaryMax") return setForm({ ...form, salary: { ...form.salary, max: value } });
    setForm({ ...form, [name]: value });
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!form.skills.includes(skillInput.trim())) {
        setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter((x) => x !== s) });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.company) return toast.error("Please select a company");
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split("\n").filter(Boolean),
        salary: { min: Number(form.salary.min) * 100000, max: Number(form.salary.max) * 100000 },
      };
      await dispatch(createJob(payload)).unwrap();
      toast.success("Job posted successfully! 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err || "Failed to post job");
    }
  };

  return (
    <div className="post-job container">
      <div className="post-header">
        <h1>Post a New Job</h1>
        <p style={{ color: "var(--muted)" }}>Fill in the details to attract the right candidates</p>
      </div>

      <form onSubmit={submit} className="post-form card">
        <h3 className="section-title">Basic Information</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>Job Title *</label>
            <input name="title" value={form.title} onChange={handle} placeholder="e.g. Senior React Developer" required />
          </div>
          <div className="form-group">
            <label>Company *</label>
            <select name="company" value={form.company} onChange={handle} required>
              <option value="">Select Company</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {companies.length === 0 && (
              <p style={{ fontSize: 12, color: "var(--warning)", marginTop: 4 }}>
                No companies found. <a href="/companies" style={{ color: "var(--accent)" }}>Create one first</a>
              </p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Job Description *</label>
          <textarea
            name="description" rows={5} value={form.description}
            onChange={handle} placeholder="Describe the role, responsibilities, and what success looks like..."
            required style={{ resize: "vertical" }}
          />
        </div>

        <div className="form-group">
          <label>Requirements (one per line)</label>
          <textarea
            name="requirements" rows={4} value={form.requirements}
            onChange={handle} placeholder={"3+ years of React experience\nStrong TypeScript skills\nExperience with REST APIs"}
            style={{ resize: "vertical" }}
          />
        </div>

        <h3 className="section-title">Job Details</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>Location *</label>
            <input name="location" value={form.location} onChange={handle} placeholder="e.g. Bangalore / Remote" required />
          </div>
          <div className="form-group">
            <label>Job Type *</label>
            <select name="type" value={form.type} onChange={handle}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
          </div>
          <div className="form-group">
            <label>Experience Level</label>
            <select name="experience" value={form.experience} onChange={handle}>
              <option>Entry</option>
              <option>Mid</option>
              <option>Senior</option>
              <option>Lead</option>
            </select>
          </div>
          <div className="form-group">
            <label>Application Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={handle} />
          </div>
        </div>

        <h3 className="section-title">Compensation</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>Min Salary (LPA)</label>
            <input name="salaryMin" type="number" value={form.salary.min} onChange={handle} placeholder="e.g. 8" />
          </div>
          <div className="form-group">
            <label>Max Salary (LPA)</label>
            <input name="salaryMax" type="number" value={form.salary.max} onChange={handle} placeholder="e.g. 15" />
          </div>
        </div>

        <h3 className="section-title">Skills</h3>
        <div className="form-group">
          <label>Add Skills (press Enter)</label>
          <input
            value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={addSkill} placeholder="e.g. React, Node.js, MongoDB..."
          />
          {form.skills.length > 0 && (
            <div className="skills-list">
              {form.skills.map((s) => (
                <span key={s} className="skill-tag">
                  {s} <button type="button" onClick={() => removeSkill(s)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="post-actions">
          <button type="submit" className="btn btn-primary" style={{ padding: "12px 32px" }}>
            🚀 Publish Job
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
