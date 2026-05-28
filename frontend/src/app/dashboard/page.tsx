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
} from "lucide-react";
import Link from "next/link";
import {
  mockEnrollments,
  mockAssignments,
  mockLiveSessions,
  mockDashboardStats,
  mockCertificates,
} from "@/lib/api/mock-data";

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
        <p className="text-muted-foreground">
          You&apos;re making great progress. Keep up the momentum!
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardStats.completedCourses} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.totalHours}</div>
            <p className="text-xs text-muted-foreground">+12h this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDashboardStats.certificatesEarned}
            </div>
            <p className="text-xs text-muted-foreground">Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDashboardStats.pendingAssignments}
            </div>
            <p className="text-xs text-muted-foreground">Assignments due</p>
          </CardContent>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active courses */}
        <div className="lg:col-span-2">
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
                .slice(0, 3)
                .map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    {enrollment.course?.thumbnail_url && (
                      <img
                        src={enrollment.course.thumbnail_url}
                        alt={enrollment.course.title}
                        className="h-20 w-32 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold">{enrollment.course?.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.course?.provider}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{enrollment.progress_percent}% complete</span>
                          <span className="text-muted-foreground">
                            {enrollment.course?.duration_hours}h total
                          </span>
                        </div>
                        <Progress value={enrollment.progress_percent} />
                      </div>
                      <Button size="sm" className="gap-1">
                        <Play className="h-3 w-3" />
                        Resume
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick actions sidebar */}
        <div className="space-y-6">
          {/* Upcoming sessions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockLiveSessions.slice(0, 2).map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{session.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.scheduled_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {session.duration_minutes} min
                    </Badge>
                  </div>
                </div>
              ))}
              <Link href="/sessions">
                <Button variant="outline" size="sm" className="w-full">
                  View All Sessions
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Achievements</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">7-Day Streak</p>
                  <p className="text-xs text-muted-foreground">
                    Keep learning daily!
                  </p>
                </div>
              </div>
              {mockCertificates.slice(0, 1).map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Certificate Earned</p>
                    <p className="text-xs text-muted-foreground">
                      Data Structures & Algorithms
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
