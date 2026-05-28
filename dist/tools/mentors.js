import { z } from "zod";
import { queryTable, insertRow, updateRow } from "../services/supabase.js";
import { makeTextContent, formatDate, formatPagination, toRecord } from "../services/formatting.js";
const ResponseFormatSchema = z
    .enum(["markdown", "json"])
    .default("markdown")
    .describe("Output format: 'markdown' or 'json'");
export function registerMentorTools(server) {
    server.registerTool("lms_list_mentors", {
        title: "List Available Mentors",
        description: `List all mentors registered in Lumina LMS.

Args:
  - limit (number): Max results 1–100 (default: 20)
  - offset (number): Pagination offset (default: 0)
  - response_format: "markdown" or "json"

Returns: Paginated list of mentor profiles.`,
        inputSchema: z.object({
            limit: z.number().int().min(1).max(100).default(20),
            offset: z.number().int().min(0).default(0),
            response_format: ResponseFormatSchema,
        }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ limit, offset, response_format }) => {
        const { data, count, error } = await queryTable("users", {
            filters: { role: "mentor" }, limit, offset, order: { column: "full_name" },
        });
        if (error)
            return { isError: true, content: [{ type: "text", text: `Error: ${error}` }] };
        const paginated = formatPagination(data, count ?? data.length, offset, limit);
        return {
            content: makeTextContent(paginated, response_format, (d) => {
                const p = d;
                if (!p.items.length)
                    return "No mentors found.";
                return [`## Mentors (${p.total} total)\n`, ...p.items.map((m) => `- **${m.full_name}** — ${m.email} | Joined ${formatDate(m.created_at)} | ID: \`${m.id}\``)].join("\n");
            }),
            structuredContent: toRecord(paginated),
        };
    });
    server.registerTool("lms_list_live_sessions", {
        title: "List Live Class Sessions",
        description: `List upcoming or past live class sessions.

Args:
  - course_id (string, optional): Filter by course UUID
  - mentor_id (string, optional): Filter by mentor UUID
  - status (string, optional): "scheduled", "live", "completed", or "cancelled"
  - limit (number): Max results 1–50 (default: 10)
  - offset (number): Pagination offset (default: 0)
  - response_format: "markdown" or "json"

Returns: Paginated list of sessions with Jitsi room info.`,
        inputSchema: z.object({
            course_id: z.string().uuid().optional(),
            mentor_id: z.string().uuid().optional(),
            status: z.enum(["scheduled", "live", "completed", "cancelled"]).optional(),
            limit: z.number().int().min(1).max(50).default(10),
            offset: z.number().int().min(0).default(0),
            response_format: ResponseFormatSchema,
        }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ course_id, mentor_id, status, limit, offset, response_format }) => {
        const filters = {};
        if (course_id)
            filters["course_id"] = course_id;
        if (mentor_id)
            filters["mentor_id"] = mentor_id;
        if (status)
            filters["status"] = status;
        const { data, count, error } = await queryTable("live_sessions", {
            filters, limit, offset, order: { column: "scheduled_at" },
        });
        if (error)
            return { isError: true, content: [{ type: "text", text: `Error: ${error}` }] };
        const paginated = formatPagination(data, count ?? data.length, offset, limit);
        const statusEmoji = { scheduled: "📅", live: "🔴", completed: "✅", cancelled: "❌" };
        return {
            content: makeTextContent(paginated, response_format, (d) => {
                const p = d;
                if (!p.items.length)
                    return "No live sessions found.";
                return [`## Live Sessions (${p.total} total)\n`, ...p.items.map((s) => `### ${statusEmoji[s.status] ?? ""} ${s.title}\n` +
                        `- **When**: ${formatDate(s.scheduled_at)} (${s.duration_minutes}min)\n` +
                        `- **Status**: ${s.status}\n` +
                        `- **Join**: https://meet.jit.si/${s.jitsi_room_id}\n` +
                        (s.description ? `- ${s.description}\n` : ""))].join("\n\n");
            }),
            structuredContent: toRecord(paginated),
        };
    });
    server.registerTool("lms_schedule_live_session", {
        title: "Schedule Live Session (Mentor)",
        description: `Schedule a new live class for a course. Auto-generates a Jitsi room ID.

Args:
  - course_id (string): Course UUID
  - mentor_id (string): Mentor UUID
  - title (string): Session title (5–200 chars)
  - description (string, optional): Session description
  - scheduled_at (string): ISO 8601 datetime e.g. "2025-08-01T10:00:00Z"
  - duration_minutes (number): Length in minutes 15–180 (default: 60)

Returns: Created session with Jitsi join link.`,
        inputSchema: z.object({
            course_id: z.string().uuid(),
            mentor_id: z.string().uuid(),
            title: z.string().min(5).max(200),
            description: z.string().max(500).optional(),
            scheduled_at: z.string().describe("ISO 8601 datetime"),
            duration_minutes: z.number().int().min(15).max(180).default(60),
        }),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    }, async (params) => {
        const roomId = `lumina-${params.course_id.slice(0, 8)}-${Date.now()}`;
        const { data: session, error } = await insertRow("live_sessions", {
            course_id: params.course_id,
            mentor_id: params.mentor_id,
            title: params.title,
            description: params.description ?? null,
            scheduled_at: params.scheduled_at,
            duration_minutes: params.duration_minutes,
            jitsi_room_id: roomId,
            status: "scheduled",
        });
        if (error || !session)
            return { isError: true, content: [{ type: "text", text: `Failed: ${error}` }] };
        return {
            content: [{ type: "text", text: [
                        `✅ Live session scheduled!`,
                        `- **Title**: ${session.title}`,
                        `- **When**: ${formatDate(session.scheduled_at)} (${session.duration_minutes}min)`,
                        `- **Join**: https://meet.jit.si/${session.jitsi_room_id}`,
                        `- **Session ID**: \`${session.id}\``,
                    ].join("\n") }],
            structuredContent: toRecord(session),
        };
    });
    server.registerTool("lms_update_session_status", {
        title: "Update Live Session Status (Mentor/Admin)",
        description: `Update a live session's status — mark it live when it starts, or completed when it ends.

Args:
  - session_id (string): Session UUID
  - status (string): "live", "completed", or "cancelled"

Returns: Confirmation of update.`,
        inputSchema: z.object({
            session_id: z.string().uuid(),
            status: z.enum(["live", "completed", "cancelled"]),
        }),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ session_id, status }) => {
        const { data, error } = await updateRow("live_sessions", session_id, { status });
        if (error || !data)
            return { isError: true, content: [{ type: "text", text: `Failed: ${error}` }] };
        const emoji = { live: "🔴", completed: "✅", cancelled: "❌" }[status] ?? "";
        return {
            content: [{ type: "text", text: `${emoji} Session "${data.title}" → **${status}**` }],
            structuredContent: toRecord(data),
        };
    });
}
//# sourceMappingURL=mentors.js.map