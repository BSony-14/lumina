# Lumina LMS — MCP Server

> AI-powered MCP server for Lumina LMS. Connects AI agents to your entire LMS — courses, students, live classes, assignments, and contextual AI coaching — all backed by Supabase.

---

## What it does

The Lumina LMS MCP server exposes **18 tools** across 5 domains:

| Domain | Tools |
|---|---|
| **Courses** | list, get details, search |
| **Students** | profile, enrolled courses, lesson progress, mark complete, certificates |
| **AI Coaching** | explain concept, lesson summary, quiz generation, revision notes, interview prep, roadmap, practical applications |
| **Assignments** | list, submit, get submission, grade (mentor) |
| **Mentors & Live** | list mentors, list sessions, schedule session, update status |

All AI tools use **Gemini 1.5 Flash** via environment variable — no hardcoded keys, ever.

---

## Setup

### 1. Install

```bash
npm install
npm run build
```

### 2. Environment variables

Create a `.env` file (never commit it):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key
```

### 3. Run

```bash
# stdio (default — for Claude Desktop, Claude Code, etc.)
npm start

# HTTP mode (for testing or HTTP-based MCP clients)
TRANSPORT=http PORT=3001 npm start
```

---

## Claude Desktop config

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "lumina-lms": {
      "command": "node",
      "args": ["/absolute/path/to/lumina-lms-mcp-server/dist/index.js"],
      "env": {
        "NEXT_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your-key",
        "GOOGLE_GENERATIVE_AI_API_KEY": "your-gemini-key"
      }
    }
  }
}
```

---

## Supabase schema

The server expects these tables:

```sql
-- Core tables
courses (id, title, description, provider, difficulty, category, duration_hours, created_at, updated_at)
modules (id, course_id, title, order_index, created_at)
lessons (id, module_id, course_id, title, content_type, content_url, duration_minutes, order_index, created_at)

-- Student data
users (id, email, full_name, role, avatar_url, created_at)
course_enrollments (id, user_id, course_id, enrolled_at, progress_percent, completed, completed_at)
lesson_progress (id, user_id, lesson_id, course_id, completed, completed_at, time_spent_minutes, created_at)
certificates (id, user_id, course_id, issued_at, certificate_url)

-- Assignments
assignments (id, course_id, lesson_id, title, description, due_date, max_score, created_at)
assignment_submissions (id, assignment_id, user_id, content, submitted_at, score, feedback, graded_at)

-- Live classes
live_sessions (id, course_id, mentor_id, title, description, scheduled_at, duration_minutes, jitsi_room_id, status, created_at)
```

Enable Row Level Security and set up policies per your auth model.

---

## All 18 tools

### Courses
- `lms_list_courses` — list with filters (category, difficulty, provider)
- `lms_get_course` — full course with modules and lessons
- `lms_search_courses` — full-text search

### Students
- `lms_get_student_profile` — user profile + role
- `lms_get_enrolled_courses` — enrolled courses with progress %
- `lms_get_lesson_progress` — per-lesson completion for a course
- `lms_mark_lesson_complete` — mark lesson done, auto-recalculate course %
- `lms_get_certificates` — earned certificates

### AI (Gemini 1.5 Flash)
- `lms_ai_explain_concept` — explain any concept simply in learner context
- `lms_ai_lesson_summary` — structured summary with key points and takeaways
- `lms_ai_generate_quiz` — MCQ quiz as JSON with answers and explanations
- `lms_ai_revision_notes` — brief or detailed cheat-sheet style notes
- `lms_ai_interview_questions` — technical/behavioural interview prep
- `lms_ai_generate_roadmap` — personalised learning roadmap (roadmap.sh inspired)
- `lms_ai_practical_applications` — real-world project and exercise ideas

### Assignments
- `lms_list_assignments` — list by course/lesson
- `lms_submit_assignment` — student submission (idempotent — no double submits)
- `lms_get_submission` — view submission + grade + feedback
- `lms_grade_assignment` — mentor grades with score and written feedback

### Mentors & Live
- `lms_list_mentors` — all registered mentors
- `lms_list_live_sessions` — upcoming/past sessions with Jitsi links
- `lms_schedule_live_session` — mentor schedules a session (auto Jitsi room)
- `lms_update_session_status` — mark live, completed, or cancelled

---

## Architecture

```
lumina-lms-mcp-server/
├── src/
│   ├── index.ts              # Entry point, transport setup
│   ├── types.ts              # TypeScript types
│   ├── services/
│   │   ├── supabase.ts       # Supabase client + query helpers
│   │   ├── gemini.ts         # Gemini 1.5 Flash client + prompt builders
│   │   └── formatting.ts     # Pagination, markdown, toRecord helpers
│   └── tools/
│       ├── courses.ts        # lms_list_courses, lms_get_course, lms_search_courses
│       ├── students.ts       # Student progress and enrollment tools
│       ├── ai.ts             # All Gemini-powered AI tools
│       ├── assignments.ts    # Assignment lifecycle tools
│       └── mentors.ts        # Mentor and live session tools
├── dist/                     # Compiled output (gitignored)
├── package.json
└── tsconfig.json
```

---

## Security notes

- API keys are **only read from environment variables** — never hardcoded
- Use `SUPABASE_SERVICE_ROLE_KEY` only server-side (this MCP server is server-side)
- For production: scope Supabase RLS policies per user role (student/mentor/admin)
- Jitsi room IDs are deterministic but obscured — add password protection in Jitsi for sensitive sessions

---

## Stack

- **Runtime**: Node.js ≥18, TypeScript
- **Transport**: stdio (default) or HTTP
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 1.5 Flash
- **Live classes**: Jitsi Meet (open source)
- **Protocol**: MCP SDK v1.12+
