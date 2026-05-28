// Mock data types matching MCP server types

export interface Course {
  id: string;
  title: string;
  description: string;
  provider: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  duration_hours: number;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  content_type: "video" | "article" | "quiz" | "assignment";
  content_url?: string;
  duration_minutes: number;
  order_index: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "mentor" | "admin";
  avatar_url?: string;
  created_at: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress_percent: number;
  completed: boolean;
  completed_at?: string;
  course?: Course;
}

export interface Assignment {
  id: string;
  course_id: string;
  lesson_id?: string;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  created_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  user_id: string;
  content: string;
  submitted_at: string;
  score?: number;
  feedback?: string;
  graded_at?: string;
}

export interface LiveSession {
  id: string;
  course_id: string;
  mentor_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  jitsi_room_id: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  issued_at: string;
  certificate_url?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
