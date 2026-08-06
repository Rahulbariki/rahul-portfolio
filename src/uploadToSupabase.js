import { supabase, BUCKET_NAME, isSupabaseReady } from './supabaseClient.js'

/**
 * Reads a File object into a Base64 data URL string.
 * @param {File|Blob} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read file as Base64'))
    reader.readAsDataURL(file)
  })
}

/**
 * Client-side canvas compression for uploaded images.
 * Scales down large images (max 1200px) and compresses to 85% JPEG/PNG quality.
 * Prevents localStorage quota overflow and speeds up cloud uploads.
 * @param {File} file
 * @param {number} maxDimension
 * @param {number} quality
 * @returns {Promise<File>}
 */
export async function compressImage(file, maxDimension = 1200, quality = 0.85) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file
  if (file.type.includes('gif') || file.type.includes('svg')) return file

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width <= maxDimension && height <= maxDimension && file.size < 300 * 1024) {
          resolve(file)
          return
        }

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          mimeType,
          quality
        )
      }
      img.onerror = () => resolve(file)
      img.src = e.target.result
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

/**
 * Upload a File to Supabase Storage with automatic image optimization & Base64 fallback.
 * @param {File} file - The file object to upload
 * @param {string} folder - Subfolder in the bucket: 'profile' | 'projects' | 'certificates' | 'hackathons' | 'media'
 * @param {function} onProgress - Optional progress callback
 * @returns {Promise<string>} - Public CDN URL or compressed Base64 data URL
 */
export async function uploadToSupabase(file, folder = 'media', onProgress = null) {
  if (!file) return ''

  // 1. Compress image to prevent quota issues & slow uploads
  let targetFile = file
  try {
    if (file.type && file.type.startsWith('image/')) {
      targetFile = await compressImage(file, 1200, 0.85)
    }
  } catch (err) {
    console.warn('[Image Compress Warning]', err)
  }

  // 2. If Supabase is not ready, return optimized Base64 immediately
  if (!isSupabaseReady || !supabase) {
    return fileToBase64(targetFile)
  }

  // 3. Attempt Supabase Storage Upload with graceful error fallback
  try {
    const timestamp = Date.now()
    const sanitizedName = (targetFile.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = folder + '/' + timestamp + '_' + sanitizedName

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, targetFile, {
        cacheControl: '31536000',
        upsert: true,
        contentType: targetFile.type || 'image/jpeg',
      })

    if (error) {
      console.warn('[Supabase Upload Warning] Falling back to Base64 data URL:', error.message)
      return fileToBase64(targetFile)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    if (urlData && urlData.publicUrl) {
      return urlData.publicUrl
    }
    return fileToBase64(targetFile)
  } catch (err) {
    console.warn('[Supabase Exception Warning] Falling back to Base64 data URL:', err.message)
    return fileToBase64(targetFile)
  }
}

/**
 * Delete a file from Supabase Storage by its public URL.
 * @param {string} publicUrl - The full public URL of the file
 */
export async function deleteFromSupabase(publicUrl) {
  if (!isSupabaseReady || !supabase || !publicUrl) return

  try {
    const url = new URL(publicUrl)
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/)
    if (!pathMatch) return

    const filePath = pathMatch[1]
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])
    if (error) console.error('[Supabase Delete Error]', error.message)
  } catch (e) {
    console.error('[Supabase Delete Error]', e.message)
  }
}
