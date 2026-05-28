"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as SupabaseUser, createClient } from "@supabase/supabase-js";

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create supabase client only if env vars are present
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "mentor" | "admin";
  avatar_url?: string;
  learning_goal?: string;
  cohort?: string;
  progress_percentage: number;
  courses_enrolled: number;
  courses_completed: number;
  learning_hours: number;
  streak_days: number;
  created_at: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default profile for demo mode
const demoProfile: UserProfile = {
  id: "demo-user",
  email: "demo@lumina.dev",
  full_name: "Demo Learner",
  role: "student",
  learning_goal: "Full-Stack Development",
  cohort: "2024-cohort",
  progress_percentage: 68,
  courses_enrolled: 3,
  courses_completed: 1,
  learning_hours: 185,
  streak_days: 5,
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !supabase;

  useEffect(() => {
    // If no Supabase client, use demo mode
    if (!supabase) {
      setProfile(demoProfile);
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setProfile(demoProfile);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setProfile(demoProfile);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (user: SupabaseUser) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data || demoProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(demoProfile);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) {
      // Demo mode - simulate success
      setProfile({ ...demoProfile, email, full_name: fullName });
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      // Demo mode - simulate success
      setProfile(demoProfile);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(demoProfile);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isDemo, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
