# SkillDNA 🧬

**SkillDNA** is not just another portfolio tracker — it's an evidence-based technical skill intelligence platform. Instead of relying on what a developer *claims* to know, SkillDNA analyzes real data from GitHub, LeetCode, and personal projects to determine what a developer can *actually* demonstrate.

> "What's your strongest skill?" — SkillDNA answers that question with evidence, not guesswork.

---

## 🎯 Problem It Solves

Most developers list skills on their resume without any way to verify or quantify them. SkillDNA solves this by:

- Pulling real data from GitHub (repositories, languages used)
- Pulling real data from LeetCode (problems solved, difficulty breakdown)
- Combining it with manually added projects
- Calculating an **evidence-based skill score** for each technology
- Comparing current skills against a chosen target role
- Generating a personalized learning roadmap for skill gaps

---

## 🧩 Features

### ✅ Authentication
- Secure Register/Login with JWT-based authentication
- Password hashing with bcrypt
- Protected routes (both backend middleware and frontend route guards)

### ✅ User Profile
- Target role, experience level, education
- GitHub & LeetCode username linking

### ✅ GitHub Analysis
- Fetches real repository and language data via the GitHub REST API
- Tracks total repos, stars, and language distribution

### ✅ LeetCode Analysis
- Fetches problem-solving stats via LeetCode's GraphQL API
- Tracks total solved, easy/medium/hard breakdown, and global ranking

### ✅ Project Management (CRUD)
- Add, view, and delete personal projects
- Each project includes tech stack, description, and links

### ✅ Skill Engine
- Combines GitHub, LeetCode, and Project data into a unified **Skill Score (0–100)** per technology
- Every score comes with **evidence** (e.g., "Used in 3 GitHub repositories", "Used in 2 projects")
- Calculates an overall skill score

### ✅ Skill Gap Analysis
- Compares your current skill scores against the requirements of your target role
- Flags each skill as 🟢 Good / 🟠 Improve / 🔴 Major Gap

### ✅ Personalized Roadmap
- Generates prioritized learning suggestions for skills with the biggest gaps

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing

**External APIs:**
- GitHub REST API
- LeetCode GraphQL API (unofficial endpoint)

**Architecture:**
- RESTful API design
- MVC-style folder structure (models, controllers, routes, middleware)
- Context API for frontend auth state management

---

## 📁 Project Structure
SkillDNA/
│
├── client/ # React frontend
│ └── src/
│ ├── components/ # Reusable components (ProtectedRoute, UI elements)
│ ├── context/ # Auth context
│ ├── pages/ # Register, Login, Dashboard
│ └── services/ # Axios API instance
│
├── server/ # Express backend
│ ├── config/ # Role requirements, learning resources
│ ├── controllers/ # Business logic
│ ├── middleware/ # JWT auth middleware
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ └── server.js # App entry point
│
└── README.md

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/Lovedeep466/SkillDNA.git
cd SkillDNA
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

The app should now be running at `http://localhost:5173` with the backend at `http://localhost:5000`.

---

## 🔌 API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/profile` | Get logged-in user's profile (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |
| POST | `/api/github/analyze` | Fetch & analyze GitHub data (protected) |
| POST | `/api/leetcode/analyze` | Fetch & analyze LeetCode data (protected) |
| POST | `/api/projects` | Create a project (protected) |
| GET | `/api/projects` | Get all user projects (protected) |
| PUT | `/api/projects/:id` | Update a project (protected) |
| DELETE | `/api/projects/:id` | Delete a project (protected) |
| POST | `/api/skills/calculate` | Calculate skill scores (protected) |
| GET | `/api/skill-gap` | Get skill gap vs target role (protected) |
| GET | `/api/roadmap` | Get personalized learning roadmap (protected) |

---

## 🗺️ Roadmap (Future Enhancements)

- [ ] AI-powered explanations for skill gaps (LLM integration)
- [ ] Skill history tracking (growth over time)
- [ ] UI/UX overhaul with a polished design system
- [ ] Deployment (Vercel + Render)
- [ ] Resume import for claimed-vs-actual skill comparison

---

## 👤 Author

**Lovedeep**
GitHub: [@Lovedeep466](https://github.com/Lovedeep466)