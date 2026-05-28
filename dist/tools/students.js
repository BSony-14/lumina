import { z } from "zod";
import { queryTable, getById } from "../services/supabase.js";
import { formatPagination, makeTextContent, difficultyBadge, formatDate, toRecord, } from "../services/formatting.js";
const ResponseFormatSchema = z
    .enum(["markdown", "json"])
    .default("markdown")
    .describe("Output format: 'markdown' or 'json'");
export function registerStudentTools(server) {
    server.registerTool("lms_get_student_profile", {
        title: "Get Student Profile",
        description: `Fetch a learner's profile including role and account details.

Args:
  - user_id (string): UUID of the user
  - response_format: "markdown" or "json"

Returns: User profile with role (student/mentor/admin).`,
        inputSchema: z.object({
            user_id: z.string().uuid().describe("User UUID"),
            response_format: ResponseFormatSchema,
        }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ user_id, response_format }) => {
        const { data: user, error } = await getById("users", user_id);
        if (error || !user) {
            return { isError: true, content: [{ type: "text", text: `User not found: ${error ?? "no data"}` }] };
        }
        return {
            content: makeTextContent(user, response_format, (d) => {
                const u = d;
                return [`## ${u.full_name}`, `- **Email**: ${u.email}`, `- **Role**: ${u.role}`, `- **Joined**: ${formatDate(u.created_at)}`, `- **ID**: \`${u.id}\``].join("\n");
            }),
            structuredContent: toRecord(user),
        };
    });
    server.registerTool("lms_get_enrolled_courses", {
        title: "Get Student Enrolled Courses",
        description: `List all courses a student is enrolled in with progress percentages.

Args:
  - user_id (string): Student UUID
  - completed_only (boolean): Return only completed courses (default: false)
  - limit (number): Max results 1–100 (default: 20)
  - offset (number): Pagination offset (default: 0)
  - response_format: "markdown" or "json"

Returns: Paginated enrolled courses with progress.`,
        inputSchema: z.object({
            user_id: z.string().uuid().describe("Student UUID"),
            completed_only: z.boolean().default(false),
            limit: z.number().int().min(1).max(100).default(20),
            offset: z.number().int().min(0).default(0),
            response_format: ResponseFormatSchema,
        }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ user_id, completed_only, limit, offset, response_format }) => {
        const filters = { user_id };
        if (completed_only)
            filters["completed"] = true;
        const { data: enrollments, count, error } = await queryTable("course_enrollments", {
            filters, limit, offset, order: { column: "enrolled_at", ascending: false },
        });
        if (error)
            return { isError: true, content: [{ type: "text", text: `Error: ${error}` }] };
        const courseIds = enrollments.map((e) => e.course_id);
        let courses = [];
        if (courseIds.length) {
            const supabase = (await import("../services/supabase.js")).getSupabaseClient();
            const { data } = await supabase.from("courses").select("*").in("id", courseIds);
            courses = data ?? [];
        }
        const courseMap = new Map(courses.map((c) => [c.id, c]));
        const enriched = enrollments.map((e) => ({ ...e, course: courseMap.get(e.course_id) ?? null }));
        const paginated = formatPagination(enriched, count ?? enriched.length, offset, limit);
        return {
            content: makeTextContent(paginated, response_format, (d) => {
                const p = d;
                if (!p.items.length)
                    return "No enrolled courses found.";
                return [`## Enrolled Courses (${p.total} total)\n`, ...p.items.map((item) => {
                        const c = item.course;
                        const bar = progressBar(item.progress_percent);
                        return [`### ${c?.title ?? item.course_id}`, `${bar} **${item.progress_percent}%**`,
                            c ? `- **Provider**: ${c.provider} | ${difficultyBadge(c.difficulty)}` : "",
                            `- **Enrolled**: ${formatDate(item.enrolled_at)}`,
                            item.completed ? `- ✅ Completed on ${formatDate(item.completed_at)}` : "",
                        ].filter(Boolean).join("\n");
                    })].join("\n\n");
            }),
            structuredContent: toRecord(paginated),
        };
    });
    server.registerTool("lms_get_lesson_progress", {
        title: "Get Student Lesson Progress",
        description: `Get a student's lesson-level completion data for a course.

Args:
  - user_id (string): Student UUID
  - course_id (string): Course UUID
  - response_format: "markdown" or "json"

Returns: Lessons with completion status and time spent.`,
        inputSchema: z.object({
            user_id: z.string().uuid().describe("Student UUID"),
            course_id: z.string().uuid().describe("Course UUID"),
            response_format: ResponseFormatSchema,
        }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ user_id, course_id, response_format }) => {
        const { data, error } = await queryTable("lesson_progress", {
            filters: { user_id, course_id }, order: { column: "created_at" }, limit: 500,
        });
        if (error)
            return { isError: true, content: [{ type: "text", text: `Error: ${error}` }] };
        const completed = data.filter((lp) => lp.completed).length;
        const summary = {
            user_id, course_id,
            total_lessons_tracked: data.length,
            completed_lessons: completed,
            total_time_minutes: data.reduce((acc, lp) => acc + lp.time_spent_minutes, 0),
            progress: data,
        };
        return {
            content: makeTextContent(summary, response_format, (d) => {
                const s = d;
                return [`## Lesson Progress`, `**Completed**: ${s.completed_lessons} / ${s.total_lessons_tracked}`,
                    `**Total study time**: ${s.total_time_minutes} minutes\n`, `### Breakdown`,
                    ...s.progress.map((lp) => `- ${lp.completed ? "✅" : "⬜"} \`${lp.lesson_id}\` — ${lp.time_spent_minutes}min`),
                ].join("\n");
            }),
            structuredContent: toRecord(summary),
        };
    });
    server.registerTool("lms_mark_lesson_complete", {
        title: "Mark Lesson as Completed",
        description: `Record a lesson as completed for a student and update course progress %.

Args:
  - user_id (string): Student UUID
  - lesson_id (string): Lesson UUID
  - course_id (string): Course UUID
  - time_spent_minutes (number): Minutes spent (default: 0)

Returns: Confirmation with updated progress percent.`,
        inputSchema: z.object({
            user_id: z.string().uuid(),
            lesson_id: z.string().uuid(),
            course_id: z.string().uuid(),
            time_spent_minutes: z.number().int().min(0).default(0),
        }),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ user_id, lesson_id, course_id, time_spent_minutes }) => {
        const supabase = (await import("../services/supabase.js")).getSupabaseClient();
        const { error: upsertErr } = await supabase.from("lesson_progress").upsert({ user_id, lesson_id, course_id, completed: true, completed_at: new Date().toISOString(), time_spent_minutes }, { onConflict: "user_id,lesson_id" });
        if (upsertErr)
            return { isError: true, content: [{ type: "text", text: `Failed: ${upsertErr.message}` }] };
        const { count: totalLessons } = await supabase.from("lessons").select("*", { count: "exact", head: true }).eq("course_id", course_id);
        const { count: completedLessons } = await supabase.from("lesson_progress").select("*", { count: "exact", head: true }).eq("user_id", user_id).eq("course_id", course_id).eq("completed", true);
        const progressPercent = totalLessons && completedLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
        const isComplete = progressPercent === 100;
        await supabase.from("course_enrollments").update({
            progress_percent: progressPercent,
            ...(isComplete ? { completed: true, completed_at: new Date().toISOString() } : {}),
        }).eq("user_id", user_id).eq("course_id", course_id);
        const result = { lesson_id, progress_percent: progressPercent, course_completed: isComplete };
        return {
            content: [{ type: "text", text: `✅ Lesson complete. Course progress: **${progressPercent}%**${isComplete ? "\n🎉 Course completed!" : ""}` }],
            structuredContent: toRecord(result),
        };
    });
    server.registerTool("lms_get_certificates", {
        title: "Get Student Certificates",
        description: `List all certificates earned by a student.

Args:
  - user_id (string): Student UUID
  - response_format: "markdown" or "json"

Returns: Certificates with course info and issue date.`,
        inputSchema: z.object({
            user_id: z.string().uuid(),
            response_format: ResponseFormatSchema,
        }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ user_id, response_format }) => {
        const { data: certs, error } = await queryTable("certificates", {
            filters: { user_id }, order: { column: "issued_at", ascending: false }, limit: 100,
        });
        if (error)
            return { isError: true, content: [{ type: "text", text: `Error: ${error}` }] };
        return {
            content: makeTextContent(certs, response_format, (d) => {
                const cs = d;
                if (!cs.length)
                    return "No certificates earned yet.";
                return [`## Certificates (${cs.length} earned)\n`, ...cs.map((c) => `- 🏆 Course \`${c.course_id}\` — **${formatDate(c.issued_at)}**` + (c.certificate_url ? ` | [View](${c.certificate_url})` : ""))].join("\n");
            }),
            structuredContent: toRecord(certs),
        };
    });
}
function progressBar(percent) {
    const filled = Math.round(percent / 10);
    return "█".repeat(filled) + "░".repeat(10 - filled);
}
//# sourceMappingURL=students.js.map