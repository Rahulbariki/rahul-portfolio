import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Mail, Phone, Github, Linkedin, Globe, MapPin,
  Copy, Check, Download, Share2, Sparkles, QrCode
} from 'lucide-react'
import QRCodeLib from 'qrcode'

/* ─── Contact Data ─────────────────────────────────────── */
const CARD_DATA = {
  name: 'Rahul Bariki',
  roles: ['GenAI Engineer', 'AI Automation Dev', 'Full-Stack Developer', 'UI/UX Specialist'],
  location: 'Nandyal, AP, India',
  email: 'rahulbariki24@gmail.com',
  phone: '+91 62817 69623',
  linkedin: 'https://linkedin.com/in/rahulbariki24',
  github: 'https://github.com/rahulbariki',
  portfolio: 'https://rahulbariki.vercel.app',
  tagline: 'Building AI Products that Solve Real Problems.',
  affiliation: 'Co-Builder @ IntelliAttend Startup',
}

/* ─── vCard Generator ───────────────────────────────────── */
function downloadVCard() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${CARD_DATA.name}`,
    `N:Bariki;Rahul;;;`,
    `TITLE:Generative AI & AI Automation Developer`,
    `ORG:IntelliAttend Startup`,
    `TEL;TYPE=CELL:${CARD_DATA.phone}`,
    `EMAIL:${CARD_DATA.email}`,
    `URL:${CARD_DATA.portfolio}`,
    `X-SOCIALPROFILE;type=linkedin:${CARD_DATA.linkedin}`,
    `X-SOCIALPROFILE;type=github:${CARD_DATA.github}`,
    `ADR;TYPE=HOME:;;Nandyal;Andhra Pradesh;;518501;India`,
    `NOTE:${CARD_DATA.tagline}`,
    'END:VCARD',
  ].join('\r\n')

  try {
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Rahul_Bariki.vcf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => window.URL.revokeObjectURL(url), 2000)
  } catch {
    const base64Data = btoa(unescape(encodeURIComponent(vcard)))
    const a = document.createElement('a')
    a.href = 'data:text/x-vcard;base64,' + base64Data
    a.download = 'Rahul_Bariki.vcf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

/* ─── Holographic Tilt Hook ─────────────────────────────── */
function useHoloTilt(cardRef) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, shine: { x: 50, y: 50 } })

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({
      x: -dy * 12,
      y: dx * 12,
      shine: {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      },
    })
  }, [cardRef])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, shine: { x: 50, y: 50 } })
  }, [])

  return { tilt, handleMouseMove, handleMouseLeave }
}

/* ─── Role Typewriter ───────────────────────────────────── */
function RoleTypewriter({ roles }) {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const current = roles[index]
    if (!deleting && displayed.length < current.length) {
      timerRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
    } else if (!deleting && displayed.length === current.length) {
      timerRef.current = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timerRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIndex((i) => (i + 1) % roles.length)
    }
    return () => clearTimeout(timerRef.current)
  }, [displayed, deleting, index, roles])

  return (
    <span className="biz-role-typewriter">
      {displayed}<span className="biz-cursor">|</span>
    </span>
  )
}

/* ─── QR Code Image ─────────────────────────────────────── */
function QRCodeImage({ url }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    QRCodeLib.toDataURL(url, {
      width: 140,
      margin: 2,
      color: { dark: '#e2e8f0', light: '#0f0f1a' },
      errorCorrectionLevel: 'M',
    }).then(setSrc).catch(console.error)
  }, [url])

  if (!src) return <div className="biz-qr-placeholder" />
  return <img src={src} alt="Portfolio QR Code" className="biz-qr-img" />
}

/* ─── Main Component ────────────────────────────────────── */
export function SmartBusinessCard({ onClose }) {
  const cardRef = useRef(null)
  const { tilt, handleMouseMove, handleMouseLeave } = useHoloTilt(cardRef)
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(CARD_DATA.portfolio)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // fallback
    }
  }

  const handleVCard = () => {
    downloadVCard()
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2200)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="biz-card-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="biz-card-wrapper"
          initial={{ scale: 0.82, opacity: 0, y: 32 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.82, opacity: 0, y: 32 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button className="biz-close-btn" onClick={onClose} aria-label="Close business card">
            <X size={18} />
          </button>

          {/* Label */}
          <div className="biz-label-row">
            <Sparkles size={12} />
            <span>RECRUITER SMART CARD</span>
          </div>

          {/* The Card */}
          <div
            ref={cardRef}
            className="biz-card-face"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              '--shine-x': `${tilt.shine.x}%`,
              '--shine-y': `${tilt.shine.y}%`,
            }}
          >
            {/* Holographic shimmer overlay */}
            <div className="biz-holo-shine" />

            {/* Card content */}
            <div className="biz-card-inner">
              {/* Left column */}
              <div className="biz-card-left">
                {/* Avatar / initials */}
                <div className="biz-avatar">
                  <span>RB</span>
                  <div className="biz-avatar-ring" />
                </div>

                <div className="biz-name-block">
                  <h2 className="biz-name">Rahul Bariki</h2>
                  <div className="biz-role-line">
                    <RoleTypewriter roles={CARD_DATA.roles} />
                  </div>
                  <div className="biz-location">
                    <MapPin size={11} />
                    <span>{CARD_DATA.location}</span>
                  </div>
                  <div className="biz-affiliation"><Sparkles size={11} /> {CARD_DATA.affiliation}</div>
                </div>

                <p className="biz-tagline">"{CARD_DATA.tagline}"</p>

                {/* Contact Links */}
                <div className="biz-contact-links">
                  <a href={`mailto:${CARD_DATA.email}`} className="biz-link email" title="Send Email">
                    <Mail size={14} />
                    <span>{CARD_DATA.email}</span>
                  </a>
                  <a href={`tel:${CARD_DATA.phone.replace(/\s/g, '')}`} className="biz-link phone" title="Call">
                    <Phone size={14} />
                    <span>{CARD_DATA.phone}</span>
                  </a>
                  <a href={CARD_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="biz-link linkedin" title="LinkedIn">
                    <Linkedin size={14} />
                    <span>rahulbariki24</span>
                  </a>
                  <a href={CARD_DATA.github} target="_blank" rel="noopener noreferrer" className="biz-link github" title="GitHub">
                    <Github size={14} />
                    <span>rahulbariki</span>
                  </a>
                  <a href={CARD_DATA.portfolio} target="_blank" rel="noopener noreferrer" className="biz-link portfolio" title="Portfolio">
                    <Globe size={14} />
                    <span>rahulbariki.vercel.app</span>
                  </a>
                </div>
              </div>

              {/* Right column – QR */}
              <div className="biz-card-right">
                <div className="biz-qr-zone">
                  <div className="biz-qr-glow" />
                  <QRCodeImage url={CARD_DATA.portfolio} />
                  <p className="biz-qr-label">Scan to open portfolio</p>
                </div>

                {/* Corner logo mark */}
                <div className="biz-corner-mark">RB<span>°</span></div>
              </div>
            </div>

            {/* Card footer stripe */}
            <div className="biz-card-footer-stripe">
              <span className="biz-tech-tags">AI · GenAI · React · Python · FastAPI</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="biz-action-btns">
            <button
              type="button"
              className={`biz-btn share-btn ${copied ? 'success' : ''}`}
              onClick={handleShare}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Link Copied!' : 'Copy Portfolio Link'}
            </button>
            <button
              type="button"
              className={`biz-btn vcf-btn ${downloaded ? 'success' : ''}`}
              onClick={handleVCard}
            >
              {downloaded ? <Check size={15} /> : <Download size={15} />}
              {downloaded ? 'Saved!' : 'Save Contact (.vcf)'}
            </button>
          </div>

          <p className="biz-hint">
            <QrCode size={11} /> QR code links to your live portfolio · vCard imports directly into iPhone & Android contacts
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
