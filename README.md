# CareerAI — AI Career Guidance Platform 
> *"Turn Your Potential Into Possibility."*

CareerAI is a modern, full-stack career guidance and recommendation platform built for students, freshers, and job switchers. It helps users discover tailored career tracks, identify skill gaps, progress through structured roadmaps, build ATS-friendly resumes, prepare for interviews, and ask questions to an AI Career Assistant.

---

##  Key Features

1. **AI Career Assessment & Recommendation Engine**
   - 7-question interactive assessment analyzing interests, industry preference, problem-solving style, current skills, and career goals.
   - Transparent rule-based match scoring engine with confidence breakdown, matching skills, skills to develop, and concrete next steps.
   - Clearly disclaimed as guidance estimates.

2. **Interactive Learning Roadmaps**
   - Multi-career roadmaps for Software Developer, Data Scientist, and UX/UI Designer.
   - Phase-by-phase breakdown (Fundamentals, Core Concepts, Applied Projects, Career Launch).
   - Interactive progress tracking with task check-offs and duration estimates.

3. **Skill Gap Analysis**
   - Self-assessment sliders for required skills per career.
   - Visual priority badges (High / Medium / Low priority), gap indicators, and recommended learning resources.

4. **Resume Studio (Builder & Analyser)**
   - Live editable resume builder with multiple design templates (Modern, Classic, Creative).
   - Real-time live preview.
   - One-click PDF generation via **ReportLab**.
   - ATS Resume Analyser with PDF text parsing via **PyPDF2**, scoring, section detection, and actionable suggestions.

5. **Curated Jobs & Internship Tracker**
   - Filter by job type (Full-time, Internship, Contract) and experience level (Fresher, 0–2 years, 2+ years).
   - Track application stages: *Saved*, *Applied*, *Interview*, *Rejected*, *Selected*.

6. **Interview Preparation**
   - Practice questions across Java, Python, SQL, DSA, System Design, and Behavioral topics.
   - Filter by category and difficulty (Beginner, Intermediate, Advanced).
   - Expandable hints and model answers with interactive self-answer inputs.

7. **AI Career Assistant Chat**
   - Interactive career mentor with quick prompt shortcuts and message history.
   - Backed by Google Gemini API if key is configured, with robust offline rule-based fallback.

8. **Authentication & Profile Management**
   - Secure signup and login with PBKDF2-SHA256 password hashing.
   - JWT tokens issued via Flask-JWT-Extended.
   - Comprehensive profile management (Education, College, Experience, Skills, Interests).

---

##  Technology Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS 3 with custom warm palette & typography
- **Routing:** React Router v7
- **Icons:** React Icons (`hi2` Heroicons)
- **HTTP Client:** Axios with JWT auto-injection

### Backend
- **Framework:** Python Flask 3.0 REST API
- **Auth:** Flask-JWT-Extended & Werkzeug Security
- **Database:** SQLite with WAL mode & foreign keys
- **PDF Engine:** ReportLab
- **PDF Extraction:** PyPDF2
- **AI Integration:** Google Generative AI (Gemini SDK)

---

##  Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### 2. Start the Backend (Flask API)

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already installed if done via agent)
pip install -r requirements.txt

# Start the Flask server (runs on http://localhost:5000)
python app.py
```

### 3. Start the Frontend (Vite React)

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install npm dependencies (if not already installed)
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

### 4. Or Run Both Automatically (Windows)
Double-click `start.bat` in the root folder, or execute:
```cmd
start.bat
```

Open your browser at: **`http://localhost:5173`**

---

##  Project Structure

```
AI Career Recommendation System/
├── backend/
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py            # Signup, login, JWT issuance
│   │   ├── user.py            # Profile CRUD and skills
│   │   ├── assessment.py      # Recommendation engine & results
│   │   ├── careers.py         # Saved career tracks
│   │   ├── assistant.py       # AI chat with Gemini & fallback
│   │   ├── resume.py          # Resume builder, ReportLab PDF & ATS parser
│   │   ├── jobs.py            # Jobs feed & application tracker
│   │   └── notifications.py   # User alerts & reminders
│   ├── app.py                 # Flask factory, blueprints & CORS
│   ├── database.py            # SQLite schema, tables & seed data
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment configurations
│   └── careerai.db            # SQLite database file
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, Footer, Logo, LoadingSpinner
│   │   ├── hooks/             # useAuth context
│   │   ├── pages/             # 15 complete pages (Home, Dashboard, Assessment, etc.)
│   │   ├── services/          # Axios API client
│   │   ├── App.jsx            # Route definitions & protected routes
│   │   ├── index.css          # Design system & tokens
│   │   └── main.jsx           # App entry point
│   ├── package.json
│   ├── tailwind.config.js     # Custom fonts, colors, animations
│   └── vite.config.js
├── README.md
└── start.bat
```

---

##  Security & Best Practices
- Passwords hashed using Werkzeug PBKDF2-SHA256 with dynamic salts.
- Protected endpoints require Bearer JWT authorization.
- SQLite parameterized queries prevent SQL injection.
- Maximum upload limit enforced for file security.
