// src/components/FilterPanel/FilterPanel.jsx
import React, { useState } from "react";
import "./FilterPanel.css";

export default function FilterPanel({ onFilter }) {
  const [filters, setFilters] = useState({
    type: "", experience: "", location: "", minSalary: "", maxSalary: "",
  });

  const handle = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    onFilter(updated);
  };

  const reset = () => {
    const cleared = { type: "", experience: "", location: "", minSalary: "", maxSalary: "" };
    setFilters(cleared);
    onFilter(cleared);
  };

  return (
    <aside className="filter-panel card">
      <div className="filter-header">
        <h3>Filters</h3>
        <button onClick={reset} className="reset-btn">Reset</button>
      </div>

      <div className="filter-group">
        <label>Job Type</label>
        <select name="type" value={filters.type} onChange={handle}>
          <option value="">All Types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Remote</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Experience Level</label>
        <select name="experience" value={filters.experience} onChange={handle}>
          <option value="">All Levels</option>
          <option>Entry</option>
          <option>Mid</option>
          <option>Senior</option>
          <option>Lead</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Location</label>
        <input name="location" placeholder="e.g. Bangalore" value={filters.location} onChange={handle} />
      </div>

      <div className="filter-group">
        <label>Salary Range (₹ LPA)</label>
        <div style={{display:"flex", gap:8}}>
          <input name="minSalary" type="number" placeholder="Min" value={filters.minSalary} onChange={handle} />
          <input name="maxSalary" type="number" placeholder="Max" value={filters.maxSalary} onChange={handle} />
        </div>
      </div>
    </aside>
  );
}
