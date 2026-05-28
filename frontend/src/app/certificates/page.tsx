"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, ExternalLink } from "lucide-react";
import { mockCertificates, mockEnrollments, mockCourses } from "@/lib/api/mock-data";

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="mt-2 text-muted-foreground">
            Your earned credentials and achievements.
          </p>
        </div>

        {/* Certificates Grid */}
        {mockCertificates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockCertificates.map((cert) => {
              const course = mockEnrollments.find(
                (e) => e.course_id === cert.course_id
              )?.course;
              return (
                <Card key={cert.id} className="overflow-hidden">
                  {/* Certificate Visual */}
                  <div className="relative bg-gradient-to-br from-yellow-100 to-amber-50 p-8 dark:from-yellow-900/20 dark:to-amber-950/20">
                    <div className="absolute inset-0 opacity-10">
                      <div
                        className="h-full w-full"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />
                    </div>
                    <div className="relative text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
                        <Award className="h-8 w-8 text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        Certificate of Completion
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {course?.title}
                      </p>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <CardContent className="p-6">
                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issued:</span>
                        <span className="font-medium">
                          {new Date(cert.issued_at).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Provider:</span>
                        <span className="font-medium">{course?.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credential ID:</span>
                        <span className="font-mono text-xs">{cert.id.slice(0, 8)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                      <Button size="sm" className="gap-1">
                        <ExternalLink className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No certificates yet</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Complete courses to earn verified certificates.
              </p>
              <Button className="mt-4">Browse Courses</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
