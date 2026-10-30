# JobGenie

JobGenie is an AI-powered career assistant for creating resumes, reviewing resume readiness, and finding relevant jobs. It consists of a React frontend and an Express API backed by MongoDB.

## Features

- **Resume builder:** Enter career details, select one of three built-in layouts (Classic, Sidebar, or Modern), optionally add a profile photo, and generate resume content with AI. Export through the browser print dialog and choose **Save as PDF**.
- **Resume scoring:** Upload a PDF or DOCX to receive an overall score, five section scores, strengths, and a short prioritized improvement plan.
- **Scanned-PDF OCR:** PDFs with little or no selectable text are processed locally with English OCR. OCR is limited to 10 pages per document.
- **Job matching:** Extract a candidate profile from a PDF or DOCX, search Pakistan job listings through JSearch/RapidAPI, and rank matches using role, skill, and keyword overlap.
- **Accounts:** Sign up and log in with passwords hashed using bcrypt. Authenticated API requests use an HttpOnly JWT cookie.
- **Responsive interface:** React, Tailwind CSS, and mobile-friendly layouts.

AI-generated resume advice and match scores are estimates, not guarantees of ATS performance, job suitability, or employment outcomes. Review AI-generated content for accuracy before using it.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Tailwind CSS 4, Lucide |
| Backend | Node.js, Express 5, Mongoose, MongoDB |
| AI providers | Qwen through the OpenAI-compatible API; Google Gemini as provider fallback |
| Resume documents | `pdf-parse`, Mammoth, Poppler, Tesseract.js |
| Job listings | JSearch API through RapidAPI |

## Requirements

- Node.js **20.19 or newer** and npm
- MongoDB, either local or MongoDB Atlas
- At least one configured AI provider: Qwen or Gemini
- JSearch/RapidAPI credentials to use job matching
- Poppler (`pdftoppm`) on the backend host for OCR of scanned PDFs

On Ubuntu/Debian, install Poppler with:

```bash
sudo apt-get update
sudo apt-get install -y poppler-utils
```

Text-based PDFs and DOCX files do not need OCR. OCR is performed on the backend host, uses the bundled English model, and does not send the uploaded PDF to a separate OCR service.

## Quick start

### 1. Get the code and install dependencies

```bash
git clone https://github.com/Zohaib-57/FYP-JOB-GENIE-AI_CAREER_ASSISTANT.git
cd FYP-JOB-GENIE-AI_CAREER_ASSISTANT

cd backend
npm ci

cd ../frontend
npm ci
```

Install Poppler as shown above before testing OCR on scanned PDFs.

### 2. Configure the backend

Create `backend/.env`:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/JobGenie
JWT_SECRET=replace-with-a-long-random-secret

# Configure at least one AI provider.
QWEN_API_KEY=
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

# Needed for Find Jobs.
JSEARCH_API_KEY=

NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

Generate a strong JWT secret locally, then paste the result into `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

At least one of `QWEN_API_KEY` or `GEMINI_API_KEY` is required for AI features. Configure both to enable automatic provider fallback. `JSEARCH_API_KEY` is required for job listings.

### 3. Configure the frontend

Create `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000
```

Keep the frontend and API on the same local hostname: use `localhost` for both, or use `127.0.0.1` for both. The configured frontend origin must match `CLIENT_URL`.

### 4. Start MongoDB and the app

Start MongoDB, then run the backend and frontend in separate terminals:

```bash
# Terminal 1
cd backend
npm run dev
```

```bash
# Terminal 2
cd frontend
npm run dev
```

Open the frontend URL printed by Vite (normally <http://localhost:5173>). The API health check is available at <http://localhost:5000/>.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection URI. |
| `JWT_SECRET` | Yes | Secret used to sign seven-day session tokens. |
| `QWEN_API_KEY` | One AI key required | Qwen API credential. |
| `QWEN_BASE_URL` | No | OpenAI-compatible Qwen API endpoint; defaults to the international DashScope endpoint. |
| `QWEN_MODEL` | No | Qwen model name; defaults to `qwen-plus`. |
| `GEMINI_API_KEY` | One AI key required | Google Gemini API credential and fallback provider. |
| `GEMINI_MODEL` | No | Gemini model name; defaults to `gemini-2.5-flash`. |
| `JSEARCH_API_KEY` | For Find Jobs | RapidAPI key for the JSearch API. |
| `NODE_ENV` | No | Set to `production` when deployed. |
| `PORT` | No | Backend listening port; defaults to `5000`. |
| `CLIENT_URL` | Yes for deployment | Exact frontend origin allowed by the API's CORS policy. |
| `VITE_API_URL` | Yes | Frontend API base URL, injected when Vite runs/builds. |

Never commit `.env` files, API keys, database credentials, or JWT secrets. For deployment, configure variables in the hosting provider's secret/environment settings. Set `CLIENT_URL` to the deployed frontend origin and `VITE_API_URL` to the deployed API URL. Production authentication cookies require HTTPS.

## Application flow

1. A visitor creates an account or signs in.
2. The browser sends the HttpOnly session cookie with authenticated requests.
3. Resume generation sends the entered form data to the API, which asks the configured AI provider for structured resume content.
4. The user selects a built-in template and can preview the result. Browser printing preserves selectable text in exported PDFs; use **Save as PDF** in the print dialog.
5. Resume scoring and job matching accept PDF or DOCX uploads. The backend first extracts embedded PDF text; when there is too little text, it renders up to ten pages with Poppler and applies local English OCR.
6. Scoring returns the overall and section scores with concise feedback. Job matching extracts a profile and searches JSearch for relevant Pakistan listings.

Generated resumes, uploaded documents, and score reports are processed for the request and are not saved as user records in MongoDB. MongoDB stores account data only.

## API

The local API base URL is `http://localhost:5000`. JSON errors use a `message` field. Authentication routes are public; resume and job routes require a valid session cookie. AI endpoints are rate-limited to 10 requests per 15 minutes per client.

| Method | Endpoint | Authentication | Request |
| --- | --- | --- | --- |
| `GET` | `/` | No | API health check |
| `POST` | `/api/auth/register` | No | JSON: `{ "name", "email", "password" }` |
| `POST` | `/api/auth/login` | No | JSON: `{ "email", "password" }` |
| `POST` | `/api/auth/logout` | No | Clears the session cookie |
| `GET` | `/api/auth/me` | Yes | Returns the current user's public account details |
| `POST` | `/api/resume/generate` | Yes | JSON resume-builder form data |
| `POST` | `/api/resume/score` | Yes | Multipart form with a `resume` PDF or DOCX, up to 5 MB |
| `POST` | `/api/jobs/find` | Yes | Multipart form with a `resume` PDF or DOCX, up to 5 MB |

Successful login and registration responses contain the user and a session token; the browser-based app uses the HttpOnly cookie. Do not expose tokens in client-side storage or logs.

### Resume generation request

The JSON body accepts the resume-builder fields, including:

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "phone": "",
  "address": "",
  "zipCode": "",
  "linkedin": "",
  "github": "",
  "socialLink": "",
  "jobTitle": "Software Engineer",
  "highSchoolInfo": { "name": "", "percentage": "", "years": "" },
  "collegeInfo": { "name": "", "percentage": "", "years": "" },
  "experiences": [],
  "extraSkills": "JavaScript, Node.js",
  "languages": "English",
  "customSections": []
}
```

The generated resume content is returned in `resume`. Template selection and an optional profile photo are handled in the frontend and are not sent as part of this AI request.

### Resume score response

`/api/resume/score` returns `scoreData` with:

- `overallScore`: integer from 0 to 100
- `sections`: ATS compatibility, keywords, experience, education, and formatting scores with concise feedback
- `strengths`: up to three concise highlights
- `improvements`: up to four prioritized actions

Non-resume uploads are rejected rather than scored.

### Job matching response

`/api/jobs/find` returns the extracted primary and related job titles, experience summary, skills, keywords, ranked `jobs`, a result count, search queries, and any partial-search warnings. Match scores are heuristic comparisons against the job listing, not AI guarantees.

## Privacy and security

- Passwords are hashed with bcrypt before storage.
- Session JWTs are set as HttpOnly cookies and expire after seven days.
- AI and job-search credentials stay on the backend.
- Resume uploads are held in memory during the request. OCR page images are written to a temporary directory and removed after processing.
- PDF/DOCX uploads are limited to 5 MB. OCR is limited to ten PDF pages.
- User-controlled resume content is treated as document data by the AI prompts; do not follow instructions embedded in uploaded documents.

## Development and tests

```bash
# Frontend
cd frontend
npm run dev
npm run build
npm run lint

# Backend (in a separate terminal)
cd backend
npm run dev
npm test
```

Backend tests cover searchable PDF extraction, scanned-PDF OCR, and score-response validation. The scanned-PDF OCR test requires `pdftoppm` on the test machine.

## Project layout

```text
backend/
  db/                  MongoDB connection
  middleware/          Authentication, upload validation, AI rate limit
  models/              MongoDB user model
  routes/              Authentication, resume, and job API routes
  services/            AI provider and job-match helpers
  utils/               PDF/DOCX extraction, OCR, and response validation
  server.js            Express application
frontend/
  public/              Icons and static images
  src/Pages/           Home, authentication, resume builder, score, and jobs
  src/App.jsx          Routes and authentication state
  src/index.css        Global styles, resume templates, and print rules
```
