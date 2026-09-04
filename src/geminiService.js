/**
 * Gemini AI Integration Service
 * Powers automated multimodal certificate OCR/analysis, project screenshot parsing,
 * and text refinement using Google Gemini 2.5 / 1.5 Flash models.
 */

const GEMINI_API_STORAGE_KEY = 'gemini-api-key'
const DEFAULT_MODEL = 'gemini-2.5-flash'

/**
 * Retrieves the active Gemini API Key from localStorage or Vite environment variable.
 * @returns {string}
 */
export function getGeminiApiKey() {
  const customKey = localStorage.getItem(GEMINI_API_STORAGE_KEY)
  if (customKey && customKey.trim()) return customKey.trim()
  return (import.meta.env.VITE_GEMINI_API_KEY || '').trim()
}

/**
 * Saves a custom Gemini API Key to local storage.
 * @param {string} key
 */
export function setGeminiApiKey(key) {
  if (!key) {
    localStorage.removeItem(GEMINI_API_STORAGE_KEY)
  } else {
    localStorage.setItem(GEMINI_API_STORAGE_KEY, key.trim())
  }
}

/**
 * Converts a File or Blob or base64 URL to an inlineData payload for Gemini API.
 * @param {File|Blob|string} imageSource
 * @returns {Promise<{ mimeType: string, data: string }>}
 */
async function toInlineData(imageSource) {
  if (typeof imageSource === 'string') {
    // If it's a base64 data URL
    if (imageSource.startsWith('data:')) {
      const parts = imageSource.split(',')
      const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
      const data = parts[1]
      return { mimeType, data }
    }
    // If it's an external URL, fetch and convert to base64
    const res = await fetch(imageSource)
    const blob = await res.blob()
    return blobToInlineData(blob)
  }

  if (imageSource instanceof Blob || imageSource instanceof File) {
    return blobToInlineData(imageSource)
  }

  throw new Error('Unsupported image source type for Gemini Vision analysis.')
}

function blobToInlineData(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      const parts = result.split(',')
      const mimeType = blob.type || 'image/jpeg'
      const data = parts[1]
      resolve({ mimeType, data })
    }
    reader.onerror = () => reject(new Error('Failed to read image as Base64'))
    reader.readAsDataURL(blob)
  })
}

/**
 * Helper to call Gemini REST endpoint.
 * @param {object} payload
 * @param {string} apiKey
 * @param {string} model
 * @returns {Promise<string>}
 */
async function callGemini(payload, apiKey = null, model = DEFAULT_MODEL) {
  const key = apiKey || getGeminiApiKey()
  if (!key) {
    throw new Error('Gemini API Key missing. Please provide your Gemini API key in Admin Settings.')
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const errorMsg = errData.error?.message || `HTTP ${response.status} ${response.statusText}`
    throw new Error(`Gemini API Error: ${errorMsg}`)
  }

  const result = await response.json()
  const textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text
  if (!textOutput) {
    throw new Error('No valid response returned by Gemini.')
  }

  return textOutput
}

/**
 * Tests Gemini API connection and returns status + latency.
 * @param {string} keyToTest
 * @returns {Promise<{ ok: boolean, latencyMs: number, message: string }>}
 */
export async function testGeminiConnection(keyToTest = null) {
  const start = performance.now()
  try {
    const payload = {
      contents: [{
        parts: [{ text: 'Respond with exactly the word "ONLINE".' }]
      }],
      generationConfig: { maxOutputTokens: 10 }
    }
    const response = await callGemini(payload, keyToTest)
    const latencyMs = Math.round(performance.now() - start)
    return {
      ok: true,
      latencyMs,
      message: `Gemini API connected successfully (${latencyMs}ms). Response: ${response.trim()}`
    }
  } catch (err) {
    return {
      ok: false,
      latencyMs: Math.round(performance.now() - start),
      message: err.message
    }
  }
}

/**
 * Analyzes an uploaded certificate, trophy photo, or credential document using Gemini Multimodal Vision.
 * Automatically extracts structured fields: title, issuer, date, certId, skills, and summary.
 * @param {File|Blob|string} imageSource
 * @returns {Promise<{ title: string, kicker: string, issuer: string, date: string, certId: string, skills: string[], details: string, tone: string }>}
 */
export async function analyzeCertificateWithGemini(imageSource) {
  const inlineData = await toInlineData(imageSource)

  const prompt = `
You are an expert AI credential analyzer for a software engineering portfolio.
Analyze the attached certificate / award / credential image and extract the following details accurately in JSON format:
- "title": Exact or polished name of the certificate / award / course.
- "kicker": A concise role or subtitle (e.g. "Secretary — IEEE Student Branch" or "Prompt Engineering Competition Winner").
- "issuer": Name of issuing organization, college, or company (e.g. "IEEE Education Society", "NASSCOM FutureSkills Prime", "Stanford", "Google").
- "date": Issuance date or period (e.g. "Feb 2025 — Feb 2027", "Mar 2026", "2024").
- "certId": Certificate ID, verification code, or roll number if visible on the document. (If none, leave empty string).
- "skills": Array of 3 to 6 technical skills or topics covered in this credential (e.g. ["Prompt Engineering", "Cyber Security", "GenAI"]).
- "details": A 2-sentence professional, impressive summary of what was accomplished, learned, or awarded. Do not use emojis.
- "tone": One of ["cyan", "lime", "violet", "gold"].

Return ONLY valid JSON matching this exact structure with no markdown code fences or commentary.
`

  const payload = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData }
      ]
    }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json'
    }
  }

  const rawJson = await callGemini(payload)
  try {
    const cleaned = rawJson.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('Failed to parse Gemini Certificate JSON:', rawJson)
    throw new Error('Gemini analyzed the image, but the output format was invalid. Please try again.')
  }
}

/**
 * Analyzes a project screenshot or UI capture to automatically deduce project details.
 * @param {File|Blob|string} imageSource
 * @returns {Promise<{ title: string, kicker: string, problem: string, solution: string, keyFeatures: string[], description: string, tags: string[], tone: string }>}
 */
export async function analyzeProjectScreenshotWithGemini(imageSource) {
  const inlineData = await toInlineData(imageSource)

  const prompt = `
You are an expert full-stack & AI software architect evaluating a portfolio project screenshot.
Analyze the attached UI screenshot and return a structured JSON breakdown for a top-tier developer portfolio:
- "title": Guessed or visible project name.
- "kicker": A punchy 1-line subtitle explaining the system (e.g. "AI-Powered Smart Attendance Platform").
- "problem": The real-world problem this project solves (1 sentence).
- "solution": The technical solution engineered to solve it (1 sentence).
- "keyFeatures": Array of 4 clear, impressive key technical features visible or inferred from the UI.
- "description": A 2-3 sentence recruiter-focused description of the platform's architecture and capabilities.
- "tags": Array of 5-7 modern tech stack tags (e.g. ["React", "FastAPI", "Python", "Computer Vision"]).
- "tone": One of ["lime", "cyan", "violet"].

Return ONLY valid JSON matching this structure with no markdown code blocks.
`

  const payload = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData }
      ]
    }],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json'
    }
  }

  const rawJson = await callGemini(payload)
  try {
    const cleaned = rawJson.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('Failed to parse Gemini Project JSON:', rawJson)
    throw new Error('Gemini analyzed the project screenshot, but output parsing failed.')
  }
}

/**
 * Enhances existing portfolio copy (Projects, Bio, Hackathons, Blog Posts) into high-impact engineering copy.
 * @param {'project'|'bio'|'hackathon'|'blog'} type
 * @param {object} currentData
 * @returns {Promise<object>}
 */
export async function enhanceContentWithGemini(type, currentData) {
  let prompt = ''

  if (type === 'project') {
    prompt = `
You are an elite Silicon Valley technical resume & portfolio writer for a Generative AI & Full-Stack Software Engineer.
Enhance and elevate the following project details to sound highly impressive, technical, and quantifiable. Avoid fluff and avoid emojis.

Input Data:
${JSON.stringify(currentData, null, 2)}

Return a JSON object with the enhanced fields:
- "kicker": Punchy one-line technical subtitle.
- "problem": High-stakes real-world problem statement (1 sentence).
- "solution": Architecture-focused solution statement (1 sentence).
- "keyFeatures": Array of 4 bullet points emphasizing scale, latency, AI pipelines, or efficiency.
- "description": Polished 2-3 sentence overview.
- "tags": Curated array of 6-8 relevant technical tags.

Return ONLY valid JSON.
`
  } else if (type === 'bio') {
    prompt = `
Enhance the portfolio bio and headline for Rahul Bariki, a final-year AI & Machine Learning software engineer specializing in Generative AI, AI Agents, and Full-Stack development.
Input Bio Data:
${JSON.stringify(currentData, null, 2)}

Return a JSON object with:
- "tagline": A memorable, powerful one-liner.
- "bio": A 2-3 sentence authoritative, results-driven professional summary highlighting AI agent workflows, real-time architectures, and startup co-engineering. Do not use emojis.

Return ONLY valid JSON.
`
  } else if (type === 'hackathon') {
    prompt = `
Enhance this hackathon / award entry to emphasize high-stakes competition, judges' reception, and technical execution.
Input Data:
${JSON.stringify(currentData, null, 2)}

Return a JSON object with:
- "role": Polished award title (e.g. "2nd Prize Winner — Prompt Engineering").
- "award": Polished recognition details.
- "description": 2-3 sentences explaining the challenge, live demo, judge presentation, and press coverage without emojis.

Return ONLY valid JSON.
`
  } else if (type === 'blog') {
    prompt = `
Enhance this technical blog post / article summary for maximum developer engagement and architectural depth.
Input Data:
${JSON.stringify(currentData, null, 2)}

Return a JSON object with:
- "title": Engaging, authoritative engineering title.
- "snippet": Compelling 2-sentence technical summary.
- "readTime": Estimated reading time string (e.g. "5 min read").

Return ONLY valid JSON.
`
  }

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json'
    }
  }

  const rawJson = await callGemini(payload)
  try {
    const cleaned = rawJson.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
    return JSON.parse(cleaned)
  } catch (err) {
    throw new Error(`Gemini enhancement parse error: ${err.message}`)
  }
}
