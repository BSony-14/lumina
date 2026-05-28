# Lumina LMS — Full Stack Learning Platform

> AI-powered Learning Management System with MCP server integration, modern Next.js frontend, and personalized AI coaching.

---

## Overview

Lumina LMS is a complete learning platform combining:

1. **MCP Server** (Backend) — 18 tools for AI agents to interact with courses, students, assignments, and mentor sessions
2. **Next.js Frontend** — Modern, responsive web application with AI-native UX

---

## Frontend

### Tech Stack

- **Next.js 15** — App Router, TypeScript
- **Tailwind CSS v4** — Utility-first styling
- **shadcn/ui** — 22+ accessible UI components
- **Radix UI** — Unstyled, accessible primitives
- **next-themes** — Dark/light mode toggle
- **cmdk** — Command palette (Cmd+K)
- **Lucide** — Icon library

### Routes (All Working)

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, stats |
| `/login` | Email/password authentication UI |
| `/signup` | Registration form with feature preview |
| `/dashboard` | Student dashboard with AI coach, goals, stats |
| `/mentor/dashboard` | Mentor session scheduling, reviews |
| `/courses` | Course catalog with search/filter |
| `/assignments` | Assignment tracker with tabs |
| `/ai-assistant` | AI chat interface with suggested queries |
| `/sessions` | Live session calendar |
| `/certificates` | Earned credentials |
| `/profile` | User profile and stats |
| `/settings` | Preferences, security, notifications |

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### Key Features

1. **Personalized Dashboard**
   - Dynamic greeting based on time of day
   - Learning goals with progress tracking
   - AI coach integration card
   - Quick stats (courses, hours, certificates)

2. **AI Learning Coach**
   - Context-aware suggestions based on progress
   - Markdown rendering for rich content
   - Suggested prompts for quick actions
   - Progress-aware context bar

3. **Command Palette**
   - Press `Cmd+K` (Mac) or `Ctrl+K` (Windows)
   - Quick navigation to all pages
   - Theme toggle from anywhere

4. **Dark/Light Mode**
   - System preference detection
   - Manual toggle in sidebar/header
   - Persistent preference storage

---

## MCP Server (Backend)

### Tools (18 Total)

| Domain | Tools |
|--------|-------|
| **Courses** | list, get details, search |
| **Students** | profile, enrolled courses, lesson progress, mark complete, certificates |
| **AI Coaching** | explain concept, lesson summary, quiz generation, revision notes, interview prep, roadmap, practical applications |
| **Assignments** | list, submit, get submission, grade (mentor) |
| **Mentors & Live** | list mentors, list sessions, schedule session, update status |

All AI tools use **Gemini 1.5 Flash** via environment variable.

### Running the MCP Server

```bash
npm install
npm run build
npm start
```

For HTTP mode:
```bash
TRANSPORT=http PORT=3001 npm start
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini AI (MCP Server)
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key
```

For the frontend, create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key
```

---

## Architecture

```
project/
├── src/                        # MCP Server (Node.js)
│   ├── index.ts                # MCP entry point
│   ├── types.ts                # TypeScript types
│   ├── services/
│   │   ├── supabase.ts         # Database client
│   │   ├── gemini.ts           # AI tool integration
│   │   └── formatting.ts       # Output formatting
│   └── tools/                  # 18 MCP tools
│       ├── courses.ts
│       ├── students.ts
│       ├── ai.ts
│       ├── assignments.ts
│       └── mentors.ts
│
└── frontend/                   # Next.js Application
    ├── src/
    │   ├── app/                # App Router pages
    │   ├── components/
    │   │   ├── ui/             # 22 shadcn components
    │   │   └── layout/         # Sidebar, header, mobile nav
    │   └── lib/
    │       ├── api/            # Types + mock data
    │       ├── supabase.ts     # Frontend client
    │       └── utils.ts        # Utility functions
    ├── public/
    ├── package.json
    └── tsconfig.json
```

---

## Current Status

### What's Working

- All 12 frontend routes compile and render
- Dark/light mode toggle functional
- Command palette (Cmd+K) navigation
- Responsive sidebar with mobile drawer
- Personalized dashboard with AI coach card
- Course filtering by category/difficulty
- AI assistant chat with suggested prompts
- Assignment tracker with status tabs
- Mock data layer ready for API integration

### Limitations

- Authentication is simulated (no actual Supabase auth yet)
- API calls use mock data (not connected to MCP server)
- Gemini AI integration pending (simulated responses)
- No live session video integration (Jitsi placeholder)

### Next Steps

1. Connect frontend to Supabase auth
2. Build API routes to wrap MCP tools
3. Integrate real Gemini responses
4. Add Jitsi Meet embed for live sessions
5. Implement real-time notifications

---

## Deployment

### Vercel (Frontend)

```bash
cd frontend
vercel --prod
```

Environment variables must be set in Vercel dashboard.

### MCP Server

Deploy as a standalone Node.js service or run locally for Claude Desktop integration.

---

## Stack Summary

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Backend | Node.js MCP Server |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini 1.5 Flash |
| Live Classes | Jitsi Meet |
| Protocol | MCP SDK v1.12+ |
