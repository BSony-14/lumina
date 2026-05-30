# Lumina LMS

**AI-powered Learning Intelligence Platform for the GradSkills x CodeQuesters Summership Challenge.**

---

## The Problem

Modern learners face three critical challenges that traditional Learning Management Systems fail to address:

**Fragmented Learning Experience**
- Content scattered across NPTEL, DeepLearning.AI, Coursera, Educative, and YouTube playlists
- No unified progress tracking, assignment submission, or certification across providers
- Manual effort to organize learning paths and track achievements

**Passive, Non-Personalized Education**
- One-size-fits-all video lectures without adaptive guidance
- No intelligent tutoring that understands individual learning context
- Limited real-time feedback and personalized study assistance

**Disconnected Mentorship**
- Live sessions require manual scheduling, separate platforms (Zoom, Meet)
- No integrated workflow for mentors to track student progress, grade work, or manage cohorts
- No unified system bridging learners, AI tutors, and human mentors

---

## Our Solution

Lumina LMS is an **AI-native learning platform** that unifies course delivery, intelligent tutoring, and live mentorship into a single, cohesive learning experience.

### Key Capabilities

**Unified Course Platform**
- Aggregate courses from NPTEL, DeepLearning.AI, AWS Training, Coursera, and Educative in one catalog
- Track progress, submit assignments, and earn verified certificates across all providers
- Structured modules, lessons, and learning paths with prerequisites and skill mapping

**AI Learning Coach (Powered by Google Gemini 1.5 Flash)**
- Context-aware tutoring: explain concepts at your level, generate revision notes, create practice quizzes
- Personalized study roadmaps based on your enrolled courses and progress
- Interview preparation with topic-specific questions and practical project suggestions
- Real-time assistance without waiting for mentor availability

**Live Mentorship Integration**
- Schedule and join live sessions via Jitsi Meet rooms (auto-generated with room IDs and passwords)
- Mentor dashboard to track student progress, review submissions, and grade assignments
- Role-based access (student/mentor/admin) with Row-Level Security protecting all data

**Complete Learning Lifecycle**
- Enroll in courses, track lesson progress, complete assignments
- Earn shareable certificates with verification codes
- Set personal learning goals with due dates and completion tracking

---

## Platform Vision

Lumina bridges the gap between **high-quality course content** (from top providers), **AI-powered personalization** (via Gemini), and **human mentorship** (via live sessions and grading).

**For Learners**: One workspace to discover, learn, practice, and get certified — with an AI coach available 24/7.

**For Mentors**: Tools to schedule sessions, track student progress, provide feedback, and manage cohorts — all in one dashboard.

**For Institutions**: A complete LMS with cohort management, role-based access control, and RLS-secured data across all 10 database tables.

---

## Architecture

Lumina employs a **hybrid architecture**: a Next.js web application for learners and mentors, plus a standalone MCP server enabling AI agents (Claude, others) to autonomously manage and teach within the LMS.

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Learners & Mentors                       │
│                  (Browser + Mobile Responsive UI)                │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Next.js 16 Frontend (React 19)                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 14 Pages: Dashboard, Courses, Assignments, Sessions,       │ │
│  │ Certificates, AI Assistant, Mentor Dashboard, Profile      │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Supabase JS Client (Auth + Realtime)                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                  ┌───────────┴──────────┐
                  │                      │
                  ▼                      ▼
┌─────────────────────────┐  ┌───────────────────────────────────┐
│  Supabase PostgreSQL    │  │  MCP Server (Node.js + SDK v1.12)│
│  ┌───────────────────┐  │  │  ┌─────────────────────────────┐ │
│  │ 10 Tables, RLS    │  │  │  │ 25 AI Tools:                │ │
│  │ + Auth Provider   │  │  │  │ - Course queries            │ │
│  └───────────────────┘  │  │  │ - Student progress tracking  │ │
│  ┌───────────────────┐  │  │  │ - Assignment grading         │ │
│  │ Real Course Data  │  │  │  │ - Live session management   │ │
│  │ (NPTEL, DeepLearn)│  │  │  │ - AI coaching (Gemini 1.5)  │ │
│  └───────────────────┘  │  │  └─────────────────────────────┘ │
└─────────────────────────┘  └───────────────┬───────────────────┘
                                             │
                                             ▼
                               ┌──────────────────────────┐
                               │  Google Gemini 1.5 Flash │
                               │  (AI Coaching Engine)    │
                               └──────────────────────────┘
```

### Technology Stack

**Frontend (Learner & Mentor Interface)**
- Next.js 16.2.6 with App Router and Turbopack
- React 19.2.4 with TypeScript (strict mode)
- Tailwind CSS v4 with shadcn/ui components
- Supabase Auth (email/password, extensible to OAuth)
- Dark/light theme with responsive design

**Backend (AI Agent Interface)**
- Node.js MCP Server (Model Context Protocol SDK v1.12+)
- Dual transport: stdio (Claude Desktop) + HTTP (remote agents)
- 25 tools across 5 categories (courses, students, assignments, mentors, AI coaching)

**Database**
- PostgreSQL via Supabase (10 tables with relationships)
- Row-Level Security (RLS) on all tables
- Supabase Auth integration (`auth.users` + `user_profiles`)
- Real-time subscriptions enabled

**AI Integration**
- Google Gemini 1.5 Flash via REST API
- Context-aware pedagogical prompts
- Per-tool temperature tuning (e.g., higher for creative roadmaps)

**Live Sessions**
- Jitsi Meet integration (room generation with ID/password)
- Session status tracking (scheduled, live, completed, cancelled)
- Attendance tracking with join timestamps

---

## Current Implementation

### Production-Ready Components

**Database Schema (10 Tables, Fully Migrated)**
- `user_profiles` — Extended user data (role, cohort, learning stats)
- `courses` — 8 real courses from NPTEL, DeepLearning.AI, AWS Training, Coursera, Educative
- `modules`, `lessons` — Hierarchical course structure
- `enrollments`, `lesson_progress` — Student-course relationships and progress
- `assignments`, `assignment_submissions` — Assignment lifecycle with grading
- `live_sessions`, `session_attendance` — Mentor sessions with Jitsi integration
- `certificates`, `learning_goals` — Credentials and personal goals

**Row-Level Security (RLS)**
- All tables protected with restrictive policies
- Students access only their own enrollments, progress, submissions
- Mentors can view student data for their sessions, grade assignments
- Admin role for full access

**Frontend (14 Pages)**
| Route | Purpose |
|-------|---------|
| `/` | Landing page with hero, features, CTA |
| `/login` | Email/password authentication |
| `/signup` | User registration |
| `/dashboard` | Personalized student workspace (enrolled courses, goals, AI coach prompt) |
| `/courses` | Searchable course catalog (8 real courses) |
| `/assignments` | Assignment tracker (pending/submitted/completed tabs) |
| `/ai-assistant` | AI chat interface for tutoring |
| `/sessions` | Live session calendar with Jitsi integration |
| `/certificates` | Earned credentials |
| `/profile` | User stats and settings |
| `/settings` | Preferences and account management |
| `/mentor/dashboard` | Mentor-exclusive workspace (schedule sessions, grade assignments) |

**MCP Server (25 AI Tools)**
| Category | Tools |
|----------|-------|
| **Courses** (4) | List courses, get details, list modules/lessons, filter by category/difficulty |
| **Students** (4) | Get profile, enrolled courses, lesson progress, certificates |
| **Assignments** (5) | List, view details, submit, view submission, grade (mentor only) |
| **Mentors** (4) | List mentors, list sessions, schedule session, update status |
| **AI Coaching** (8) | Explain concept, lesson summary, quiz generation, revision notes, interview prep, learning roadmap, practical applications, study suggestions |

All tools functional via MCP protocol, querying Supabase and calling Gemini API.

### Implementation Status

**Fully Functional**
- Complete database schema with RLS (migrated to Supabase)
- 8 real courses seeded (NPTEL, DeepLearning.AI, AWS, Coursera, Educative)
- MCP server running (stdio + HTTP modes)
- AI coaching powered by Gemini 1.5 Flash
- Frontend builds and runs (14 static pages, 12.2s build time)
- Supabase Auth integration (login/signup flows)
- Dark mode, responsive design, command palette navigation

**Partial Implementation (Frontend UI Shells)**
- Course enrollment workflow (UI exists, no backend wiring to enrollments table)
- Assignment submission (UI exists, not connected to submission API)
- Live session joining (Jitsi room data exists, no embed)
- Certificate generation logic (table exists, no auto-issue workflow)
- Dashboard stats (hardcoded mock data, not pulling from Supabase)

**Not Yet Implemented**
- Real-time notifications
- Payment gateway integration
- OAuth providers (Google, GitHub)
- Mobile app (web-responsive only)

---

## User Workflows

### Student Journey

1. **Sign Up/Login** — Email/password authentication via Supabase Auth
2. **Browse Courses** — Filter by category, difficulty, provider (8 real courses)
3. **Enroll** — Join courses, track progress via lesson completion
4. **Learn** — Access lessons, mark as complete, track time spent
5. **Get AI Help** — Ask the AI coach for explanations, quizzes, summaries
6. **Submit Assignments** — Upload work, receive mentor feedback and grades
7. **Attend Live Sessions** — Join Jitsi rooms, attend mentor-led classes
8. **Earn Certificates** — Complete courses, get verified credentials

### Mentor Journey

1. **Login** (mentor role) — Access mentor dashboard
2. **Schedule Sessions** — Create Jitsi rooms, set times, link to courses
3. **Review Assignments** — View submissions, provide feedback, assign grades
4. **Monitor Progress** — See student engagement, completion rates
5. **Manage Cohorts** — Track groups of students across courses

### AI Agent Journey (via MCP)

1. **Connect** — Claude (or MCP client) connects to Lumina MCP server
2. **Query** — Ask about courses, student progress, assignments
3. **Act** — Schedule sessions, grade submissions, generate coaching content
4. **Teach** — Use AI tools to create personalized learning experiences

---

## Getting Started

### Prerequisites

- Node.js 18+ (v22 recommended)
- npm 10+
- Supabase account (free tier works)
- Google AI Studio API key (for Gemini)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/lumina-lms.git
cd lumina-lms
```

2. **Configure Frontend Environment**

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. **Configure MCP Server Environment**

Create `.env` in project root:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

4. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

5. **Install MCP Server Dependencies**
```bash
cd ..
npm install
npm run build
```

### Database Setup

Run the migrations in Supabase SQL Editor or via CLI:

```bash
# Migrations are in supabase/migrations/
# 00001_initial_schema.sql — Creates all 10 tables with RLS
# 00002_seed_course_data.sql — Seeds 8 real courses
# 00003_fix_rls_security_issues.sql — Security patches
```

### Running the Application

**Start Frontend (Development)**
```bash
cd frontend
npm run dev
```
Open http://localhost:3000

**Start MCP Server (Stdio Mode, for Claude Desktop)**
```bash
npm start
```

**Start MCP Server (HTTP Mode)**
```bash
TRANSPORT=http npm start
# Runs on http://localhost:9091/mcp
```

### Production Build

```bash
cd frontend
npm run build  # 14 static pages, ~12s build time
npm start      # Production server
```

---

## Deployment

### Vercel (Frontend)

```bash
cd frontend
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Root Directory: `frontend`

### MCP Server

Deploy as standalone Node.js service:
- Railway, Render, Fly.io, or any Node.js host
- Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`
- Expose `/mcp` endpoint (HTTP mode)

---

## Project Structure

```
lumina-lms/
├── frontend/                    # Next.js 16 Application
│   ├── src/
│   │   ├── app/                 # 14 pages (App Router)
│   │   ├── components/          # UI components (shadcn/ui)
│   │   └── lib/                 # Supabase client, auth context
│   ├── public/                  # Static assets
│   └── package.json
│
├── src/                         # MCP Server (Node.js)
│   ├── index.ts                 # MCP entry point
│   ├── services/
│   │   ├── supabase.ts          # Database helpers
│   │   ├── gemini.ts            # AI integration
│   │   └── formatting.ts        # Output formatters
│   └── tools/                   # 25 MCP tools
│       ├── courses.ts
│       ├── students.ts
│       ├── assignments.ts
│       ├── mentors.ts
│       └── ai.ts
│
├── supabase/
│   └── migrations/              # SQL migrations (3 files)
│
└── package.json                 # MCP server dependencies
```

---

## Security

- **Row-Level Security (RLS)** on all 10 tables
- **Restrictive policies**: Users access only their own data
- **Supabase Auth**: Secure session management with JWT tokens
- **Service Role Key**: Used by MCP server only (admin-level access)
- **Anon Key**: Used by frontend (RLS-enforced)

---

## Roadmap

**High Priority**
- Wire frontend enrollment to Supabase (real data flow)
- Connect assignment submission UI to backend
- Embed Jitsi Meet for live sessions
- Auto-generate certificates on course completion

**Medium Priority**
- Real-time notifications (Supabase Realtime)
- OAuth providers (Google, GitHub)
- Payment integration (Stripe)
- Mobile app (React Native)

**Long-Term**
- Multi-language support
- Accessibility improvements (WCAG 2.1)
- Analytics dashboard for admins
- Plugin system for custom tools

---

## Built For

- **Coaching Institutes** — Batch management, mentor assignments, live classes
- **Universities** — Course catalog, student progress, faculty workflows
- **Corporate Training** — Employee upskilling, progress tracking, certifications
- **Bootcamps** — Cohort learning, AI tutoring, job prep
- **MOOC Providers** — Course delivery with AI assistance

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Backend | Node.js MCP Server |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth with RLS |
| AI | Google Gemini 1.5 Flash |
| Live Sessions | Jitsi Meet |
| Protocol | MCP SDK v1.12+ |

---

## License

MIT

---

## Acknowledgments

Built for the **GradSkills x CodeQuesters Summership Challenge**.

Course content aggregated from NPTEL, DeepLearning.AI, AWS Training, Coursera, and Educative.
