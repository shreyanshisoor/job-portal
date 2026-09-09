# 🚀 SeekForGeeks

A full-stack recruitment platform built with the MERN stack that connects job seekers with recruiters through role-based dashboards, job listings, applications, company management, and secure authentication.

> Built with React, Redux Toolkit, Node.js, Express, MongoDB, and JWT authentication.

---

## ✨ Features

### 👤 Job Seekers
- Register and log in securely
- Browse available job listings
- Search and filter jobs
- View detailed job information
- Apply for jobs
- Track submitted applications
- Save and unsave jobs
- Update profile information

### 🧑‍💼 Recruiters
- Register and log in as a recruiter
- Create and manage companies
- Post new job opportunities
- Update and delete job listings
- View applicants for posted jobs
- Update application status
- Manage recruiter profile

### 🔐 Authentication & Authorization
- JWT-based authentication
- Password hashing
- Protected routes
- Role-based authorization
- Separate Job Seeker and Recruiter workflows

---

## 🛠️ Tech Stack

### Frontend

- React 18
- React Router
- Redux Toolkit
- Axios
- React Toastify
- Custom CSS

### Backend

- Node.js
- Express.js
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- express-validator

### Database

- MongoDB

### Tools

- Git
- GitHub
- Postman
- VS Code

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React App      │
                    │   Redux Toolkit     │
                    └──────────┬──────────┘
                               │
                           Axios / HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express REST API  │
                    │   JWT Middleware    │
                    └──────────┬──────────┘
                               │
                            Mongoose
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    └─────────────────────┘

---

SeekForGeeks/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Company.js
│   │   └── Application.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── companies.js
│   │   ├── applications.js
│   │   └── users.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── features/
│       │   ├── authSlice.js
│       │   └── jobSlice.js
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Jobs.jsx
│       │   ├── JobDetail.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── PostJob.jsx
│       │   ├── Profile.jsx
│       │   └── Companies.jsx
│       │
│       ├── utils/
│       │   └── api.js
│       │
│       ├── store.js
│       └── App.js
│
└── README.md

---

🔌 API Endpoints

Authentication
| Method | Endpoint             | Access  | Description           |
| ------ | -------------------- | ------- | --------------------- |
| POST   | `/api/auth/register` | Public  | Register a new user   |
| POST   | `/api/auth/login`    | Public  | Login and receive JWT |
| GET    | `/api/auth/me`       | Private | Get current user      |

Jobs
| Method | Endpoint        | Access    | Description      |
| ------ | --------------- | --------- | ---------------- |
| GET    | `/api/jobs`     | Public    | Get all jobs     |
| GET    | `/api/jobs/:id` | Public    | Get a single job |
| POST   | `/api/jobs`     | Recruiter | Create a job     |
| PUT    | `/api/jobs/:id` | Recruiter | Update a job     |
| DELETE | `/api/jobs/:id` | Recruiter | Delete a job     |

Applications
| Method | Endpoint                       | Access     | Description               |
| ------ | ------------------------------ | ---------- | ------------------------- |
| POST   | `/api/applications/:jobId`     | Job Seeker | Apply for a job           |
| GET    | `/api/applications/my`         | Job Seeker | View my applications      |
| GET    | `/api/applications/job/:jobId` | Recruiter  | View applicants           |
| PUT    | `/api/applications/:id/status` | Recruiter  | Update application status |

Companies
| Method | Endpoint             | Access    | Description    |
| ------ | -------------------- | --------- | -------------- |
| GET    | `/api/companies`     | Public    | View companies |
| POST   | `/api/companies`     | Recruiter | Create company |
| PUT    | `/api/companies/:id` | Recruiter | Update company |

Users
| Method | Endpoint                  | Access     | Description         |
| ------ | ------------------------- | ---------- | ------------------- |
| PUT    | `/api/users/profile`      | Private    | Update user profile |
| POST   | `/api/users/save-job/:id` | Job Seeker | Save or unsave job  |
| GET    | `/api/users/saved-jobs`   | Job Seeker | View saved jobs     |

---

⚙️ Getting Started

Prerequisites

Make sure you have installed:
    Node.js 18+
    MongoDB or MongoDB Atlas
    Git

1. Clone the repository
    git clone https://github.com/shreyanshisoor/SeekForGeeks.git
    cd SeekForGeeks

2. Install backend dependencies
    cd backend
    npm install
    (Create a .env file using .env.example.)

    Example:

        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        PORT=5000

        *Never commit your real .env file.

3. Install frontend dependencies
    cd ../frontend
    npm install

4. Start the backend
    cd backend
    npm run dev

    The backend runs on:
        http://localhost:5000

5. Start the frontend
    cd frontend
    npm start

    The application runs on:
        http://localhost:3000

---

🔑 Demo Access

The application supports separate Job Seeker and Recruiter roles.

For local testing, create an account through the registration flow.

---

📸 Screenshots

Screenshots of the application will be added here.

Home Page
<!-- Add screenshot here -->
Job Listings
<!-- Add screenshot here -->
Job Seeker Dashboard
<!-- Add screenshot here -->
Recruiter Dashboard
<!-- Add screenshot here -->

----

🚧 Future Improvements
    Live deployment
    Resume upload support
    Advanced search and filters
    Pagination
    Email notifications
    Recruiter analytics dashboard
    Password reset flow
    Improved responsive design
    Automated testing
    CI/CD with GitHub Actions

---

👩‍💻 Author

Shreyanshi Soor
GitHub: @shreyanshisoor

----

⭐ Support

If you found this project useful or interesting, consider giving the repository a star.
