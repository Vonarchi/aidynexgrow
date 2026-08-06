import { createClient } from '@supabase/supabase-js'

export function createEngineSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are required for the website engine.')
  }

  return createClient(supabaseUrl, supabaseKey)
}
