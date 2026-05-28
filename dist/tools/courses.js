import { z } from "zod";
import { queryTable, getById } from "../services/supabase.js";
import { formatPagination, makeTextContent, difficultyBadge, formatDate, toRecord, } from "../services/formatting.js";
const ResponseFormatSchema = z
    .enum(["markdown", "json"])
    .default("markdown")
    .describe("Output format: 'markdown' for human-readable, 'json' for machine-readable");
export function registerCourseTools(server) {
    // ── lms_list_courses ──────────────────────────────────────────────────────
    server.registerTool("lms_list_courses", {
        title: "List LMS Courses",
        description: `List all available courses in Lumina LMS with optional filtering.

Args:
  - category (string, optional): Filter by category slug
  - difficulty (string, optional): "beginner", "intermediate", or "advanced"
  - provider (string, optional): Filter by provider (e.g. "NPTEL", "DeepLearning.AI")
  - limit (number): Max results 1–100 (default: 20)
  - offset (number): Pagination offset (default: 0)
  - response_format: "markdown" or "json"

Returns: Paginated list of courses with provider, difficulty, and duration.`,
        inputSchema: z.object({
            category: z.string().optional().describe("Filter by category slug"),
            difficulty: z
                .enum(["beginner", "intermediate", "advanced"])
                .optional()
                .describe("Filter by difficulty level"),
            provider: z.string().optional().describe("Filter by provider name"),
            limit: z.number().int().min(1).max(100).default(20).describe("Max results"),
            offset: z.number().int().min(0).default(0).describe("Pagination offset"),
            response_format: ResponseFormatSchema,
        }),
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async ({ category, difficulty, provider, limit, offset, response_format }) => {
        const filters = {};
        if (category)
            filters["category"] = category;
        if (difficulty)
            filters["difficulty"] = difficulty;
        if (provider)
            filters["provider"] = provider;
        const { data, count, error } = await queryTable("courses", {
            limit,
            offset,
            filters,
            order: { column: "created_at", ascending: false },
        });
        if (error) {
            return {
                isError: true,
                content: [{ type: "text", text: `Error fetching courses: ${error}` }],
            };
        }
        const paginated = formatPagination(data, count ?? data.length, offset, limit);
        return {
            content: makeTextContent(paginated, response_format, (d) => {
                const p = d;
                if (!p.items.length)
                    return "No courses found matching your filters.";
                const lines = [
                    `## Lumina LMS Courses (${p.total} total)\n`,
                    ...p.items.map((c) => `### ${c.title}\n` +
                        `- **Provider**: ${c.provider}\n` +
                        `- **Difficulty**: ${difficultyBadge(c.difficulty)}\n` +
                        `- **Category**: ${c.category}\n` +
                        `- **Duration**: ${c.duration_hours}h\n` +
                        `- **ID**: \`${c.id}\`\n` +
                        `- ${c.description}\n`),
                    p.has_more
                        ? `\n_Showing ${p.offset + 1}–${p.offset + p.count} of ${p.total}. Use offset=${p.next_offset} for next page._`
                        : "",
                ];
                return lines.join("\n");
            }),
            structuredContent: toRecord(paginated),
        };
    });
    // ── lms_get_course ────────────────────────────────────────────────────────
    server.registerTool("lms_get_course", {
        title: "Get Course Details",
        description: `Get full details for a single course by its ID, including all modules and lessons.

Args:
  - course_id (string): UUID of the course
  - response_format: "markdown" or "json"

Returns: Course details with full module and lesson curriculum.`,
        inputSchema: z.object({
            course_id: z.string().uuid().describe("Course UUID"),
            response_format: ResponseFormatSchema,
        }),
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async ({ course_id, response_format }) => {
        const { data: course, error: courseErr } = await getById("courses", course_id);
        if (courseErr || !course) {
            return {
                isError: true,
                content: [{ type: "text", text: `Course not found: ${courseErr ?? "no data"}` }],
            };
        }
        const { data: modules } = await queryTable("modules", {
            filters: { course_id },
            order: { column: "order_index" },
            limit: 100,
        });
        const { data: lessons } = await queryTable("lessons", {
            filters: { course_id },
            order: { column: "order_index" },
            limit: 500,
        });
        const result = { course, modules, lessons };
        return {
            content: makeTextContent(result, response_format, (d) => {
                const { course: c, modules: mods, lessons: ls } = d;
                const moduleLines = mods.map((m) => {
                    const modLessons = ls.filter((l) => l.module_id === m.id);
                    const lessonList = modLessons
                        .map((l) => `  - [${l.content_type.toUpperCase()}] ${l.title} (${l.duration_minutes}min)`)
                        .join("\n");
                    return `### Module ${m.order_index}: ${m.title}\n${lessonList}`;
                });
                return [
                    `## ${c.title}`,
                    `**Provider**: ${c.provider} | **Difficulty**: ${difficultyBadge(c.difficulty)} | **Duration**: ${c.duration_hours}h`,
                    `**Category**: ${c.category}`,
                    `\n${c.description}\n`,
                    `---`,
                    `### Curriculum (${mods.length} modules, ${ls.length} lessons)`,
                    ...moduleLines,
                ].join("\n");
            }),
            structuredContent: toRecord(result),
        };
    });
    // ── lms_search_courses ────────────────────────────────────────────────────
    server.registerTool("lms_search_courses", {
        title: "Search Courses",
        description: `Full-text search for courses by title or description keyword.

Args:
  - query (string): Search keyword (2–100 chars)
  - limit (number): Max results 1–50 (default: 10)
  - response_format: "markdown" or "json"

Returns: Matching courses.`,
        inputSchema: z.object({
            query: z.string().min(2).max(100).describe("Search keyword"),
            limit: z.number().int().min(1).max(50).default(10).describe("Max results"),
            response_format: ResponseFormatSchema,
        }),
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async ({ query, limit, response_format }) => {
        const supabase = (await import("../services/supabase.js")).getSupabaseClient();
        const { data, count, error } = await supabase
            .from("courses")
            .select("*", { count: "exact" })
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(limit);
        if (error) {
            return {
                isError: true,
                content: [{ type: "text", text: `Search failed: ${error.message}` }],
            };
        }
        const courses = data ?? [];
        const paginated = formatPagination(courses, count ?? courses.length, 0, limit);
        return {
            content: makeTextContent(paginated, response_format, (d) => {
                const p = d;
                if (!p.items.length)
                    return `No courses found matching "${query}".`;
                return [
                    `## Search Results for "${query}" (${p.total} found)\n`,
                    ...p.items.map((c) => `**${c.title}** — ${difficultyBadge(c.difficulty)} | ${c.provider}\n` +
                        `> ${c.description.slice(0, 120)}...\n` +
                        `\`ID: ${c.id}\`\n` +
                        `Added: ${formatDate(c.created_at)}`),
                ].join("\n\n");
            }),
            structuredContent: toRecord(paginated),
        };
    });
}
//# sourceMappingURL=courses.js.map