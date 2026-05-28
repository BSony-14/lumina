# Lumina LMS — AI-Native Learning Platform

> Modern learning management system with AI-powered coaching, live mentorship, and intelligent study tools. Built for educational institutions, coaching platforms, and professional training programs.

---

## Overview

Lumina LMS is a **production-ready, AI-native learning platform** that combines:

1. **Intelligent Learning Workspace** — Personalized dashboards with AI coaching, progress tracking, and study tools
2. **Full-Stack Application** — Next.js 15 frontend with Supabase backend and MCP server integration
3. **Modern EdTech Experience** — Inspired by Linear, Notion, and Coursera with dark mode and responsive design

---

## Key Features

### For Learners
- **AI Learning Coach** — Context-aware tutoring for any topic (React, ML, DSA, etc.)
- **Personalized Dashboard** — Dynamic greeting, learning goals, progress insights
- **Course Catalog** — Browse and enroll in courses from NPTEL, DeepLearning.AI, Coursera
- **Smart Assignments** — Track deadlines, submit work, receive feedback
- **Live Sessions** — Join mentor-led sessions via Jitsi Meet integration
- **Verified Certificates** — Earn credentials upon course completion
- **Study Tools** — Generate quizzes, revision notes, and learning roadmaps

### For Institutions
- **Cohort Management** — Organize students into batches/groups
- **Mentor Workflows** — Schedule sessions, grade assignments, track engagement
- **Progress Analytics** — Monitor student progress and learning hours
- **Role-Based Access** — Student, mentor, and admin roles with RLS policies

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui (22 components) |
| **Backend** | Node.js MCP Server |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth with RLS |
| **AI** | Google Gemini 1.5 Flash |
| **Live Classes** | Jitsi Meet (self-hosted) |
| **Protocol** | MCP SDK v1.12+ |

---

## Architecture

```
project/
├── src/                        # MCP Server (Node.js)
│   ├── index.ts                # MCP entry point
│   ├── types.ts                # TypeScript definitions
│   ├── services/
│   │   ├── supabase.ts         # Database client
│   │   ├── gemini.ts           # AI tool integration
│   │   └── formatting.ts       # Output formatting
│   └── tools/                  # 18 MCP tools
│       ├── courses.ts          # Course management
│       ├── students.ts         # Student progress
│       ├── ai.ts               # AI coaching tools
│       ├── assignments.ts      # Assignment lifecycle
│       └── mentors.ts          # Mentor workflows
│
└── frontend/                   # Next.js Application
    ├── src/
    │   ├── app/                # 14 App Router pages
    │   │   ├── (auth)/         # Login, signup
    │   │   ├── dashboard/      # Student workspace
    │   │   ├── mentor/         # Mentor dashboard
    │   │   ├── courses/        # Course catalog
    │   │   ├── assignments/    # Task tracker
    │   │   ├── ai-assistant/   # AI chat interface
    │   │   ├── sessions/       # Live session calendar
    │   │   ├── certificates/   # Credentials
    │   │   ├── profile/        # User profile
    │   │   └── settings/       # Preferences
    │   ├── components/
    │   │   ├── ui/             # shadcn/ui components
    │   │   └── layout/         # Sidebar, header, command palette
    │   └── lib/
    │       ├── api/            # Types + mock data layer
    │       ├── auth-context.tsx # Supabase auth state
    │       ├── supabase.ts     # Frontend client
    │       └── utils.ts        # Utilities
    └── public/                 # Static assets
```

---

## Pages & Features

| Route | Features |
|-------|----------|
| `/` | Landing page with hero, stats, features, CTA |
| `/login` | Email/password auth, Google/GitHub OAuth |
| `/signup` | Registration with feature preview |
| `/dashboard` | Personalized workspace with AI coach, goals, insights |
| `/mentor/dashboard` | Session scheduling, assignment grading, student activity |
| `/courses` | Filterable catalog with real providers |
| `/assignments` | Tabs for pending/submitted/completed tasks |
| `/ai-assistant` | NotebookLM-style AI chat with suggested prompts |
| `/sessions` | Live session calendar with Jitsi integration |
| `/certificates` | Earned credentials with verification codes |
| `/profile` | User stats, edit form, achievements |
| `/settings` | Theme, notifications, security, account |

---

## MCP Tools (18 Total)

| Category | Tools |
|----------|-------|
| **Courses** | list, get details, search by category/difficulty |
| **Students** | profile, enrolled courses, lesson progress, mark complete, certificates |
| **AI Coaching** | explain concept, lesson summary, quiz generation, revision notes, interview prep, roadmap, practical applications |
| **Assignments** | list, submit, view submission, grade (mentor) |
| **Mentors & Live** | list mentors, sessions, schedule session, update status |

---

## Database Schema

### Core Tables
- `user_profiles` — Extended user data with cohort, learning goals, progress stats
- `courses` — Course catalog with provider, difficulty, skills covered
- `modules` & `lessons` — Structured course content
- `enrollments` & `lesson_progress` — Student-course relationships
- `assignments` & `assignment_submissions` — Assignment lifecycle
- `live_sessions` & `session_attendance` — Mentor sessions
- `certificates` — Earned credentials
- `learning_goals` — Personal study tasks

### Security
- Row Level Security (RLS) on all tables
- Policies for student/mentor/admin roles
- Authenticated users access only their data

---

## Setup

### 1. Environment Variables

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key
```

Create `.env` in project root for MCP server:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key
```

### 2. Install & Run

```bash
# MCP Server
npm install && npm run build && npm start

# Frontend
cd frontend && npm install && npm run dev
```

Open http://localhost:3000

---

## Deployment

### Vercel (Frontend)
```bash
cd frontend && vercel --prod
```

Set environment variables in Vercel dashboard.

### MCP Server
Deploy as standalone Node.js service or run locally for Claude Desktop integration.

---

## Current Status

### Production-Ready
- Complete UI with 14 pages
- Supabase auth integration
- Database schema with RLS
- Dark/light mode
- Command palette navigation
- Responsive design
- Build succeeds (static generation)

### Integration Ready
- Auth context with dynamic personalization
- Realistic course catalog
- Assignment workflow
- Live session scheduling
- Certificate generation

### Pending Integration
- Real Gemini API responses (mocked)
- Real-time notifications
- Jitsi video embed
- Payment gateway

---

## Use Cases

- **Coaching Institutes** — Batch management, mentor assignments, live classes
- **Universities** — Course catalog, student progress, faculty workflows
- **Corporate Training** — Employee upskilling, progress tracking, certifications
- **Bootcamps** — Cohort learning, AI tutoring, job prep
- **MOOC Platforms** — Course delivery, AI assistance, certification

---

## License

MIT
