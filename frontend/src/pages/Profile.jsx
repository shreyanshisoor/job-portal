// src/pages/Profile.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../features/authSlice";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./Profile.css";

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: user.name || "",
    profile: {
      bio: user.profile?.bio || "",
      location: user.profile?.location || "",
      phone: user.profile?.phone || "",
      experience: user.profile?.experience || "",
      resume: user.profile?.resume || "",
      skills: user.profile?.skills || [],
    },
  });
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handle = (e) => {
    const { name, value } = e.target;
    if (name in form.profile) {
      setForm({ ...form, profile: { ...form.profile, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const skills = form.profile.skills;
      if (!skills.includes(skillInput.trim())) {
        setForm({ ...form, profile: { ...form.profile, skills: [...skills, skillInput.trim()] } });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (s) =>
    setForm({ ...form, profile: { ...form.profile, skills: form.profile.skills.filter((x) => x !== s) } });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/profile", form);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <div className="profile-avatar">{user.name[0].toUpperCase()}</div>
        <div>
          <h1>{user.name}</h1>
          <span className={`badge ${user.role === "recruiter" ? "badge-green" : "badge-purple"}`}>
            {user.role}
          </span>
          <p style={{ color: "var(--muted)", marginTop: 4, fontSize: 14 }}>{user.email}</p>
        </div>
      </div>

      <form onSubmit={save} className="profile-form card">
        <h3 className="section-title">Personal Info</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.profile.phone} onChange={handle} placeholder="+91 98765 43210" />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input name="location" value={form.profile.location} onChange={handle} placeholder="City, State" />
          </div>
          {user.role === "jobseeker" && (
            <div className="form-group">
              <label>Experience</label>
              <input name="experience" value={form.profile.experience} onChange={handle} placeholder="e.g. 3 years in React" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio" rows={4} value={form.profile.bio}
            onChange={handle} placeholder="Tell recruiters about yourself..."
            style={{ resize: "vertical" }}
          />
        </div>

        {user.role === "jobseeker" && (
          <>
            <h3 className="section-title">Skills & Resume</h3>
            <div className="form-group">
              <label>Resume URL</label>
              <input name="resume" value={form.profile.resume} onChange={handle} placeholder="https://your-resume.pdf" />
            </div>
            <div className="form-group">
              <label>Skills (press Enter to add)</label>
              <input
                value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill} placeholder="e.g. React, Python..."
              />
              {form.profile.skills.length > 0 && (
                <div className="skills-list">
                  {form.profile.skills.map((s) => (
                    <span key={s} className="skill-tag">
                      {s} <button type="button" onClick={() => removeSkill(s)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
