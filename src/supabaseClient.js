import { createClient } from '@supabase/supabase-js'

// These two values come from your Supabase project settings.
// See SETUP.md for exactly where to find them.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
