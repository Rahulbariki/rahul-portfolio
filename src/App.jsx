import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Award, BrainCircuit, Calendar, Camera, Code2, Cpu, ExternalLink, Eye, Github, GraduationCap, Layers3, Linkedin, Mail, MapPin, Medal, Menu, MoveUpRight, Newspaper, Phone, Sparkles, Terminal, Trophy, Wrench, X } from 'lucide-react'

const projects = [
  {
    number: '01',
    title: 'IntelliAttend',
    kicker: 'AI-Powered Smart Attendance Platform (Startup Project)',
    description: 'Currently co-engineering an intelligent, automated attendance management portal with a startup team. IntelliAttend leverages AI algorithms to streamline attendance tracking, real-time analytics, and automated reporting for institutions.',
    result: 'Active Startup ⚡',
    tags: ['AI Intelligence', 'React', 'Python', 'FastAPI', 'Full-Stack', 'Active Startup'],
    tone: 'lime',
    icon: BrainCircuit,
    image: '/assets/intelliattend-logo.png',
    url: 'https://dashboard.intelliattend.app/login',
    liveUrl: 'https://dashboard.intelliattend.app/login',
  },
  {
    number: '02',
    title: 'BrandNova',
    kicker: 'AI Brand Automation Platform',
    description: 'Built an AI-powered branding suite that generates logos, brand names, and marketing content, leveraging LLM APIs and generative AI models to automate brand identity creation for startups.',
    result: '0 → identity',
    tags: ['React', 'Python', 'HTML', 'CSS', 'FastAPI', 'Vercel', 'Supabase'],
    tone: 'cyan',
    icon: Sparkles,
    url: 'https://github.com/Rahulbariki/brand-automation',
    liveUrl: 'https://brandnova-brand-automation.vercel.app/',
  },
  {
    number: '03',
    title: 'CampusPulse',
    kicker: 'Smart Campus Event Management',
    description: 'CampusPulse is a smart campus event management platform designed to solve the problem of students missing important college events due to scattered information across multiple platforms such as WhatsApp groups, notice boards, emails, and social media.',
    result: 'Events → Unified',
    tags: ['React', 'HTML', 'CSS', 'Python', 'FastAPI', 'Node.js', 'Express.js', 'PostgreSQL'],
    tone: 'violet',
    icon: Layers3,
    url: 'https://github.com/Rahulbariki/campus-achievement-intelligence',
    liveUrl: 'https://srec-community.vercel.app/',
  },
  {
    number: '04',
    title: 'SHOWLINK',
    kicker: 'College Search & Discovery Portal',
    description: 'Designed and developed a user-friendly web platform that lists colleges and their detailed brochures, enabling students to easily search and compare college information. Built during the "Building Blocks of the Web" workshop and presented live on stage.',
    result: 'Search → Compare',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Workshop Built', 'Live Presented'],
    tone: 'lime',
    icon: Code2,
    image: '/assets/showlink-logo.png',
    stageImage: '/assets/photo-showlink-presentation-1.jpg',
    stageTitle: 'Live Auditorium Stage Presentation of SHOWLINK Project',
    url: 'https://github.com/Rahulbariki/SHOWLINK',
    liveUrl: 'https://showlink.vercel.app/',
  },
]

const technicalSkills = {
  languages: ['Python', 'C', 'C++', 'HTML5', 'CSS3', 'JavaScript'],
  technologies: [
    'Generative AI',
    'AI Engineering',
    'Artificial Intelligence',
    'Machine Learning',
    'Natural Language Processing (NLP)',
    'AI Agents',
    'UI/UX Design',
    'User Experience & Wireframing',
    'Web Development',
    'API Integration',
    'Chatbot Development',
    'Automation Systems',
    'Prompt Engineering',
  ],
  tools: ['Git', 'GitHub', 'VS Code', 'Antigravity', 'PowerBI', 'Supabase', 'FastAPI', 'Vercel', 'UI/UX Tools'],
  softSkills: ['Real-Time Problem Solving', 'Technical Presentation', 'UI/UX Design Thinking'],
}

const capabilities = [
  { icon: BrainCircuit, title: 'Generative AI Engineering', text: 'Architecting intelligent AI agents, prompt engineering pipelines, LLM workflows, and multi-step generative automation.' },
  { icon: Cpu, title: 'AI Engineering & ML Systems', text: 'Building end-to-end NLP engines, chatbot architectures, machine learning models, and automated intelligence systems.' },
  { icon: Layers3, title: 'UI/UX Design & Frontend', text: 'Designing intuitive, user-centric interfaces, visual design systems, wireframes, and seamless digital user experiences.' },
  { icon: Code2, title: 'Real-Time Problem Solutions', text: 'Architecting software platforms and scalable solutions engineered to solve complex, real-time real-world problems.' },
]

const hackathons = [
  {
    title: 'DEFEND-X National Technical Symposium (RIPPLE 2K26)',
    organizer: 'Dept of CSE (Cyber Security), RGMCET',
    date: 'Mar 9 — Mar 10, 2026',
    role: '2nd Prize Winner — Prompt Engineering 🥈',
    award: '2nd Prize Winner 🥈 (Cash Prize & Medal)',
    description: 'Secured 2nd Prize in the Prompt Engineering competition at DEFEND-X (RIPPLE 2K26), competing against top engineering students. Awarded Certificate of Merit, cash prize, on-stage recognition, and featured in Major News Telugu newspaper press.',
    tags: ['Prompt Engineering', 'DEFEND-X', 'RGMCET', '2nd Prize Winner', 'Press Featured'],
    image: '/assets/cert-defendx-prompt-engineering.jpg',
    imageTitle: 'Certificate of Merit — 2nd Prize Winner in Prompt Engineering',
    newsImage: '/assets/news-defendx-prompt-engineering.jpg',
    newsTitle: 'Major News Telugu Press Feature (12 March 2026)',
    stageImage: '/assets/photo-defendx-stage-award.jpg',
    stageTitle: 'On-Stage Award Presentation at RGMCET Auditorium',
    secImage: '/assets/photo-defendx-sec-felicitation.jpg',
    secTitle: 'Felicitation by Santhiram Engineering College Principal',
    tone: 'lime',
  },
  {
    title: '14th National Technical Symposium (EMINENCE-SIGMA-2K25)',
    organizer: 'Dept of ECE & Dept of Basic Sciences, SEC',
    date: 'Feb 28 — Mar 1, 2025',
    role: '3rd Prize Winner — Challenge AI 🥉',
    award: '3rd Prize Winner 🥉 (Trophy Memento)',
    description: 'Secured 3rd Prize in the Challenge AI competition at the 14th National Level Technical Symposium (EMINENCE-SIGMA-2K25). Presented a live Python AI assistant & speech recognition system on stage before faculty judges.',
    tags: ['Challenge AI', 'EMINENCE-SIGMA', '3rd Prize Winner', 'AI Competition', 'Live Demo'],
    image: '/assets/cert-challenge-ai-merit-3rd-prize.jpg',
    imageTitle: 'Certificate of Merit — 3rd Prize Winner in Challenge AI',
    newsImage: '/assets/cert-challenge-ai-participation.jpg',
    newsTitle: 'Certificate of Participation — Challenge AI',
    stageImage: '/assets/photo-challenge-ai-trophy.jpg',
    stageTitle: '3rd Prize Trophy Memento Presentation by Principal',
    secImage: '/assets/photo-challenge-ai-presentation-1.jpg',
    secTitle: 'Live Python AI Assistant Demo on Smart Digital Screen',
    tone: 'violet',
  },
  {
    title: 'GenAI Forge Hackathon 2026',
    organizer: 'SmartBridge & NASSCOM FutureSkills Prime',
    date: 'Feb 11 — Feb 14, 2026',
    role: '1st Runner Up Winner 🏆',
    award: '1st Runner Up Winner 🥇',
    description: 'Won 1st Runner Up in a 4-day intensive GenAI bootcamp & hackathon organized by SmartBridge and NASSCOM FutureSkills Prime at Santhiram Engineering College. Featured in Nandi Patrika national press.',
    tags: ['GenAI Forge', 'SmartBridge', 'NASSCOM', '1st Runner Up', 'Press Featured'],
    image: '/assets/cert-genai-forge-hackathon-2026.png',
    imageTitle: 'GenAI Forge Hackathon 2026 — 1st Runner Up Certificate of Recognition',
    newsImage: '/assets/news-genai-forge-hackathon-2026.jpg',
    newsTitle: 'Nandi Patrika National Press Coverage (15 Feb 2026)',
    tone: 'cyan',
  },
  {
    title: 'LeetCode Club Grand Event - 2K25',
    organizer: 'LeetCode Club & IEEE Computer Society',
    date: 'Feb 22, 2025',
    role: 'Active Participant — Competitive Coding',
    award: 'Active Participant 🏆',
    description: 'Participated in the LeetCode Club Grand Event - 2K25 organized by LeetCode Club, IEEE Computer Society, and Dept of CSE (AI & ML) at Santhiram Engineering College, focusing on data structures, algorithms, and rapid problem solving.',
    tags: ['LeetCode', 'Algorithms', 'Data Structures', 'Competitive Coding', 'IEEE'],
    image: '/assets/cert-leetcode-club-2k25.jpg',
    imageTitle: 'Certificate of Participation — LeetCode Club Grand Event - 2K25',
    stageImage: '/assets/photo-leetcode-club-2k25.jpg',
    stageTitle: 'On-Stage Certificate Felicitation with Resource Persons',
    tone: 'cyan',
  },
  {
    title: 'Building Blocks of the Web (HTML, CSS & JavaScript)',
    organizer: 'Dept of Basic Sciences (SEC) & Brainovision',
    date: 'Apr 22 — Apr 27, 2024',
    role: 'Web Development Participant & SHOWLINK Presenter',
    award: 'One-Week Certificate Program',
    description: 'Completed an intensive one-week web development program. Developed and presented SHOWLINK (College Search & Discovery Portal) live on stage in the college auditorium before faculty and peers.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'SHOWLINK', 'Stage Presentation'],
    image: '/assets/cert-building-blocks-web-2024.png',
    imageTitle: 'Certificate of Participation — One-Week Web Development Program',
    stageImage: '/assets/photo-showlink-presentation-1.jpg',
    stageTitle: 'Live Auditorium Stage Presentation of SHOWLINK Project',
    secImage: '/assets/photo-showlink-presentation-2.jpg',
    secTitle: 'SHOWLINK Web Portal Demo Day Presentation',
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
    tone: 'violet',
  },
  {
    title: 'Smart Campus AI Challenge',
    organizer: 'SEC Tech Fest',
    date: '2024',
    role: 'Full-Stack Developer',
    award: 'Top Finalist',
    description: 'Engineered CampusPulse, a centralized event intelligence portal solving fragmented student communications.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    tone: 'cyan',
  },
]

const certCategories = [
  { id: 'all', label: 'All Credentials (14)' },
  { id: 'winnings', label: '🏆 Winnings & Awards (3)' },
  { id: 'ieee', label: '🎓 IEEE Certifications (5)' },
  { id: 'participation', label: '💻 Workshops & Competitions (2)' },
  { id: 'course', label: '📜 Course Certifications (4)' },
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
    imageTitle: 'Certificate of IEEE Volunteering — Secretary (Santhiram Engg. College)',
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
    imageTitle: '2025 Certificate of IEEE Global Membership',
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
    imageTitle: '2025 Certificate of Membership — IEEE Education Society',
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
    imageTitle: '2025 Certificate of Participation — IEEE Sensors Council',
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
    imageTitle: '2025 Certificate of Participation — IEEE Council on RFID',
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
    imageTitle: 'Career Essentials in Generative AI by Microsoft & LinkedIn',
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
    imageTitle: 'Certificate of Completion — HP LIFE AI for Beginners',
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
    title: 'AI Developer Virtual Internship Certification',
    kicker: 'Virtual Internship — NLP & Chatbot Development',
    issuer: 'Zcalar AI',
    date: '2024',
    certId: 'Zcalar AI Virtual',
    skills: ['NLP Systems', 'Chatbot Architectures', 'Python Automation', 'Virtual Internship'],
    image: null,
    credentialUrl: 'https://github.com/Rahulbariki',
    tone: 'violet',
  },

  // --- PARTICIPATIONS & WORKSHOPS ---
  {
    category: 'participation',
    title: 'National Level Short Term Training Program (NSTTP 2K24)',
    kicker: 'JAVA Full Stack with React JS & AI',
    issuer: 'Santhiram Engg. College, Brainovision & AICTE',
    date: 'Dec 2 — Dec 22, 2024',
    certId: 'ID: NSTTP-B-SEC286',
    skills: ['Java Full Stack', 'React JS', 'AI Integration', 'AICTE Approved'],
    image: '/assets/cert-nsttp-2k24.png',
    imageTitle: 'National Level Short Term Training Program (NSTTP 2K24) Certificate',
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
    imageTitle: 'International Level Student Workshop (INSW 2k24) Certificate',
    credentialUrl: '/assets/cert-insw-2k24.png',
    tone: 'violet',
  },

  // --- WINNINGS & AWARDS ---
  {
    category: 'winnings',
    title: 'EMINENCE-SIGMA-2K25 — 3rd Prize Winner ("Challenge AI")',
    kicker: '14th National Level Technical Symposium (Dept of ECE & Basic Sciences)',
    issuer: 'Santhiram Engineering College (Autonomous)',
    date: 'Feb 28 — Mar 1, 2025',
    certId: '3rd Prize Award 🥉',
    skills: ['Challenge AI', 'AI Problem Solving', 'EMINENCE-SIGMA', 'National Symposium', 'Live Demo'],
    image: '/assets/cert-challenge-ai-merit-3rd-prize.jpg',
    imageTitle: 'Certificate of Merit — 3rd Prize Winner in Challenge AI',
    newsImage: '/assets/cert-challenge-ai-participation.jpg',
    newsTitle: 'Certificate of Participation — Challenge AI',
    stageImage: '/assets/photo-challenge-ai-trophy.jpg',
    stageTitle: '3rd Prize Trophy Memento Presentation by Principal',
    secImage: '/assets/photo-challenge-ai-presentation-1.jpg',
    secTitle: 'Live Python AI Assistant Demo on Smart Digital Screen',
    credentialUrl: '/assets/cert-challenge-ai-merit-3rd-prize.jpg',
    tone: 'violet',
  },
  {
    category: 'winnings',
    title: 'DEFEND-X National Symposium — 2nd Prize Winner',
    kicker: 'Prompt Engineering Competition (Dept of CSE - Cyber Security, RGMCET)',
    issuer: 'RGMCET (Autonomous)',
    date: 'Mar 9 — 10, 2026',
    certId: '2nd Prize & Cash Award 🥈',
    skills: ['Prompt Engineering', 'AI Optimization', 'DEFEND-X Winner', 'Press Featured'],
    image: '/assets/cert-defendx-prompt-engineering.jpg',
    imageTitle: 'Certificate of Merit — 2nd Prize Winner in Prompt Engineering',
    newsImage: '/assets/news-defendx-prompt-engineering.jpg',
    newsTitle: 'Major News Telugu Press Feature (12 March 2026)',
    stageImage: '/assets/photo-defendx-stage-award.jpg',
    stageTitle: 'On-Stage Award Presentation at RGMCET Auditorium',
    secImage: '/assets/photo-defendx-sec-felicitation.jpg',
    secTitle: 'Felicitation by Santhiram Engineering College Principal',
    credentialUrl: '/assets/cert-defendx-prompt-engineering.jpg',
    tone: 'lime',
  },
  {
    category: 'winnings',
    title: 'GenAI Forge Hackathon 2026 — 1st Runner Up',
    kicker: 'SmartBridge & NASSCOM FutureSkills Prime Winner',
    issuer: 'SmartBridge & NASSCOM',
    date: 'Feb 14, 2026',
    certId: '1st Runner Up Winner 🏆',
    skills: ['GenAI Forge', 'NASSCOM Certified', 'SmartBridge', '1st Runner Up', 'Press Featured'],
    image: '/assets/cert-genai-forge-hackathon-2026.png',
    imageTitle: 'GenAI Forge Hackathon 2026 — 1st Runner Up Certificate of Recognition',
    newsImage: '/assets/news-genai-forge-hackathon-2026.jpg',
    newsTitle: 'Nandi Patrika National Press Coverage (15 Feb 2026)',
    credentialUrl: '/assets/cert-genai-forge-hackathon-2026.png',
    tone: 'cyan',
  },
]

const educationList = [
  {
    period: '2023 — 2027',
    degree: 'B.Tech in Computer Science and Engineering (AI & ML)',
    institution: 'Santhiram Engineering College, Nandyal (Autonomous)',
    scoreLabel: 'CGPA',
    scoreValue: '8.46 / 10.0',
    badge: '8.46 CGPA 🌟',
    details: 'Specializing in Artificial Intelligence, Machine Learning, Natural Language Processing, Generative AI, AI Agents, and Full-Stack Engineering.',
    tone: 'cyan',
  },
  {
    period: '2021 — 2023',
    degree: 'Class XII (Intermediate MPC)',
    institution: 'Narayana Junior College, Nandyal',
    scoreLabel: 'Score & JEE Mains Rank',
    scoreValue: '79% Score • JEE Mains Rank: 58055',
    badge: 'JEE Rank: 58055 🎯',
    details: 'Completed higher secondary education in Mathematics, Physics, and Chemistry (MPC) with a 79% score and top 58k JEE Mains All India Rank.',
    tone: 'violet',
  },
]

const experiences = [
  { period: 'Present (Active Startup)', company: 'IntelliAttend Startup Team', role: 'AI Software Engineer & Co-Developer', text: 'Co-engineering IntelliAttend (dashboard.intelliattend.app/login), an AI-driven smart attendance intelligence & real-time analytics platform for modern educational institutions.' },
  { period: 'Feb 2025 — Feb 2027', company: 'IEEE Student Branch — Santhiram Engg. College (E25)', role: 'Secretary', text: 'Appointed as Secretary for IEEE Student Branch (E25) at Santhiram Engineering College, leading technical events, student initiatives, and managing branch operations.' },
  { period: 'Jan 2024 — Mar 2024', company: 'Google AI-ML Virtual Internship', role: 'AI / Machine Learning Virtual Intern', text: 'Completed a virtual internship studying end-to-end machine learning workflows, model development, and practical AI foundations powered by Google & EduSkills.' },
  { period: '2024', company: 'Zcalar AI Virtual Internship', role: 'AI Developer Virtual Intern', text: 'Completed a virtual internship developing intelligent chatbot systems and exploring useful, product-focused NLP experiences.' },
]

function getMediaCount(item) {
  let count = 0
  if (item.image) count++
  if (item.newsImage) count++
  if (item.stageImage) count++
  if (item.secImage) count++
  return count
}

const navItems = ['About', 'Work', 'Skills', 'Hackathons', 'Certifications', 'Education', 'Experience', 'Contact']

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
        <div className="eyebrow"><span className="signal" /> GENERATIVE AI ENGINEER · AI ENGINEER · UI/UX DESIGNER</div>
        <div className="hero-topbar-right">
          <span className="hero-location"><MapPin size={13} /> Nandyal, Andhra Pradesh, India</span>
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
            Results-driven Software Engineer with expertise in Generative AI, AI Engineering, and UI/UX Design. I specialize in building intelligent AI agents, intuitive user interfaces, and software solutions for real-time problems.
          </p>

          <div className="hero-actions">
            <a href="mailto:rahulbariki24@gmail.com" className="hero-cta-primary">Let's Talk <ArrowUpRight /></a>
            <a href="tel:+916281769623" className="hero-cta-secondary"><Phone size={15} /> +91 62817 69623</a>
          </div>

          <div className="hero-stats">
            <span><strong>8.46</strong><small>B.Tech CGPA</small></span>
            <span><strong>58,055</strong><small>JEE Mains Rank</small></span>
            <span><strong>3+</strong><small>AI Systems</small></span>
            <span><strong>02</strong><small>AI Internships</small></span>
          </div>
        </motion.div>

        {/* Dedicated Portrait Frame Column */}
        <motion.div className="hero-portrait-col" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45, duration: 0.85 }}>
          <div className="portrait-frame">
            <div className="portrait-glow" />
            <div className="portrait-border-ring" />
            <img src="/assets/rahul-profile.png" alt="Rahul Bariki - Gen-AI Engineer & UI/UX Designer" loading="eager" />
          </div>

          <div className="portrait-sub-tags">
            <span>GEN-AI ENGINEER</span>
            <span>UI/UX DESIGNER</span>
            <span>REAL-TIME SOLUTIONS</span>
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
      <div className="section-kicker">Professional Summary / 01</div>
      <motion.p initial={{ opacity: 0.2 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.2 }}>
        Results-driven Software Engineer with expertise in AI engineering, Generative AI, and UI/UX design. Passionate about architecting intelligent AI agents, intuitive user-centric platforms, and developing software solutions to solve real-time problems.
      </motion.p>
      <div className="manifesto-meta">
        <span>📍 Nandyal, Andhra Pradesh, India</span>
        <span>🎓 B.Tech CSE (AI & ML) — 8.46 CGPA</span>
        <span>💼 Target Roles: Generative AI Engineer | AI Engineer | UI/UX Designer</span>
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
          <div className="project-footer-top">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="project-action-buttons">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-project-live" aria-label={`View Live Application for ${project.title}`}>
                <span>Live Project</span> <ExternalLink size={14} />
              </a>
            )}
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-project-github" aria-label={`View ${project.title} Source Code on GitHub`}>
              <Github size={16} />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function Work() {
  return (
    <section className="work section-shell" id="work">
      <div className="section-heading">
        <div><span>Selected systems</span><span>02 / 08</span></div>
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
    <section className="capabilities section-shell" id="skills">
      <div className="section-heading compact">
        <div><span>Technical Skills & Capabilities</span><span>03 / 08</span></div>
        <h2>Engineering stacks &<br /><em>core AI expertise.</em></h2>
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

      {/* Categorized Skill Badges Matrix */}
      <div className="skills-matrix-container">
        <div className="skill-cat-card">
          <div className="skill-cat-header">
            <Terminal size={18} /> <h3>Programming Languages & Core</h3>
          </div>
          <div className="skill-tags">
            {technicalSkills.languages.map((s) => <span key={s} className="skill-tag lang">{s}</span>)}
          </div>
        </div>

        <div className="skill-cat-card">
          <div className="skill-cat-header">
            <BrainCircuit size={18} /> <h3>AI, GenAI & Machine Learning</h3>
          </div>
          <div className="skill-tags">
            {technicalSkills.technologies.map((s) => <span key={s} className="skill-tag tech">{s}</span>)}
          </div>
        </div>

        <div className="skill-cat-card">
          <div className="skill-cat-header">
            <Wrench size={18} /> <h3>Tools & Frameworks</h3>
          </div>
          <div className="skill-tags">
            {technicalSkills.tools.map((s) => <span key={s} className="skill-tag tool">{s}</span>)}
          </div>
        </div>

        <div className="skill-cat-card">
          <div className="skill-cat-header">
            <Sparkles size={18} /> <h3>Soft Skills & Strengths</h3>
          </div>
          <div className="skill-tags">
            {technicalSkills.softSkills.map((s) => <span key={s} className="skill-tag soft">{s}</span>)}
          </div>
        </div>
      </div>

      <div className="ticker" aria-hidden="true">
        <div>PYTHON · GENERATIVE AI · AI AGENTS · MACHINE LEARNING · NATURAL LANGUAGE PROCESSING · FASTAPI · REACT · PROMPT ENGINEERING · </div>
        <div>PYTHON · GENERATIVE AI · AI AGENTS · MACHINE LEARNING · NATURAL LANGUAGE PROCESSING · FASTAPI · REACT · PROMPT ENGINEERING · </div>
      </div>
    </section>
  )
}

function Hackathons({ onSelectImage }) {
  return (
    <section className="hackathons section-shell" id="hackathons">
      <div className="section-heading compact">
        <div><span>Sprints & Competitions</span><span>04 / 08</span></div>
        <h2>Building under<br /><em>pressure & speed.</em></h2>
      </div>
      <div className="hackathon-grid">
        {hackathons.map((item, index) => {
          const mediaCount = getMediaCount(item)
          return (
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

              {/* If hackathon has certificate image or secondary media preview */}
              {item.image && (
                <div className="hack-preview-row">
                  <div
                    className="cert-img-thumb hack-thumb"
                    onClick={() => onSelectImage({
                      title: item.title,
                      img: item.image,
                      imgTitle: item.imageTitle,
                      newsImg: item.newsImage,
                      newsTitle: item.newsTitle,
                      stageImg: item.stageImage,
                      stageTitle: item.stageTitle,
                      secImg: item.secImage,
                      secTitle: item.secTitle
                    })}
                    role="button"
                    tabIndex={0}
                    aria-label={`View credential for ${item.title}`}
                  >
                    <img src={item.image} alt={item.imageTitle || item.title} loading="lazy" />
                    {mediaCount > 1 && (
                      <span className="media-count-badge">
                        <Camera size={11} /> {mediaCount} Media
                      </span>
                    )}
                    <div className="thumb-overlay">
                      <Eye size={16} />
                      <span>View Certificate</span>
                    </div>
                  </div>

                  {item.newsImage && (
                    <div
                      className="cert-img-thumb hack-thumb"
                      onClick={() => onSelectImage({
                        title: item.title,
                        img: item.newsImage,
                        imgTitle: item.newsTitle,
                        newsImg: null,
                        stageImg: item.stageImage,
                        stageTitle: item.stageTitle,
                        secImg: item.secImage,
                        secTitle: item.secTitle
                      })}
                      role="button"
                      tabIndex={0}
                      aria-label={`View press feature for ${item.title}`}
                    >
                      <img src={item.newsImage} alt={item.newsTitle || `${item.title} Press Feature`} loading="lazy" />
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
          )
        })}
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
        <div><span>Verified Credentials & Awards</span><span>05 / 08</span></div>
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
          {filteredCerts.map((cert, index) => {
            const mediaCount = getMediaCount(cert)
            return (
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
                        onClick={() => onSelectImage({
                          title: cert.title,
                          img: cert.image,
                          imgTitle: cert.imageTitle,
                          newsImg: cert.newsImage,
                          newsTitle: cert.newsTitle,
                          stageImg: cert.stageImage,
                          stageTitle: cert.stageTitle,
                          secImg: cert.secImage,
                          secTitle: cert.secTitle
                        })}
                        role="button"
                        tabIndex={0}
                        aria-label={`View certificate image for ${cert.title}`}
                      >
                        <img src={cert.image} alt={cert.imageTitle || `${cert.title} certificate`} loading="lazy" />
                        {mediaCount > 1 && (
                          <span className="media-count-badge">
                            <Camera size={11} /> {mediaCount} Media
                          </span>
                        )}
                        <div className="thumb-overlay">
                          <Eye size={18} />
                          <span>View Certificate</span>
                        </div>
                      </div>

                      {cert.newsImage && (
                        <div
                          className="cert-img-thumb cert-news-thumb"
                          onClick={() => onSelectImage({
                            title: cert.title,
                            img: cert.newsImage,
                            imgTitle: cert.newsTitle,
                            newsImg: null,
                            stageImg: cert.stageImage,
                            stageTitle: cert.stageTitle,
                            secImg: cert.secImage,
                            secTitle: cert.secTitle
                          })}
                          role="button"
                          tabIndex={0}
                          aria-label={`View press coverage for ${cert.title}`}
                        >
                          <img src={cert.newsImage} alt={cert.newsTitle || `${cert.title} press feature`} loading="lazy" />
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
                        onClick={() => onSelectImage({
                          title: cert.title,
                          img: cert.image,
                          imgTitle: cert.imageTitle,
                          newsImg: cert.newsImage,
                          newsTitle: cert.newsTitle,
                          stageImg: cert.stageImage,
                          stageTitle: cert.stageTitle,
                          secImg: cert.secImage,
                          secTitle: cert.secTitle
                        })}
                      >
                        <Eye size={15} /> Certificate ({mediaCount})
                      </button>
                      {cert.newsImage && (
                        <button
                          type="button"
                          className="cert-view-btn cert-news-btn"
                          onClick={() => onSelectImage({
                            title: cert.title,
                            img: cert.newsImage,
                            imgTitle: cert.newsTitle,
                            newsImg: null,
                            stageImg: cert.stageImage,
                            stageTitle: cert.stageTitle,
                            secImg: cert.secImage,
                            secTitle: cert.secTitle
                          })}
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
            )
          })}
        </AnimatePresence>
      </div>
    </section>
  )
}

function Education() {
  return (
    <section className="education section-shell" id="education">
      <div className="section-heading compact">
        <div><span>Academic Foundation</span><span>06 / 08</span></div>
        <h2>Education &<br /><em>academic achievements.</em></h2>
      </div>

      <div className="education-grid">
        {educationList.map((item, index) => (
          <motion.article
            key={item.degree}
            className={`education-card ${item.tone}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12 }}
            data-cursor
          >
            <div className="edu-top">
              <span className="edu-badge"><GraduationCap size={15} /> {item.badge}</span>
              <span className="edu-period"><Calendar size={13} /> {item.period}</span>
            </div>
            <h3>{item.degree}</h3>
            <p className="edu-institution">{item.institution}</p>
            <div className="edu-score-pill">
              <span>{item.scoreLabel}:</span> <strong>{item.scoreValue}</strong>
            </div>
            <p className="edu-details">{item.details}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section className="experience section-shell" id="experience">
      <div className="section-heading compact">
        <div><span>Field Notes & Internships</span><span>07 / 08</span></div>
        <h2>Learning & leading<br /><em>in practice.</em></h2>
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
      <div className="section-kicker">Next Chapter / 08</div>
      <h2>Have an ambitious<br />project? <em>Let's connect.</em></h2>
      <p>I’m looking for ambitious teams, serious AI challenges, and opportunities to engineer intelligent systems that scale.</p>
      
      <div className="contact-actions-row">
        <a className="contact-cta" href="mailto:rahulbariki24@gmail.com">
          <span>Email Me</span><ArrowUpRight />
        </a>
        <a className="contact-cta contact-cta-phone" href="tel:+916281769623">
          <span>Call: +91 62817 69623</span><Phone size={18} />
        </a>
      </div>

      <div className="social-row">
        <a href="mailto:rahulbariki24@gmail.com"><Mail /> rahulbariki24@gmail.com</a>
        <a href="tel:+916281769623"><Phone /> +91 62817 69623</a>
        <a href="https://github.com/rahulbariki" target="_blank" rel="noopener noreferrer"><Github /> GitHub</a>
        <a href="https://www.linkedin.com/in/rahulbariki24" target="_blank" rel="noopener noreferrer"><Linkedin /> LinkedIn</a>
      </div>
      <footer>
        <span>Rahul Bariki © 2026</span>
        <span>Gen-AI Engineer • Nandyal, AP, India</span>
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
        <Education />
        <Experience />
        <Contact />
      </main>

      {/* Global Lightbox Modal for Certificate & Media Images */}
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
                <div>
                  <h3>{selectedImage.title}</h3>
                  {selectedImage.imgTitle && <p className="cert-modal-subtitle">{selectedImage.imgTitle}</p>}
                </div>
                <button type="button" onClick={() => setSelectedImage(null)} className="cert-modal-close" aria-label="Close modal">
                  <X size={20} />
                </button>
              </div>

              <div className="cert-modal-body">
                <img src={selectedImage.img} alt={selectedImage.imgTitle || selectedImage.title} />

                {selectedImage.newsImg && (
                  <div className="cert-modal-news-block">
                    <h4>{selectedImage.newsTitle || 'Press / Media Coverage'}</h4>
                    <img src={selectedImage.newsImg} alt={selectedImage.newsTitle || `${selectedImage.title} Press Feature`} />
                  </div>
                )}

                {selectedImage.stageImg && (
                  <div className="cert-modal-news-block">
                    <h4>{selectedImage.stageTitle || 'On-Stage Presentation / Award Ceremony'}</h4>
                    <img src={selectedImage.stageImg} alt={selectedImage.stageTitle || `${selectedImage.title} Stage Ceremony`} />
                  </div>
                )}

                {selectedImage.secImg && (
                  <div className="cert-modal-news-block">
                    <h4>{selectedImage.secTitle || 'Event Presentation & Demo'}</h4>
                    <img src={selectedImage.secImg} alt={selectedImage.secTitle || `${selectedImage.title} Event Demo`} />
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
