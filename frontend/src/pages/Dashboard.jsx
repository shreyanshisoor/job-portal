// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./Dashboard.css";

const STATUS_COLORS = {
  Applied: "badge-purple", Reviewed: "badge-yellow",
  Shortlisted: "badge-green", Rejected: "badge-red", Hired: "badge-green",
};

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user.role === "jobseeker") {
          const res = await api.get("/applications/my");
          setData(res.data.applications);
        } else {
          const res = await api.get("/jobs");
          setData(res.data.jobs.filter((j) => j.postedBy?._id === user.id || j.postedBy === user.id));
        }
      } catch { toast.error("Failed to load dashboard"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [user]);

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      toast.success("Status updated");
    } catch { toast.error("Failed to update"); }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setData((p) => p.filter((j) => j._id !== jobId));
      toast.success("Job deleted");
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="dashboard container">
      <div className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{color:"var(--muted)"}}>Welcome back, {user.name} 👋</p>
        </div>
        {user.role === "recruiter" && (
          <Link to="/post-job" className="btn btn-primary">+ Post New Job</Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="dash-stats">
        <div className="stat-card card">
          <span className="stat-icon">📋</span>
          <div>
            <p className="stat-num">{data.length}</p>
            <p className="stat-lbl">{user.role === "jobseeker" ? "Applications" : "Jobs Posted"}</p>
          </div>
        </div>
        {user.role === "jobseeker" && (
          <>
            <div className="stat-card card">
              <span className="stat-icon">✅</span>
              <div>
                <p className="stat-num">{data.filter(a => a.status === "Shortlisted").length}</p>
                <p className="stat-lbl">Shortlisted</p>
              </div>
            </div>
            <div className="stat-card card">
              <span className="stat-icon">🎯</span>
              <div>
                <p className="stat-num">{data.filter(a => a.status === "Hired").length}</p>
                <p className="stat-lbl">Offers</p>
              </div>
            </div>
          </>
        )}
        {user.role === "recruiter" && (
          <div className="stat-card card">
            <span className="stat-icon">👥</span>
            <div>
              <p className="stat-num">{data.reduce((a, j) => a + (j.applicantsCount || 0), 0)}</p>
              <p className="stat-lbl">Total Applicants</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="dash-table card">
        <h2 style={{marginBottom:20}}>
          {user.role === "jobseeker" ? "My Applications" : "My Job Listings"}
        </h2>

        {loading ? <p style={{color:"var(--muted)"}}>Loading...</p> : data.length === 0 ? (
          <div className="empty-state">
            <span>{user.role === "jobseeker" ? "📝" : "💼"}</span>
            <p>{user.role === "jobseeker" ? "No applications yet. Start applying!" : "No jobs posted yet."}</p>
            <Link to={user.role === "jobseeker" ? "/jobs" : "/post-job"} className="btn btn-primary" style={{marginTop:16}}>
              {user.role === "jobseeker" ? "Browse Jobs" : "Post a Job"}
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {user.role === "jobseeker"
                    ? <><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></>
                    : <><th>Job Title</th><th>Type</th><th>Applicants</th><th>Actions</th></>
                  }
                </tr>
              </thead>
              <tbody>
                {user.role === "jobseeker"
                  ? data.map((app) => (
                    <tr key={app._id}>
                      <td><Link to={`/jobs/${app.job?._id}`} className="table-link">{app.job?.title}</Link></td>
                      <td>{app.job?.company?.name}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td><span className={`badge ${STATUS_COLORS[app.status]}`}>{app.status}</span></td>
                    </tr>
                  ))
                  : data.map((job) => (
                    <tr key={job._id}>
                      <td><Link to={`/jobs/${job._id}`} className="table-link">{job.title}</Link></td>
                      <td><span className="badge badge-purple">{job.type}</span></td>
                      <td>{job.applicantsCount}</td>
                      <td>
                        <div style={{display:"flex",gap:8}}>
                          <Link to={`/jobs/${job._id}`} className="btn btn-outline" style={{padding:"5px 12px",fontSize:12}}>View</Link>
                          <button onClick={() => deleteJob(job._id)} className="btn btn-danger" style={{padding:"5px 12px",fontSize:12}}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
