import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Send, Sparkles, RefreshCw, ChevronDown, ChevronUp, MessageSquare, ExternalLink, FileText } from 'lucide-react'

const KNOWLEDGE_BASE = {
  genai: {
    title: 'Generative AI & AI Agents Expertise',
    response: `Rahul specializes in end-to-end GenAI product engineering.
• LLMs & Frameworks: OpenAI GPT-4o, Llama-3, Claude 3.5, LangChain, FastAPI.
• AI Agents: n8n workflow automation, vector embeddings, RAG pipelines.
• Highlights: 1st Runner Up at GenAI Forge Hackathon (NASSCOM / SmartBridge).`,
    pills: ['Tell me about IntelliAttend', 'Technical Skills & Stack', 'Open Resume']
  },
  intelliattend: {
    title: 'IntelliAttend — AI-Powered Smart Attendance Platform',
    response: `Co-engineered an enterprise-grade automated attendance management platform.
• Tech Stack: Computer Vision (OpenCV), Facial Recognition, Real-time Dashboard analytics, PostgreSQL, FastAPI.
• Impact: Prevents attendance proxy fraud with liveness detection and real-time reporting.
• Status: Active Startup Portal deployed on production.`,
    pills: ['BrandNova Platform', 'CampusPulse System', 'View Technical Skills']
  },
  brandnova: {
    title: 'BrandNova — AI Brand Automation Platform',
    response: `Architected a Generative AI suite powered by LLM pipelines & prompt engineering.
• Generates logos, marketing copy, taglines, color palettes, and vector SVG assets in seconds.
• Stack: React, Python, LangChain, OpenAI APIs, FastAPI, Supabase.`,
    pills: ['Tell me about IntelliAttend', 'Hackathon Victories', 'Open Resume']
  },
  campuspulse: {
    title: 'CampusPulse — Smart Campus Event Intelligence',
    response: `Centralized platform unifying campus event discovery, instant registration, and automated alerts.
• Features: Multi-department announcement aggregation, QR entry tickets, and real-time participation analytics.
• Stack: React, Node.js, PostgreSQL, Python, FastAPI, Tailwind CSS.`,
    pills: ['Tell me about SHOWLINK', 'View Technical Skills', 'Get in Touch']
  },
  showlink: {
    title: 'SHOWLINK — College Search & Discovery Portal',
    response: `Developed an intuitive engineering college discovery engine with side-by-side brochure comparison.
• Built during the "Building Blocks of the Web" workshop and presented live in the college auditorium before 300+ students.
• Stack: HTML5, CSS3, JavaScript, Interactive PDF canvas streamer.`,
    pills: ['Hackathon Victories', 'Why hire Rahul for GenAI?', 'Open Resume']
  },
  toolverse: {
    title: 'ToolVerse — AI Tool Discovery & Aggregation Platform',
    response: `One-stop platform listing and categorizing all market AI tools.
• Features: Comprehensive tool directory, category navigation, n8n automated tool submission forms.
• Developed during: CodeTantra Generative AI Internship (AICTE & APSCHE).
• Live URL: https://toolversedaily.netlify.app/`,
    pills: ['Nexus Super App', 'Tell me about IntelliAttend', 'Open Resume']
  },
  nexus: {
    title: 'Nexus Super App — All-in-One Smart Service Ecosystem',
    response: `Integrated digital platform unifying everyday essential services.
• Features: Food delivery, grocery shopping, ride hailing (cabs & bike taxis), and doorstep home services with AI recommendations.
• Developed as: Solo prototype during CodeTantra Generative AI Internship.
• Live URL: https://nexus-super-app-nine.vercel.app/`,
    pills: ['ToolVerse Platform', 'Tell me about IntelliAttend', 'Open Resume']
  },
  skills: {
    title: 'Core Technical Stack & Engineering Capabilities',
    response: `• Languages: Python, SQL, JavaScript, HTML5/CSS3.
• AI/ML: PyTorch, OpenAI API, LangChain, Prompt Engineering, Computer Vision, NLP, n8n Automation, Telegram Bots.
• Backend & Cloud: FastAPI, Node.js, PostgreSQL, Supabase, Docker, AWS, Azure, Vercel.
• Frontend: React.js, Vite, Framer Motion, Responsive UI/UX Architecture.`,
    pills: ['Why hire Rahul for GenAI?', 'Hackathon Victories', 'Open Resume']
  },
  hackathons: {
    title: 'Hackathons & National Competition Wins',
    response: `1. 1st Runner Up — GenAI Forge Hackathon 2026 (NASSCOM / SmartBridge).
2. 2nd Prize Winner — DEFEND-X National Technical Symposium (Prompt Engineering, RGMCET).
3. 3rd Prize Winner — 14th National Technical Symposium EMINENCE-SIGMA (Challenge AI).
4. IEEE Student Branch Secretary (IEEE Education Society).`,
    pills: ['Tell me about IntelliAttend', 'Open Resume', 'Contact Rahul']
  },
  education: {
    title: 'Academic Foundation & Honors',
    response: `• B.Tech in CSE (Artificial Intelligence & Machine Learning) @ Santhiram Engineering College (2023 — 2027).
• Academic Standing: 8.46 CGPA.
• JEE Mains Rank: Top 58,055 All India Rank.
• Leadership: Secretary, IEEE Student Branch in IEEE Education Society.`,
    pills: ['Hackathon Victories', 'Technical Skills & Stack', 'Open Resume']
  },
  experience: {
    title: 'Industry Experience & Internships',
    response: `• Intern – Software Development Engineer @ SHNOOR International LLC (Oct 2026 — Present, Remote): Information Technology department working on software development workflows & modern application engineering.
• Generative AI (GenAI) Intern @ CodeTantra Tech Solutions (May — Jun 2026, AICTE & APSCHE): Built ToolVerse, Nexus Super App, @BRahulOnline_bot Telegram automation, and n8n job scraping pipelines.
• Co-Developer @ IntelliAttend Startup (2026 — Present): Facial verification & institutional analytics.
• Google AI-ML Virtual Intern (2024): Applied machine learning algorithms & model evaluation.
• Zcalar AI Virtual Intern (2024): Prompt engineering, NLP pipelines & chatbot development.`,
    pills: ['Tell me about Jarvis', 'IntelliAttend Platform', 'Open Resume']
  },
  jarvis: {
    title: 'Jarvis AI — Voice-First Ambient Desktop Assistant',
    response: `Designed and built an ambient voice AI assistant leveraging Python, speech recognition, and intent extraction.
• Honors: Awarded 3rd Prize Winner in Challenge AI at the 14th National Level Technical Symposium (EMINENCE-SIGMA-2K25).
• Live Presentation: Demonstrated live on auditorium digital screen before faculty and student judges.
• Features: Real-time speech-to-text recognition, conversational voice feedback, desktop task automation, and hands-free system command execution.`,
    pills: ['Tell me about BrandNova', 'Hackathon Victories', 'Open Resume']
  },
  resume: {
    title: 'Rahul Bariki — Verified Resume & Credentials',
    response: `Rahul's complete resume highlights:
• Specialization: Generative AI, AI Agents, Full-Stack Engineering, Computer Vision.
• Top Honors: 1st Runner Up GenAI Forge 2026, 2nd Prize DEFEND-X 2026, 8.46 CGPA.
• Click the button below to launch the interactive resume modal.`,
    pills: ['Why hire Rahul for GenAI?', 'Contact Rahul', 'Tell me about IntelliAttend'],
    isResume: true
  },
  contact: {
    title: 'Get in Touch with Rahul Bariki',
    response: `• Email: rahulbariki24@gmail.com
• Phone: +91 62817 69623
• Location: Nandyal, AP, India
• GitHub: github.com/rahulbariki
• LinkedIn: linkedin.com/in/rahulbariki24`,
    pills: ['Open Resume', 'Why hire Rahul for GenAI?', 'Tell me about IntelliAttend']
  }
}

export function InteractiveAITerminal({ onOpenResume, customKnowledge }) {
  const activeKb = { ...KNOWLEDGE_BASE, ...(customKnowledge || {}) }
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [history, setHistory] = useState([
    {
      type: 'ai',
      title: 'AI Copilot Initialized',
      text: 'Rahul AI Copilot v2.4 initialized. Ask anything about skills, projects, hackathons, or credentials!',
      status: '[ONLINE]',
      pills: ['GenAI Skills', 'IntelliAttend', 'Hackathon Wins', 'View Resume']
    }
  ])
  const historyEndRef = useRef(null)

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [history, isTyping])

  const handleQuery = (textToQuery) => {
    const q = (textToQuery || input).trim()
    if (!q || isTyping) return

    setHistory((prev) => [...prev, { type: 'user', text: q }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const lower = q.toLowerCase()
      let key = 'genai'

      // Check custom keys first
      const customKeyMatch = Object.keys(activeKb).find(k => lower.includes(k.toLowerCase()) || (activeKb[k].title && lower.includes(activeKb[k].title.toLowerCase())))

      if (customKeyMatch) {
        key = customKeyMatch
      } else if (lower.includes('resume') || lower.includes('cv') || lower.includes('profile')) {
        key = 'resume'
      } else if (lower.includes('intelliattend')) {
        key = 'intelliattend'
      } else if (lower.includes('brandnova') || lower.includes('brand')) {
        key = 'brandnova'
      } else if (lower.includes('jarvis') || lower.includes('voice assistant')) {
        key = 'jarvis'
      } else if (lower.includes('campuspulse') || lower.includes('campus') || lower.includes('event')) {
        key = 'campuspulse'
      } else if (lower.includes('showlink') || lower.includes('college search')) {
        key = 'showlink'
      } else if (lower.includes('skill') || lower.includes('stack') || lower.includes('python') || lower.includes('react') || lower.includes('fastapi') || lower.includes('tech')) {
        key = 'skills'
      } else if (lower.includes('hackathon') || lower.includes('award') || lower.includes('win') || lower.includes('prize') || lower.includes('defend') || lower.includes('eminence')) {
        key = 'hackathons'
      } else if (lower.includes('education') || lower.includes('cgpa') || lower.includes('jee') || lower.includes('college') || lower.includes('b.tech') || lower.includes('degree')) {
        key = 'education'
      } else if (lower.includes('toolverse') || lower.includes('ai tool')) {
        key = 'toolverse'
      } else if (lower.includes('nexus') || lower.includes('super app')) {
        key = 'nexus'
      } else if (lower.includes('intern') || lower.includes('experience') || lower.includes('shnoor') || lower.includes('codetantra') || lower.includes('google') || lower.includes('zcalar')) {
        key = 'experience'
      } else if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('hire') || lower.includes('reach') || lower.includes('social')) {
        key = 'contact'
      } else if (lower.includes('project') || lower.includes('work') || lower.includes('app')) {
        key = 'intelliattend'
      }

      const match = activeKb[key] || Object.values(activeKb)[0]

      setHistory((prev) => [
        ...prev,
        {
          type: 'ai',
          title: match.title,
          text: match.response,
          status: match.status || '[200 OK — KNOWLEDGE MATCH]',
          pills: match.pills || ['Why hire Rahul for GenAI?', 'Open Resume'],
          isResume: match.isResume
        }
      ])
      setIsTyping(false)
    }, 380)
  }

  const handlePillClick = (pillText) => {
    if (pillText.toLowerCase().includes('open resume') || pillText.toLowerCase().includes('view resume')) {
      if (onOpenResume) onOpenResume()
      handleQuery('View Resume')
    } else {
      handleQuery(pillText)
    }
  }

  return (
    <div className={`hero-interactive-terminal ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
      {/* Terminal Top Bar (Clicking expands/collapses terminal) */}
      <div 
        className="terminal-bar" 
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-label="Toggle Interactive AI Terminal"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
      >
        <div className="terminal-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>

        <div className="terminal-title">
          <Sparkles size={13} className="sparkle-icon" />
          <span>rahul_ai_copilot.py</span>
          <span className="live-status-pill">● LIVE</span>
        </div>

        <div className="terminal-toggle-trigger">
          {isExpanded ? (
            <span className="toggle-btn-label"><ChevronUp size={14} /> Collapse Terminal</span>
          ) : (
            <span className="toggle-btn-label expand"><MessageSquare size={13} /> Click to Expand AI Terminal <ChevronDown size={14} /></span>
          )}
        </div>
      </div>

      {/* Expandable Terminal Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="terminal-expandable-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="terminal-interactive-body">
              {history.map((item, idx) => (
                <div key={idx} className={`terminal-line-block ${item.type}`}>
                  {item.type === 'user' ? (
                    <div className="user-query-line">
                      <span className="terminal-prompt">&gt;</span>
                      <span className="user-query-text">{item.text}</span>
                    </div>
                  ) : (
                    <div className="ai-response-block">
                      <div className="ai-status-row">
                        <span className="ai-badge">{item.status || '[INFO]'}</span>
                        {item.title && <strong className="ai-title">{item.title}</strong>}
                      </div>
                      <pre className="ai-response-text">{item.text}</pre>
                      {item.isResume && (
                        <div style={{ marginTop: '8px' }}>
                          <button
                            type="button"
                            className="term-pill"
                            style={{ background: 'rgba(124, 58, 237, 0.4)', color: '#fff', borderColor: '#a78bfa' }}
                            onClick={onOpenResume}
                          >
                            <FileText size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                            Launch Interactive Resume Modal ↗
                          </button>
                        </div>
                      )}
                      {item.pills && item.pills.length > 0 && (
                        <div className="terminal-inline-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                          {item.pills.map((pill, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              className="term-pill"
                              style={{ fontSize: '9.5px', padding: '2px 8px' }}
                              onClick={() => handlePillClick(pill)}
                            >
                              {pill}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="ai-response-block typing">
                  <span className="ai-badge">[PROCESSING]</span>
                  <span className="typing-dots">
                    <span /> <span /> <span />
                  </span>
                </div>
              )}
              <div ref={historyEndRef} />
            </div>

            {/* Quick Action Preset Pills */}
            <div className="terminal-quick-pills">
              <button type="button" className="term-pill" onClick={() => handleQuery('Why hire Rahul for GenAI?')}>
                GenAI Skills
              </button>
              <button type="button" className="term-pill" onClick={() => handleQuery('Tell me about IntelliAttend')}>
                IntelliAttend
              </button>
              <button type="button" className="term-pill" onClick={() => handleQuery('List Hackathon Victories')}>
                Awards & Honors
              </button>
              <button type="button" className="term-pill" onClick={() => handleQuery('Academic & Education')}>
                Education
              </button>
              <button type="button" className="term-pill" onClick={() => { if (onOpenResume) onOpenResume(); handleQuery('View Resume'); }}>
                Resume
              </button>
              <button type="button" className="term-pill" onClick={() => handleQuery('Contact & Socials')}>
                Contact Info
              </button>
              <button
                type="button"
                className="term-pill reset"
                onClick={() => setHistory([{ type: 'ai', text: 'Terminal reset. Ask Rahul AI Copilot anything!', status: '[RESET]', pills: ['GenAI Skills', 'IntelliAttend', 'Hackathon Wins'] }])}
                title="Reset conversation"
              >
                <RefreshCw size={11} /> Reset
              </button>
            </div>

            {/* Interactive Input Form */}
            <form
              className="terminal-input-form"
              onSubmit={(e) => {
                e.preventDefault()
                handleQuery(input)
              }}
            >
              <span className="terminal-prompt">$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Rahul AI Copilot (e.g. 'skills', 'projects', 'awards')…"
                className="terminal-input-field"
                disabled={isTyping}
              />
              <button type="submit" className="terminal-submit-btn" disabled={isTyping || !input.trim()}>
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
