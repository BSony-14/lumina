// ─── WhatsApp Service (Twilio) ───────────────────────────────────────────────
// Sends WhatsApp messages via Twilio REST API.
// Uses the free Twilio Sandbox for development/testing.
//
// Required env vars:
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_WHATSAPP_FROM (e.g. "whatsapp:+14155238886")

interface TwilioMessageResponse {
  sid: string;
  status: string;
  error_code?: number;
  error_message?: string;
}

function getCredentials(): { accountSid: string; authToken: string; from: string } {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    throw new Error(
      "Missing Twilio credentials. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, " +
      "and TWILIO_WHATSAPP_FROM in environment."
    );
  }

  return { accountSid, authToken, from };
}

/**
 * Send a WhatsApp message via Twilio.
 * @param to Phone number in WhatsApp format (e.g. "whatsapp:+919876543210")
 * @param body Message text (max 1600 chars for session messages)
 */
export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<{ sid: string; status: string }> {
  const { accountSid, authToken, from } = getCredentials();

  // Ensure the "to" number has whatsapp: prefix
  const toFormatted = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const formData = new URLSearchParams({
    From: from,
    To: toFormatted,
    Body: body,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
    },
    body: formData.toString(),
  });

  const result = (await response.json()) as TwilioMessageResponse;

  if (!response.ok || result.error_code) {
    throw new Error(
      `Twilio WhatsApp error ${result.error_code ?? response.status}: ` +
      `${result.error_message ?? "Unknown error"}`
    );
  }

  return { sid: result.sid, status: result.status };
}

/**
 * Check if WhatsApp credentials are configured (non-throwing).
 */
export function isWhatsAppConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_FROM
  );
}
