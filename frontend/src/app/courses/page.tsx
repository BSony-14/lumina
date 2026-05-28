"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCourses } from "@/lib/api/mock-data";
import { Search, ListFilter as Filter } from "lucide-react";

const categories = [
  "all",
  "web-development",
  "machine-learning",
  "cloud",
  "computer-science",
  "devops",
  "data-science",
];

const difficulties = ["all", "beginner", "intermediate", "advanced"];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || course.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Discover courses from NPTEL, DeepLearning.AI, and top providers.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all"
                    ? "All Categories"
                    : cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff} value={diff}>
                  {diff === "all" ? "All Levels" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="mb-6 text-sm text-muted-foreground">
          {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} found
        </p>

        {/* Course grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group overflow-hidden rounded-lg border bg-card transition-all hover:border-primary hover:shadow-lg"
            >
              {/* Thumbnail */}
              {course.thumbnail_url && (
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                      {course.duration_hours}h
                    </Badge>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {course.provider}
                  </Badge>
                  <Badge
                    variant={
                      course.difficulty === "beginner"
                        ? "default"
                        : course.difficulty === "intermediate"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {course.difficulty}
                  </Badge>
                </div>

                <h3 className="mb-2 font-semibold group-hover:text-primary">
                  {course.title}
                </h3>

                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {course.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs capitalize text-muted-foreground">
                    {course.category.replace("-", " ")}
                  </span>
                  <Button size="sm">Enroll</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredCourses.length === 0 && (
          <div className="py-12 text-center">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No courses found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
