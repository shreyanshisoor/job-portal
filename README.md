# 🚀 SeekForGeeks — Full Stack Job Portal

A complete full-stack Job Portal built with the MERN stack (MongoDB, Express, React, Node.js).  
Covers all 8 experiments of the Full Stack Development syllabus.

---

## 📁 Project Structure

```
job-portal/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   └── db.js             # MongoDB connection (Exp 6)
│   ├── middleware/
│   │   └── auth.js           # JWT protect + authorize (Exp 8)
│   ├── models/               # Mongoose schemas (Exp 7)
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Company.js
│   │   └── Application.js
│   ├── routes/               # RESTful API routes (Exp 5)
│   │   ├── auth.js           # /api/auth
│   │   ├── jobs.js           # /api/jobs
│   │   ├── companies.js      # /api/companies
│   │   ├── applications.js   # /api/applications
│   │   └── users.js          # /api/users
│   ├── .env.example
│   ├── package.json
│   └── server.js             # Express entry point (Exp 5)
│
└── frontend/                 # React.js app
    └── src/
        ├── components/
        │   ├── Navbar/       # Sticky responsive navbar (Exp 4)
        │   ├── JobCard/      # Reusable job card component (Exp 4)
        │   └── FilterPanel/  # Search filters (Exp 4)
        ├── features/
        │   ├── authSlice.js  # Redux auth state (Exp 8)
        │   └── jobSlice.js   # Redux jobs state (Exp 8)
        ├── pages/
        │   ├── Home.jsx      # Landing page (Exp 2, 3)
        │   ├── Jobs.jsx      # Job listing + search (Exp 4)
        │   ├── JobDetail.jsx # Job detail + apply modal (Exp 4, 8)
        │   ├── Login.jsx     # Login form (Exp 4, 8)
        │   ├── Register.jsx  # Register with role selection (Exp 4)
        │   ├── Dashboard.jsx # Role-based dashboard (Exp 4, 8)
        │   ├── PostJob.jsx   # Post a job (Recruiter) (Exp 4)
        │   ├── Profile.jsx   # Edit profile (Exp 4)
        │   └── Companies.jsx # Browse & create companies (Exp 4)
        ├── utils/
        │   └── api.js        # Axios instance + JWT interceptor (Exp 8)
        ├── store.js          # Redux store (Exp 8)
        └── App.js            # Routing + protected routes (Exp 4)
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cd ../frontend
npm install
```

### 2. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm start
```

### 3. Open in Browser
```
http://localhost:3000
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint             | Access  | Description       |
|--------|----------------------|---------|-------------------|
| POST   | /api/auth/register   | Public  | Register user     |
| POST   | /api/auth/login      | Public  | Login + get JWT   |
| GET    | /api/auth/me         | Private | Get current user  |

### Jobs
| Method | Endpoint       | Access    | Description           |
|--------|----------------|-----------|-----------------------|
| GET    | /api/jobs      | Public    | List jobs (filters)   |
| GET    | /api/jobs/:id  | Public    | Get single job        |
| POST   | /api/jobs      | Recruiter | Post new job          |
| PUT    | /api/jobs/:id  | Recruiter | Update job            |
| DELETE | /api/jobs/:id  | Recruiter | Delete job            |

### Applications
| Method | Endpoint                      | Access    | Description              |
|--------|-------------------------------|-----------|--------------------------|
| POST   | /api/applications/:jobId      | Seeker    | Apply to a job           |
| GET    | /api/applications/my          | Seeker    | My applications          |
| GET    | /api/applications/job/:jobId  | Recruiter | All applicants for a job |
| PUT    | /api/applications/:id/status  | Recruiter | Update status            |

### Companies
| Method | Endpoint           | Access    | Description        |
|--------|--------------------|-----------|--------------------|
| GET    | /api/companies     | Public    | List all companies |
| POST   | /api/companies     | Recruiter | Create company     |
| PUT    | /api/companies/:id | Recruiter | Update company     |

### Users
| Method | Endpoint                 | Access  | Description       |
|--------|--------------------------|---------|-------------------|
| PUT    | /api/users/profile       | Private | Update profile    |
| POST   | /api/users/save-job/:id  | Seeker  | Save/unsave job   |
| GET    | /api/users/saved-jobs    | Seeker  | Get saved jobs    |

---

## 🗂️ Experiment Coverage

| Experiment | Topics Covered | Where in Project |
|---|---|---|
| Exp 1 | VS Code, Git, Postman, Node.js setup | README setup section |
| Exp 2 | HTML structure, semantic tags, CSS Flexbox/Grid, responsive | All CSS files, index.css |
| Exp 3 | JS variables, loops, DOM manipulation | React components (useEffect, map, filter) |
| Exp 4 | React components, props, state, events, forms, API calls | All pages & components |
| Exp 5 | Express server, middleware, routing, REST APIs | server.js, all routes/ |
| Exp 6 | MongoDB, connecting backend with database | config/db.js |
| Exp 7 | CRUD operations, Mongoose ORM | models/, all route handlers |
| Exp 8 | JWT auth, role-based access, Redux state management | middleware/auth.js, features/ |

---

## 👤 Test Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Job Seeker | seeker@test.com | password123 |
| Recruiter | recruiter@test.com | password123 |

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router v6, Redux Toolkit, Axios, React Toastify  
**Backend:** Node.js, Express.js, Mongoose, bcryptjs, jsonwebtoken, express-validator  
**Database:** MongoDB  
**Styling:** Custom CSS with CSS variables (dark theme)
