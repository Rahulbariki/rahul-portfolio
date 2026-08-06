import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only treat as ready if the URL is a real HTTP/HTTPS URL (not a placeholder)
const isValidUrl = (url) => {
  if (!url) return false
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

const credentialsReady = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE'

if (!credentialsReady) {
  console.info(
    '[Supabase] No valid credentials found in .env.local.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable cloud image uploads.\n' +
    'Uploads will fall back to Base64 until then.'
  )
}

export const supabase = credentialsReady
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const BUCKET_NAME = 'portfolio-assets'
export const isSupabaseReady = credentialsReady
