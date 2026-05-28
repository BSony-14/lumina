"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as SupabaseUser, createClient, SupabaseClient } from "@supabase/supabase-js";

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

// Singleton Supabase client - only created on client side
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  // Only create on client side
  if (typeof window === "undefined") return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();

    // If no Supabase client, use demo mode
    if (!supabase) {
      setProfile(demoProfile);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(supabase, session.user);
      } else {
        setProfile(demoProfile);
        setIsDemo(true);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(supabase, session.user);
      } else {
        setProfile(demoProfile);
        setIsDemo(true);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (supabase: SupabaseClient, user: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data || demoProfile);
      setIsDemo(!data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(demoProfile);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      // Demo mode - simulate success
      setProfile({ ...demoProfile, email, full_name: fullName });
      setIsDemo(true);
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
    const supabase = getSupabaseClient();

    if (!supabase) {
      // Demo mode - simulate success
      setProfile(demoProfile);
      setIsDemo(true);
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
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(demoProfile);
    setIsDemo(true);
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
