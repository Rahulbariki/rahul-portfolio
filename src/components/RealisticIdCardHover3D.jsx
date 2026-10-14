import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CheckCircle, Eye, RotateCw, Shield, Sparkles, ExternalLink, QrCode } from 'lucide-react'
import QRCodeLib from 'qrcode'

/**
 * RealisticIdCardHover3D
 * 
 * Photorealistic 3D floating lanyard ID card badge with:
 * - Suspended woven lanyard strap & metallic clip hardware
 * - Realistic idle pendulum oscillation (floating bob + sway)
 * - Interactive 3D mouse tilt tracking with spring physics
 * - Dynamic specular light bloom & iridescent holographic rainbow sheen
 * - 3D card flip interaction revealing authentic reverse side (magnetic stripe, smart chip, barcode & QR)
 * - Clear polycarbonate acrylic badge holder bevels & top punch slot
 */
export function RealisticIdCardHover3D({
  cardImage = '/assets/shnoor-sde-intern-id-card.png',
  employeeId = 'SI0121',
  employeeName = 'BARIKI RAHUL',
  designation = 'Intern – Software Development Engineer',
  department = 'Information Technology',
  company = 'SHNOOR International LLC',
  joiningDate = '05-10-2026',
  workMode = 'Remote',
  onExpand,
  is3dEnabled = true,
}) {
  const cardRef = useRef(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })

  // Generate QR Code for reverse side
  useEffect(() => {
    let mounted = true
    const verificationUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/#appointment`
      : 'https://rahulbariki.vercel.app/#appointment'

    QRCodeLib.toDataURL(verificationUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => {
        if (mounted) setQrDataUrl(url)
      })
      .catch(() => {})

    return () => { mounted = false }
  }, [])

  // Framer Motion coordinates for silky smooth physics
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for natural weight & fluid inertia
  const springConfig = { stiffness: 240, damping: 22 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // 3D rotation mappings
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [18, -18])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-22, 22])
  const rotateZ = useTransform(smoothX, [-0.5, 0.5], [-4, 4])

  // Lanyard strap reaction angle (follows the sway)
  const lanyardSway = useTransform(smoothX, [-0.5, 0.5], [-6, 6])

  // Dynamic shadow displacement (shifts opposite to light source)
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [-24, 24])
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [26, 42])

  // Mouse move handler for 3D tilt & glare calculation
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !is3dEnabled) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const nx = (e.clientX - cx) / rect.width
    const ny = (e.clientY - cy) / rect.height

    mouseX.set(Math.max(-0.55, Math.min(0.55, nx)))
    mouseY.set(Math.max(-0.55, Math.min(0.55, ny)))

    // Calculate glare percentage (0% to 100%)
    const gx = ((e.clientX - rect.left) / rect.width) * 100
    const gy = ((e.clientY - rect.top) / rect.height) * 100
    setGlarePos({ x: gx, y: gy, opacity: 0.9 })
  }, [is3dEnabled, mouseX, mouseY])

  const handleMouseEnter = useCallback(() => {
    if (!is3dEnabled) return
    setIsHovered(true)
  }, [is3dEnabled])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
    setGlarePos(prev => ({ ...prev, opacity: 0 }))
  }, [mouseX, mouseY])

  // Touch support for mobile devices
  const handleTouchMove = useCallback((e) => {
    if (!cardRef.current || !is3dEnabled || !e.touches[0]) return
    const touch = e.touches[0]
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const nx = (touch.clientX - cx) / rect.width
    const ny = (touch.clientY - cy) / rect.height

    mouseX.set(Math.max(-0.5, Math.min(0.5, nx)))
    mouseY.set(Math.max(-0.5, Math.min(0.5, ny)))

    const gx = ((touch.clientX - rect.left) / rect.width) * 100
    const gy = ((touch.clientY - rect.top) / rect.height) * 100
    setGlarePos({ x: gx, y: gy, opacity: 0.85 })
  }, [is3dEnabled, mouseX, mouseY])

  const toggleFlip = (e) => {
    e?.stopPropagation?.()
    setIsFlipped(prev => !prev)
  }

  return (
    <div className="id-badge-lanyard-stage">
      {/* 1. LANYARD STRAP & METALLIC HARDWARE SUSPENSION */}
      <div className="id-badge-lanyard-assembly">
        {/* Fabric lanyard neck straps */}
        <motion.div 
          className="id-badge-lanyard-straps"
          style={{ rotate: is3dEnabled ? lanyardSway : 0 }}
        >
          <div className="id-lanyard-strap strap-left" />
          <div className="id-lanyard-strap strap-right" />
        </motion.div>

        {/* Metallic Crimp / Buckle */}
        <div className="id-badge-crimp">
          <div className="id-badge-crimp-detail" />
        </div>

        {/* Swivel Ring & Carabiner Clip Hook */}
        <div className="id-badge-swivel-clip">
          <div className="id-badge-swivel-ring" />
          <div className="id-badge-clip-hook">
            <div className="id-badge-clip-pin" />
          </div>
        </div>
      </div>

      {/* 2. MAIN 3D TILT CONTAINER */}
      <div 
        className="id-badge-tilt-wrapper"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
      >
        <motion.div
          className="id-badge-3d-card"
          style={is3dEnabled ? {
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            rotateZ: isHovered ? rotateZ : 0,
            transformPerspective: 1200,
            transformStyle: 'preserve-3d',
          } : {}}
          animate={!isHovered && is3dEnabled ? {
            y: [0, -10, 0],
            rotateZ: [-2, 2, -2],
            rotateY: [-2.5, 2.5, -2.5],
          } : {
            y: isHovered ? -12 : 0,
          }}
          transition={!isHovered ? {
            duration: 4.8,
            repeat: Infinity,
            ease: 'easeInOut',
          } : {
            duration: 0.3,
            ease: 'easeOut'
          }}
        >
          {/* Card Flip Rotator */}
          <motion.div 
            className="id-badge-flip-container"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ─────────────────────────────────────────────────────────────
                FRONT FACE: Clear Acrylic Sleeve with Official ID Card
            ────────────────────────────────────────────────────────────── */}
            <div 
              className="id-badge-face id-badge-face-front"
              onClick={onExpand}
              role="button"
              tabIndex={0}
              aria-label="View Full-Size Official SHNOOR ID Card"
            >
              {/* Acrylic Top Tab with punched slot hole */}
              <div className="id-badge-acrylic-header">
                <div className="id-badge-slot-punch" />
              </div>

              {/* ID Card Graphic Container */}
              <div className="id-badge-image-frame">
                <img 
                  src={cardImage} 
                  alt={`${employeeName} — ${designation} ID Card (${company})`}
                  loading="lazy"
                />

                {/* Verified Pill Badge Overlay */}
                <div className="id-card-overlay-badge">
                  <CheckCircle size={13} style={{ color: '#10b981' }} />
                  <span>OFFICIAL ID VERIFIED · {employeeId}</span>
                </div>

                {/* Hover Click-to-Expand Hint */}
                <div className="id-card-hover-hint">
                  <Eye size={14} /> Click to Expand ID Card
                </div>
              </div>

              {/* Specular Light Bloom (tracks mouse cursor) */}
              <div 
                className="id-badge-specular-glare"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(245, 158, 11, 0.18) 32%, transparent 68%)`,
                  opacity: glarePos.opacity,
                }}
              />

              {/* Holographic Rainbow Iridescent Sheen */}
              <div 
                className="id-badge-holo-rainbow"
                style={{
                  opacity: isHovered ? 0.38 : 0.15,
                  transform: `rotate(${glarePos.x * 0.4}deg)`,
                }}
              />
            </div>

            {/* ─────────────────────────────────────────────────────────────
                BACK FACE: Corporate Reverse Side with Chip, Mag-Stripe, QR & Barcode
            ────────────────────────────────────────────────────────────── */}
            <div 
              className="id-badge-face id-badge-face-back"
              onClick={onExpand}
              role="button"
              tabIndex={0}
              aria-label="View Full-Size Official SHNOOR ID Card Reverse"
            >
              {/* Acrylic Top Tab with punched slot hole */}
              <div className="id-badge-acrylic-header">
                <div className="id-badge-slot-punch" />
              </div>

              <div className="id-badge-back-content">
                {/* Magnetic Stripe across the top */}
                <div className="id-badge-mag-stripe">
                  <span className="id-mag-track-code">ISO/IEC 7810 · SHNOOR ENCRYPTED SECURE ACCESS · SI0121</span>
                </div>

                {/* Middle Row: Gold NFC Smart Chip + Security Hologram */}
                <div className="id-badge-chip-row">
                  {/* Smart Chip Contact Pad */}
                  <div className="id-badge-smart-chip">
                    <div className="chip-line line-h-1" />
                    <div className="chip-line line-h-2" />
                    <div className="chip-line line-v-1" />
                    <div className="chip-line line-v-2" />
                    <div className="chip-center-core" />
                  </div>

                  {/* Security Hologram Shield */}
                  <div className="id-badge-holo-seal">
                    <Shield size={16} />
                    <span>AUTHENTIC CREDENTIAL</span>
                  </div>
                </div>

                {/* Employee Credentials Details Block */}
                <div className="id-badge-back-info">
                  <div className="id-back-field">
                    <span className="id-back-label">EMPLOYEE NAME</span>
                    <strong className="id-back-value">{employeeName}</strong>
                  </div>
                  <div className="id-back-field-grid">
                    <div>
                      <span className="id-back-label">BADGE ID</span>
                      <strong className="id-back-value highlight-amber">{employeeId}</strong>
                    </div>
                    <div>
                      <span className="id-back-label">DEPARTMENT</span>
                      <strong className="id-back-value">{department}</strong>
                    </div>
                  </div>
                  <div className="id-back-field">
                    <span className="id-back-label">DESIGNATION</span>
                    <strong className="id-back-value" style={{ fontSize: '11px', color: '#fde68a' }}>{designation}</strong>
                  </div>
                  <div className="id-back-field-grid">
                    <div>
                      <span className="id-back-label">JOINING DATE</span>
                      <strong className="id-back-value">{joiningDate}</strong>
                    </div>
                    <div>
                      <span className="id-back-label">STATUS</span>
                      <strong className="id-back-value" style={{ color: '#10b981' }}>Active SDE Intern</strong>
                    </div>
                  </div>
                </div>

                {/* Verification Barcode & QR Code Section */}
                <div className="id-badge-barcode-section">
                  <div className="id-badge-qr-box">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt={`Credential QR Code ${employeeId}`} className="id-back-qr-img" />
                    ) : (
                      <QrCode size={36} color="#000" />
                    )}
                    <span className="id-qr-caption">SCAN TO VERIFY</span>
                  </div>

                  {/* Vector Simulated Code 128 Barcode */}
                  <div className="id-badge-barcode-lines">
                    <svg viewBox="0 0 120 38" className="id-barcode-svg" preserveAspectRatio="none">
                      <rect x="0" y="0" width="3" height="34" fill="#0f172a" />
                      <rect x="5" y="0" width="2" height="34" fill="#0f172a" />
                      <rect x="9" y="0" width="4" height="34" fill="#0f172a" />
                      <rect x="15" y="0" width="1" height="34" fill="#0f172a" />
                      <rect x="18" y="0" width="3" height="34" fill="#0f172a" />
                      <rect x="23" y="0" width="5" height="34" fill="#0f172a" />
                      <rect x="30" y="0" width="2" height="34" fill="#0f172a" />
                      <rect x="34" y="0" width="3" height="34" fill="#0f172a" />
                      <rect x="39" y="0" width="1" height="34" fill="#0f172a" />
                      <rect x="42" y="0" width="4" height="34" fill="#0f172a" />
                      <rect x="48" y="0" width="2" height="34" fill="#0f172a" />
                      <rect x="52" y="0" width="4" height="34" fill="#0f172a" />
                      <rect x="58" y="0" width="1" height="34" fill="#0f172a" />
                      <rect x="61" y="0" width="3" height="34" fill="#0f172a" />
                      <rect x="66" y="0" width="2" height="34" fill="#0f172a" />
                      <rect x="70" y="0" width="5" height="34" fill="#0f172a" />
                      <rect x="77" y="0" width="2" height="34" fill="#0f172a" />
                      <rect x="81" y="0" width="3" height="34" fill="#0f172a" />
                      <rect x="86" y="0" width="1" height="34" fill="#0f172a" />
                      <rect x="89" y="0" width="4" height="34" fill="#0f172a" />
                      <rect x="95" y="0" width="2" height="34" fill="#0f172a" />
                      <rect x="99" y="0" width="3" height="34" fill="#0f172a" />
                      <rect x="104" y="0" width="2" height="34" fill="#0f172a" />
                      <rect x="108" y="0" width="4" height="34" fill="#0f172a" />
                      <rect x="114" y="0" width="2" height="34" fill="#0f172a" />
                      <rect x="118" y="0" width="2" height="34" fill="#0f172a" />
                    </svg>
                    <span className="id-barcode-text">*{employeeId}*</span>
                  </div>
                </div>

                {/* Authorized Signature Strip */}
                <div className="id-badge-signature-row">
                  <div className="id-signature-strip">
                    <span className="id-signature-text">Rahul Bariki</span>
                  </div>
                  <span className="id-signature-label">AUTHORIZED EMPLOYEE SIGNATURE</span>
                </div>

                {/* Legal & Return Notice */}
                <div className="id-badge-legal-notice">
                  Property of {company}. If found, please return to IT Security Operations or contact bariki@shnoor.com.
                </div>
              </div>

              {/* Specular Light Bloom for Back Face */}
              <div 
                className="id-badge-specular-glare"
                style={{
                  background: `radial-gradient(circle at ${100 - glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(245, 158, 11, 0.15) 30%, transparent 65%)`,
                  opacity: glarePos.opacity,
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Dynamic Floor Shadow beneath suspended card */}
        <motion.div 
          className="id-badge-ambient-shadow"
          style={is3dEnabled ? {
            x: shadowX,
            y: shadowY,
            scaleX: isHovered ? 1.08 : 1,
            opacity: isHovered ? 0.8 : 0.65,
          } : {}}
          animate={!isHovered && is3dEnabled ? {
            scale: [0.94, 1.04, 0.94],
            opacity: [0.55, 0.72, 0.55],
          } : {}}
          transition={!isHovered ? {
            duration: 4.8,
            repeat: Infinity,
            ease: 'easeInOut',
          } : { duration: 0.3 }}
        />
      </div>

      {/* 3. INTERACTIVE CONTROL ACTIONS BAR */}
      <div className="id-badge-action-bar">
        <button 
          type="button" 
          className="id-badge-flip-btn"
          onClick={toggleFlip}
          aria-label={isFlipped ? "Flip to ID Card Front" : "Flip to ID Card Reverse"}
        >
          <motion.span
            animate={{ rotate: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'inline-flex' }}
          >
            <RotateCw size={13} />
          </motion.span>
          <span>{isFlipped ? 'Show ID Front' : 'Flip to Back (Chip & Barcode)'}</span>
        </button>

        <button 
          type="button" 
          className="id-badge-expand-btn"
          onClick={onExpand}
          aria-label="Expand High-Resolution ID Card in Modal"
        >
          <Eye size={13} />
          <span>Expand View</span>
        </button>
      </div>

      {/* Physics & Interaction Indicator */}
      <div className="id-badge-physics-hint">
        <Sparkles size={11} style={{ color: '#f59e0b' }} />
        <span>3D Lanyard Physics · Hover to tilt · Click to flip &amp; inspect</span>
      </div>
    </div>
  )
}
