// src/components/Navbar/Navbar.jsx
import logo from '../../logo.png';
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";
import "./Navbar.css";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="SeekForGeeks" style={{height: '42px'}} />
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <li><Link to="/jobs"      className={isActive("/jobs")}>Browse Jobs</Link></li>
          <li><Link to="/companies" className={isActive("/companies")}>Companies</Link></li>
          {user && <li><Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link></li>}
          {user?.role === "recruiter" && (
            <li><Link to="/post-job" className="btn btn-outline" style={{padding:"8px 16px"}}>Post a Job</Link></li>
          )}
        </ul>

        <div className={`navbar-actions ${menuOpen ? "open" : ""}`}>
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-avatar">{user.name[0].toUpperCase()}</Link>
              <div className="user-dropdown">
                <p className="user-name">{user.name}</p>
                <p className="user-role">{user.role}</p>
                <hr />
                <Link to="/profile">My Profile</Link>
                <Link to="/dashboard">Dashboard</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
