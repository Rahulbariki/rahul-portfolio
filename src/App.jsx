import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Award, BrainCircuit, Calendar, Code2, Cpu, ExternalLink, Eye, Github, Layers3, Linkedin, Mail, Medal, Menu, MoveUpRight, Newspaper, Sparkles, Trophy, X } from 'lucide-react'

const projects = [
  {
    number: '01',
    title: 'BrandNova',
    kicker: 'AI Brand Automation Platform',
    description: 'Built an AI-powered branding suite that generates logos, brand names, and marketing content, leveraging LLM APIs and generative AI models to automate brand identity creation for startups.',
    result: '0 → identity',
    tags: ['React', 'Python', 'FastAPI', 'Supabase', 'Vercel'],
    tone: 'cyan',
    icon: Sparkles,
    url: 'https://github.com/Rahulbariki/brand-automation',
  },
  {
    number: '02',
    title: 'CampusPulse',
    kicker: 'Smart Campus Event Management',
    description: 'A smart campus event management platform designed to solve the problem of students missing important college events due to scattered information across multiple platforms.',
    result: 'Events → Unified',
    tags: ['React', 'FastAPI', 'Node.js', 'Express', 'PostgreSQL'],
    tone: 'violet',
    icon: Layers3,
    url: 'https://github.com/Rahulbariki/campus-achievement-intelligence',
  },
  {
    number: '03',
    title: 'SHOWLINK',
    kicker: 'College Search & Discovery',
    description: 'Designed and developed a user-friendly web platform that lists colleges and their detailed brochures, enabling students to easily search and compare college information.',
    result: 'Search → Compare',
    tags: ['HTML', 'CSS', 'JavaScript'],
    tone: 'lime',
    icon: Code2,
    url: 'https://github.com/Rahulbariki/SHOWLINK',
  },
]

const capabilities = [
  { icon: BrainCircuit, title: 'AI product engineering', text: 'Turning model capability into focused, useful, human-centered product experiences.' },
  { icon: Layers3, title: 'Generative systems', text: 'Designing multi-step generation workflows, agents, and automation that hold together.' },
  { icon: Cpu, title: 'Full-stack development', text: 'Building responsive, data-driven web applications with React, FastAPI, Node.js, and SQL.' },
  { icon: Code2, title: 'Rapid prototyping', text: 'Moving from an ambitious idea to a testable, polished product with unusual speed.' },
]

const hackathons = [
  {
    title: 'GenAI Forge Hackathon 2026',
    organizer: 'SmartBridge & NASSCOM FutureSkills Prime',
    date: 'Feb 11 — Feb 14, 2026',
    role: '1st Runner Up Winner 🏆',
    award: '1st Runner Up Winner 🥇',
    description: 'Won 1st Runner Up in a 4-day intensive GenAI bootcamp & hackathon organized by SmartBridge and NASSCOM FutureSkills Prime at Santhiram Engineering College. Featured in Nandi Patrika national press.',
    tags: ['GenAI Forge', 'SmartBridge', 'NASSCOM', '1st Runner Up', 'Press Featured'],
    image: '/assets/cert-genai-forge-hackathon-2026.png',
    newsImage: '/assets/news-genai-forge-hackathon-2026.jpg',
    tone: 'lime',
  },
  {
    title: 'GenAI Innovation Hackathon',
    organizer: 'National AI Sprint',
    date: '2024',
    role: 'Team Lead & AI Architect',
    award: 'Featured Innovator',
    description: 'Built a generative AI automation system under 24 hours to accelerate startup branding workflows.',
    tags: ['GenAI', 'FastAPI', 'React'],
    tone: 'cyan',
  },
  {
    title: 'Smart Campus AI Challenge',
    organizer: 'SEC Tech Fest',
    date: '2024',
    role: 'Full-Stack Developer',
    award: 'Top Finalist',
    description: 'Engineered CampusPulse, a centralized event intelligence portal solving fragmented student communications.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    tone: 'violet',
  },
]

const certCategories = [
  { id: 'all', label: 'All Credentials' },
  { id: 'ieee', label: 'IEEE Certifications' },
  { id: 'course', label: 'Course Certifications' },
  { id: 'participation', label: 'Participations & Workshops' },
  { id: 'winnings', label: 'Winnings & Awards' },
]

const certifications = [
  // --- IEEE CERTIFICATIONS ---
  {
    category: 'ieee',
    title: 'Certificate of IEEE Volunteering (Secretary)',
    kicker: 'Secretary — Santhiram Engineering College (E25)',
    issuer: 'IEEE Student Branch',
    date: 'Feb 2025 — Feb 2027',
    certId: 'IEEE Secretary E25',
    skills: ['Leadership', 'IEEE Secretary', 'Event Management', 'Student Branch'],
    image: '/assets/cert-ieee-volunteering-secretary.png',
    credentialUrl: '/assets/cert-ieee-volunteering-secretary.png',
    tone: 'lime',
  },
  {
    category: 'ieee',
    title: '2025 Certificate of IEEE Membership',
    kicker: 'Global Student Member in Good Standing',
    issuer: 'IEEE',
    date: 'Through Dec 2025',
    certId: 'IEEE Global Member',
    skills: ['IEEE Member', 'Technology Advancement', 'Global Engineering'],
    image: '/assets/cert-ieee-membership-2025.png',
    credentialUrl: '/assets/cert-ieee-membership-2025.png',
    tone: 'cyan',
  },
  {
    category: 'ieee',
    title: '2025 Certificate of Membership — IEEE Education Society',
    kicker: 'Student Member in Good Standing',
    issuer: 'IEEE Education Society',
    date: '2025',
    certId: 'IEEE Education Society',
    skills: ['Education Society', 'Educational Tech', 'Engineering Learning'],
    image: '/assets/cert-ieee-education-society-2025.png',
    credentialUrl: '/assets/cert-ieee-education-society-2025.png',
    tone: 'violet',
  },
  {
    category: 'ieee',
    title: '2025 Certificate of Participation — IEEE Sensors Council',
    kicker: 'Sensor Systems & IoT Student Member',
    issuer: 'IEEE Sensors Council',
    date: '2025',
    certId: 'IEEE Sensors Council',
    skills: ['Sensors Council', 'Sensor Tech', 'IoT Systems'],
    image: '/assets/cert-ieee-sensors-council-2025.png',
    credentialUrl: '/assets/cert-ieee-sensors-council-2025.png',
    tone: 'cyan',
  },
  {
    category: 'ieee',
    title: '2025 Certificate of Participation — IEEE CRFID',
    kicker: 'IEEE Council on RFID Student Member',
    issuer: 'IEEE Council on RFID',
    date: '2025',
    certId: 'IEEE CRFID',
    skills: ['Council on RFID', 'RFID Tech', 'Digital Physical Integration'],
    image: '/assets/cert-ieee-crfid-2025.png',
    credentialUrl: '/assets/cert-ieee-crfid-2025.png',
    tone: 'violet',
  },

  // --- COURSE CERTIFICATIONS ---
  {
    category: 'course',
    title: 'Career Essentials in Generative AI',
    kicker: 'Professional Learning Path Certification',
    issuer: 'Microsoft & LinkedIn Learning',
    date: 'Jul 10, 2026',
    certId: 'ID: 47a1746469714c89d998f58239be87a9',
    skills: ['Microsoft Copilot', 'Generative AI', 'Responsible AI'],
    image: '/assets/cert-microsoft-genai.png',
    credentialUrl: '/assets/cert-microsoft-genai.png',
    tone: 'cyan',
  },
  {
    category: 'course',
    title: 'AI for Beginners',
    kicker: 'HP LIFE Online Professional Course',
    issuer: 'HP LIFE & HP Foundation',
    date: 'Sep 18, 2025',
    certId: 'Serial: 07fa596e-4b08-4da0',
    skills: ['AI Concepts', 'Business Applications', 'Ethical AI'],
    image: '/assets/cert-hp-life-ai.png',
    credentialUrl: '/assets/cert-hp-life-ai.png',
    tone: 'violet',
  },
  {
    category: 'course',
    title: 'Google AI-ML Virtual Internship Certification',
    kicker: 'AI & Machine Learning Foundations',
    issuer: 'Google & EduSkills',
    date: 'Jan 2024 — Mar 2024',
    certId: 'Google AI-ML',
    skills: ['Machine Learning', 'Model Workflows', 'TensorFlow Foundations'],
    image: null,
    credentialUrl: 'https://github.com/Rahulbariki',
    tone: 'cyan',
  },
  {
    category: 'course',
    title: 'AI Developer Internship Certification',
    kicker: 'NLP & Chatbot Development',
    issuer: 'Zcalar AI',
    date: '2024',
    certId: 'Zcalar AI',
    skills: ['NLP Systems', 'Chatbot Architectures', 'Python Automation'],
    image: null,
    credentialUrl: 'https://github.com/Rahulbariki',
    tone: 'violet',
  },

  // --- PARTICIPATIONS & WORKSHOPS ---
  {
    category: 'participation',
    title: 'Building Blocks of the Web (HTML, CSS & JavaScript)',
    kicker: 'One-Week Intensive Web Certificate Program',
    issuer: 'Santhiram Engg. College & Brainovision',
    date: 'Apr 22 — Apr 27, 2024',
    certId: 'Dept of Basic Sciences (SEC)',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Web Fundamentals'],
    image: '/assets/cert-building-blocks-web-2024.png',
    credentialUrl: '/assets/cert-building-blocks-web-2024.png',
    tone: 'lime',
  },
  {
    category: 'participation',
    title: 'National Level Short Term Training Program (NSTTP 2K24)',
    kicker: 'JAVA Full Stack with React JS & AI',
    issuer: 'Santhiram Engg. College, Brainovision & AICTE',
    date: 'Dec 2 — Dec 22, 2024',
    certId: 'ID: NSTTP-B-SEC286',
    skills: ['Java Full Stack', 'React JS', 'AI Integration', 'AICTE Approved'],
    image: '/assets/cert-nsttp-2k24.png',
    credentialUrl: '/assets/cert-nsttp-2k24.png',
    tone: 'cyan',
  },
  {
    category: 'participation',
    title: 'International Level Student Workshop (INSW 2k24)',
    kicker: 'Data Science using Python',
    issuer: 'Santhiram Engg. College, Brainovision & AICTE',
    date: 'Feb 19 — Feb 23, 2024',
    certId: 'ID: INSW24BOVSEC938',
    skills: ['Data Science', 'Python', 'Data Analytics', 'AICTE Approved'],
    image: '/assets/cert-insw-2k24.png',
    credentialUrl: '/assets/cert-insw-2k24.png',
    tone: 'violet',
  },

  // --- WINNINGS & AWARDS ---
  {
    category: 'winnings',
    title: 'GenAI Forge Hackathon 2026 — 1st Runner Up',
    kicker: 'SmartBridge & NASSCOM FutureSkills Prime Winner',
    issuer: 'SmartBridge & NASSCOM',
    date: 'Feb 14, 2026',
    certId: '1st Runner Up Winner 🏆',
    skills: ['GenAI Forge', 'NASSCOM Certified', 'SmartBridge', '1st Runner Up', 'Press Featured'],
    image: '/assets/cert-genai-forge-hackathon-2026.png',
    newsImage: '/assets/news-genai-forge-hackathon-2026.jpg',
    credentialUrl: '/assets/cert-genai-forge-hackathon-2026.png',
    tone: 'lime',
  },
  {
    category: 'winnings',
    title: 'GenAI Innovation Hackathon Award',
    kicker: 'National Level AI Sprint Winner',
    issuer: 'National AI Sprint',
    date: '2024',
    certId: 'Featured Innovator Award',
    skills: ['GenAI Workflow', 'Rapid Prototyping', 'FastAPI'],
    image: null,
    credentialUrl: 'https://github.com/Rahulbariki',
    tone: 'cyan',
  },
  {
    category: 'winnings',
    title: 'Smart Campus AI Challenge Award',
    kicker: 'SEC Tech Fest Innovation Award',
    issuer: 'Santhiram Engineering College',
    date: '2024',
    certId: 'Top 3 Finalist',
    skills: ['CampusPulse Portal', 'Full Stack', 'Event Intelligence'],
    image: null,
    credentialUrl: 'https://github.com/Rahulbariki',
    tone: 'violet',
  },
]

const experiences = [
  { period: 'Feb 2025 — Feb 2027', company: 'IEEE Student Branch — Santhiram Engg. College (E25)', role: 'Secretary', text: 'Appointed as Secretary for IEEE Student Branch (E25) at Santhiram Engineering College, leading technical events, student initiatives, and managing branch operations.' },
  { period: 'Jan 2024 — Mar 2024', company: 'Google AI-ML Virtual Internship', role: 'AI / Machine Learning Intern', text: 'Studied end-to-end machine learning workflows, model development, and practical AI foundations.' },
  { period: '2024', company: 'Zcalar AI Internship', role: 'AI Developer Intern', text: 'Developed intelligent chatbot systems and explored useful, product-focused NLP experiences.' },
]

const navItems = ['About', 'Work', 'Capabilities', 'Hackathons', 'Certifications', 'Experience', 'Contact']

function usePointer() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 45 })
  const springY = useSpring(y, { stiffness: 500, damping: 45 })
  useEffect(() => {
    const move = (event) => {
      const clientX = event.touches ? event.touches[0].clientX : event.clientX
      const clientY = event.touches ? event.touches[0].clientY : event.clientY
      if (clientX === undefined) return
      x.set(clientX)
      y.set(clientY)
      document.documentElement.style.setProperty('--mx', `${clientX}px`)
      document.documentElement.style.setProperty('--my', `${clientY}px`)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('touchmove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('touchmove', move)
    }
  }, [x, y])
  return { springX, springY }
}

function ParticleField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame
    let particles = []
    let width = 0
    let height = 0
    const pointer = { x: -1000, y: -1000 }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      particles = Array.from({ length: Math.min(95, Math.max(20, Math.floor(width / 15))) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.4 + 0.3,
      }))
    }
    const move = (event) => {
      if (event.touches && event.touches[0]) {
        pointer.x = event.touches[0].clientX
        pointer.y = event.touches[0].clientY
      } else if (event.clientX !== undefined) {
        pointer.x = event.clientX
        pointer.y = event.clientY
      }
    }
    const draw = () => {
      context.clearRect(0, 0, width, height)
      particles.forEach((particle, index) => {
        if (!reduced) {
          particle.x += particle.vx
          particle.y += particle.vy
        }
        if (particle.x < 0 || particle.x > width) particle.vx *= -1
        if (particle.y < 0 || particle.y > height) particle.vy *= -1
        const pointerDistance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y)
        context.beginPath()
        context.fillStyle = pointerDistance < 180 ? 'rgba(167,139,250,.9)' : 'rgba(255,255,255,.28)'
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
        particles.slice(index + 1, index + 7).forEach((other) => {
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y)
          if (distance < 105) {
            context.beginPath()
            context.strokeStyle = `rgba(167,139,250,${0.045 * (1 - distance / 105)})`
            context.moveTo(particle.x, particle.y)
            context.lineTo(other.x, other.y)
            context.stroke()
          }
        })
      })
      frame = requestAnimationFrame(draw)
    }
    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move)
    window.addEventListener('touchmove', move, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('touchmove', move)
    }
  }, [])
  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}

function Cursor({ x, y }) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const handlePointerOver = (e) => {
      if (e.target && e.target.closest && e.target.closest('a, button, [data-cursor], input, textarea')) {
        setActive(true)
      }
    }
    const handlePointerOut = (e) => {
      if (e.target && e.target.closest && e.target.closest('a, button, [data-cursor], input, textarea')) {
        setActive(false)
      }
    }
    window.addEventListener('pointerover', handlePointerOver)
    window.addEventListener('pointerout', handlePointerOut)
    return () => {
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('pointerout', handlePointerOut)
    }
  }, [])
  return <motion.div className={`cursor ${active ? 'cursor-active' : ''}`} style={{ x, y }} aria-hidden="true" />
}

function Navigation({ onOpen }) {
  return (
    <motion.header className="nav" initial={{ y: -80 }} animate={{ y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}>
      <a className="monogram" href="#top" aria-label="Rahul Bariki home">RB<span>®</span></a>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item, index) => (
          <a key={item} href={`#${item.toLowerCase()}`}>
            <span>0{index + 1}</span>{item}
          </a>
        ))}
      </nav>
      <button className="menu-button" type="button" onClick={onOpen} aria-label="Open menu">
        <Menu size={18} /> Menu
      </button>
    </motion.header>
  )
}

function MenuOverlay({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Site navigation" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
          <button type="button" onClick={onClose} className="menu-close" aria-label="Close navigation menu"><X /> Close</button>
          <div className="menu-list">
            {navItems.map((item, index) => (
              <motion.a key={item} href={`#${item.toLowerCase()}`} onClick={onClose} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + index * 0.08 }}>
                <span>0{index + 1}</span>{item}<ArrowUpRight />
              </motion.a>
            ))}
          </div>
          <p>Available for internships, ambitious ideas, and teams building what comes next.</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Hero() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 40])
  const opacity = useTransform(scrollYProgress, [0, 0.16], [1, 0])

  return (
    <section className="hero" id="top">
      {/* Decorative gradient elements */}
      <div className="hero-gradient-orb hero-orb-1" />
      <div className="hero-gradient-orb hero-orb-2" />
      <div className="hero-gradient-orb hero-orb-3" />

      {/* Top status bar */}
      <motion.div className="hero-topbar" style={{ opacity }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="eyebrow"><span className="signal" /> Available for ambitious AI work</div>
        <div className="hero-topbar-right">
          <span className="hero-location">Based in India</span>
        </div>
      </motion.div>

      {/* Main Grid: Name & Text on Left, Portrait Frame on Right */}
      <div className="hero-main-grid">
        <motion.div className="hero-text-col" style={{ y, opacity }}>
          <h1 aria-label="Rahul Bariki">
            <span className="hero-line"><motion.span initial={{ y: '120%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>Rahul</motion.span></span>
            <span className="hero-line hero-line-last"><motion.span initial={{ y: '120%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}>Bariki</motion.span></span>
          </h1>

          <p className="hero-desc">
            I build intelligent AI products, generative systems, and full-stack web platforms that make ambitious ideas useful.
          </p>

          <div className="hero-actions">
            <a href="mailto:rahulbariki24@gmail.com" className="hero-cta-primary">Let's Talk <ArrowUpRight /></a>
            <a href="#work" className="hero-cta-secondary">View Work <ArrowDown /></a>
          </div>

          <div className="hero-stats">
            <span><strong>3+</strong><small>Featured projects</small></span>
            <span><strong>02</strong><small>AI internships</small></span>
          </div>
        </motion.div>

        {/* Dedicated Portrait Frame Column */}
        <motion.div className="hero-portrait-col" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45, duration: 0.85 }}>
          <div className="portrait-frame">
            <div className="portrait-glow" />
            <div className="portrait-border-ring" />
            <img src="/assets/rahul-profile.png" alt="Rahul Bariki" loading="eager" />
            
            <motion.span className="hero-float-tag tag-ai" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}>GEN AI</motion.span>
            <motion.span className="hero-float-tag tag-cv" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.05 }}>FULL-STACK</motion.span>
            <motion.span className="hero-float-tag tag-eng" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}>AI ENGINEER</motion.span>
          </div>
        </motion.div>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↓</motion.span>
        <span>Scroll</span>
      </div>
    </section>
  )
}

function Manifesto() {
  return (
    <section className="manifesto" id="about">
      <div className="section-kicker">Principle / 01</div>
      <motion.p initial={{ opacity: 0.2 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.2 }}>
        AI is only remarkable when it feels <em>inevitable.</em> I combine engineering, experimentation, and product instinct to make complex systems feel beautifully simple.
      </motion.p>
      <div className="manifesto-meta">
        <span>Based in India</span>
        <span>Building globally</span>
        <span>Available now</span>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  const Icon = project.icon
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 220, damping: 25 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 220, damping: 25 })
  const move = (event) => {
    if (!cardRef.current) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const box = cardRef.current.getBoundingClientRect()
    x.set((event.clientX - box.left) / box.width - 0.5)
    y.set((event.clientY - box.top) / box.height - 0.5)
  }
  return (
    <motion.article
      ref={cardRef}
      className={`project-card ${project.tone}`}
      onPointerMove={move}
      onPointerLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8 }}
      data-cursor
    >
      <div className="project-top"><span>{project.number} / Featured</span><Icon /></div>
      <div className="project-visual">
        <div className="visual-ring ring-a" />
        <div className="visual-ring ring-b" />
        <div className="visual-grid" />
        <Icon className="visual-icon" />
        <span>{project.result}</span>
      </div>
      <div className="project-copy">
        <p>{project.kicker}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-footer">
          <div>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`}>
            <MoveUpRight />
          </a>
        </div>
      </div>
    </motion.article>
  )
}

function Work() {
  return (
    <section className="work section-shell" id="work">
      <div className="section-heading">
        <div><span>Selected systems</span><span>02 / 07</span></div>
        <h2>Work that moves<br /><em>ideas forward.</em></h2>
      </div>
      <div className="project-grid">
        {projects.map((project) => <ProjectCard project={project} key={project.title} />)}
      </div>
    </section>
  )
}

function Capabilities() {
  return (
    <section className="capabilities section-shell" id="capabilities">
      <div className="section-heading compact">
        <div><span>What I bring</span><span>03 / 07</span></div>
        <h2>From possibility<br />to <em>working product.</em></h2>
      </div>
      <div className="capability-list">
        {capabilities.map(({ icon: Icon, title, text }, index) => (
          <motion.article key={title} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
            <span>0{index + 1}</span>
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
            <ArrowUpRight />
          </motion.article>
        ))}
      </div>
      <div className="ticker" aria-hidden="true">
        <div>GENERATIVE AI · FULL-STACK DEVELOPMENT · AGENTIC SYSTEMS · PRODUCT ENGINEERING · RAPID PROTOTYPING · </div>
        <div>GENERATIVE AI · FULL-STACK DEVELOPMENT · AGENTIC SYSTEMS · PRODUCT ENGINEERING · RAPID PROTOTYPING · </div>
      </div>
    </section>
  )
}

function Hackathons({ onSelectImage }) {
  return (
    <section className="hackathons section-shell" id="hackathons">
      <div className="section-heading compact">
        <div><span>Sprints & Competitions</span><span>04 / 07</span></div>
        <h2>Building under<br /><em>pressure & speed.</em></h2>
      </div>
      <div className="hackathon-grid">
        {hackathons.map((item, index) => (
          <motion.article
            key={item.title}
            className={`hackathon-card ${item.tone}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12 }}
            data-cursor
          >
            <div className="hack-header">
              <span className="hack-badge"><Trophy size={14} /> {item.award}</span>
              <span className="hack-date"><Calendar size={13} /> {item.date}</span>
            </div>
            <h3>{item.title}</h3>
            <div className="hack-meta">
              <span>{item.organizer}</span> • <span>{item.role}</span>
            </div>
            <p>{item.description}</p>

            {/* If hackathon has certificate image or newspaper feature preview */}
            {item.image && (
              <div className="hack-preview-row">
                <div
                  className="cert-img-thumb hack-thumb"
                  onClick={() => onSelectImage({ title: item.title, img: item.image, newsImg: item.newsImage })}
                  role="button"
                  tabIndex={0}
                  aria-label={`View award certificate for ${item.title}`}
                >
                  <img src={item.image} alt={`${item.title} award certificate`} loading="lazy" />
                  <div className="thumb-overlay">
                    <Eye size={16} />
                    <span>View Award</span>
                  </div>
                </div>

                {item.newsImage && (
                  <div
                    className="cert-img-thumb hack-thumb"
                    onClick={() => onSelectImage({ title: `${item.title} — Press Feature`, img: item.newsImage })}
                    role="button"
                    tabIndex={0}
                    aria-label={`View newspaper press coverage for ${item.title}`}
                  >
                    <img src={item.newsImage} alt={`${item.title} newspaper press feature`} loading="lazy" />
                    <div className="thumb-overlay">
                      <Newspaper size={16} />
                      <span>Press Feature</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="hack-tags">
              {item.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function Certifications({ onSelectImage }) {
  const [activeTab, setActiveTab] = useState('all')

  const filteredCerts = activeTab === 'all'
    ? certifications
    : certifications.filter((item) => item.category === activeTab)

  return (
    <section className="certifications section-shell" id="certifications">
      <div className="section-heading compact">
        <div><span>Verified Credentials & Awards</span><span>05 / 07</span></div>
        <h2>Certifications,<br /><em>workshops & awards.</em></h2>
      </div>

      {/* Category Filter Tabs */}
      <div className="cert-filter-tabs">
        {certCategories.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`cert-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="cert-grid">
        <AnimatePresence mode="wait">
          {filteredCerts.map((cert, index) => (
            <motion.article
              key={cert.title}
              className={`cert-card ${cert.tone}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              data-cursor
            >
              <div className="cert-top-row">
                <div className="cert-icon-wrapper">
                  <Medal size={24} className="cert-icon" />
                </div>
                <div className="cert-top-meta">
                  <span className="cert-issuer">{cert.issuer}</span>
                  <span className="cert-date">{cert.date}</span>
                </div>
              </div>

              <div className="cert-content">
                <h3>{cert.title}</h3>
                {cert.kicker && (
                  <p className="cert-kicker">
                    {cert.kicker} {cert.certId && <span className="cert-id">• {cert.certId}</span>}
                  </p>
                )}

                {/* Certificate Image Thumbnail Preview */}
                {cert.image && (
                  <div className="cert-img-thumb-container">
                    <div
                      className="cert-img-thumb"
                      onClick={() => onSelectImage({ title: cert.title, img: cert.image, newsImg: cert.newsImage })}
                      role="button"
                      tabIndex={0}
                      aria-label={`View certificate image for ${cert.title}`}
                    >
                      <img src={cert.image} alt={`${cert.title} certificate`} loading="lazy" />
                      <div className="thumb-overlay">
                        <Eye size={18} />
                        <span>View Certificate</span>
                      </div>
                    </div>

                    {cert.newsImage && (
                      <div
                        className="cert-img-thumb cert-news-thumb"
                        onClick={() => onSelectImage({ title: `${cert.title} — Press Feature`, img: cert.newsImage })}
                        role="button"
                        tabIndex={0}
                        aria-label={`View press coverage for ${cert.title}`}
                      >
                        <img src={cert.newsImage} alt={`${cert.title} news feature`} loading="lazy" />
                        <div className="thumb-overlay">
                          <Newspaper size={18} />
                          <span>Press Feature</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="cert-skills">
                  {cert.skills.map((s) => <span key={s}>{s}</span>)}
                </div>
              </div>

              <div className="cert-card-footer">
                {cert.image ? (
                  <div className="cert-btn-group">
                    <button
                      type="button"
                      className="cert-view-btn"
                      onClick={() => onSelectImage({ title: cert.title, img: cert.image, newsImg: cert.newsImage })}
                    >
                      <Eye size={15} /> Certificate
                    </button>
                    {cert.newsImage && (
                      <button
                        type="button"
                        className="cert-view-btn cert-news-btn"
                        onClick={() => onSelectImage({ title: `${cert.title} — Press Feature`, img: cert.newsImage })}
                      >
                        <Newspaper size={15} /> Press Feature
                      </button>
                    )}
                  </div>
                ) : (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="cert-link" aria-label={`View credential for ${cert.title}`}>
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section className="experience section-shell" id="experience">
      <div className="section-heading compact">
        <div><span>Field notes</span><span>06 / 07</span></div>
        <h2>Learning by<br /><em>building in public.</em></h2>
      </div>
      <div className="experience-grid">
        <div className="experience-intro">
          <span>Current chapter</span>
          <p>B.Tech Artificial Intelligence & Machine Learning student at Santhiram Engineering College, turning coursework and curiosity into useful systems.</p>
        </div>
        <div className="experience-list">
          {experiences.map((item, index) => (
            <motion.article key={item.company} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <div><span>0{index + 1}</span><span>{item.period}</span></div>
              <h3>{item.company}</h3>
              <h4>{item.role}</h4>
              <p>{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact section-shell" id="contact">
      <div className="contact-glow" />
      <div className="section-kicker">Next chapter / 07</div>
      <h2>Have an impossible<br />idea? <em>Good.</em></h2>
      <p>I’m looking for ambitious teams, serious AI problems, and ideas with enough energy to change shape while we build them.</p>
      <a className="contact-cta" href="mailto:rahulbariki24@gmail.com">
        <span>Start a conversation</span><ArrowUpRight />
      </a>
      <div className="social-row">
        <a href="mailto:rahulbariki24@gmail.com"><Mail />Email</a>
        <a href="https://github.com/rahulbariki" target="_blank" rel="noopener noreferrer"><Github />GitHub</a>
        <a href="https://www.linkedin.com/in/rahulbariki24" target="_blank" rel="noopener noreferrer"><Linkedin />LinkedIn</a>
      </div>
      <footer>
        <span>Rahul Bariki © 2026</span>
        <span>AI systems / intelligent products</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const { scrollYProgress } = useScroll()
  const { springX, springY } = usePointer()
  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>
        {!loaded && (
          <motion.div className="loader" exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>INITIALIZING INTELLIGENCE</motion.span>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1 }} />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} />
      <div className="noise" />
      <div className="pointer-glow" />
      <ParticleField />
      <Cursor x={springX} y={springY} />
      <Navigation onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <Hero />
        <Manifesto />
        <Work />
        <Capabilities />
        <Hackathons onSelectImage={setSelectedImage} />
        <Certifications onSelectImage={setSelectedImage} />
        <Experience />
        <Contact />
      </main>

      {/* Global Lightbox Modal for Certificate / Press Images */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="cert-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="cert-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cert-modal-header">
                <h3>{selectedImage.title}</h3>
                <button type="button" onClick={() => setSelectedImage(null)} className="cert-modal-close" aria-label="Close modal">
                  <X size={20} />
                </button>
              </div>
              <div className="cert-modal-body">
                <img src={selectedImage.img} alt={selectedImage.title} />
                {selectedImage.newsImg && (
                  <div className="cert-modal-news-block">
                    <h4>Nandi Patrika Press Coverage</h4>
                    <img src={selectedImage.newsImg} alt={`${selectedImage.title} Nandi Patrika Press Coverage`} />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
