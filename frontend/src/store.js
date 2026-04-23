// src/store.js — Redux Toolkit (Experiment 8)
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import jobReducer from "./features/jobSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
  },
});
