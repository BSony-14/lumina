/*
  # Fix RLS Security Issues

  1. Security Changes
    - **certificates**: Drop the `System inserts certificates` INSERT policy that uses
      `WITH CHECK (true)`, which bypasses RLS entirely. Replace with a policy that
      only allows inserts where the authenticated user is the certificate owner
      (`user_id = auth.uid()`).
    - **session_attendance**: RLS is enabled but has zero policies, meaning no one
      can access the table at all. Add four policies:
      - SELECT: Users can view their own attendance records
      - INSERT: Users can insert their own attendance records (e.g., joining a session)
      - UPDATE: Users can update their own attendance records
      - DELETE: Users can delete their own attendance records

  2. Important Notes
    - The certificates INSERT policy `WITH CHECK (true)` allowed ANY authenticated
      user to insert certificates for ANY user_id, which is a serious security hole.
    - session_attendance had RLS enabled with no policies, effectively making the
      table inaccessible to all authenticated users.
*/

-- ============================================================
-- Fix certificates: replace permissive INSERT policy
-- ============================================================

DROP POLICY IF EXISTS "System inserts certificates" ON certificates;

CREATE POLICY "Users insert own certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Fix session_attendance: add all four CRUD policies
-- ============================================================

CREATE POLICY "Users view own attendance"
  ON session_attendance FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own attendance"
  ON session_attendance FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own attendance"
  ON session_attendance FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own attendance"
  ON session_attendance FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
