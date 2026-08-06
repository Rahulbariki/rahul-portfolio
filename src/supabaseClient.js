import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only treat as ready if the URL is a real HTTP/HTTPS URL and key is a valid Supabase JWT key
const isValidUrl = (url) => {
  if (!url) return false
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

const isValidAnonKey = (key) => {
  if (!key || typeof key !== 'string') return false
  if (key === 'YOUR_SUPABASE_ANON_KEY_HERE') return false
  // Real Supabase anon keys are JWT strings starting with eyJ
  return key.startsWith('eyJ') || key.length > 50
}

const credentialsReady = isValidUrl(supabaseUrl) && isValidAnonKey(supabaseAnonKey)

if (!credentialsReady) {
  console.info(
    '[Supabase] No valid JWT credentials found in .env.local.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (JWT) from Supabase dashboard to enable cloud storage.\n' +
    'Optimized local storage mode active.'
  )
}

export const supabase = credentialsReady
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const BUCKET_NAME = 'portfolio-assets'
export const isSupabaseReady = credentialsReady
