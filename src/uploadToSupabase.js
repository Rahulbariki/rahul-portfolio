import { supabase, BUCKET_NAME, isSupabaseReady } from './supabaseClient.js'

/**
 * Upload a File to Supabase Storage.
 * @param {File} file - The file object to upload
 * @param {string} folder - Subfolder in the bucket: 'profile' | 'projects' | 'certificates' | 'hackathons' | 'media'
 * @param {function} onProgress - Optional progress callback (not supported by Supabase JS v2, reserved for future)
 * @returns {Promise<string>} - Public CDN URL of the uploaded file, or a base64 data URL as fallback
 */
export async function uploadToSupabase(file, folder = 'media', onProgress = null) {
  // Fallback: if Supabase is not configured, return base64 data URL
  if (!isSupabaseReady || !supabase) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Failed to read file as Base64'))
      reader.readAsDataURL(file)
    })
  }

  const timestamp = Date.now()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = folder + '/' + timestamp + '_' + sanitizedName

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    console.error('[Supabase Upload Error]', error.message)
    throw new Error(error.message)
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Delete a file from Supabase Storage by its public URL.
 * @param {string} publicUrl - The full public URL of the file
 */
export async function deleteFromSupabase(publicUrl) {
  if (!isSupabaseReady || !supabase) return

  try {
    const url = new URL(publicUrl)
    // Extract path after /storage/v1/object/public/{bucket}/
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/)
    if (!pathMatch) return

    const filePath = pathMatch[1]
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])
    if (error) console.error('[Supabase Delete Error]', error.message)
  } catch (e) {
    console.error('[Supabase Delete Error]', e.message)
  }
}
