const path = require('path');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ── Middleware (Experiment 5) ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ── Routes ────────────────────────────────────────────────────────
app.use("/api/auth",         require("./routes/auth"));
app.use("/api/jobs",         require("./routes/jobs"));
app.use("/api/companies",    require("./routes/companies"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/users",        require("./routes/users"));
app.use(express.static(path.join(__dirname, 'public')));

// ── Global Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
