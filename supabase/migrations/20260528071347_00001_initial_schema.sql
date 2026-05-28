/*
  # Initial LMS Schema

  1. User Profiles
    - Extended user data beyond auth.users
    - Learning goals, cohort membership, progress stats
  
  2. Courses
    - Full course catalog with metadata
    - Provider, difficulty, category, duration

  3. Modules & Lessons
    - Structured course content hierarchy

  4. Enrollments & Progress
    - Student-course relationships
    - Lesson-level completion tracking

  5. Assignments & Submissions
    - Assignment definitions with due dates
    - Student submission tracking

  6. Live Sessions
    - Mentor-led session scheduling
    - Jitsi room integration

  7. Certificates
    - Earned credentials

  8. Security
    - RLS enabled on all tables
    - Policies for student/mentor/admin roles
*/

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'admin')),
  avatar_url text,
  learning_goal text,
  cohort text,
  progress_percentage integer DEFAULT 0,
  courses_enrolled integer DEFAULT 0,
  courses_completed integer DEFAULT 0,
  learning_hours integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  provider text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category text NOT NULL,
  duration_hours integer NOT NULL,
  thumbnail_url text,
  instructor_name text,
  skills_covered text[] DEFAULT '{}',
  prerequisites text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Modules
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('video', 'article', 'quiz', 'assignment')),
  content_url text,
  content_body text,
  duration_minutes integer NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  progress_percent integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, course_id)
);

-- Lesson Progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  time_spent_minutes integer DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  instructions text,
  due_date timestamptz,
  max_score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Assignment Submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content text,
  file_urls text[],
  submitted_at timestamptz DEFAULT now(),
  score integer,
  feedback text,
  graded_by uuid REFERENCES user_profiles(id),
  graded_at timestamptz,
  UNIQUE(assignment_id, user_id)
);

-- Live Sessions
CREATE TABLE IF NOT EXISTS live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES user_profiles(id),
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL,
  jitsi_room_id text,
  jitsi_room_password text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  max_attendees integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- Session Attendance
CREATE TABLE IF NOT EXISTS session_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  attended boolean DEFAULT false,
  joined_at timestamptz,
  UNIQUE(session_id, user_id)
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  issued_at timestamptz DEFAULT now(),
  certificate_url text,
  verification_code text UNIQUE,
  UNIQUE(user_id, course_id)
);

-- Learning Goals/Tasks
CREATE TABLE IF NOT EXISTS learning_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date date,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_goals ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Courses are publicly readable
CREATE POLICY "Courses are publicly readable" ON courses
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid() AND role = 'admin'
  ));

-- Modules/Lessons are publicly readable
CREATE POLICY "Modules readable by all" ON modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lessons readable by all" ON lessons FOR SELECT TO authenticated USING (true);

-- Enrollments - users own their enrollments
CREATE POLICY "Users view own enrollments" ON enrollments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own enrollments" ON enrollments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own enrollments" ON enrollments
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Lesson Progress
CREATE POLICY "Users own lesson progress" ON lesson_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Assignments
CREATE POLICY "Assignments readable by enrolled" ON assignments
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.user_id = auth.uid() AND enrollments.course_id = assignments.course_id
  ));

CREATE POLICY "Mentors manage assignments" ON assignments
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid() AND role IN ('mentor', 'admin')
  ));

-- Submissions
CREATE POLICY "Users view own submissions" ON assignment_submissions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create submissions" ON assignment_submissions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Mentors grade submissions" ON assignment_submissions
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid() AND role IN ('mentor', 'admin')
  ));

-- Live Sessions
CREATE POLICY "Users view sessions" ON live_sessions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Mentors manage sessions" ON live_sessions
  FOR ALL TO authenticated
  USING (mentor_id = auth.uid() OR EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid() AND role = 'admin'
  ));

-- Certificates
CREATE POLICY "Users view own certificates" ON certificates
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System inserts certificates" ON certificates
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Learning Goals
CREATE POLICY "Users own learning goals" ON learning_goals
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_live_sessions_scheduled ON live_sessions(scheduled_at);
