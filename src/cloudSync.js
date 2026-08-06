import { supabase, BUCKET_NAME, isSupabaseReady } from './supabaseClient.js'

const CENTRAL_DATA_URL = `https://pnvpjoekdwiifzsrxkrs.supabase.co/storage/v1/object/public/${BUCKET_NAME}/data/portfolio-data.json`

/**
 * Fetch the latest published portfolio data from Supabase CDN for any visitor viewing the site.
 * @returns {Promise<object|null>}
 */
export async function fetchCentralPortfolioData() {
  try {
    const res = await fetch(`${CENTRAL_DATA_URL}?t=${Date.now()}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data && typeof data === 'object' && data.profileInfo) {
      return data
    }
    return null
  } catch (err) {
    console.warn('[CloudSync] Could not fetch central portfolio data:', err)
    return null
  }
}

/**
 * Publish updated portfolio data to Supabase Storage CDN so all visitors across the globe see it.
 * @param {object} fullPortfolioData
 */
export async function publishCentralPortfolioData(fullPortfolioData) {
  if (!fullPortfolioData) return

  // Clean data to strip non-serialisable properties (like React icon components)
  const cleanedData = {
    ...fullPortfolioData,
    projects: (fullPortfolioData.projects || []).map((p) => ({
      ...p,
      icon: undefined,
    })),
  }

  const jsonString = JSON.stringify(cleanedData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const file = new File([blob], 'portfolio-data.json', { type: 'application/json' })

  // 1. Save to local storage cache
  try {
    if (cleanedData.profileInfo) localStorage.setItem('admin-profile', JSON.stringify(cleanedData.profileInfo))
    if (cleanedData.projects) localStorage.setItem('admin-projects', JSON.stringify(cleanedData.projects))
    if (cleanedData.hackathons) localStorage.setItem('admin-hackathons', JSON.stringify(cleanedData.hackathons))
    if (cleanedData.certifications) localStorage.setItem('admin-certifications', JSON.stringify(cleanedData.certifications))
    if (cleanedData.timelineEvents) localStorage.setItem('admin-timeline', JSON.stringify(cleanedData.timelineEvents))
    if (cleanedData.blogPosts) localStorage.setItem('admin-blog', JSON.stringify(cleanedData.blogPosts))
    if (cleanedData.faqItems) localStorage.setItem('admin-faq', JSON.stringify(cleanedData.faqItems))
  } catch (e) {
    console.warn('[CloudSync LocalStorage Warning]', e)
  }

  // 2. Upload to Supabase Storage CDN for global visitor access
  if (isSupabaseReady && supabase) {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload('data/portfolio-data.json', file, {
          cacheControl: '0',
          upsert: true,
          contentType: 'application/json',
        })

      if (error) {
        console.warn('[CloudSync Cloud Publish Warning]', error.message)
      } else {
        console.log('[CloudSync] Successfully published portfolio data to global cloud CDN!')
      }
    } catch (e) {
      console.warn('[CloudSync Cloud Publish Exception]', e)
    }
  }
}
