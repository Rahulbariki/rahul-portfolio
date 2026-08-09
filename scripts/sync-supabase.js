import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pnvpjoekdwiifzsrxkrs.supabase.co'
const SUPABASE_KEY = 'sb_publishable_yFKVpES9cqi0GuuVn0VX7g_p_eE6DW8'
const BUCKET_NAME = 'portfolio-assets'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function sync() {
  console.log('⚡ Uploading all assets from public/assets to Supabase Storage CDN...')
  const assetsDir = path.resolve('public/assets')
  const files = fs.readdirSync(assetsDir)

  for (const filename of files) {
    const filePath = path.join(assetsDir, filename)
    const stat = fs.statSync(filePath)
    if (!stat.isFile()) continue

    const fileBuffer = fs.readFileSync(filePath)
    const mimeType = filename.endsWith('.png')
      ? 'image/png'
      : filename.endsWith('.pdf')
      ? 'application/pdf'
      : 'image/jpeg'

    const targets = [
      'hackathons/' + filename,
      'certificates/' + filename,
      'profile/' + filename,
      'projects/' + filename
    ]

    for (const targetPath of targets) {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(targetPath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
          cacheControl: '3600'
        })
      if (!error) {
        console.log(`✓ Uploaded ${targetPath}`)
      }
    }
  }

  // Next, fetch current central portfolio data JSON
  console.log('⚡ Cleaning central portfolio-data.json on Supabase CDN...')
  const { data: fetchRes, error: fetchErr } = await supabase.storage
    .from(BUCKET_NAME)
    .download('data/portfolio-data.json')

  if (!fetchErr && fetchRes) {
    const jsonText = await fetchRes.text()
    const parsed = JSON.parse(jsonText)

    // Normalize image paths in hackathons and certifications to reliable /assets/ paths or valid CDN URLs
    const fixUrl = (url) => {
      if (!url) return url
      if (url.includes('/portfolio-assets/')) {
        const filename = url.split('/').pop().split('?')[0]
        return `/assets/${filename}`
      }
      return url
    }

    if (parsed.hackathons) {
      parsed.hackathons = parsed.hackathons.map((h) => ({
        ...h,
        image: fixUrl(h.image),
        newsImage: fixUrl(h.newsImage),
        stageImage: fixUrl(h.stageImage),
        secImage: fixUrl(h.secImage)
      }))
    }

    if (parsed.certifications) {
      parsed.certifications = parsed.certifications.map((c) => ({
        ...c,
        image: fixUrl(c.image),
        credentialUrl: fixUrl(c.credentialUrl)
      }))
    }

    const updatedJsonStr = JSON.stringify(parsed, null, 2)
    const fileBlob = new File([updatedJsonStr], 'portfolio-data.json', { type: 'application/json' })

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET_NAME)
      .upload('data/portfolio-data.json', fileBlob, {
        upsert: true,
        contentType: 'application/json',
        cacheControl: '0'
      })

    if (!uploadErr) {
      console.log('✓ Cleaned and updated portfolio-data.json on Supabase Cloud CDN!')
    } else {
      console.warn('Warning updating portfolio-data.json:', uploadErr.message)
    }
  }

  console.log('🎉 Sync complete!')
}

sync().catch(console.error)
