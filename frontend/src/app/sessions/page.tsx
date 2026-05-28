"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Users } from "lucide-react";
import { mockLiveSessions, mockCourses } from "@/lib/api/mock-data";

export default function SessionsPage() {
  const upcomingSessions = mockLiveSessions.filter(
    (s) => s.status === "scheduled" || s.status === "live"
  );
  const pastSessions = mockLiveSessions.filter((s) => s.status === "completed");

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Live Sessions</h1>
          <p className="mt-2 text-muted-foreground">
            Join live mentor sessions and interactive workshops.
          </p>
        </div>

        {/* Upcoming Sessions */}
        <div className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Upcoming Sessions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingSessions.map((session) => {
              const course = mockCourses.find((c) => c.id === session.course_id);
              return (
                <Card key={session.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 p-8 md:w-48">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {new Date(session.scheduled_at).getDate()}
                        </div>
                        <div className="text-sm uppercase text-muted-foreground">
                          {new Date(session.scheduled_at).toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {new Date(session.scheduled_at).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <CardContent className="flex-1 p-6">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {course?.title}
                          </p>
                        </div>
                        <Badge
                          variant={session.status === "live" ? "default" : "secondary"}
                        >
                          {session.status}
                        </Badge>
                      </div>

                      {session.description && (
                        <p className="mb-4 text-sm text-muted-foreground">
                          {session.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.duration_minutes} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          Jitsi Meet
                        </div>
                      </div>

                      <Button className="mt-4 w-full" disabled={session.status !== "live"}>
                        {session.status === "live" ? "Join Now" : "Set Reminder"}
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Past Sessions</h2>
            <div className="space-y-3">
              {pastSessions.map((session) => {
                const course = mockCourses.find((c) => c.id === session.course_id);
                return (
                  <Card key={session.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Video className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.scheduled_at).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            • {course?.title}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Recording
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
