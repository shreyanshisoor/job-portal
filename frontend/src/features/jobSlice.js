// src/features/jobSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchJobs = createAsyncThunk("jobs/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/jobs?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs");
  }
});

export const fetchJobById = createAsyncThunk("jobs/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/jobs/${id}`);
    return res.data.job;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createJob = createAsyncThunk("jobs/create", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/jobs", data);
    return res.data.job;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteJob = createAsyncThunk("jobs/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/jobs/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const jobSlice = createSlice({
  name: "jobs",
  initialState: { jobs: [], currentJob: null, total: 0, loading: false, error: null },
  reducers: {
    clearCurrentJob(state) { state.currentJob = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending,      (s) => { s.loading = true; })
      .addCase(fetchJobs.fulfilled,    (s, a) => { s.loading = false; s.jobs = a.payload.jobs; s.total = a.payload.total; })
      .addCase(fetchJobs.rejected,     (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchJobById.fulfilled, (s, a) => { s.currentJob = a.payload; })
      .addCase(createJob.fulfilled,    (s, a) => { s.jobs.unshift(a.payload); })
      .addCase(deleteJob.fulfilled,    (s, a) => { s.jobs = s.jobs.filter((j) => j._id !== a.payload); });
  },
});

export const { clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
