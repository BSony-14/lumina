"use client";

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
} from "lucide-react";
import Link from "next/link";
import {
  mockEnrollments,
  mockAssignments,
  mockLiveSessions,
  mockDashboardStats,
  mockCertificates,
} from "@/lib/api/mock-data";

const userName = "Sony";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const learningGoals = [
  { title: "Complete React hooks module", progress: 68 },
  { title: "Submit Todo App assignment", progress: 0, urgent: true },
  { title: "Attend ML Q&A session", progress: 50 },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <div className="rounded-xl border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {getGreeting()}, {userName}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Your AI/ML learning workspace is ready. Let&apos;s make progress today.
            </p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">7-Day Streak</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardStats.completedCourses} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.totalHours}</div>
            <p className="text-xs text-muted-foreground">+12h this week</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDashboardStats.certificatesEarned}
            </div>
            <p className="text-xs text-muted-foreground">Earned</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Action Items</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDashboardStats.pendingAssignments + mockDashboardStats.upcomingSessions}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Continue Learning - Takes 2 columns */}
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
                    Ready to help you with React hooks, ML concepts, or generate practice quizzes.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href="/ai-assistant">
                      <Button size="sm" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        Ask Anything
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      Generate Quiz
                    </Button>
                    <Button size="sm" variant="outline">
                      Revision Notes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Learning Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle>Today&apos;s Focus</CardTitle>
                </div>
                <Button variant="ghost" size="sm">
                  Edit Goals
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    <Progress value={goal.progress} className="h-1.5" />
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
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
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
                          <h3 className="font-semibold leading-tight">{enrollment.course?.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {enrollment.course?.provider}
                          </p>
                        </div>
                        <Badge variant="secondary">{enrollment.progress_percent}%</Badge>
                      </div>
                      <Progress value={enrollment.progress_percent} className="h-2" />
                      <Button size="sm" className="gap-1">
                        <Play className="h-3 w-3" />
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
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
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
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
                  <Badge variant="outline" className="text-xs">
                    {session.duration_minutes} min
                  </Badge>
                </div>
              ))}
              <Link href="/sessions">
                <Button variant="outline" size="sm" className="w-full">
                  View All Sessions
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">7-Day Learning Streak</p>
                  <p className="text-xs text-muted-foreground">Keep the momentum!</p>
                </div>
              </div>
              {mockCertificates.slice(0, 1).map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Certificate Earned</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Data Structures & Algorithms
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link href="/courses">
                <Button variant="outline" size="sm" className="w-full">
                  <BookOpen className="mr-1 h-3 w-3" />
                  Courses
                </Button>
              </Link>
              <Link href="/assignments">
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="mr-1 h-3 w-3" />
                  Tasks
                </Button>
              </Link>
              <Link href="/ai-assistant">
                <Button variant="outline" size="sm" className="w-full">
                  <Bot className="mr-1 h-3 w-3" />
                  AI Coach
                </Button>
              </Link>
              <Link href="/certificates">
                <Button variant="outline" size="sm" className="w-full">
                  <Award className="mr-1 h-3 w-3" />
                  Certs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
