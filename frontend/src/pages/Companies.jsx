// src/pages/Companies.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./Companies.css";

export default function Companies() {
  const { user } = useSelector((s) => s.auth);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", website: "", location: "", industry: "", size: "11-50" });

  useEffect(() => {
    api.get("/companies")
      .then((r) => setCompanies(r.data.companies))
      .finally(() => setLoading(false));
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/companies", form);
      setCompanies([...companies, res.data.company]);
      setShowForm(false);
      setForm({ name: "", description: "", website: "", location: "", industry: "", size: "11-50" });
      toast.success("Company created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create company");
    }
  };

  return (
    <div className="companies-page container">
      <div className="companies-header">
        <div>
          <h1>Companies</h1>
          <p style={{ color: "var(--muted)" }}>{companies.length} companies hiring now</p>
        </div>
        {user?.role === "recruiter" && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancel" : "+ Add Company"}
          </button>
        )}
      </div>

      {/* Create Company Form */}
      {showForm && (
        <div className="card company-form">
          <h3 style={{ marginBottom: 20 }}>Register Your Company</h3>
          <form onSubmit={submit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Company Name *</label>
                <input name="name" value={form.name} onChange={handle} required />
              </div>
              <div className="form-group">
                <label>Industry</label>
                <input name="industry" value={form.industry} onChange={handle} placeholder="e.g. Software, Finance" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input name="location" value={form.location} onChange={handle} placeholder="City, Country" />
              </div>
              <div className="form-group">
                <label>Company Size</label>
                <select name="size" value={form.size} onChange={handle}>
                  <option>1-10</option><option>11-50</option>
                  <option>51-200</option><option>201-500</option><option>500+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Website</label>
                <input name="website" value={form.website} onChange={handle} placeholder="https://..." />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" rows={3} value={form.description} onChange={handle} style={{ resize: "vertical" }} />
            </div>
            <button type="submit" className="btn btn-primary">Create Company</button>
          </form>
        </div>
      )}

      {/* Companies Grid */}
      {loading ? (
        <div className="companies-grid">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" style={{ height: 180 }} />)}
        </div>
      ) : companies.length === 0 ? (
        <div className="empty-state card">
          <span>🏢</span>
          <p>No companies registered yet.</p>
        </div>
      ) : (
        <div className="companies-grid">
          {companies.map((c) => (
            <div key={c._id} className="company-card card">
              <div className="company-logo-wrap">
                {c.logo
                  ? <img src={c.logo} alt={c.name} />
                  : <span>{c.name[0]}</span>
                }
              </div>
              <h3>{c.name}</h3>
              {c.industry && <p className="company-industry">{c.industry}</p>}
              {c.location && <p className="company-loc">📍 {c.location}</p>}
              {c.size && <span className="badge badge-purple">{c.size} employees</span>}
              {c.description && (
                <p className="company-desc">{c.description.slice(0, 100)}{c.description.length > 100 ? "..." : ""}</p>
              )}
              {c.website && (
                <a href={c.website} target="_blank" rel="noreferrer"
                  className="btn btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: 12 }}>
                  Visit Website
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
