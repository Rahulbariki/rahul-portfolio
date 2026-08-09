import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Send, Sparkles, CornerDownLeft, RefreshCw } from 'lucide-react'

const KNOWLEDGE_BASE = {
  genai: {
    title: 'Generative AI & AI Agents Expertise',
    response: `Rahul specializes in end-to-end GenAI product engineering. 
• LLMs & Frameworks: OpenAI GPT-4o, Llama-3, Claude 3.5, LangChain, FastAPI.
• AI Agents: n8n workflow automation, vector embeddings, RAG pipelines.
• Highlights: 1st Runner Up at GenAI Forge Hackathon (NASSCOM / SmartBridge).`,
    pills: ['Why hire Rahul for GenAI?', 'View IntelliAttend', 'Open Resume']
  },
  intelliattend: {
    title: 'IntelliAttend — AI-Powered Smart Attendance Platform',
    response: `Co-engineered an enterprise-grade automated attendance management platform.
• Tech Stack: Computer Vision (OpenCV), Facial Recognition, Real-time Dashboard analytics, PostgreSQL, FastAPI.
• Impact: Prevents attendance proxy fraud with liveness detection and real-time reporting.`,
    pills: ['View Featured Projects', 'Tech Stack & Systems']
  },
  skills: {
    title: 'Core Technical Stack & Engineering Capabilities',
    response: `• Languages: Python, SQL, JavaScript, HTML5/CSS3.
• AI/ML: PyTorch, OpenAI API, LangChain, Prompt Engineering, Computer Vision.
• Backend & Cloud: FastAPI, Node.js, PostgreSQL, Supabase, Docker, AWS, Azure.
• Frontend: React.js, Vite, Modern CSS, Responsive UI/UX Architecture.`,
    pills: ['Why hire Rahul for GenAI?', 'Hackathon Victories']
  },
  hackathons: {
    title: 'Hackathons & National Competition Wins 🏆',
    response: `1. 🥇 1st Runner Up — GenAI Forge Hackathon 2026 (NASSCOM / SmartBridge).
2. 🥈 2nd Prize — DEFEND-X National Technical Symposium (Prompt Engineering).
3. 🥉 3rd Prize — 14th National Technical Symposium EMINENCE-SIGMA (Challenge AI).`,
    pills: ['View IntelliAttend', 'Open Resume']
  },
  contact: {
    title: 'Get in Touch with Rahul Bariki',
    response: `• Email: rahulbariki24@gmail.com
• Phone: +91 62817 69623
• Location: Nandyal, AP, India
• GitHub: github.com/rahulbariki
• LinkedIn: linkedin.com/in/rahulbariki24`,
    pills: ['Open Resume', 'View Featured Projects']
  }
}

export function InteractiveAITerminal({ onOpenResume }) {
  const [history, setHistory] = useState([
    {
      type: 'ai',
      text: 'Rahul AI Copilot v2.4 initialized. Type a query or click a quick prompt below to explore skills, projects, & achievements.',
      status: '[ONLINE]'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [history, isTyping])

  const handleQuery = (rawQuery) => {
    if (!rawQuery || !rawQuery.trim() || isTyping) return

    const query = rawQuery.trim()
    setInput('')
    setHistory((prev) => [...prev, { type: 'user', text: query }])
    setIsTyping(true)

    setTimeout(() => {
      const lower = query.toLowerCase()
      let key = 'genai'

      if (lower.includes('intelliattend') || lower.includes('project') || lower.includes('work')) {
        key = 'intelliattend'
      } else if (lower.includes('skill') || lower.includes('stack') || lower.includes('python') || lower.includes('react')) {
        key = 'skills'
      } else if (lower.includes('hackathon') || lower.includes('award') || lower.includes('win') || lower.includes('prize')) {
        key = 'hackathons'
      } else if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('hire')) {
        key = 'contact'
      }

      const match = KNOWLEDGE_BASE[key]

      setHistory((prev) => [
        ...prev,
        {
          type: 'ai',
          title: match.title,
          text: match.response,
          status: '[200 OK — KNOWLEDGE MATCH]'
        }
      ])
      setIsTyping(false)
    }, 450)
  }

  return (
    <div className="hero-interactive-terminal">
      <div className="terminal-bar">
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
        <button
          type="button"
          className="terminal-reset-btn"
          onClick={() => setHistory([{ type: 'ai', text: 'Terminal reset. Ask Rahul AI Copilot anything!', status: '[RESET]' }])}
          title="Reset Terminal"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      <div className="terminal-interactive-body" ref={bodyRef}>
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
      </div>

      {/* Quick Action Preset Pills */}
      <div className="terminal-quick-pills">
        <button type="button" className="term-pill" onClick={() => handleQuery('Why hire Rahul for GenAI?')}>
          ⚡ GenAI Skills
        </button>
        <button type="button" className="term-pill" onClick={() => handleQuery('Tell me about IntelliAttend')}>
          🤖 IntelliAttend
        </button>
        <button type="button" className="term-pill" onClick={() => handleQuery('List Hackathon Victories')}>
          🏆 Awards
        </button>
        <button type="button" className="term-pill" onClick={() => handleQuery('Contact & Socials')}>
          📬 Contact
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
        />
        <button type="button" className="terminal-submit-btn" onClick={() => handleQuery(input)}>
          <Send size={13} />
        </button>
      </form>
    </div>
  )
}
