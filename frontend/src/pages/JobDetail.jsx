// src/pages/JobDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById } from "../features/jobSlice";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./JobDetail.css";

export default function JobDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob: job } = useSelector((s) => s.jobs);
  const { user } = useSelector((s) => s.auth);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ coverLetter: "", resume: "" });
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => { dispatch(fetchJobById(id)); }, [id, dispatch]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setSubmitting(true);
    try {
      await api.post(`/applications/${id}`, form);
      toast.success("Application submitted! 🎉");
      setApplied(true);
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return <div className="container" style={{padding:"80px 0",textAlign:"center",color:"var(--muted)"}}>Loading...</div>;

  return (
    <div className="job-detail container">
      <button className="back-btn" onClick={() => navigate("/jobs")}>← Back to Jobs</button>

      <div className="detail-layout">
        {/* Main Content */}
        <article className="detail-main card">
          <div className="detail-header">
            <div className="company-logo-lg">
              {job.company?.logo
                ? <img src={job.company.logo} alt={job.company.name} />
                : <span>{job.company?.name?.[0]}</span>
              }
            </div>
            <div>
              <h1>{job.title}</h1>
              <p className="detail-company">{job.company?.name} · {job.location}</p>
            </div>
          </div>

          <div className="detail-tags">
            <span className="badge badge-purple">{job.type}</span>
            {job.experience && <span className="badge badge-green">{job.experience} Level</span>}
            {job.salary?.min && (
              <span className="badge badge-yellow">
                ₹{(job.salary.min/100000).toFixed(1)}L – ₹{(job.salary.max/100000).toFixed(1)}L / year
              </span>
            )}
          </div>

          <div className="detail-section">
            <h3>Job Description</h3>
            <p style={{color:"var(--muted)", lineHeight:1.7}}>{job.description}</p>
          </div>

          {job.requirements?.length > 0 && (
            <div className="detail-section">
              <h3>Requirements</h3>
              <ul className="requirements-list">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {job.skills?.length > 0 && (
            <div className="detail-section">
              <h3>Skills Required</h3>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
                {job.skills.map((s) => (
                  <span key={s} className="badge badge-purple">{s}</span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside>
          <div className="card apply-card">
            <h3>Apply for this role</h3>
            <p style={{color:"var(--muted)",fontSize:14,margin:"8px 0 20px"}}>
              {job.applicantsCount} people have applied
            </p>
            {applied ? (
              <div className="badge badge-green" style={{display:"block",textAlign:"center",padding:12}}>
                ✅ Application Submitted
              </div>
            ) : (
              <button
                className="btn btn-primary"
                style={{width:"100%",justifyContent:"center"}}
                onClick={() => user ? setShowModal(true) : navigate("/login")}
              >
                Apply Now
              </button>
            )}
            {job.deadline && (
              <p style={{fontSize:12,color:"var(--muted)",marginTop:12,textAlign:"center"}}>
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="card" style={{marginTop:16}}>
            <h3 style={{marginBottom:12}}>About {job.company?.name}</h3>
            <p style={{color:"var(--muted)",fontSize:14,lineHeight:1.6}}>{job.company?.description || "No description available."}</p>
            {job.company?.website && (
              <a href={job.company.website} target="_blank" rel="noreferrer"
                className="btn btn-outline" style={{width:"100%",justifyContent:"center",marginTop:14}}>
                Visit Website
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h2>Apply for {job.title}</h2>
            <p style={{color:"var(--muted)",marginBottom:20}}>at {job.company?.name}</p>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Resume URL</label>
                <input
                  placeholder="https://your-resume-link.com"
                  value={form.resume}
                  onChange={(e) => setForm({...form, resume: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea
                  rows={5} placeholder="Tell them why you're a great fit..."
                  value={form.coverLetter}
                  onChange={(e) => setForm({...form, coverLetter: e.target.value})}
                  style={{resize:"vertical"}}
                />
              </div>
              <div style={{display:"flex",gap:12}}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
