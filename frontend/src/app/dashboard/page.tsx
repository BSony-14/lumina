"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Award,
  Calendar,
  FileText,
  TrendingUp,
  Play,
  Bot,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import {
  mockEnrollments,
  mockAssignments,
  mockLiveSessions,
  mockCertificates,
  getDashboardStats,
} from "@/lib/api/mock-data";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const learningGoals = [
  { title: "Complete React hooks module", progress: 68, category: "Web Development" },
  { title: "Submit Todo App assignment", progress: 0, urgent: true, category: "Assignment" },
  { title: "Attend ML Q&A session", progress: 50, category: "Live Session" },
  { title: "Practice system design problems", progress: 25, category: "Interview Prep" },
];

const learningInsights = [
  { title: "Strong in React fundamentals", status: "strong" },
  { title: "Focus: JavaScript async patterns", status: "improve" },
  { title: "On track for ML milestone", status: "progress" },
];

export default function StudentDashboard() {
  const { profile, loading } = useAuth();
  const userName = profile?.full_name?.split(" ")[0] || "Learner";
  const stats = getDashboardStats(mockEnrollments);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading workspace...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <div className="rounded-xl border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{getGreeting()}</p>
            <h1 className="text-3xl font-bold">{userName}&apos;s Learning Workspace</h1>
            <p className="mt-1 text-muted-foreground">
              {profile?.learning_goal
                ? `Continue your journey in ${profile.learning_goal}`
                : "Your personalized AI-powered learning environment"}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {profile?.streak_days && profile.streak_days > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-1.5 dark:bg-orange-950/20">
                <Zap className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">{profile.streak_days}-day streak</span>
              </div>
            )}
            {profile?.cohort && (
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {profile.cohort}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">{stats.completedCourses} completed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">Total time invested</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
            <p className="text-xs text-muted-foreground">Credentials earned</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Action Items</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAssignments + stats.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">Tasks & sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Learning Companion */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">AI Learning Coach</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your personal tutor for React, ML, or any course. Ask questions, generate quizzes, or create study notes.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href="/ai-assistant">
                      <Button size="sm" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        Start Conversation
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">Generate Quiz</Button>
                    <Button size="sm" variant="outline">Study Notes</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Goals / Today's Focus */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle>Today&apos;s Focus</CardTitle>
                </div>
                <Button variant="ghost" size="sm">Add Goal</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {learningGoals.map((goal, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    goal.urgent ? "border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${goal.urgent ? "text-orange-700 dark:text-orange-400" : ""}`}>
                        {goal.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={goal.progress} className="h-1.5 flex-1" />
                      <Badge variant="outline" className="text-[10px]">{goal.category}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Continue Learning</CardTitle>
                <Link href="/courses">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockEnrollments
                .filter((e) => !e.completed)
                .slice(0, 2)
                .map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="group flex items-start gap-4 rounded-lg border p-4 transition-all hover:border-primary"
                  >
                    {enrollment.course?.thumbnail_url && (
                      <img
                        src={enrollment.course.thumbnail_url}
                        alt={enrollment.course.title}
                        className="h-16 w-28 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">{enrollment.course?.provider}</Badge>
                          <h3 className="font-semibold leading-tight">{enrollment.course?.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {enrollment.course?.duration_hours}h • {enrollment.course?.difficulty}
                          </p>
                        </div>
                        <Badge variant="secondary">{enrollment.progress_percent}%</Badge>
                      </div>
                      <Progress value={enrollment.progress_percent} className="h-2" />
                      <Button size="sm" className="gap-1">
                        <Play className="h-3 w-3" />
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Learning Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Learning Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {learningInsights.map((insight, index) => (
                <div key={index} className={`flex items-center gap-2 p-2 rounded-lg ${
                  insight.status === "strong" ? "bg-green-50 dark:bg-green-950/20" :
                  insight.status === "improve" ? "bg-orange-50 dark:bg-orange-950/20" :
                  "bg-blue-50 dark:bg-blue-950/20"
                }`}>
                  <div className={`h-2 w-2 rounded-full ${
                    insight.status === "strong" ? "bg-green-500" :
                    insight.status === "improve" ? "bg-orange-500" :
                    "bg-blue-500"
                  }`} />
                  <span className="text-sm">{insight.title}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming Sessions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockLiveSessions.slice(0, 2).map((session) => (
                <div
                  key={session.id}
                  className="rounded-lg border bg-muted/30 p-3"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.scheduled_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">{session.duration_minutes} min</Badge>
                    <Badge variant="outline" className="text-xs">{session.max_attendees || 30} seats</Badge>
                  </div>
                </div>
              ))}
              <Link href="/sessions">
                <Button variant="outline" size="sm" className="w-full">View All Sessions</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAssignments.slice(0, 3).map((assignment) => {
                const daysLeft = Math.ceil(
                  (new Date(assignment.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={assignment.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {daysLeft > 0 ? `${daysLeft} days left` : "Due today"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">Submit</Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link href="/courses"><Button variant="outline" size="sm" className="w-full gap-1"><BookOpen className="h-3 w-3" />Courses</Button></Link>
              <Link href="/assignments"><Button variant="outline" size="sm" className="w-full gap-1"><FileText className="h-3 w-3" />Tasks</Button></Link>
              <Link href="/ai-assistant"><Button variant="outline" size="sm" className="w-full gap-1"><Bot className="h-3 w-3" />AI Coach</Button></Link>
              <Link href="/certificates"><Button variant="outline" size="sm" className="w-full gap-1"><Award className="h-3 w-3" />Certs</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
