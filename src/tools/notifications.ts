// ─── Notification Tools ──────────────────────────────────────────────────────
// MCP tools for WhatsApp & Email notification automation.
// Exposes notification sending and history to AI agents.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { sendNotification, sendBulkNotification, getNotificationHistory } from "../services/notifications.js";
import { getSupportedEventTypes } from "../services/notification-templates.js";
import { makeTextContent, formatDate, toRecord } from "../services/formatting.js";

const ResponseFormatSchema = z
  .enum(["markdown", "json"])
  .default("markdown")
  .describe("Output format: 'markdown' or 'json'");

const EventTypeSchema = z.enum(["assignment_graded", "session_scheduled"]);

export function registerNotificationTools(server: McpServer): void {
  server.registerTool(
    "lms_send_notification",
    {
      title: "Send Notification",
      description: `Send a notification to a user via their enabled channels (email and/or WhatsApp).

Args:
  - user_id (string): Target user UUID
  - event_type (string): "assignment_graded" or "session_scheduled"
  - data (object): Template variables — keys depend on event type:
      assignment_graded: assignment_title, course_name, score, max_score, feedback
      session_scheduled: session_title, course_name, scheduled_at, duration, join_link

Returns: Delivery status per channel (sent/failed/skipped).`,
      inputSchema: z.object({
        user_id: z.string().uuid(),
        event_type: EventTypeSchema,
        data: z.record(z.string()).describe("Template variables for the notification"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ user_id, event_type, data }) => {
      try {
        const result = await sendNotification(user_id, event_type, data);

        const summary = result.channels
          .map((ch) => {
            const icon = ch.status === "sent" ? "✅" : ch.status === "failed" ? "❌" : "⏭️";
            return `${icon} **${ch.channel}**: ${ch.status}${ch.error ? ` — ${ch.error}` : ""}${ch.externalId ? ` (ID: \`${ch.externalId}\`)` : ""}`;
          })
          .join("\n");

        return {
          content: [{ type: "text", text: `## Notification Sent\n\n**User**: \`${user_id}\`\n**Event**: ${event_type}\n\n### Channel Results\n${summary}` }],
          structuredContent: toRecord(result),
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return { isError: true, content: [{ type: "text", text: `Failed to send notification: ${msg}` }] };
      }
    }
  );

  server.registerTool(
    "lms_send_bulk_notification",
    {
      title: "Send Bulk Notification",
      description: `Send notifications to multiple users (e.g., all students enrolled in a course).

Args:
  - user_ids (string[]): Array of user UUIDs to notify
  - event_type (string): "assignment_graded" or "session_scheduled"
  - data (object): Template variables (same as lms_send_notification)

Returns: Summary of delivery results across all users.`,
      inputSchema: z.object({
        user_ids: z.array(z.string().uuid()).min(1).max(100),
        event_type: EventTypeSchema,
        data: z.record(z.string()).describe("Template variables for the notification"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ user_ids, event_type, data }) => {
      try {
        const results = await sendBulkNotification(user_ids, event_type, data);

        const sent = results.flatMap((r) => r.channels.filter((c) => c.status === "sent")).length;
        const failed = results.flatMap((r) => r.channels.filter((c) => c.status === "failed")).length;
        const skipped = results.flatMap((r) => r.channels.filter((c) => c.status === "skipped")).length;

        return {
          content: [{
            type: "text",
            text: `## Bulk Notification Complete\n\n**Event**: ${event_type}\n**Users**: ${user_ids.length}\n\n### Summary\n- ✅ Sent: ${sent}\n- ❌ Failed: ${failed}\n- ⏭️ Skipped: ${skipped}`,
          }],
          structuredContent: toRecord({ event_type, total_users: user_ids.length, sent, failed, skipped, results }),
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return { isError: true, content: [{ type: "text", text: `Bulk notification failed: ${msg}` }] };
      }
    }
  );

  server.registerTool(
    "lms_get_notification_history",
    {
      title: "Get Notification History",
      description: `Fetch the notification log for a user — shows sent emails and WhatsApp messages.

Args:
  - user_id (string): User UUID
  - limit (number): Max results 1–50 (default: 20)
  - response_format: "markdown" or "json"

Returns: Recent notification log entries with status and timestamps.`,
      inputSchema: z.object({
        user_id: z.string().uuid(),
        limit: z.number().int().min(1).max(50).default(20),
        response_format: ResponseFormatSchema,
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ user_id, limit, response_format }) => {
      const { data, error } = await getNotificationHistory(user_id, limit);
      if (error) return { isError: true, content: [{ type: "text", text: `Error: ${error}` }] };

      return {
        content: makeTextContent(data, response_format, (d) => {
          const logs = d as Record<string, unknown>[];
          if (!logs.length) return "No notifications sent yet.";
          return [
            `## Notification History (${logs.length} entries)\n`,
            ...logs.map((log) => {
              const icon = log.status === "sent" ? "✅" : "❌";
              return `${icon} **${log.channel}** | ${log.event_type} | ${formatDate(log.created_at as string)}${log.error_message ? ` | Error: ${log.error_message}` : ""}`;
            }),
          ].join("\n");
        }),
        structuredContent: toRecord(data),
      };
    }
  );

  server.registerTool(
    "lms_get_supported_notifications",
    {
      title: "List Supported Notification Types",
      description: `List all supported notification event types and channels.

Returns: Available event types that can be used with lms_send_notification.`,
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async () => {
      const eventTypes = getSupportedEventTypes();
      const channels = ["email", "whatsapp"];

      const info = {
        event_types: eventTypes,
        channels,
        templates: eventTypes.map((et) => ({
          event_type: et,
          available_channels: channels,
          required_data: et === "assignment_graded"
            ? ["assignment_title", "course_name", "score", "max_score", "feedback"]
            : ["session_title", "course_name", "scheduled_at", "duration", "join_link"],
        })),
      };

      return {
        content: [{
          type: "text",
          text: [
            "## Supported Notification Types\n",
            "| Event | Required Data |",
            "|-------|--------------|",
            `| \`assignment_graded\` | assignment_title, course_name, score, max_score, feedback |`,
            `| \`session_scheduled\` | session_title, course_name, scheduled_at, duration, join_link |`,
            "\n**Channels**: email, whatsapp",
            "\nWhatsApp requires user opt-in and phone number configured.",
          ].join("\n"),
        }],
        structuredContent: toRecord(info),
      };
    }
  );
}
