// ─── Email Service (SendGrid) ────────────────────────────────────────────────
// Sends transactional emails via Twilio SendGrid REST API.
// Free tier: 100 emails/day, no credit card required.
// Requires Single Sender Verification (verify your "from" email).
//
// Required env vars:
//   SENDGRID_API_KEY
//   SENDGRID_FROM_EMAIL (e.g. "malve.nandu@gmail.com")
//   SENDGRID_FROM_NAME  (optional, e.g. "Lumina LMS")

const SENDGRID_API_BASE = "https://api.sendgrid.com/v3";

interface SendGridResponse {
  // SendGrid returns 202 with empty body on success
  errors?: Array<{ message: string; field?: string }>;
}

function getApiKey(): string {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) {
    throw new Error("Missing SENDGRID_API_KEY environment variable.");
  }
  return key;
}

function getFromEmail(): string {
  return process.env.SENDGRID_FROM_EMAIL ?? "noreply@lumina.dev";
}

function getFromName(): string {
  return process.env.SENDGRID_FROM_NAME ?? "Lumina LMS";
}

/**
 * Send a transactional email via SendGrid.
 * @param to Recipient email address
 * @param subject Email subject line
 * @param html HTML body content
 * @param text Optional plain-text fallback
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<{ id: string }> {
  const apiKey = getApiKey();

  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: getFromEmail(), name: getFromName() },
    subject,
    content: [
      ...(text ? [{ type: "text/plain", value: text }] : []),
      { type: "text/html", value: html },
    ],
  };

  const response = await fetch(`${SENDGRID_API_BASE}/mail/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  // SendGrid returns 202 Accepted with empty body on success
  if (response.status === 202) {
    const messageId = response.headers.get("x-message-id") ?? `sg-${Date.now()}`;
    return { id: messageId };
  }

  // Error handling
  const err = (await response.json()) as SendGridResponse;
  const errorMsg = err.errors?.map((e) => e.message).join(", ") ?? "Unknown error";
  throw new Error(`SendGrid email error ${response.status}: ${errorMsg}`);
}

/**
 * Check if email credentials are configured (non-throwing).
 */
export function isEmailConfigured(): boolean {
  return !!process.env.SENDGRID_API_KEY;
}
