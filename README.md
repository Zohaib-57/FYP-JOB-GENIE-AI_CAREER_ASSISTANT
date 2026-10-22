# 🧞 JobGenie — AI-Powered Career Assistant

> An intelligent, full-stack web application that uses **Qwen AI**, with Google Gemini as an automatic fallback, to help job seekers build resumes, evaluate CVs, and discover relevant job opportunities.

**Final Year Project (FYP) — BS Software Engineering**

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Proposed Solution](#-proposed-solution)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [AI Agents Overview](#-ai-agents-overview)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Authentication & Security](#-authentication--security)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [References](#-references)

---

## 🔍 Project Overview

**JobGenie** is a web-based career assistance platform designed to address the growing challenges job seekers face in today's competitive employment landscape. The application integrates three distinct **AI-powered agents** — each solving a specific pain point in the job application process:

1. **AI Resume Generator** — Creates professional, ATS-optimized resumes from user input
2. **AI Resume Scorer** — Analyzes uploaded resumes and provides detailed ATS compatibility scores
3. **AI Job Finder** — Extracts skills from resumes and matches them with real-time job listings

The platform uses **Qwen** as its primary model for content generation and structured extraction, with **Google Gemini 2.5 Flash** as an automatic fallback. The frontend is built with **React.js** and **Vite**; the backend runs on **Node.js with Express.js** and **MongoDB**.

---

## ❓ Problem Statement

Job seekers today face several critical challenges:

1. **Resume Quality Gap** — Many candidates lack the expertise to create professional, ATS-friendly resumes. Studies show that over 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them (Jobscan, 2023).

2. **Lack of Feedback** — Candidates submit resumes without knowing how they will perform against ATS algorithms. There is no accessible, instant feedback mechanism for the average job seeker.

3. **Job Discovery Inefficiency** — Searching for relevant jobs across multiple platforms (LinkedIn, Indeed, Glassdoor) is time-consuming. Candidates often apply to mismatched roles because they lack tools to objectively assess skill-to-job alignment.

4. **Cost Barriers** — Professional resume writing services charge $100–$400 per resume. AI-powered tools can democratize access to this expertise at zero cost.

---

## 💡 Proposed Solution

JobGenie solves these problems by unifying three AI agents into a single platform:

| Problem                | Agent                   | Solution                                                                                                                                      |
| ---------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Poor resume quality    | **AI Resume Generator** | Generates professionally written, ATS-optimized resumes from structured user input using Qwen, with Gemini fallback                           |
| No ATS feedback        | **AI Resume Scorer**    | Uploads an existing resume (PDF), analyzes it across 5 ATS dimensions, and provides an actionable score with specific improvement suggestions |
| Inefficient job search | **AI Job Finder**       | Parses resume text, extracts a job title and skills using Qwen, then searches Pakistan listings through JSearch |

The user interacts through a clean, modern dark-themed interface with smooth animations. All AI processing happens server-side through secure, authenticated API endpoints.

---

## ✨ Key Features

### Core Functionality

- **AI Resume Generation** — Fill in a structured form (personal info, experience, education, skills) → AI generates a complete, formatted resume → Export as PDF using the browser's native Print-to-PDF engine
- **AI Resume Scoring** — Upload a PDF resume → AI analyzes ATS compatibility, keyword density, experience quality, education, and formatting → Returns a score out of 100 with section-level breakdowns, strengths, and improvement suggestions
- **AI Job Matching** — Upload a PDF resume → AI extracts a job title and top skills → Searches JSearch through RapidAPI for Pakistan listings → Displays matching jobs with direct apply links

### User Experience

- **JWT Authentication** — Secure signup/login with password hashing (bcrypt) and JSON Web Token sessions (7-day expiry)
- **Responsive Design** — Fully mobile and desktop responsive using Tailwind CSS v4
- **Interactive Animations** — Custom HTML5 Canvas particle backgrounds, orbital rings, and a hand-crafted SVG robot assistant with blinking eyes and waving arms
- **Print-Ready Export** — Clean A4 resume layout with optimized CSS print styles for zero-margin PDF export
- **Sequential UX Flow** — Consistent Form → Loading → Result pattern across all three AI modules

### Security

- **Protected API Routes** — All AI endpoints require valid JWT tokens via auth middleware
- **CORS Restriction** — API only accepts requests from the configured frontend origin
- **Environment Variables** — All secrets (API keys, JWT secret, database URI) stored in `.env` files, excluded from version control via `.gitignore`
- **Input Validation** — File type filtering (PDF/DOCX only), file size limits (5MB), and form field validation

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                     │
│              React.js + Vite + Tailwind CSS              │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Login/   │  │  Resume   │  │  Resume   │  │  Job    │ │
│  │  Signup   │  │ Generator │  │  Scorer   │  │ Finder  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │              │              │              │      │
│       └──────────────┴──────┬───────┴──────────────┘      │
│                             │                             │
│              fetch() + Authorization: Bearer <JWT>        │
└─────────────────────────────┬─────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVER (Backend)                        │
│              Node.js + Express.js (Port 5000)            │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   Middleware Layer                    │ │
│  │  CORS Filter → JSON Parser → JWT Auth → Multer      │ │
│  └─────────────────────────┬───────────────────────────┘ │
│                             │                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ /api/auth │  │/api/resume│  │ /api/jobs │               │
│  │  signup   │  │  generate │  │   find    │               │
│  │  login    │  │  score    │  │           │               │
│  │  me       │  │           │  │           │               │
│  └────┬─────┘  └─────┬─────┘  └─────┬────┘               │
│       │               │              │                    │
│       ▼               ▼              ▼                    │
│  ┌────────┐   ┌──────────────┐  ┌──────────────┐        │
│  │MongoDB │   │ Qwen → Gemini│  │ JSearch API   │        │
│  │ Users  │   │  AI fallback │  │ JSearch API   │        │
│  │        │   │              │  │ (RapidAPI)    │        │
│  └────────┘   └──────────────┘  └───────────────┘        │
└─────────────────────────────────────────────────────────┘
```

### Data Flow — Resume Generation (Example)

1. User fills in the multi-section form on the frontend (name, experience, education, skills)
2. Frontend sends a `POST` request to `/api/resume/generate` with form data + JWT token
3. Backend **auth middleware** validates the JWT token
4. Backend constructs a detailed prompt with the user's data and strict output schema instructions
5. Prompt is sent to **Qwen** in JSON mode; if Qwen fails or returns invalid output, the backend retries with **Gemini**
6. The first provider returning a valid resume object is used
7. Backend validates the response structure and sends it to the frontend
8. Frontend renders the resume in a styled A4 paper layout
9. User clicks "Export PDF" → browser's native `window.print()` generates a clean PDF

---

## 🛠️ Technology Stack

### Frontend

| Technology           | Version | Purpose                                     |
| -------------------- | ------- | ------------------------------------------- |
| **React.js**         | 19.x    | Component-based UI framework                |
| **Vite**             | 8.x     | Lightning-fast build tool and dev server    |
| **Tailwind CSS**     | 4.x     | Utility-first CSS framework                 |
| **React Router DOM** | 7.x     | Client-side routing and navigation          |
| **Lucide React**     | 1.x     | Modern icon library (replacing react-icons) |
| **HTML5 Canvas**     | Native  | Custom animated particle backgrounds        |

### Backend

| Technology          | Version | Purpose                                       |
| ------------------- | ------- | --------------------------------------------- |
| **Node.js**         | 20.19+  | JavaScript runtime for server-side execution  |
| **Express.js**      | 5.x     | Minimal, flexible web framework for REST APIs |
| **MongoDB**         | 7.x     | NoSQL document database for user storage      |
| **Mongoose**        | 9.x     | MongoDB ODM (Object Document Modeling)        |
| **JSON Web Tokens** | 9.x     | Stateless authentication tokens               |
| **bcrypt.js**       | 3.x     | Password hashing (10 salt rounds)             |
| **Multer**          | 2.x     | File upload handling (PDF/DOCX)               |
| **pdf-parse**       | 1.x     | PDF text extraction for scoring/job matching  |

### AI & External APIs

| Service              | Model/Plan       | Purpose                                                         |
| -------------------- | ---------------- | --------------------------------------------------------------- |
| **Qwen API**         | qwen-plus        | Primary resume generation, analysis, and skill extraction       |
| **Google Gemini AI** | gemini-2.5-flash | Automatic fallback when Qwen fails                              |
| **JSearch API**      | RapidAPI         | Pakistan job listing search                                     |

---

## 🤖 AI Agents Overview

### Agent 1: Resume Generator

**Input:** Structured form data (name, contact info, experiences, education, skills, languages)

**AI Task:** Generate a professional summary, rewrite raw responsibilities into metrics-driven bullet points, and structure all data into a strict JSON schema.

**Prompt Engineering Strategy:**

- Strict JSON-only output enforced via `responseMimeType: "application/json"`
- Anti-hallucination rules: "DO NOT invent, hallucinate, or fabricate ANY details"
- Exact output schema provided in the prompt to guarantee consistent structure
- Role-tailored summary generation based on the target job title

**Output:** Complete resume JSON object rendered into a styled A4 template

---

### Agent 2: Resume Scorer

**Input:** Uploaded PDF resume file

**AI Task:** Analyze the resume across 5 ATS (Applicant Tracking System) dimensions and provide scores with actionable feedback.

**Scoring Dimensions:**

1. **ATS Compatibility** — Structural compliance with tracking systems
2. **Keywords** — Industry-relevant technical keyword density
3. **Experience** — Quality and impact of work experience descriptions
4. **Education** — Academic qualifications and relevance
5. **Formatting** — Layout consistency, section balance, and readability

**Output:** Overall score (0–100), per-section scores with feedback, top strengths, and specific improvement suggestions

---

### Agent 3: Job Finder

**Input:** Uploaded PDF or DOCX resume file

**AI Task:** Read the resume text and extract a grounded primary role, adjacent roles, relevant experience summary, skills, and job-search keywords.

**Pipeline:**

1. Text extraction from PDF or DOCX
2. Qwen analyzes the resume and returns the candidate profile; Gemini is tried automatically if Qwen fails
3. Searches JSearch through RapidAPI for the primary role and up to two related roles in Pakistan
4. Deduplicates and ranks listings using job-title, resume-skill, and keyword overlap
5. Returns up to 20 ranked matches with an estimated score and an explanation of matching terms

**Output:** Resume-based Pakistan job listings, plus the extracted profile and the reasons each listing matched. Search scores are heuristic estimates, not guarantees of suitability.

---

## 📁 Project Structure

```
JobGenie/
├── backend/                          # Express.js REST API Server
│   ├── db/
│   │   └── db.js                     # MongoDB connection setup
│   ├── middleware/
│   │   ├── auth.js                   # JWT authentication middleware
│   │   └── upload.js                 # Multer file upload config (PDF/DOCX, 5MB limit)
│   ├── models/
│   │   └── user.js                   # Mongoose User schema (name, email, password)
│   ├── routes/
│   │   ├── auth.js                   # POST /signup, POST /login, GET /me
│   │   ├── resume.js                 # POST /generate (auth), POST /score (auth)
│   │   └── jobs.js                   # POST /find (auth)
│   ├── services/
│   ├── .env                          # Environment variables (git-ignored)
│   ├── .env.example                  # Template with placeholder values
│   ├── .gitignore                    # Excludes .env, node_modules
│   ├── package.json                  # Backend dependencies
│   └── server.js                     # Express app entry point (CORS, routes, DB)
│
├── frontend/                          # React.js Frontend (Vite)
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── Home.jsx              # Landing page with hero, stats, feature cards
│   │   │   ├── Login.jsx             # Login form with robot assistant
│   │   │   ├── Signup.jsx            # Registration form with robot assistant
│   │   │   ├── Generate.jsx          # AI Resume Builder (form → loading → result)
│   │   │   ├── Score.jsx             # AI Resume Scorer (upload → loading → dashboard)
│   │   │   ├── Jobs.jsx              # AI Job Finder (upload → loading → job cards)
│   │   │   ├── Navbar.jsx            # Navigation with mobile responsive menu
│   │   │   ├── HeroAnimation.jsx     # Canvas-based particle + orbit animation
│   │   │   ├── ParticleBackground.jsx# Full-screen particle canvas for auth pages
│   │   │   └── RobotAssistant.jsx    # Animated SVG robot with speech bubble
│   │   ├── App.jsx                   # Root component with routing + auth state
│   │   ├── main.jsx                  # React DOM entry point
│   │   └── index.css                 # Global styles, animations, print rules
│   ├── .env                          # VITE_API_URL (git-ignored)
│   ├── .gitignore                    # Excludes .env, node_modules, dist
│   ├── index.html                    # HTML entry point
│   ├── vite.config.js                # Vite configuration
│   └── package.json                  # Frontend dependencies
│
└── README.md                         # This file
```

---

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId,              // Auto-generated MongoDB ID
  name: String,               // Required — User's full name
  email: String,              // Required, Unique — User's email address
  password: String,           // Required — bcrypt hashed (10 salt rounds)
  createdAt: Date,            // Auto-generated timestamp
  updatedAt: Date             // Auto-updated timestamp
}
```

> **Note:** The application stores user authentication data in MongoDB. Generated resumes and scores are rendered client-side and are not persisted in the database.

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:5000
```

### Authentication Endpoints (Public)

| Method | Endpoint           | Body                        | Response                                      |
| ------ | ------------------ | --------------------------- | --------------------------------------------- |
| `POST` | `/api/auth/signup` | `{ name, email, password }` | `{ message: "User registered successfully" }` |
| `POST` | `/api/auth/login`  | `{ email, password }`       | `{ token, user: { id, name, email } }`        |
| `GET`  | `/api/auth/me`     | — (Bearer token in header)  | `{ user: { id, name, email } }`               |

### Protected Endpoints (Require `Authorization: Bearer <token>`)

| Method | Endpoint               | Body                                                         | Response                                                                           |
| ------ | ---------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `POST` | `/api/resume/generate` | JSON: `{ name, email, phone, jobTitle, experiences[], ... }` | `{ success, resume: { name, summary, experience[], education[], skills[], ... } }` |
| `POST` | `/api/resume/score`    | FormData: `resume` (PDF or DOCX file)                        | `{ success, scoreData: { overallScore, sections, improvements[], strengths[] } }`  |
| `POST` | `/api/jobs/find`       | FormData: `resume` (PDF or DOCX file)                        | `{ success, jobTitle, relatedJobTitles[], experienceSummary, skills[], keywords[], jobs[], count, searchQueries[], searchWarnings[] }` |

### Error Response Format

```json
{
	"message": "Human-readable error description"
}
```

Common HTTP status codes: `400` (validation), `401` (unauthorized), `429` (rate limit), `500` (server error)

---

## 🔐 Authentication & Security

### Authentication Flow

```
1. User signs up → password hashed with bcrypt (10 rounds) → stored in MongoDB
2. User logs in → credentials verified → JWT token issued (7-day expiry)
3. The JWT is stored in an HttpOnly cookie and is not readable by frontend JavaScript
4. The browser sends the cookie with protected API requests
5. Auth middleware decodes and verifies the JWT on each request
6. If the token is expired or invalid → 401 Unauthorized response
```

### Security Measures Implemented

| Measure               | Implementation                                                       |
| --------------------- | -------------------------------------------------------------------- |
| Password Hashing      | bcrypt.js with 10 salt rounds                                        |
| Token-Based Auth      | JWT in an HttpOnly, SameSite cookie with a 7-day expiry              |
| CORS Restriction      | API only accepts requests from `CLIENT_URL` (configured in `.env`)   |
| Environment Variables | All secrets in `.env`, excluded from git via `.gitignore`            |
| File Validation       | Only PDF/DOCX accepted, max 5MB file size                            |
| API Key Protection    | `.env.example` provided with placeholders; real keys never committed |

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v20.19 or higher
- **MongoDB** installed locally or a MongoDB Atlas cloud URI
- **Qwen API Key** (from Alibaba Cloud Model Studio)
- **Google Gemini API Key** (fallback provider, from [Google AI Studio](https://aistudio.google.com/))
- **JSearch API Key** (from [RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch))

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/JobGenie.git
cd JobGenie
```

### Step 2: Setup Backend

```bash
cd backend
npm install

# Create environment file from template (PowerShell)
Copy-Item .env.example .env

# Edit .env and add your real API keys:
# - QWEN_API_KEY (primary provider)
# - QWEN_BASE_URL (must match the key's Model Studio region)
# - GEMINI_API_KEY (automatic fallback)
# - JSEARCH_API_KEY (for Pakistan job listings)
# - JWT_SECRET (any random string)
# - MONGO_URI

# Generate a strong JWT secret locally, then put the output in backend/.env:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Step 3: Setup Frontend

```bash
cd ../frontend
npm install

# Create frontend/.env and add: VITE_API_URL=http://localhost:5000
```

### Step 4: Start MongoDB

```bash
# If using local MongoDB:
mongod

# Or use MongoDB Atlas URI in your .env
```

### Step 5: Run the Application

```bash
# Terminal 1 — Start Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Start Frontend (port 5173)
cd frontend
npm run dev
```

### Step 6: Open in Browser

```
http://localhost:5173
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable          | Description                | Example                                                  |
| ----------------- | -------------------------- | -------------------------------------------------------- |
| `MONGO_URI`       | MongoDB connection string  | `mongodb://localhost:27017/JobGenie`                     |
| `JWT_SECRET`      | Secret key for JWT signing | `your_random_secret_key`                                 |
| `QWEN_API_KEY`    | Primary Qwen API key       | `sk-...`                                                 |
| `QWEN_BASE_URL`   | Regional Qwen API endpoint | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| `QWEN_MODEL`      | Qwen model name            | `qwen-plus`                                              |
| `GEMINI_API_KEY`  | Automatic fallback key     | `AIza...`                                                |
| `GEMINI_MODEL`    | Fallback model name        | `gemini-2.5-flash`                                       |
| `JSEARCH_API_KEY` | JSearch RapidAPI key for Pakistan listings | `your-key`                                   |
| `NODE_ENV`        | Environment mode           | `development`                                            |
| `PORT`            | Server port                | `5000`                                                   |
| `CLIENT_URL`      | Frontend URL for CORS      | `http://localhost:5173`                                  |

### Frontend (`frontend/.env`)

| Variable       | Description          | Example                 |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## ☁️ Deployment (Render + Vercel)

Deploy the backend as a Render Web Service and the frontend as a Vercel project. Do not put backend secrets in Vercel environment variables or commit either `.env` file.

### 1. Deploy the backend to Render

1. Push the project to a GitHub repository and create a **Web Service** in Render from that repository.
2. Set **Root Directory** to `backend`, **Build Command** to `npm ci`, and **Start Command** to `npm start`. The service health-check path can be `/`.
3. Add these environment variables in the Render dashboard:

   | Variable | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | A long, random secret generated locally |
   | `CLIENT_URL` | Your Vercel production origin, such as `https://your-app.vercel.app` |
   | `QWEN_API_KEY` or `GEMINI_API_KEY` | At least one AI provider key |
   | `JSEARCH_API_KEY` | Required for job search |

   `PORT` is assigned by Render; do not set it manually. Keep all secret values in Render's environment settings. Ensure your MongoDB Atlas network access settings allow connections from the Render service.
4. Deploy, then open the Render service URL (for example, `https://your-api.onrender.com`) and confirm it returns an `API Running` status.

### 2. Deploy the frontend to Vercel

1. Import the same GitHub repository into Vercel.
2. Set **Root Directory** to `frontend`. Use the Vite defaults: build command `npm run build` and output directory `dist`.
3. Add the `VITE_API_URL` environment variable with the Render service URL, without a trailing slash (for example, `https://your-api.onrender.com`).
4. Deploy and copy the production domain Vercel assigns to your project.

### 3. Connect the deployed services

Set Render's `CLIENT_URL` to the exact Vercel production origin (`https://...`, with no path or trailing slash), then redeploy the backend. If you use a custom frontend domain, set `CLIENT_URL` to that origin instead. The frontend's Vercel rewrite supports client-side routes such as `/login` and `/jobs` on refresh.

Production auth cookies use `SameSite=None; Secure` so browsers can send them between the separate Vercel and Render domains. The frontend environment variable contains only the public API URL; never put API keys or other secrets in a `VITE_*` variable.

Finally, verify signup/login, refreshing a protected route, resume generation/scoring, and job search. A free Render service may sleep when idle, so its first request after inactivity can take longer.

---

## 📸 Screenshots

> Add your own screenshots here for the thesis document:

1. **Login Page** — Dark theme with animated robot assistant and particle background
2. **Home Page** — Hero section with gradient text, animated canvas, and feature cards
3. **Resume Generator** — Multi-section form with experience cards and validation
4. **Generated Resume** — A4 paper preview with professional typography and purple accents
5. **Resume Scorer** — Circular score visualization with section breakdowns and progress bars
6. **Job Finder** — Job listing cards with company logos, locations, and apply links

---

## 🔮 Future Enhancements

| #   | Feature                       | Description                                                                                                     | Priority |
| --- | ----------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **Resume Storage**            | Save generated resumes to MongoDB and allow users to view/edit past resumes from a dashboard                    | High     |
| 2   | **Multiple Templates**        | Offer 3–4 resume templates (Modern, Classic, Minimal, Creative) with template preview and selection             | High     |
| 3   | **Cover Letter Generator**    | 4th AI agent — paste a job description + upload resume → AI generates a tailored cover letter                   | High     |
| 4   | **Resume vs Job Description** | Paste a specific job posting → AI compares your resume against it → shows match percentage and missing keywords | High     |
| 5   | **Inline Resume Editing**     | Allow users to click and edit any section of the generated resume before exporting                              | Medium   |
| 6   | **AI Interview Prep**         | 5th AI agent — generates likely interview questions with suggested answers based on resume and target role      | Medium   |
| 7   | **Toast Notifications**       | Replace browser `alert()` dialogs with a modern toast notification system                                       | Medium   |
| 8   | **LinkedIn Import**           | Auto-fill resume form by importing LinkedIn profile data                                                        | Low      |
| 9   | **Multi-Language Support**    | Generate resumes in different languages (Urdu, Arabic, French, etc.)                                            | Low      |
| 10  | **Analytics Dashboard**       | Track resume score improvements over time with visual charts                                                    | Low      |

---

## 📚 References

1. Google. (2024). _Gemini API Documentation_. https://ai.google.dev/docs
2. MongoDB. (2024). _Mongoose ODM Documentation_. https://mongoosejs.com/docs/
3. Express.js. (2024). _Express.js API Reference_. https://expressjs.com/en/api.html
4. Vite. (2024). _Vite Build Tool Documentation_. https://vitejs.dev/guide/
5. React. (2024). _React Documentation_. https://react.dev/
6. Tailwind CSS. (2024). _Tailwind CSS v4 Documentation_. https://tailwindcss.com/docs
7. RapidAPI. (2024). _JSearch API — Job Search Aggregator_. https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
8. Jobscan. (2023). _ATS Resume Statistics_. https://www.jobscan.co/
9. Auth0. (2024). _JSON Web Tokens (JWT) Introduction_. https://jwt.io/introduction

---

## 👨‍💻 Author

**Muhammad Umair**

- GitHub: [MuhammadUmair151601](https://github.com/MuhammadUmair151601)
- LinkedIn: [muhammad-umair-a7b10a2b2](https://www.linkedin.com/in/muhammad-umair-a7b10a2b2/)
- Email: muhammadumair4105@gmail.com

---

## 📄 License

This project is developed as an academic Final Year Project (FYP). All rights reserved.

---

> _Built with React, Express, MongoDB, Qwen, and Gemini fallback_
# FYP-JOB-GENIE-AI_CAREER_ASSISTANT
