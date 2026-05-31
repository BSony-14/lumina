// ─── Notification Templates ──────────────────────────────────────────────────
// Template definitions for 2 events × 2 channels (email + WhatsApp).
// Uses simple {{variable}} interpolation.

export type NotificationEventType = "assignment_graded" | "session_scheduled";
export type NotificationChannel = "email" | "whatsapp";

export interface NotificationTemplate {
  id: string;
  eventType: NotificationEventType;
  channel: NotificationChannel;
  subject?: string; // Email only
  body: string;
}

// ─── Template Definitions ────────────────────────────────────────────────────

const TEMPLATES: Record<NotificationEventType, Record<NotificationChannel, NotificationTemplate>> = {
  assignment_graded: {
    email: {
      id: "assignment_graded_email",
      eventType: "assignment_graded",
      channel: "email",
      subject: "Your assignment \"{{assignment_title}}\" has been graded!",
      body: `<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Assignment Graded</h1>
  </div>
  <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
    <p>Hi <strong>{{student_name}}</strong>,</p>
    <p>Your submission for <strong>{{assignment_title}}</strong> in <em>{{course_name}}</em> has been graded.</p>
    <div style="background: #f7fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Score:</strong> {{score}} / {{max_score}}</p>
      <p style="margin: 4px 0;"><strong>Feedback:</strong> {{feedback}}</p>
    </div>
    <a href="{{app_url}}/assignments" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 12px;">View Submission</a>
    <p style="color: #718096; font-size: 12px; margin-top: 24px;">— Lumina LMS</p>
  </div>
</body>
</html>`,
    },
    whatsapp: {
      id: "assignment_graded_wa",
      eventType: "assignment_graded",
      channel: "whatsapp",
      body: `Hi {{student_name}}! Your assignment "{{assignment_title}}" in {{course_name}} has been graded.

Score: {{score}}/{{max_score}}
Feedback: {{feedback}}

Check details in Lumina LMS.`,
    },
  },

  session_scheduled: {
    email: {
      id: "session_scheduled_email",
      eventType: "session_scheduled",
      channel: "email",
      subject: "New Live Session: {{session_title}}",
      body: `<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 24px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Live Session Scheduled</h1>
  </div>
  <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
    <p>Hi <strong>{{student_name}}</strong>,</p>
    <p>A new live session has been scheduled for <em>{{course_name}}</em>.</p>
    <div style="background: #f7fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Session:</strong> {{session_title}}</p>
      <p style="margin: 4px 0;"><strong>When:</strong> {{scheduled_at}}</p>
      <p style="margin: 4px 0;"><strong>Duration:</strong> {{duration}} minutes</p>
    </div>
    <a href="{{join_link}}" style="display: inline-block; background: #11998e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 12px;">Join Session</a>
    <p style="color: #718096; font-size: 12px; margin-top: 24px;">— Lumina LMS</p>
  </div>
</body>
</html>`,
    },
    whatsapp: {
      id: "session_scheduled_wa",
      eventType: "session_scheduled",
      channel: "whatsapp",
      body: `Hi {{student_name}}! A live session has been scheduled for {{course_name}}.

Session: {{session_title}}
When: {{scheduled_at}}
Duration: {{duration}} min

Join here: {{join_link}}`,
    },
  },
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get a notification template by event type and channel.
 */
export function getTemplate(
  eventType: NotificationEventType,
  channel: NotificationChannel
): NotificationTemplate | null {
  return TEMPLATES[eventType]?.[channel] ?? null;
}

/**
 * Render a template by replacing {{variable}} placeholders with values.
 */
export function renderTemplate(
  template: NotificationTemplate,
  variables: Record<string, string>
): { subject?: string; body: string } {
  const interpolate = (text: string): string => {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      return variables[key] ?? `{{${key}}}`;
    });
  };

  return {
    subject: template.subject ? interpolate(template.subject) : undefined,
    body: interpolate(template.body),
  };
}

/**
 * Get all supported event types.
 */
export function getSupportedEventTypes(): NotificationEventType[] {
  return Object.keys(TEMPLATES) as NotificationEventType[];
}
