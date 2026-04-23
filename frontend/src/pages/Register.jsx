// src/pages/Register.jsx
import logo from '../logo.png';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../features/authSlice";
import { toast } from "react-toastify";
import "./Auth.css";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "jobseeker" });

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo"><img src={logo} alt="SeekForGeeks" style={{height:'36px'}} /></div>
        <h2>Create account</h2>
        <p className="auth-sub">Join thousands of professionals</p>

        {/* Role Selector */}
        <div className="role-selector">
          {["jobseeker", "recruiter"].map((r) => (
            <button
              key={r} type="button"
              className={`role-btn ${form.role === r ? "active" : ""}`}
              onClick={() => setForm({ ...form, role: r })}
            >
              {r === "jobseeker" ? "👤 Job Seeker" : "🏢 Recruiter"}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); dispatch(registerUser(form)); }}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handle} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
