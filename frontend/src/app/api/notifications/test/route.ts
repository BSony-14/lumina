// ─── Test Notification API Route ─────────────────────────────────────────────
// POST /api/notifications/test
// Sends a test notification (WhatsApp + Email) to the provided phone/email.
// Uses Twilio and Resend directly — no MCP server dependency.

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number, email, student_name } = body;

    if (!phone_number && !email) {
      return NextResponse.json(
        { error: "Provide phone_number or email" },
        { status: 400 }
      );
    }

    const results: { channel: string; status: string; id?: string; error?: string }[] = [];

    // ─── Send WhatsApp ─────────────────────────────────────────────────────
    if (phone_number) {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_WHATSAPP_FROM;

      if (accountSid && authToken && from) {
        try {
          const to = phone_number.startsWith("whatsapp:")
            ? phone_number
            : `whatsapp:${phone_number}`;

          const formData = new URLSearchParams({
            From: from,
            To: to,
            Body: `Hi ${student_name || "there"}! This is a test notification from Lumina LMS.\n\nYour WhatsApp notifications are configured correctly! You'll receive alerts for:\n- Assignment graded\n- Live session scheduled`,
          });

          const res = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
              },
              body: formData.toString(),
            }
          );

          const data = await res.json();
          if (res.ok) {
            results.push({ channel: "whatsapp", status: "sent", id: data.sid });
          } else {
            results.push({ channel: "whatsapp", status: "failed", error: data.message || data.error_message });
          }
        } catch (err) {
          results.push({ channel: "whatsapp", status: "failed", error: (err as Error).message });
        }
      } else {
        results.push({ channel: "whatsapp", status: "skipped", error: "Twilio not configured" });
      }
    }

    // ─── Send Email (SendGrid) ──────────────────────────────────────────────
    if (email) {
      const apiKey = process.env.SENDGRID_API_KEY;
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || "noreply@lumina.dev";
      const fromName = process.env.SENDGRID_FROM_NAME || "Lumina LMS";

      if (apiKey) {
        try {
          const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email }] }],
              from: { email: fromEmail, name: fromName },
              subject: "Lumina LMS — Test Notification",
              content: [{
                type: "text/html",
                value: `<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0;">Lumina LMS</h1>
                  </div>
                  <div style="border: 1px solid #e2e8f0; border-top: none; padding: 20px; border-radius: 0 0 12px 12px;">
                    <p>Hi <strong>${student_name || "there"}</strong>!</p>
                    <p>This is a <strong>test notification</strong> from Lumina LMS.</p>
                    <p>Your email notifications are configured correctly! You'll receive alerts for:</p>
                    <ul>
                      <li>Assignment graded</li>
                      <li>Live session scheduled</li>
                    </ul>
                    <p style="color: #718096; font-size: 12px; margin-top: 20px;">— Lumina LMS Notification System</p>
                  </div>
                </div>`,
              }],
            }),
          });

          if (res.status === 202) {
            const messageId = res.headers.get("x-message-id") || `sg-${Date.now()}`;
            results.push({ channel: "email", status: "sent", id: messageId });
          } else {
            const data = await res.json();
            const errorMsg = data.errors?.map((e: { message: string }) => e.message).join(", ") || "Unknown error";
            results.push({ channel: "email", status: "failed", error: errorMsg });
          }
        } catch (err) {
          results.push({ channel: "email", status: "failed", error: (err as Error).message });
        }
      } else {
        results.push({ channel: "email", status: "skipped", error: "Resend not configured" });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
