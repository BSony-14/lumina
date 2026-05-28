import { Course, User, Assignment, LiveSession, Module, Lesson, CourseEnrollment, Certificate } from "./types";

// Realistic user profiles
export const mockUsers: User[] = [
  {
    id: "user-demo-1",
    email: "student@lumina.dev",
    full_name: "Student",
    role: "student",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "user-demo-2",
    email: "mentor@lumina.dev",
    full_name: "Dr. Sarah Chen",
    role: "mentor",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    created_at: "2023-09-10T00:00:00Z",
  },
];

// Realistic courses from major providers
export const mockCourses: Course[] = [
  {
    id: "course-react-node",
    title: "Full-Stack Web Development with React & Node.js",
    description: "Master modern web development by building production-ready applications with React 18, Node.js, and PostgreSQL. Learn authentication, API design, and deployment strategies.",
    provider: "NPTEL",
    difficulty: "intermediate",
    category: "web-development",
    duration_hours: 120,
    thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f3e0b45a655c?w=800&h=450&fit=crop",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "course-ml-fundamentals",
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
    id: "course-aws-cloud",
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
    id: "course-dsa-python",
    title: "Data Structures & Algorithms in Python",
    description: "Essential CS foundations: arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming. Includes 200+ coding challenges for interview prep.",
    provider: "NPTEL",
    difficulty: "beginner",
    category: "computer-science",
    duration_hours: 50,
    thumbnail_url: "https://images.unsplash.com/photo-1509228468518-180dd45684f2?w=800&h=450&fit=crop",
    created_at: "2023-11-01T00:00:00Z",
    updated_at: "2023-11-01T00:00:00Z",
  },
  {
    id: "course-devops",
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
    id: "course-python-ds",
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
  {
    id: "course-nlp",
    title: "Natural Language Processing",
    description: "Advanced NLP techniques: text processing, transformers, BERT, GPT architectures, sentiment analysis, and chatbot development.",
    provider: "DeepLearning.AI",
    difficulty: "advanced",
    category: "machine-learning",
    duration_hours: 70,
    thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f8f1914cbaab?w=800&h=450&fit=crop",
    created_at: "2024-05-01T00:00:00Z",
    updated_at: "2024-05-01T00:00:00Z",
  },
  {
    id: "course-system-design",
    title: "System Design for Interviews",
    description: "Master system design interviews: scalability, load balancing, databases, caching, microservices, and real-world architecture.",
    provider: "Educative",
    difficulty: "intermediate",
    category: "system-design",
    duration_hours: 40,
    thumbnail_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
];

// Realistic module structure
export const mockModules: Module[] = [
  { id: "mod-web-1", course_id: "course-react-node", title: "Web Fundamentals", order_index: 1, created_at: "2024-01-01T00:00:00Z" },
  { id: "mod-web-2", course_id: "course-react-node", title: "React Fundamentals", order_index: 2, created_at: "2024-01-01T00:00:00Z" },
  { id: "mod-web-3", course_id: "course-react-node", title: "Node.js & Express", order_index: 3, created_at: "2024-01-01T00:00:00Z" },
  { id: "mod-web-4", course_id: "course-react-node", title: "Database Design", order_index: 4, created_at: "2024-01-01T00:00:00Z" },
  { id: "mod-web-5", course_id: "course-react-node", title: "Capstone Project", order_index: 5, created_at: "2024-01-01T00:00:00Z" },
];

// Detailed lessons
export const mockLessons: Lesson[] = [
  { id: "lesson-1", module_id: "mod-web-1", course_id: "course-react-node", title: "How the Web Works", content_type: "video", duration_minutes: 25, order_index: 1, created_at: "2024-01-01T00:00:00Z" },
  { id: "lesson-2", module_id: "mod-web-1", course_id: "course-react-node", title: "HTML5 Semantic Structure", content_type: "article", duration_minutes: 45, order_index: 2, created_at: "2024-01-01T00:00:00Z" },
  { id: "lesson-3", module_id: "mod-web-1", course_id: "course-react-node", title: "CSS & Modern Layouts", content_type: "video", duration_minutes: 60, order_index: 3, created_at: "2024-01-01T00:00:00Z" },
  { id: "lesson-4", module_id: "mod-web-1", course_id: "course-react-node", title: "JavaScript Essentials", content_type: "video", duration_minutes: 90, order_index: 4, created_at: "2024-01-01T00:00:00Z" },
  { id: "lesson-5", module_id: "mod-web-2", course_id: "course-react-node", title: "React Introduction", content_type: "video", duration_minutes: 35, order_index: 1, created_at: "2024-01-01T00:00:00Z" },
  { id: "lesson-6", module_id: "mod-web-2", course_id: "course-react-node", title: "Props and State", content_type: "video", duration_minutes: 50, order_index: 2, created_at: "2024-01-01T00:00:00Z" },
  { id: "lesson-7", module_id: "mod-web-2", course_id: "course-react-node", title: "useEffect Deep Dive", content_type: "video", duration_minutes: 55, order_index: 3, created_at: "2024-01-01T00:00:00Z" },
];

// Enrollments with realistic progress
export const mockEnrollments: CourseEnrollment[] = [
  {
    id: "enroll-1",
    user_id: "user-demo-1",
    course_id: "course-react-node",
    enrolled_at: "2024-03-01T00:00:00Z",
    progress_percent: 68,
    completed: false,
    course: mockCourses[0],
  },
  {
    id: "enroll-2",
    user_id: "user-demo-1",
    course_id: "course-ml-fundamentals",
    enrolled_at: "2024-02-15T00:00:00Z",
    progress_percent: 45,
    completed: false,
    course: mockCourses[1],
  },
  {
    id: "enroll-3",
    user_id: "user-demo-1",
    course_id: "course-dsa-python",
    enrolled_at: "2023-11-20T00:00:00Z",
    progress_percent: 100,
    completed: true,
    completed_at: "2024-01-15T00:00:00Z",
    course: mockCourses[3],
  },
];

// Assignments with realistic deadlines
export const mockAssignments: Assignment[] = [
  {
    id: "assign-todo-app",
    course_id: "course-react-node",
    lesson_id: "lesson-6",
    title: "Build a Todo App with React",
    description: "Create a fully functional todo application using React hooks. Include add, edit, delete, filter, and localStorage persistence. Focus on clean component architecture.",
    due_date: "2025-07-15T23:59:00Z",
    max_score: 100,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "assign-portfolio",
    course_id: "course-react-node",
    title: "Personal Portfolio Website",
    description: "Design and build a responsive portfolio showcasing your projects, skills, and contact information. Include dark mode toggle and smooth animations.",
    due_date: "2025-08-01T23:59:00Z",
    max_score: 100,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "assign-housing-prediction",
    course_id: "course-ml-fundamentals",
    title: "Housing Price Prediction Model",
    description: "Build a regression model to predict house prices using the California Housing dataset. Perform feature engineering, model selection, and evaluation.",
    due_date: "2025-07-20T23:59:00Z",
    max_score: 100,
    created_at: "2024-02-01T00:00:00Z",
  },
];

// Live sessions with realistic scheduling
export const mockLiveSessions: LiveSession[] = [
  {
    id: "session-react-hooks",
    course_id: "course-react-node",
    mentor_id: "user-demo-2",
    title: "React Hooks Deep Dive",
    description: "Live coding session exploring advanced hook patterns, custom hooks, performance optimization, and common pitfalls. Bring your questions!",
    scheduled_at: "2025-06-28T14:00:00Z",
    duration_minutes: 90,
    jitsi_room_id: "lumina-react-hooks-june-2025",
    status: "scheduled",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "session-ml-career",
    course_id: "course-ml-fundamentals",
    mentor_id: "user-demo-2",
    title: "ML Career Path Q&A",
    description: "Open discussion about machine learning careers, building portfolios, industry expectations, and transitioning into ML roles.",
    scheduled_at: "2025-06-22T10:00:00Z",
    duration_minutes: 60,
    jitsi_room_id: "lumina-ml-career-qa",
    status: "scheduled",
    created_at: "2024-06-02T00:00:00Z",
  },
  {
    id: "session-system-design",
    course_id: "course-system-design",
    mentor_id: "user-demo-2",
    title: "System Design Workshop",
    description: "Practice designing scalable systems: database sharding, caching strategies, and microservices communication patterns.",
    scheduled_at: "2025-07-05T15:00:00Z",
    duration_minutes: 120,
    jitsi_room_id: "lumina-system-design-july",
    status: "scheduled",
    created_at: "2024-06-10T00:00:00Z",
  },
];

// Certificates
export const mockCertificates: Certificate[] = [
  {
    id: "cert-dsa",
    user_id: "user-demo-1",
    course_id: "course-dsa-python",
    issued_at: "2024-01-15T00:00:00Z",
    certificate_url: "/certificates/cert-dsa.pdf",
  },
];

// Dashboard stats
export function getDashboardStats(enrollments: CourseEnrollment[]) {
  const completedCourses = enrollments.filter(e => e.completed).length;
  const totalHours = enrollments.reduce((sum, e) => sum + (e.course?.duration_hours || 0), 0);
  const certificatesEarned = mockCertificates.length;

  return {
    totalCourses: enrollments.length,
    completedCourses,
    totalHours,
    certificatesEarned,
    upcomingSessions: mockLiveSessions.filter(s => s.status === "scheduled").length,
    pendingAssignments: mockAssignments.filter(a => new Date(a.due_date) > new Date()).length,
  };
}
