// src/pages/Jobs.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../features/jobSlice";
import JobCard from "../components/JobCard/JobCard";
import FilterPanel from "../components/FilterPanel/FilterPanel";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./Jobs.css";

export default function Jobs() {
  const dispatch = useDispatch();
  const { jobs, total, loading } = useSelector((s) => s.jobs);
  const { user } = useSelector((s) => s.auth);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);

  const load = useCallback((filters = {}) => {
    const params = { search, page, limit: 9, ...filters };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    dispatch(fetchJobs(params));
  }, [dispatch, search, page]);

  useEffect(() => { load(); }, [page]);

  useEffect(() => {
    if (user) {
      api.get("/users/saved-jobs").then((r) => setSavedJobs(r.data.savedJobs.map((j) => j._id)));
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleFilter = (filters) => {
    setPage(1);
    // Convert salary LPA to actual values
    const params = { ...filters };
    if (params.minSalary) params.minSalary = params.minSalary * 100000;
    if (params.maxSalary) params.maxSalary = params.maxSalary * 100000;
    load(params);
  };

  const handleSave = async (jobId) => {
    if (!user) return toast.info("Login to save jobs");
    try {
      const res = await api.post(`/users/save-job/${jobId}`);
      if (res.data.action === "saved") {
        setSavedJobs((p) => [...p, jobId]);
        toast.success("Job saved!");
      } else {
        setSavedJobs((p) => p.filter((id) => id !== jobId));
        toast.info("Job removed from saved");
      }
    } catch {
      toast.error("Error saving job");
    }
  };

  const totalPages = Math.ceil(total / 9);

  return (
    <div className="jobs-page container">
      <div className="jobs-header">
        <h1>Browse Jobs <span className="total-count">({total} found)</span></h1>
        <form onSubmit={handleSearch} className="search-inline">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, skill..."
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="jobs-layout">
        <FilterPanel onFilter={handleFilter} />

        <main>
          {loading ? (
            <div className="jobs-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" style={{height:220}} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <p>No jobs found. Try different filters.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onSave={handleSave}
                  isSaved={savedJobs.includes(job._id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span>{page} / {totalPages}</span>
              <button className="btn btn-outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
