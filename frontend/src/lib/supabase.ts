import { createClient } from '@supabase/supabase-js'

// Only create client if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Export a function to get the client lazily instead of creating at module load
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
  // Client-side only
  if (typeof window === 'undefined') {
    return null
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
})()

export type User = {
  id: string
  email: string
  full_name: string
  role: 'student' | 'mentor' | 'admin'
  avatar_url?: string
  created_at: string
}
