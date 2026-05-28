import { Course, User, Assignment, LiveSession, Module, Lesson, CourseEnrollment, Certificate } from "./types";

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "student@lumina.dev",
    full_name: "Alex Johnson",
    role: "student",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "user-2",
    email: "mentor@lumina.dev",
    full_name: "Dr. Sarah Chen",
    role: "mentor",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    created_at: "2023-09-10T00:00:00Z",
  },
  {
    id: "user-3",
    email: "admin@lumina.dev",
    full_name: "Admin User",
    role: "admin",
    created_at: "2023-01-01T00:00:00Z",
  },
];

// Mock courses
export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "Full-Stack Web Development with React & Node.js",
    description: "Master modern web development by building production-ready applications with React, Node.js, and PostgreSQL. Learn authentication, API design, and deployment strategies.",
    provider: "NPTEL",
    difficulty: "intermediate",
    category: "web-development",
    duration_hours: 120,
    thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f3e0b45a655c?w=800&h=450&fit=crop",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "course-2",
    title: "Machine Learning Fundamentals",
    description: "Comprehensive introduction to machine learning algorithms, neural networks, and practical applications using Python, TensorFlow, and scikit-learn.",
    provider: "DeepLearning.AI",
    difficulty: "intermediate",
    category: "machine-learning",
    duration_hours: 80,
    thumbnail_url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "course-3",
    title: "Cloud Architecture on AWS",
    description: "Design scalable, fault-tolerant systems on AWS. Covers EC2, S3, Lambda, RDS, and cloud-native architecture patterns.",
    provider: "AWS Training",
    difficulty: "advanced",
    category: "cloud",
    duration_hours: 60,
    thumbnail_url: "https://images.unsplash.com/photo-1451187580452-4bbac5e14dfb?w=800&h=450&fit=crop",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "course-4",
    title: "Data Structures & Algorithms",
    description: "Master fundamental data structures and algorithms. Prepare for technical interviews with hands-on coding challenges.",
    provider: "NPTEL",
    difficulty: "beginner",
    category: "computer-science",
    duration_hours: 50,
    thumbnail_url: "https://images.unsplash.com/photo-1509228468518-180dd45684f2?w=800&h=450&fit=crop",
    created_at: "2023-11-01T00:00:00Z",
    updated_at: "2023-11-01T00:00:00Z",
  },
  {
    id: "course-5",
    title: "DevOps Engineering Masterclass",
    description: "Learn CI/CD pipelines, containerization with Docker, orchestration with Kubernetes, and infrastructure as code with Terraform.",
    provider: "Coursera",
    difficulty: "advanced",
    category: "devops",
    duration_hours: 90,
    thumbnail_url: "https://images.unsplash.com/photo-1667372393119-3d4c49fb35d5?w=800&h=450&fit=crop",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "course-6",
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis. Covers NumPy, Pandas, Matplotlib, and real-world data projects.",
    provider: "NPTEL",
    difficulty: "beginner",
    category: "data-science",
    duration_hours: 45,
    thumbnail_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c3?w=800&h=450&fit=crop",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
];

// Mock modules
export const mockModules: Module[] = [
  { id: "mod-1", course_id: "course-1", title: "Introduction to Web Development", order_index: 1, created_at: "2024-01-01T00:00:00Z" },
  { id: "mod-2", course_id: "course-1", title: "React Fundamentals", order_index: 2, created_at: "2024-01-01T00:00:00Z" },
  { id: "mod-3", course_id: "course-1", title: "Node.js & Express", order_index: 3, created_at: "2024-01-01T00:00:00Z" },
  { id: "mod-4", course_id: "course-1", title: "Database Design", order_index: 4, created_at: "2024-01-01T00:00:00Z" },
];

// Mock lessons
export const mockLessons: Lesson[] = [
  { id: "lesson-1", module_id: "mod-1", course_id: "course-1", title: "What is Web Development?", content_type: "video", duration_minutes: 15, order_index: 1, created_at: "2024-01-01T00:00:00Z" },
  { id: "lesson-2", module_id: "mod-1", course_id: "course-1", title: "HTML Fundamentals", content_type: "video", duration_minutes: 45, order_index: 2, created_at: "2024-01-01T00:00:00Z" },
  { id: "lesson-3", module_id: "mod-1", course_id: "course-1", title: "CSS & Styling", content_type: "video", duration_minutes: 60, order_index: 3, created_at: "2024-01-01T00:00:00Z" },
  { id: "lesson-4", module_id: "mod-1", course_id: "course-1", title: "Intro to JavaScript", content_type: "video", duration_minutes: 90, order_index: 4, created_at: "2024-01-01T00:00:00Z" },
  { id: "lesson-5", module_id: "mod-2", course_id: "course-1", title: "React Components", content_type: "video", duration_minutes: 75, order_index: 1, created_at: "2024-01-01T00:00:00Z" },
];

// Mock enrollments
export const mockEnrollments: CourseEnrollment[] = [
  {
    id: "enroll-1",
    user_id: "user-1",
    course_id: "course-1",
    enrolled_at: "2024-03-01T00:00:00Z",
    progress_percent: 68,
    completed: false,
    course: mockCourses[0],
  },
  {
    id: "enroll-2",
    user_id: "user-1",
    course_id: "course-2",
    enrolled_at: "2024-02-15T00:00:00Z",
    progress_percent: 45,
    completed: false,
    course: mockCourses[1],
  },
  {
    id: "enroll-3",
    user_id: "user-1",
    course_id: "course-4",
    enrolled_at: "2023-11-20T00:00:00Z",
    progress_percent: 100,
    completed: true,
    completed_at: "2024-01-15T00:00:00Z",
    course: mockCourses[3],
  },
];

// Mock assignments
export const mockAssignments: Assignment[] = [
  {
    id: "assign-1",
    course_id: "course-1",
    lesson_id: "lesson-5",
    title: "Build a Todo App with React",
    description: "Create a fully functional todo application using React hooks. Include add, edit, delete, and filter functionality.",
    due_date: "2024-06-15T23:59:00Z",
    max_score: 100,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "assign-2",
    course_id: "course-1",
    lesson_id: "lesson-4",
    title: "JavaScript DOM Manipulation",
    description: "Build an interactive form validator using vanilla JavaScript DOM manipulation.",
    due_date: "2024-06-01T23:59:00Z",
    max_score: 80,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "assign-3",
    course_id: "course-2",
    title: "Implement a Neural Network",
    description: "Build a simple neural network from scratch using NumPy. Train it on the MNIST dataset.",
    due_date: "2024-07-01T23:59:00Z",
    max_score: 100,
    created_at: "2024-02-01T00:00:00Z",
  },
];

// Mock live sessions
export const mockLiveSessions: LiveSession[] = [
  {
    id: "session-1",
    course_id: "course-1",
    mentor_id: "user-2",
    title: "Live Code Review Session",
    description: "We'll review your React projects and discuss best practices for component architecture.",
    scheduled_at: "2024-06-20T14:00:00Z",
    duration_minutes: 90,
    jitsi_room_id: "lumina-code-review-2024",
    status: "scheduled",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "session-2",
    course_id: "course-2",
    mentor_id: "user-2",
    title: "Machine Learning Q&A",
    description: "Open Q&A session for machine learning concepts and project guidance.",
    scheduled_at: "2024-06-22T10:00:00Z",
    duration_minutes: 60,
    jitsi_room_id: "lumina-ml-qa-2024",
    status: "scheduled",
    created_at: "2024-06-02T00:00:00Z",
  },
];

// Mock certificates
export const mockCertificates: Certificate[] = [
  {
    id: "cert-1",
    user_id: "user-1",
    course_id: "course-4",
    issued_at: "2024-01-15T00:00:00Z",
    certificate_url: "/certificates/cert-1.pdf",
  },
];

// Dashboard stats
export const mockDashboardStats = {
  totalCourses: 3,
  completedCourses: 1,
  totalHours: 185,
  certificatesEarned: 1,
  upcomingSessions: 2,
  pendingAssignments: 2,
};
