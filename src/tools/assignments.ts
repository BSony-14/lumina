// ─── Assignment Tools ─────────────────────────────────────────────────────────
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { queryTable, insertRow, updateRow } from "../services/supabase.js";
import { makeTextContent, formatDate, toRecord } from "../services/formatting.js";
import type { Assignment, AssignmentSubmission } from "../types.js";

const ResponseFormatSchema = z
  .enum(["markdown", "json"])
  .default("markdown")
  .describe("Output format: 'markdown' or 'json'");

export function registerAssignmentTools(server: McpServer): void {
  server.registerTool(
    "lms_list_assignments",
    {
      title: "List Course Assignments",
      description: `List all assignments for a course, optionally filtered by lesson.

Args:
  - course_id (string): Course UUID
  - lesson_id (string, optional): Filter to a specific lesson
  - limit (number): Max results 1–100 (default: 20)
  - offset (number): Pagination offset (default: 0)
  - response_format: "markdown" or "json"

Returns: Assignments with due dates and max scores.`,
      inputSchema: z.object({
        course_id: z.string().uuid(),
        lesson_id: z.string().uuid().optional(),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
        response_format: ResponseFormatSchema,
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ course_id, lesson_id, limit, offset, response_format }) => {
      const filters: Record<string, string | number | boolean | null> = { course_id };
      if (lesson_id) filters["lesson_id"] = lesson_id;

      const { data, count, error } = await queryTable<Assignment>("assignments", {
        filters, limit, offset, order: { column: "due_date" },
      });
      if (error) return { isError: true, content: [{ type: "text", text: `Error: ${error}` }] };

      const result = { items: data, total: count ?? data.length, count: data.length, offset, has_more: (count ?? 0) > offset + data.length };

      return {
        content: makeTextContent(result, response_format, (d) => {
          const { items } = d as typeof result;
          if (!items.length) return "No assignments found.";
          return [`## Assignments (${result.total} total)\n`, ...items.map((a) =>
            `### ${a.title}\n- **Due**: ${formatDate(a.due_date)}\n- **Max Score**: ${a.max_score}\n- ${a.description}\n- ID: \`${a.id}\``
          )].join("\n\n");
        }),
        structuredContent: toRecord(result),
      };
    }
  );

  server.registerTool(
    "lms_submit_assignment",
    {
      title: "Submit Assignment",
      description: `Record a student's assignment submission.

Args:
  - assignment_id (string): Assignment UUID
  - user_id (string): Student UUID
  - content (string): Submission text, markdown, or URL (10–5000 chars)

Returns: Confirmation with submission ID and timestamp.`,
      inputSchema: z.object({
        assignment_id: z.string().uuid(),
        user_id: z.string().uuid(),
        content: z.string().min(10).max(5000),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async ({ assignment_id, user_id, content }) => {
      const supabase = (await import("../services/supabase.js")).getSupabaseClient();
      const { data: existing } = await supabase
        .from("assignment_submissions")
        .select("id, submitted_at")
        .eq("assignment_id", assignment_id)
        .eq("user_id", user_id)
        .maybeSingle();

      if (existing) {
        const alreadyResult = { already_submitted: true, submission_id: existing.id as string };
        return {
          content: [{ type: "text", text: `⚠️ Already submitted on ${formatDate(existing.submitted_at as string)}. ID: \`${existing.id}\`` }],
          structuredContent: toRecord(alreadyResult),
        };
      }

      const { data: submission, error } = await insertRow<AssignmentSubmission>("assignment_submissions", {
        assignment_id, user_id, content, submitted_at: new Date().toISOString(),
      });
      if (error || !submission) return { isError: true, content: [{ type: "text", text: `Failed to submit: ${error}` }] };

      return {
        content: [{ type: "text", text: `✅ Submitted!\n- **ID**: \`${submission.id}\`\n- **At**: ${formatDate(submission.submitted_at)}\n\nYour mentor will review and grade it.` }],
        structuredContent: toRecord(submission),
      };
    }
  );

  server.registerTool(
    "lms_get_submission",
    {
      title: "Get Assignment Submission",
      description: `Fetch a student's submission for an assignment, including score and feedback if graded.

Args:
  - assignment_id (string): Assignment UUID
  - user_id (string): Student UUID
  - response_format: "markdown" or "json"

Returns: Submission content, score, and mentor feedback.`,
      inputSchema: z.object({
        assignment_id: z.string().uuid(),
        user_id: z.string().uuid(),
        response_format: ResponseFormatSchema,
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ assignment_id, user_id, response_format }) => {
      const supabase = (await import("../services/supabase.js")).getSupabaseClient();
      const { data, error } = await supabase
        .from("assignment_submissions")
        .select("*")
        .eq("assignment_id", assignment_id)
        .eq("user_id", user_id)
        .maybeSingle();

      if (error) return { isError: true, content: [{ type: "text", text: `Error: ${error.message}` }] };
      if (!data) return { content: [{ type: "text", text: "No submission found." }] };

      const submission = data as AssignmentSubmission;
      return {
        content: makeTextContent(submission, response_format, (d) => {
          const s = d as AssignmentSubmission;
          return [
            `## Submission`,
            `- **Submitted**: ${formatDate(s.submitted_at)}`,
            s.score !== undefined ? `- **Score**: ${s.score}` : "- **Score**: Pending",
            s.graded_at ? `- **Graded**: ${formatDate(s.graded_at)}` : "",
            `\n### Your Submission\n${s.content}`,
            s.feedback ? `\n### Mentor Feedback\n${s.feedback}` : "",
          ].filter(Boolean).join("\n");
        }),
        structuredContent: toRecord(submission),
      };
    }
  );

  server.registerTool(
    "lms_grade_assignment",
    {
      title: "Grade Assignment Submission (Mentor)",
      description: `Grade a student's submission with a score and feedback. Mentor/admin only.

Args:
  - submission_id (string): Submission UUID
  - score (number): Numeric score to award
  - feedback (string): Written feedback (10–2000 chars)

Returns: Confirmation of grade recorded.`,
      inputSchema: z.object({
        submission_id: z.string().uuid(),
        score: z.number().min(0),
        feedback: z.string().min(10).max(2000),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ submission_id, score, feedback }) => {
      const { data, error } = await updateRow<AssignmentSubmission>("assignment_submissions", submission_id, {
        score, feedback, graded_at: new Date().toISOString(),
      });
      if (error || !data) return { isError: true, content: [{ type: "text", text: `Failed to grade: ${error}` }] };

      return {
        content: [{ type: "text", text: `✅ Graded \`${submission_id}\`\n- **Score**: ${score}\n- **Graded**: ${formatDate(data.graded_at!)}\n\nFeedback saved.` }],
        structuredContent: toRecord(data),
      };
    }
  );
}
