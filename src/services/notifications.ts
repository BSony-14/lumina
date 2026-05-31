// ─── Notification Service ─────────────────────────────────────────────────────
// Orchestrates sending notifications across channels (email + WhatsApp).
// Respects user preferences, renders templates, and logs all attempts.

import { getSupabaseClient, insertRow } from "./supabase.js";
import { sendEmail, isEmailConfigured } from "./email.js";
import { sendWhatsAppMessage, isWhatsAppConfigured } from "./whatsapp.js";
import {
  getTemplate,
  renderTemplate,
  type NotificationEventType,
  type NotificationChannel,
} from "./notification-templates.js";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NotificationResult {
  userId: string;
  channels: {
    channel: NotificationChannel;
    status: "sent" | "failed" | "skipped";
    externalId?: string;
    error?: string;
  }[];
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  whatsapp_opted_in: boolean;
}

interface NotificationLogEntry {
  user_id: string;
  channel: NotificationChannel;
  event_type: string;
  status: "sent" | "failed";
  metadata: Record<string, unknown>;
  error_message?: string;
  external_id?: string;
  sent_at?: string;
}

// ─── Core Functions ──────────────────────────────────────────────────────────

/**
 * Send a notification to a single user across all eligible channels.
 * Automatically checks user preferences and channel availability.
 */
export async function sendNotification(
  userId: string,
  eventType: NotificationEventType,
  data: Record<string, string>
): Promise<NotificationResult> {
  const supabase = getSupabaseClient();

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, email, full_name, phone_number, whatsapp_opted_in")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return {
      userId,
      channels: [{ channel: "email", status: "failed", error: `User not found: ${profileError?.message}` }],
    };
  }

  const user = profile as UserProfile;
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  // Merge in common variables
  const variables: Record<string, string> = {
    ...data,
    student_name: user.full_name,
    app_url: appUrl,
  };

  const result: NotificationResult = { userId, channels: [] };

  // ─── Email Channel ─────────────────────────────────────────────────────────
  if (user.email && isEmailConfigured()) {
    const template = getTemplate(eventType, "email");
    if (template) {
      const rendered = renderTemplate(template, variables);
      try {
        const emailResult = await sendEmail(
          user.email,
          rendered.subject ?? `Lumina LMS Notification`,
          rendered.body
        );
        result.channels.push({ channel: "email", status: "sent", externalId: emailResult.id });
        await logNotification({
          user_id: userId,
          channel: "email",
          event_type: eventType,
          status: "sent",
          metadata: variables,
          external_id: emailResult.id,
          sent_at: new Date().toISOString(),
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown email error";
        result.channels.push({ channel: "email", status: "failed", error: errorMsg });
        await logNotification({
          user_id: userId,
          channel: "email",
          event_type: eventType,
          status: "failed",
          metadata: variables,
          error_message: errorMsg,
        });
      }
    }
  } else {
    result.channels.push({ channel: "email", status: "skipped", error: "Email not configured or no email address" });
  }

  // ─── WhatsApp Channel ──────────────────────────────────────────────────────
  if (user.whatsapp_opted_in && user.phone_number && isWhatsAppConfigured()) {
    const template = getTemplate(eventType, "whatsapp");
    if (template) {
      const rendered = renderTemplate(template, variables);
      try {
        const waResult = await sendWhatsAppMessage(user.phone_number, rendered.body);
        result.channels.push({ channel: "whatsapp", status: "sent", externalId: waResult.sid });
        await logNotification({
          user_id: userId,
          channel: "whatsapp",
          event_type: eventType,
          status: "sent",
          metadata: variables,
          external_id: waResult.sid,
          sent_at: new Date().toISOString(),
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown WhatsApp error";
        result.channels.push({ channel: "whatsapp", status: "failed", error: errorMsg });
        await logNotification({
          user_id: userId,
          channel: "whatsapp",
          event_type: eventType,
          status: "failed",
          metadata: variables,
          error_message: errorMsg,
        });
      }
    }
  } else {
    result.channels.push({
      channel: "whatsapp",
      status: "skipped",
      error: !user.whatsapp_opted_in
        ? "User not opted in"
        : !user.phone_number
        ? "No phone number"
        : "WhatsApp not configured",
    });
  }

  return result;
}

/**
 * Send notifications to multiple users (e.g., all enrolled students in a course).
 */
export async function sendBulkNotification(
  userIds: string[],
  eventType: NotificationEventType,
  data: Record<string, string>
): Promise<NotificationResult[]> {
  const results: NotificationResult[] = [];

  // Send sequentially to avoid rate limiting (Twilio sandbox is rate-limited)
  for (const userId of userIds) {
    const result = await sendNotification(userId, eventType, data);
    results.push(result);
  }

  return results;
}

/**
 * Get notification history for a user.
 */
export async function getNotificationHistory(
  userId: string,
  limit = 20
): Promise<{ data: Record<string, unknown>[]; error: string | null }> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("notification_log")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return {
    data: (data as Record<string, unknown>[]) ?? [],
    error: error ? error.message : null,
  };
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

async function logNotification(entry: NotificationLogEntry): Promise<void> {
  try {
    await insertRow("notification_log", entry as unknown as Record<string, unknown>);
  } catch {
    // Don't let logging failures break the notification flow
    console.error("Failed to log notification:", entry);
  }
}
