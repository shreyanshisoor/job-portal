// src/components/JobCard/JobCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./JobCard.css";

const typeColor = {
  "Full-time": "badge-green",
  "Part-time": "badge-yellow",
  "Remote": "badge-purple",
  "Internship": "badge-yellow",
  "Contract": "badge-red",
};

export default function JobCard({ job, onSave, isSaved }) {
  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt)) / 86400000);

  return (
    <div className="job-card card">
      <div className="job-card-header">
        <div className="company-logo">
          {job.company?.logo
            ? <img src={job.company.logo} alt={job.company?.name} />
            : <span>{job.company?.name?.[0] || "?"}</span>
          }
        </div>
        <div className="job-meta">
          <p className="company-name">{job.company?.name || "Company"}</p>
          <p className="job-location">📍 {job.location}</p>
        </div>
        {onSave && (
          <button className={`save-btn ${isSaved ? "saved" : ""}`} onClick={() => onSave(job._id)}>
            {isSaved ? "♥" : "♡"}
          </button>
        )}
      </div>

      <Link to={`/jobs/${job._id}`} className="job-title">{job.title}</Link>

      <div className="job-tags">
        <span className={`badge ${typeColor[job.type] || "badge-purple"}`}>{job.type}</span>
        {job.experience && <span className="badge badge-purple">{job.experience}</span>}
        {job.salary?.min && (
          <span className="badge badge-green">
            ₹{(job.salary.min / 100000).toFixed(1)}L – ₹{(job.salary.max / 100000).toFixed(1)}L
          </span>
        )}
      </div>

      {job.skills?.length > 0 && (
        <div className="job-skills">
          {job.skills.slice(0, 4).map((s) => (
            <span key={s} className="skill-chip">{s}</span>
          ))}
          {job.skills.length > 4 && <span className="skill-chip">+{job.skills.length - 4}</span>}
        </div>
      )}

      <div className="job-card-footer">
        <span className="time-ago">{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}</span>
        <Link to={`/jobs/${job._id}`} className="btn btn-outline" style={{padding:"7px 16px", fontSize:"13px"}}>
          View Details →
        </Link>
      </div>
    </div>
  );
}
