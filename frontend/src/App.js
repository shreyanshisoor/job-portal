// src/App.js — React Router DOM v6 (Experiment 4)
import logo from './logo.png';
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostJob from "./pages/PostJob";
import Profile from "./pages/Profile";
import Companies from "./pages/Companies";

// Protected route wrapper
const PrivateRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/jobs"      element={<Jobs />} />
        <Route path="/jobs/:id"  element={<JobDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />

        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />
        <Route path="/post-job" element={
          <PrivateRoute role="recruiter"><PostJob /></PrivateRoute>
        } />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{ background: "#161a23", border: "1px solid #252b38" }}
      />
    </BrowserRouter>
  );
}
