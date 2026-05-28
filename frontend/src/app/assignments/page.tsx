"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Upload } from "lucide-react";
import { mockAssignments, mockCourses } from "@/lib/api/mock-data";

export default function AssignmentsPage() {
  const pendingAssignments = mockAssignments.filter((a) => {
    const dueDate = new Date(a.due_date);
    return dueDate > new Date();
  });

  const completedAssignments = [
    {
      id: "done-1",
      title: "HTML/CSS Portfolio Project",
      course: "Full-Stack Web Development",
      score: 95,
      feedback: "Excellent work! Clean design and semantic HTML.",
    },
    {
      id: "done-2",
      title: "Algorithm Analysis Report",
      course: "Data Structures & Algorithms",
      score: 88,
      feedback: "Good analysis. Consider edge cases more thoroughly.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="mt-2 text-muted-foreground">
            Track and submit your coursework.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAssignments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAssignments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Pending Assignments */}
          <TabsContent value="pending" className="space-y-4">
            {pendingAssignments.map((assignment) => {
              const daysLeft = Math.ceil(
                (new Date(assignment.due_date).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
              const isUrgent = daysLeft <= 3;

              return (
                <Card key={assignment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {mockCourses.find((c) => c.id === assignment.course_id)?.title}
                            </p>
                          </div>
                        </div>
                        <p className="ml-13 text-sm text-muted-foreground md:ml-0 md:pl-13">
                          {assignment.description}
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                          <Badge variant={isUrgent ? "destructive" : "secondary"}>
                            <Clock className="mr-1 h-3 w-3" />
                            {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                          </Badge>
                          <Badge variant="outline">
                            Max Score: {assignment.max_score}
                          </Badge>
                        </div>
                      </div>

                      <Button className="gap-2">
                        <Upload className="h-4 w-4" />
                        Submit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {pendingAssignments.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-4 text-lg font-medium">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">
                    You have no pending assignments.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Submitted */}
          <TabsContent value="submitted" className="space-y-4">
            {[
              {
                id: "sub-1",
                title: "Build a Todo App with React",
                course: "Full-Stack Web Development",
                submittedAt: "2024-06-10T14:30:00Z",
              },
            ].map((submission) => (
              <Card key={submission.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{submission.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {submission.course}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Awaiting Grade</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Completed */}
          <TabsContent value="completed" className="space-y-4">
            {completedAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {assignment.course}
                          </p>
                        </div>
                      </div>

                      <div className="ml-13 space-y-2 md:ml-0 md:pl-13">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Score:</span>
                          <Progress
                            value={assignment.score}
                            className="h-2 w-24"
                          />
                          <span className="text-sm font-bold text-green-600">
                            {assignment.score}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Feedback:
                          </span>{" "}
                          {assignment.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
