// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../features/jobSlice";
import JobCard from "../components/JobCard/JobCard";
import "./Home.css";

const stats = [
  { label: "Jobs Posted",   value: "12,400+" },
  { label: "Companies",     value: "3,200+"  },
  { label: "Hired This Month", value: "870+" },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading } = useSelector((s) => s.jobs);
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(fetchJobs({ limit: 6 })); }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-dots" />
        <div className="container hero-content">
          <span className="hero-eyebrow">🚀 India's #1 internship & job portal</span>
          <h1>Find your next<br /><span className="gradient-text">dream job</span></h1>
          <p>Browse thousands of curated opportunities from top companies. Apply in seconds.</p>

          <form onSubmit={handleSearch} className="search-bar">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job title, skill, or company..."
            />
            <button type="submit" className="btn btn-primary">Search Jobs</button>
          </form>

          <div className="hero-tags">
            {["React", "Node.js", "Python", "Data Science", "UI/UX", "DevOps"].map((t) => (
              <button key={t} className="tag-chip" onClick={() => navigate(`/jobs?search=${t}`)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container stats-inner">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="featured-jobs container">
        <div className="section-header">
          <h2>Featured Jobs</h2>
          <button className="btn btn-outline" onClick={() => navigate("/jobs")}>View all →</button>
        </div>
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="cta-section container">
        <div className="cta-card card">
          <h2>Hiring talent?</h2>
          <p>Post your job openings and reach thousands of qualified candidates instantly.</p>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Post a Job Free →
          </button>
        </div>
      </section>
    </div>
  );
}
