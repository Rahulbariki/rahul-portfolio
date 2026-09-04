import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Award, Sparkles, Newspaper, Camera, Eye, ExternalLink, X, CheckCircle2, ChevronRight } from 'lucide-react'

export const TROPHIES = [
  {
    id: 'defendx',
    rank: '2nd Prize Winner',
    category: 'PROMPT ENGINEERING & AI CYBER',
    title: 'DEFEND-X National Technical Symposium (RIPPLE 2K26)',
    organizer: 'Dept of CSE (Cyber Security), RGMCET',
    date: 'Mar 9 — Mar 10, 2026',
    award: '2nd Prize Winner (Cash Prize, Medal & Certificate)',
    description: 'Secured 2nd Prize in the Prompt Engineering competition at DEFEND-X (RIPPLE 2K26). Awarded Certificate of Merit, cash prize, on-stage medal presentation, and featured in Major News Telugu newspaper press.',
    theme: 'gold',
    badge: 'CASH PRIZE & PRESS FEATURED',
    media: [
      { type: 'Certificate', title: 'Certificate of Merit — 2nd Prize Winner in Prompt Engineering', url: '/assets/cert-defendx-prompt-engineering.jpg' },
      { type: 'Press Feature', title: 'Major News Telugu Press Feature (12 March 2026)', url: '/assets/news-defendx-prompt-engineering.jpg' },
      { type: 'Stage Award', title: 'On-Stage Award Presentation at RGMCET Auditorium', url: '/assets/photo-defendx-stage-award.jpg' },
      { type: 'Felicitation', title: 'Felicitation by Santhiram Engineering College Principal', url: '/assets/photo-defendx-sec-felicitation.jpg' }
    ]
  },
  {
    id: 'genai-forge',
    rank: '1st Runner Up Winner',
    category: 'GENERATIVE AI & LLM BOOTCAMP',
    title: 'GenAI Forge Hackathon 2026',
    organizer: 'SmartBridge & NASSCOM FutureSkills Prime',
    date: 'Feb 11 — Feb 14, 2026',
    award: '1st Runner Up Winner (National Recognition)',
    description: 'Won 1st Runner Up in a 4-day intensive GenAI bootcamp & hackathon organized by SmartBridge and NASSCOM FutureSkills Prime. Featured in Nandi Patrika national press.',
    theme: 'gold',
    badge: 'NASSCOM FUTURESKILLS PRIME',
    media: [
      { type: 'Certificate', title: 'GenAI Forge Hackathon 2026 — 1st Runner Up Certificate of Recognition', url: '/assets/cert-genai-forge-hackathon-2026.png' },
      { type: 'Press Feature', title: 'Nandi Patrika National Press Coverage (15 Feb 2026)', url: '/assets/news-genai-forge-hackathon-2026.jpg' }
    ]
  },
  {
    id: 'eminence-sigma',
    rank: '3rd Prize Winner',
    category: 'CHALLENGE AI COMPETITION',
    title: '14th National Technical Symposium (EMINENCE-SIGMA-2K25)',
    organizer: 'Dept of ECE & Dept of Basic Sciences, SEC',
    date: 'Feb 28 — Mar 1, 2025',
    award: '3rd Prize Winner (Trophy Memento)',
    description: 'Secured 3rd Prize in Challenge AI competition. Presented a live Python AI assistant & speech recognition system on stage before faculty judges.',
    theme: 'bronze',
    badge: 'TROPHY MEMENTO',
    media: [
      { type: 'Certificate', title: 'Certificate of Merit — 3rd Prize Winner in Challenge AI', url: '/assets/cert-challenge-ai-merit-3rd-prize.jpg' },
      { type: 'Certificate', title: 'Certificate of Participation — Challenge AI', url: '/assets/cert-challenge-ai-participation.jpg' },
      { type: 'Trophy Presentation', title: '3rd Prize Trophy Memento Presentation by Principal', url: '/assets/photo-challenge-ai-trophy.jpg' },
      { type: 'Stage Demo', title: 'Live Python AI Assistant Demo on Smart Digital Screen', url: '/assets/photo-challenge-ai-presentation-1.jpg' }
    ]
  },
  {
    id: 'ieee-leadership',
    rank: 'IEEE Student Branch Secretary',
    category: 'LEADERSHIP & GLOBAL MEMBERSHIP',
    title: 'IEEE Student Branch Leadership & Volunteering',
    organizer: 'IEEE Student Branch & IEEE Education Society',
    date: 'Feb 2025 — Feb 2027',
    award: 'Secretary — IEEE Student Branch (IEEE Education Society)',
    description: 'Appointed Secretary for IEEE Student Branch in IEEE Education Society. Active IEEE Student Member across IEEE Education Society, IEEE Sensors Council, and IEEE CRFID2025.',
    theme: 'cyan',
    badge: 'IEEE SECRETARY',
    media: [
      { type: 'Certificate', title: 'Certificate of IEEE Volunteering — Secretary', url: '/assets/cert-ieee-volunteering-secretary.png' },
      { type: 'Membership', title: '2025 Certificate of IEEE Global Membership', url: '/assets/cert-ieee-membership-2025.png' },
      { type: 'Society', title: '2025 Certificate of Membership — IEEE Education Society', url: '/assets/cert-ieee-education-society-2025.png' }
    ]
  }
]

export function TrophyCabinetGrid({ onSelectTrophy }) {
  return (
    <div className="trophy-cabinet-container">
      <div className="trophy-cabinet-header">
        <div>
          <span className="trophy-kicker"><Trophy size={14} /> 3D TROPHY CABINET & WINNER SPOTLIGHT</span>
          <h3>National Competition Wins & Leadership Honors</h3>
        </div>
        <p className="trophy-sub-text">Click any trophy memento to open the full Winner Spotlight with press coverage & stage award photos.</p>
      </div>

      <div className="trophy-grid">
        {TROPHIES.map((trophy, idx) => (
          <motion.div
            key={trophy.id}
            className={`trophy-card ${trophy.theme}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => onSelectTrophy(trophy)}
          >
            <div className="trophy-badge">{trophy.badge}</div>
            
            <div className="trophy-icon-wrapper">
              <div className="trophy-glow-ring" />
              {trophy.theme === 'gold' ? (
                <Trophy size={42} className="trophy-icon gold" />
              ) : trophy.theme === 'bronze' ? (
                <Medal size={42} className="trophy-icon bronze" />
              ) : (
                <Award size={42} className="trophy-icon cyan" />
              )}
            </div>

            <div className="trophy-card-content">
              <span className="trophy-cat">{trophy.category}</span>
              <h4>{trophy.rank}</h4>
              <p className="trophy-title">{trophy.title}</p>
              <div className="trophy-meta-row">
                <span>{trophy.organizer}</span>
                <span>{trophy.date}</span>
              </div>
            </div>

            <div className="trophy-card-footer">
              <span className="media-count-tag"><Camera size={12} /> {trophy.media.length} Media Proofs</span>
              <span className="spotlight-link-btn">Spotlight <ChevronRight size={14} /></span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function WinnerSpotlightModal({ trophy, onClose, onSelectImage }) {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose() }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!trophy) return null

  return (
    <AnimatePresence>
      <motion.div
        className="spotlight-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`spotlight-modal-card ${trophy.theme}`}
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="spotlight-modal-header">
            <div>
              <div className="spotlight-header-kicker">
                <Sparkles size={13} /> WINNER SPOTLIGHT & OFFICIAL VERIFICATION
              </div>
              <h2>{trophy.rank}</h2>
              <p className="spotlight-header-sub">{trophy.title}</p>
            </div>
            <button type="button" onClick={onClose} className="spotlight-close-btn" aria-label="Close modal">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="spotlight-modal-body">
            <div className="spotlight-award-info-box">
              <div className="award-info-row">
                <div><strong>Organizer:</strong> <span>{trophy.organizer}</span></div>
                <div><strong>Date:</strong> <span>{trophy.date}</span></div>
                <div><strong>Award:</strong> <span className="award-highlight">{trophy.award}</span></div>
              </div>
              <p className="spotlight-award-desc">{trophy.description}</p>
            </div>

            {/* Media Gallery */}
            <div className="spotlight-media-section">
              <h4>OFFICIAL VERIFIED MEDIA & PRESS PROOFS ({trophy.media.length})</h4>
              <div className="spotlight-media-grid">
                {trophy.media.map((item, idx) => (
                  <div
                    key={idx}
                    className="spotlight-media-card"
                    onClick={() => onSelectImage({
                      title: trophy.title,
                      img: item.url,
                      imgTitle: item.title
                    })}
                  >
                    <div className="media-img-wrapper">
                      <img src={item.url} alt={item.title} loading="lazy" />
                      <div className="media-overlay">
                        <Eye size={18} />
                        <span>View Full Screen</span>
                      </div>
                    </div>
                    <div className="media-caption">
                      <span className="media-type-pill">{item.type}</span>
                      <p>{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
