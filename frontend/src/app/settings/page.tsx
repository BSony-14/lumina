"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Moon, Globe, Trash2, MessageCircle, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const { profile, isDemo } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [whatsappOptedIn, setWhatsappOptedIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Send test notification via API route
  const handleTestNotification = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber || undefined,
          email: emailAddress || undefined,
          student_name: profile?.full_name || "Student",
        }),
      });

      const data = await res.json();
      if (data.success) {
        const summary = data.results
          .map((r: { channel: string; status: string; error?: string }) =>
            `${r.status === "sent" ? "✅" : "❌"} ${r.channel}: ${r.status}${r.error ? ` (${r.error})` : ""}`
          )
          .join(" | ");
        setTestResult(summary);
      } else {
        setTestResult(`Error: ${data.error}`);
      }
    } catch (err) {
      setTestResult(`Failed: ${(err as Error).message}`);
    } finally {
      setTesting(false);
      setTimeout(() => setTestResult(null), 8000);
    }
  };

  // Save WhatsApp preferences to Supabase
  const handleSaveWhatsApp = async () => {
    if (!supabase || !profile || isDemo) {
      setSaveStatus("error");
      return;
    }

    setSaving(true);
    setSaveStatus("idle");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("user_profiles")
        .update({
          phone_number: phoneNumber || null,
          whatsapp_opted_in: whatsappOptedIn,
        })
        .eq("id", profile.id);

      if (error) throw error;
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Failed to save WhatsApp settings:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>
                Customize how Lumina looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred theme.
                  </p>
                </div>
                <ThemeToggle />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth transitions and animations.
                  </p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Email Notifications</CardTitle>
              </div>
              <CardDescription>
                Choose what email notifications you receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email when assignments are graded.
                  </p>
                </div>
                <Switch id="email-notif" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="assignment-reminders">Assignment Graded</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your assignment is graded with feedback.
                  </p>
                </div>
                <Switch id="assignment-reminders" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="session-alerts">Session Scheduled</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when new live sessions are scheduled.
                  </p>
                </div>
                <Switch id="session-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <CardTitle>WhatsApp Notifications</CardTitle>
              </div>
              <CardDescription>
                Receive instant notifications on WhatsApp for important updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your WhatsApp number with country code (e.g., +91 for India).
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email-address">Email Address</Label>
                <Input
                  id="email-address"
                  type="email"
                  placeholder="you@example.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Email for receiving assignment grades and session notifications.
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whatsapp-optin">Enable WhatsApp Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    I agree to receive notifications via WhatsApp for assignment
                    grades and session reminders.
                  </p>
                </div>
                <Switch
                  id="whatsapp-optin"
                  checked={whatsappOptedIn}
                  onCheckedChange={setWhatsappOptedIn}
                  disabled={!phoneNumber}
                />
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveWhatsApp}
                  disabled={saving || isDemo}
                  size="sm"
                >
                  {saving ? "Saving..." : "Save WhatsApp Settings"}
                </Button>
                {saveStatus === "success" && (
                  <span className="text-sm text-green-600">Saved successfully!</span>
                )}
                {saveStatus === "error" && (
                  <span className="text-sm text-destructive">
                    {isDemo ? "Sign in to save settings" : "Failed to save. Try again."}
                  </span>
                )}
              </div>

              {whatsappOptedIn && phoneNumber && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <strong>Sandbox Mode:</strong> To receive WhatsApp messages during
                    testing, send &quot;join &lt;sandbox-code&gt;&quot; to the Twilio sandbox
                    number. Your mentor or admin will provide the code.
                  </p>
                </div>
              )}

              <Separator />

              {/* Test Notification Button */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleTestNotification}
                    disabled={testing || (!phoneNumber && !emailAddress)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    {testing ? "Sending..." : "Send Test Notification"}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Sends to {phoneNumber ? "WhatsApp" : ""}{phoneNumber && emailAddress ? " + " : ""}{emailAddress ? "Email" : ""}
                  </span>
                </div>
                {testResult && (
                  <p className="text-sm font-mono">{testResult}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>
                Manage your security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Change Password</Label>
                <div className="grid gap-2">
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Current password"
                  />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="New password"
                  />
                  <Button variant="outline" className="w-fit">
                    Update Password
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Language</CardTitle>
              </div>
              <CardDescription>
                Set your preferred language.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Display Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Currently set to English.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data.
                  </p>
                </div>
                <Button variant="destructive" size="sm" className="gap-1">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
