/*
  # Notification System Schema

  Adds WhatsApp & Email automation infrastructure:
  1. phone_number + whatsapp_opted_in columns on user_profiles
  2. notification_log table for audit trail of sent messages
  3. RLS policies and indexes
*/

-- Add phone number and WhatsApp opt-in to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS whatsapp_opted_in boolean DEFAULT false;

-- Notification log — tracks every notification sent
CREATE TABLE IF NOT EXISTS notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  event_type text NOT NULL CHECK (event_type IN (
    'assignment_graded',
    'session_scheduled'
  )),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  metadata jsonb DEFAULT '{}',
  error_message text,
  external_id text,        -- Twilio SID or Resend email ID
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own notification history
CREATE POLICY "Users view own notification log" ON notification_log
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Service role (MCP server) can insert logs
CREATE POLICY "Service can insert notification log" ON notification_log
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notification_log_user ON notification_log(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_status ON notification_log(status);
CREATE INDEX IF NOT EXISTS idx_notification_log_event ON notification_log(event_type);
