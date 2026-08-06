import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { Activity, ArrowDown, ArrowUpRight, Award, BookOpen, BrainCircuit, Calendar, Camera, CheckCircle, ChevronDown, Clock, Code2, Cpu, ExternalLink, Eye, GitCommit, Github, GraduationCap, HelpCircle, Layers3, Linkedin, Mail, MapPin, Medal, Menu, MessageSquare, Moon, MoveUpRight, Newspaper, Phone, Quote, Sparkles, Sun, Terminal, TrendingUp, Trophy, Wrench, X } from 'lucide-react'
import { AdminDashboardModal, ICON_MAP } from './components/AdminDashboardModal.jsx'

const defaultTimelineEvents = [
  {
    year: '2026 — 2027 (Current)',
    title: 'Co-Building IntelliAttend Startup & GenAI Breakthroughs',
    role: 'AI Software Engineer & Startup Co-Developer',
    detail: 'Co-building IntelliAttend attendance intelligence platform. Won 1st Runner Up in GenAI Forge Hackathon 2026 (NASSCOM/SmartBridge) and 1st Prize in DEFEND-X Prompt Engineering.',
    badge: 'Active Startup ⚡',
    tone: 'lime',
  },
  {
    year: '2025',
    title: 'IEEE Student Branch Secretary & Society Member',
    role: 'Secretary — IEEE Student Branch (IEEE Education Society)',
    detail: 'Appointed Secretary for IEEE Student Branch in IEEE Education Society. IEEE Student Member across IEEE Education Society, IEEE Sensors Council, and IEEE CRFID2025.',
    badge: 'IEEE Secretary 🎓',
    tone: 'cyan',
  },
  {
    year: '2024',
    title: 'AI Virtual Internships & SHOWLINK Stage Demo',
    role: 'Google AI-ML & Zcalar AI Intern',
    detail: 'Completed Google AI-ML and Zcalar AI Virtual Internships. Built SHOWLINK college portal and presented live on auditorium stage at INSW 2K24.',
    badge: 'Stage Demo 🏆',
    tone: 'violet',
  },
  {
    year: '2023',
    title: 'Admitted to B.Tech CSE (AI & ML) @ Santhiram Engg. College',
    role: 'Undergraduate AI & ML Student',
    detail: 'Enrolled in Autonomous B.Tech Artificial Intelligence & Machine Learning program, maintaining a high academic standing of 8.46 CGPA.',
    badge: '8.46 CGPA 🌟',
    tone: 'lime',
  },
  {
    year: '2021 — 2023',
    title: 'Class XII Intermediate MPC & Top 58k JEE Mains Rank',
    role: 'Student @ Narayana Junior College',
    detail: 'Achieved 79% score in MPC curriculum and secured top 58,055 All India Rank in JEE Mains entrance examination.',
    badge: 'JEE 58k Rank 🎯',
    tone: 'cyan',
  },
]

const defaultBlogPosts = [
  {
    title: 'Architecting Zero-Proxy AI Attendance Systems with Facial Verification',
    date: 'Feb 2026',
    readTime: '5 min read',
    snippet: 'How we built IntelliAttend to process real-time attendance tracking with computer vision, instant fraud detection, and automated parent alerts.',
    tags: ['AI Agents', 'Computer Vision', 'FastAPI', 'IntelliAttend'],
    url: 'https://dashboard.intelliattend.app/login',
  },
  {
    title: 'From 0 to Identity: Prompt Engineering Pipelines for Brand Automation',
    date: 'Jan 2026',
    readTime: '4 min read',
    snippet: 'Exploring how BrandNova leverages multi-step LLM chains and vector SVG asset generators to create complete brand identity kits in under 30 seconds.',
    tags: ['Generative AI', 'LLMs', 'Prompt Engineering', 'BrandNova'],
    url: 'https://brandnova-brand-automation.vercel.app/',
  },
  {
    title: 'Building Responsive Glassmorphic Web Portals with React & Framer Motion',
    date: 'Dec 2025',
    readTime: '6 min read',
    snippet: 'A deep dive into crafting hardware-accelerated dark cyber interfaces, fluid typography clamp rules, and 3D card tilt interactions.',
    tags: ['React', 'UI/UX Design', 'CSS3', 'Web Dev'],
    url: 'https://showlink.vercel.app/',
  },
]

const defaultFaqItems = [
  {
    question: 'Are you available for full-time roles, internships, or startup collaborations?',
    answer: 'Yes! As a final-year B.Tech CSE (AI & ML) student graduating in 2027, I am actively seeking full-time AI Engineering roles, Generative AI internships, and ambitious co-building opportunities.',
  },
  {
    question: 'What AI frameworks, models, and tech stacks do you specialize in?',
    answer: 'My primary stack centers on Python, OpenAI / LLM APIs, LangChain, AI Agents, FastAPI, React.js, Tailwind CSS, PostgreSQL, and Supabase. I am experienced in prompt engineering, computer vision pipelines, and building scalable full-stack web applications.',
  },
  {
    question: 'What is IntelliAttend and what is your role in the startup?',
    answer: 'IntelliAttend is an AI-powered smart attendance and real-time analytics platform designed for modern educational institutions. I am a Co-Developer & AI Engineer building the core portal, backend services, and analytics infrastructure.',
  },
  {
    question: 'How can I contact you for a technical interview or project discussion?',
    answer: 'You can reach me directly via email at rahulbariki24@gmail.com or call me at +91 62817 69623. You can also connect with me on LinkedIn at linkedin.com/in/rahulbariki24.',
  },
]

const defaultProjects = [
  {
    number: '01',
    title: 'IntelliAttend',
    kicker: 'AI-Powered Smart Attendance Platform (Startup Project)',
    problem: 'Manual attendance in institutions wastes 45+ minutes daily and suffers from proxy errors.',
    solution: 'Engineered an AI automated smart attendance system with facial recognition, real-time analytics & automated reporting.',
    keyFeatures: [
      'Facial recognition attendance verification engine',
      'Real-time attendance analytics & institutional charts',
      'Automated parent/admin notifications for low attendance',
      'Secure multi-role dashboard for students, faculty & admins'
    ],
    impact: 'Active Startup Portal ⚡',
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
    problem: 'Early-stage founders spend weeks and thousands of dollars generating startup brand assets.',
    solution: 'Architected a Generative AI suite powered by LLM pipelines & prompt engineering to generate complete brand kits instantly.',
    keyFeatures: [
      'Generative AI logo & brand identity engine',
      'LLM prompt engineering for marketing copy & taglines',
      'Automated color palette & typography kit generator',
      'Instant vector SVG & PDF asset export'
    ],
    impact: 'Instant 0 → Identity',
    description: 'Built an AI-powered branding suite that generates logos, brand names, and marketing content, leveraging LLM APIs and generative AI models to automate brand identity creation for startups.',
    result: '0 → identity',
    tags: ['React', 'Python', 'LLMs', 'LangChain', 'FastAPI', 'Vercel', 'Supabase'],
    tone: 'cyan',
    icon: Sparkles,
    image: '/assets/brandnova-logo.png',
    url: 'https://github.com/Rahulbariki/brand-automation',
    liveUrl: 'https://brandnova-brand-automation.vercel.app/',
  },
  {
    number: '03',
    title: 'CampusPulse',
    kicker: 'Smart Campus Event Management',
    problem: 'Fragmented college notices across WhatsApp groups and boards lead to missed event opportunities.',
    solution: 'Built a centralized intelligence portal unifying campus event discovery, instant registration, and automated alerts.',
    keyFeatures: [
      'Centralized event discovery & smart filtering',
      'One-click student event registrations & QR entry tickets',
      'Multi-department announcement aggregation engine',
      'Real-time student participation analytics'
    ],
    impact: 'Unified Campus Intelligence',
    description: 'CampusPulse is a smart campus event management platform designed to solve the problem of students missing important college events due to scattered information across multiple platforms such as WhatsApp groups, notice boards, emails, and social media.',
    result: 'Events → Unified',
    tags: ['React', 'Node.js', 'Express.js', 'Python', 'FastAPI', 'PostgreSQL', 'Tailwind'],
    tone: 'violet',
    icon: Layers3,
    image: '/assets/campuspulse-logo.png',
    url: 'https://github.com/Rahulbariki/campus-achievement-intelligence',
    liveUrl: 'https://srec-community.vercel.app/',
  },
  {
    number: '04',
    title: 'SHOWLINK',
    kicker: 'College Search & Discovery Portal',
    problem: 'Prospective students lack a streamlined portal to compare engineering college metrics and brochures.',
    solution: 'Developed an intuitive college discovery search engine with side-by-side brochure comparison.',
    keyFeatures: [
      'Comprehensive engineering college database search',
      'Side-by-side college metrics & cutoff score comparison',
      'Interactive digital brochure PDF preview engine',
      'Presented live on auditorium stage before 300+ students'
    ],
    impact: 'Presented Live on Stage 🏆',
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

const skillGroups = [
  {
    category: 'AI & ML',
    icon: BrainCircuit,
    skills: ['Python', 'LLMs', 'LangChain', 'OpenAI', 'Prompt Engineering', 'TensorFlow Foundations', 'NLP Systems', 'AI Agents'],
    tone: 'violet',
  },
  {
    category: 'Frontend',
    icon: Layers3,
    skills: ['React', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'JavaScript', 'Figma / UI-UX'],
    tone: 'cyan',
  },
  {
    category: 'Backend',
    icon: Terminal,
    skills: ['FastAPI', 'Node.js', 'Express.js', 'Supabase', 'PostgreSQL', 'REST APIs'],
    tone: 'lime',
  },
  {
    category: 'Cloud & DevOps',
    icon: Cpu,
    skills: ['Azure', 'AWS', 'Docker', 'Vercel', 'Git & GitHub', 'CI/CD Pipelines'],
    tone: 'cyan',
  },
]

const capabilities = [
  { icon: BrainCircuit, title: 'Generative AI Engineering', text: 'Architecting intelligent AI agents, prompt engineering pipelines, LLM workflows, and multi-step generative automation.' },
  { icon: Cpu, title: 'AI Engineering & ML Systems', text: 'Building end-to-end NLP engines, chatbot architectures, machine learning models, and automated intelligence systems.' },
  { icon: Layers3, title: 'UI/UX Design & Frontend', text: 'Designing intuitive, user-centric interfaces, visual design systems, wireframes, and seamless digital user experiences.' },
  { icon: Code2, title: 'Real-Time Problem Solutions', text: 'Architecting software platforms and scalable solutions engineered to solve complex, real-time real-world problems.' },
]

const navItems = [
  { name: 'About Me', href: '#about' },
  { name: 'Featured Projects', href: '#work' },
  { name: 'Tech Stack', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
]

const defaultHackathons = [
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
]

const certCategories = [
  { id: 'all', label: 'All Verified Credentials (13)' },
  { id: 'ieee', label: '🎓 IEEE Certifications (5)' },
  { id: 'course', label: '📜 Course & Virtual Internships (6)' },
  { id: 'participation', label: '💻 Training Programs & Workshops (2)' },
]

const defaultCertifications = [
  // --- IEEE CERTIFICATIONS ---
  {
    category: 'ieee',
    title: 'Certificate of IEEE Volunteering (Secretary)',
    kicker: 'Secretary — IEEE Student Branch in IEEE Education Society',
    issuer: 'IEEE Student Branch & IEEE Education Society',
    date: 'Feb 2025 — Feb 2027',
    certId: 'IEEE Secretary E25',
    skills: ['Secretary — IEEE Student Branch', 'IEEE Education Society', 'Leadership', 'Student Branch'],
    image: '/assets/cert-ieee-volunteering-secretary.png',
    imageTitle: 'Certificate of IEEE Volunteering — Secretary (IEEE Student Branch in IEEE Education Society)',
    credentialUrl: '/assets/cert-ieee-volunteering-secretary.png',
    tone: 'lime',
  },
  {
    category: 'ieee',
    title: '2025 Certificate of IEEE Membership',
    kicker: 'IEEE Student Member — IEEE Education Society, IEEE Sensors Council, IEEE CRFID2025',
    issuer: 'IEEE',
    date: 'Through Dec 2025',
    certId: 'IEEE Global Member',
    skills: ['IEEE Student Member', 'IEEE Education Society', 'IEEE Sensors Council', 'IEEE CRFID2025'],
    image: '/assets/cert-ieee-membership-2025.png',
    imageTitle: '2025 Certificate of IEEE Global Membership & Society Memberships',
    credentialUrl: '/assets/cert-ieee-membership-2025.png',
    tone: 'cyan',
  },
  {
    category: 'ieee',
    title: '2025 Certificate of Membership — IEEE Education Society',
    kicker: 'IEEE Student Member — IEEE Education Society',
    issuer: 'IEEE Education Society',
    date: '2025',
    certId: 'IEEE Education Society',
    skills: ['IEEE Education Society', 'Secretary — IEEE Student Branch', 'Educational Tech', 'Engineering Learning'],
    image: '/assets/cert-ieee-education-society-2025.png',
    imageTitle: '2025 Certificate of Membership — IEEE Education Society',
    credentialUrl: '/assets/cert-ieee-education-society-2025.png',
    tone: 'violet',
  },
  {
    category: 'ieee',
    title: '2025 Certificate of Participation — IEEE Sensors Council',
    kicker: 'IEEE Student Member — IEEE Sensors Council',
    issuer: 'IEEE Sensors Council',
    date: '2025',
    certId: 'IEEE Sensors Council',
    skills: ['IEEE Sensors Council', 'IEEE Student Member', 'Sensor Systems', 'IoT Engineering'],
    image: '/assets/cert-ieee-sensors-council-2025.png',
    imageTitle: '2025 Certificate of Participation — IEEE Sensors Council',
    credentialUrl: '/assets/cert-ieee-sensors-council-2025.png',
    tone: 'cyan',
  },
  {
    category: 'ieee',
    title: '2025 Certificate of Participation — IEEE CRFID',
    kicker: 'IEEE Student Member — IEEE CRFID2025',
    issuer: 'IEEE Council on RFID',
    date: '2025',
    certId: 'IEEE CRFID2025',
    skills: ['IEEE CRFID2025', 'IEEE Student Member', 'RFID Technology', 'Digital-Physical Integration'],
    image: '/assets/cert-ieee-crfid-2025.png',
    imageTitle: '2025 Certificate of Participation — IEEE Council on RFID (CRFID2025)',
    credentialUrl: '/assets/cert-ieee-crfid-2025.png',
    tone: 'violet',
  },

  // --- COURSE CERTIFICATIONS ---
  {
    category: 'course',
    title: 'AWS Academy Graduate - AWS Academy Data Engineering',
    kicker: 'Certificate of Completion (40 Course Hours)',
    issuer: 'AWS Academy & Credly',
    date: 'Dec 15, 2024',
    certId: 'Credly Digital Badge Verified',
    skills: ['AWS Cloud', 'Data Engineering', 'Cloud Analytics', 'ETL Pipelines', 'Big Data'],
    image: '/assets/cert-aws-data-engineering.png',
    imageTitle: 'AWS Academy Certificate of Completion — AWS Academy Data Engineering (40 Hours)',
    credentialUrl: 'https://www.credly.com/go/6PXvNxD6',
    tone: 'cyan',
  },
  {
    category: 'course',
    title: 'Fundamentals of Cybersecurity (EDU-102)',
    kicker: 'Zscaler Training Academy Certification',
    issuer: 'Zscaler Academy',
    date: 'Sep 15, 2024 — Sep 15, 2026',
    certId: 'No: gjnizt232qte',
    skills: ['Cybersecurity', 'Cloud Security', 'Zscaler Training', 'Network Protection'],
    image: '/assets/cert-zscaler-cybersecurity.png',
    imageTitle: 'Zscaler Academy Certificate of Completion — Fundamentals of Cybersecurity (EDU-102)',
    credentialUrl: 'https://verify.skilljar.com/c/gjnizt232qte',
    tone: 'violet',
  },
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
  { period: 'Feb 2025 — Feb 2027', company: 'IEEE Student Branch in IEEE Education Society', role: 'Secretary — IEEE Student Branch', text: 'Secretary — IEEE Student Branch in IEEE Education Society. Active IEEE Student Member across IEEE Education Society, IEEE Sensors Council, and IEEE CRFID2025.' },
  { period: 'Jan 2024 — Mar 2024', company: 'Google AI-ML Virtual Internship', role: 'AI / Machine Learning Virtual Intern', text: 'Completed a virtual internship studying end-to-end machine learning workflows, model development, and practical AI foundations powered by Google & EduSkills.' },
  { period: '2024', company: 'Zcalar AI Virtual Internship', role: 'AI Developer Virtual Intern', text: 'Completed a virtual internship developing intelligent chatbot systems and exploring useful, product-focused NLP experiences.' },
]

const defaultProfileInfo = {
  name: 'Rahul Bariki',
  role: 'Generative AI & AI Automation Developer',
  email: 'rahulbariki24@gmail.com',
  phone: '+91 62817 69623',
  location: 'Nandyal, AP, India',
  profilePhoto: '/assets/rahul-profile.png',
  profilePhotos: ['/assets/rahul-profile.png'],
  resumeUrl: '/assets/Rahul_Bariki_Resume.pdf',
}

/* ─────────────────────────────────────────────
   PORTFOLIO DATA — localStorage + defaults
────────────────────────────────────────────── */
function rehydrateIcons(projects) {
  return projects.map((p) => {
    const iconFn = p.iconKey ? ICON_MAP[p.iconKey] : null
    if (iconFn) return { ...p, icon: iconFn }
    // match by title to restore icon from defaults
    const match = defaultProjects.find((d) => d.title === p.title)
    return match ? { ...p, icon: match.icon } : { ...p, icon: ICON_MAP.Code2 }
  })
}

function migrateAssetUrl(url) {
  if (typeof url !== 'string' || !url.startsWith('/assets/')) return url
  const filename = url.replace('/assets/', '')
  const f = filename.toLowerCase()
  let folder = 'media'
  if (f.startsWith('rahul-profile') || f.startsWith('rahul-hero')) folder = 'profile'
  else if (f.startsWith('cert-') || f.endsWith('.pdf')) folder = 'certificates'
  else if (f.startsWith('news-') || f.startsWith('photo-')) folder = 'hackathons'
  else if (f.includes('-logo') || f.includes('intelliattend') || f.includes('brandnova') || f.includes('campuspulse') || f.includes('showlink')) folder = 'projects'
  
  return `https://pnvpjoekdwiifzsrxkrs.supabase.co/storage/v1/object/public/portfolio-assets/${folder}/${filename}`
}

function migrateDataUrls(obj) {
  if (!obj) return obj
  if (typeof obj === 'string') {
    return migrateAssetUrl(obj)
  }
  if (Array.isArray(obj)) {
    return obj.map(migrateDataUrls)
  }
  // Only recurse into plain JS data objects (never functions, React elements, or components)
  if (typeof obj === 'object' && obj.constructor === Object && !obj.$$typeof) {
    const newObj = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = migrateDataUrls(obj[key])
      }
    }
    return newObj
  }
  return obj
}

function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) ?? fallback
  } catch {
    return fallback
  }
}

function loadPortfolioData() {
  try {
    const projectsRaw = safeLoad('admin-projects', null)
    const loadedProfile = safeLoad('admin-profile', defaultProfileInfo)
    
    if (!loadedProfile.profilePhotos || !Array.isArray(loadedProfile.profilePhotos) || loadedProfile.profilePhotos.length === 0) {
      loadedProfile.profilePhotos = [loadedProfile.profilePhoto || defaultProfileInfo.profilePhoto]
    }

    const rawData = {
      profileInfo: loadedProfile,
      projects: projectsRaw || defaultProjects,
      hackathons: safeLoad('admin-hackathons', defaultHackathons),
      certifications: safeLoad('admin-certifications', defaultCertifications),
      timelineEvents: safeLoad('admin-timeline', defaultTimelineEvents),
      blogPosts: safeLoad('admin-blog', defaultBlogPosts),
      faqItems: safeLoad('admin-faq', defaultFaqItems),
    }

    // 1. Migrate string URLs in raw data BEFORE rehydrating React icon components
    const migrated = migrateDataUrls(rawData)

    // 2. Rehydrate React icon components on projects
    migrated.projects = rehydrateIcons(migrated.projects)

    return migrated
  } catch (err) {
    console.error('[Portfolio Data Load Error]', err)
    return {
      profileInfo: defaultProfileInfo,
      projects: rehydrateIcons(defaultProjects),
      hackathons: defaultHackathons,
      certifications: defaultCertifications,
      timelineEvents: defaultTimelineEvents,
      blogPosts: defaultBlogPosts,
      faqItems: defaultFaqItems,
    }
  }
}

function savePortfolioKey(key, value) {
  const storageKeyMap = {
    profileInfo: 'admin-profile',
    projects: 'admin-projects',
    hackathons: 'admin-hackathons',
    certifications: 'admin-certifications',
    timelineEvents: 'admin-timeline',
    blogPosts: 'admin-blog',
    faqItems: 'admin-faq',
  }
  const storageKey = storageKeyMap[key]
  if (storageKey) {
    try {
      // Strip non-serialisable icon functions before saving
      const toSave = key === 'projects'
        ? value.map((p) => ({ ...p, icon: undefined, iconKey: p.iconKey || (defaultProjects.find((d) => d.title === p.title)?.iconKey) }))
        : value
      localStorage.setItem(storageKey, JSON.stringify(toSave))
    } catch (e) {
      console.warn('[LocalStorage Save Quota Warning]', e)
    }
  }
}

function getMediaCount(item) {
  let count = 0
  if (item.image) count++
  if (item.newsImage) count++
  if (item.stageImage) count++
  if (item.secImage) count++
  return count
}

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
    let lastWidth = 0
    const pointer = { x: -1000, y: -1000 }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize = () => {
      const currentWidth = window.innerWidth
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = currentWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      if (particles.length === 0 || Math.abs(currentWidth - lastWidth) > 30) {
        lastWidth = currentWidth
        particles = Array.from({ length: Math.min(95, Math.max(20, Math.floor(width / 15))) }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          radius: Math.random() * 1.4 + 0.3,
        }))
      }
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

function Cursor({ x, y, disabled }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (disabled) return

    const handlePointerOver = (event) => {
      const target = event.target
      if (target && target.closest && target.closest('a, button, [role="button"]')) {
        if (target.closest('.admin-overlay, .admin-gate-backdrop')) return
        setActive(true)
      }
    }

    const handlePointerOut = (event) => {
      const related = event.relatedTarget
      if (related && related.closest && related.closest('a, button, [role="button"]')) {
        if (related.closest('.admin-overlay, .admin-gate-backdrop')) return
        return
      }
      setActive(false)
    }

    window.addEventListener('pointerover', handlePointerOver)
    window.addEventListener('pointerout', handlePointerOut)
    return () => {
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('pointerout', handlePointerOut)
    }
  }, [disabled])

  if (disabled) return null

  return <motion.div className={`cursor ${active ? 'cursor-active' : ''}`} style={{ x, y }} aria-hidden="true" />
}

function ThemeToggleSwitch({ theme, onToggleTheme, isMenu = false }) {
  return (
    <button
      className={`theme-toggle-switch ${theme} ${isMenu ? 'menu-toggle' : ''}`}
      type="button"
      onClick={onToggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="toggle-track">
        <Moon className="icon-moon" size={12} />
        <Sun className="icon-sun" size={12} />
        <motion.span
          className="toggle-thumb"
          animate={{ x: theme === 'light' ? 22 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {theme === 'dark' ? <Moon size={11} /> : <Sun size={11} />}
        </motion.span>
      </span>
      <span className="toggle-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}

function Navigation({ onOpen, theme, onToggleTheme, onAdminTrigger }) {
  return (
    <motion.header className="nav" initial={{ y: -80 }} animate={{ y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}>
      <a 
        className="monogram" 
        href="#top" 
        aria-label="Rahul Bariki home"
        onDoubleClick={(e) => {
          e.preventDefault()
          onAdminTrigger?.()
        }}
      >
        RB<span>®</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item, index) => (
          <a key={item.name} href={item.href}>
            <span>0{index + 1}</span>{item.name}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <ThemeToggleSwitch theme={theme} onToggleTheme={onToggleTheme} />
        <button className="menu-button" type="button" onClick={onOpen} aria-label="Open menu">
          <Menu size={18} /> Menu
        </button>
      </div>
    </motion.header>
  )
}

function MenuOverlay({ open, onClose, theme, onToggleTheme }) {
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
          <div className="menu-header">
            <ThemeToggleSwitch theme={theme} onToggleTheme={onToggleTheme} isMenu />
            <button type="button" onClick={onClose} className="menu-close" aria-label="Close navigation menu"><X /> Close</button>
          </div>
          <div className="menu-list">
            {navItems.map((item, index) => (
              <motion.a key={item.name} href={item.href} onClick={onClose} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + index * 0.08 }}>
                <span>0{index + 1}</span>{item.name}<ArrowUpRight />
              </motion.a>
            ))}
          </div>
          <p>Available for internships, ambitious ideas, and teams building what comes next.</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const terminalLines = [
  '> initializing GenAI_Agent(role="Engineer")...',
  '> loading LLM pipeline: GPT-4o / Llama-3 / Claude-3.5...',
  '> co-building: IntelliAttend (dashboard.intelliattend.app)...',
  '> status: 8.46 CGPA • 11 Credentials • 4 Live Apps'
]

function HeroTerminal() {
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % terminalLines.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hero-terminal">
      <div className="terminal-bar">
        <div className="terminal-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <span className="terminal-title">rahul_bariki_ai_engine.py</span>
      </div>
      <div className="terminal-body">
        <span className="terminal-prompt">$</span>
        <motion.span
          key={lineIndex}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="terminal-text"
        >
          {terminalLines[lineIndex]}
        </motion.span>
        <span className="cursor-blink">|</span>
      </div>
    </div>
  )
}

function Hero({ onOpenResume, profileInfo }) {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 40])
  const opacity = useTransform(scrollYProgress, [0, 0.16], [1, 0])
  const info = profileInfo || defaultProfileInfo

  return (
    <section className="hero" id="top">
      {/* Decorative gradient elements */}
      <div className="hero-gradient-orb hero-orb-1" />
      <div className="hero-gradient-orb hero-orb-2" />
      <div className="hero-gradient-orb hero-orb-3" />

      {/* Top status bar */}
      <motion.div className="hero-topbar" style={{ opacity }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="eyebrow">
          <span className="signal" /> GENERATIVE AI & AI AUTOMATION DEVELOPER · AI ENGINEER · UI/UX SPECIALIST
        </div>
        <div className="hero-topbar-right">
          <span className="hero-startup-pill">⚡ Co-Builder @ IntelliAttend Startup</span>
          <span className="hero-location"><MapPin size={13} /> Nandyal, AP, India</span>
        </div>
      </motion.div>

      {/* Main Grid: Name & Text on Left, Portrait Frame on Right */}
      <div className="hero-main-grid">
        <motion.div className="hero-text-col" style={{ y, opacity }}>
          <h1 aria-label="Rahul Bariki">
            <span className="hero-line"><motion.span initial={{ y: '120%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>Rahul</motion.span></span>
            <span className="hero-line hero-line-last"><motion.span initial={{ y: '120%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}>Bariki</motion.span></span>
          </h1>

          {/* User Requested Memorable Headline */}
          <h2 className="hero-tagline">
            Building AI Products that Solve Real Problems.
          </h2>

          {/* User Requested Subtext / Bio */}
          <p className="hero-desc">
            Final-year AI & ML student specializing in AI Agents, Automation, and Full-Stack Development.
          </p>

          {/* Interactive AI Agent Live Terminal Widget */}
          <HeroTerminal />

          {/* User Requested Action Buttons */}
          <div className="hero-actions">
            <a href="#work" className="hero-cta-primary">
              View Projects <ArrowUpRight />
            </a>
            <button
              type="button"
              className="hero-cta-secondary hero-cta-view"
              onClick={onOpenResume}
              aria-label="View Interactive Resume of Rahul Bariki"
            >
              <Eye size={15} /> View Resume
            </button>
            <a 
              href={info.resumeUrl} 
              className="hero-cta-secondary"
              aria-label="Download Resume of Rahul Bariki"
              download="Rahul_Bariki_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowDown size={15} /> Download PDF
            </a>
            <a href="#contact" className="hero-cta-secondary hero-cta-outline">
              <Mail size={15} /> Contact Me
            </a>
          </div>

          <div className="hero-stats">
            <span><strong>8.46</strong><small>B.Tech CGPA</small></span>
            <span><strong>58,055</strong><small>JEE Mains Rank</small></span>
            <span><strong>4+</strong><small>Live Apps</small></span>
            <span><strong>02</strong><small>AI Internships</small></span>
          </div>
        </motion.div>

        {/* Dedicated Portrait Frame Column with Cyber Orbit Rings */}
        <motion.div className="hero-portrait-col" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45, duration: 0.85 }}>
          <div className="portrait-frame">
            <div className="portrait-glow" />
            <div className="orbit-ring"><span className="orbit-dot" /></div>
            <div className="orbit-ring orbit-ring-outer"><span className="orbit-dot" /></div>
            <div className="portrait-border-ring" />
            <img 
              src={info.profilePhoto} 
              alt="Rahul Bariki - Gen-AI Engineer & UI/UX Designer" 
              loading="eager" 
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'https://pnvpjoekdwiifzsrxkrs.supabase.co/storage/v1/object/public/portfolio-assets/profile/rahul-profile.png'
              }}
            />
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
      <div className="section-kicker">Professional Summary / 01 / 07</div>
      <motion.p initial={{ opacity: 0.2 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.2 }}>
        Results-driven Software Engineer with expertise in AI engineering, Generative AI, and UI/UX design. Passionate about architecting intelligent AI agents, intuitive user-centric platforms, and developing software solutions to solve real-time problems.
      </motion.p>
      <div className="manifesto-meta">
        <span>📍 Nandyal, Andhra Pradesh, India</span>
        <span>🎓 B.Tech CSE (AI & ML) — 8.46 CGPA</span>
        <span>💼 Target Roles: Generative AI & AI Automation Developer | AI Engineer | UI/UX Specialist</span>
      </div>
    </section>
  )
}

function ProjectCard({ project, onSelectImage }) {
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
        {project.image ? (
          <img src={project.image} alt={project.title} className="project-hero-img" loading="lazy" />
        ) : (
          <Icon className="visual-icon" />
        )}
        <span>{project.result}</span>
      </div>
      <div className="project-copy">
        <p className="project-kicker">{project.kicker}</p>
        <h3>{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        {/* Strong Case Study Breakdown */}
        {project.problem && (
          <div className="project-case-study">
            <div className="cs-item cs-problem">
              <strong>The Problem:</strong> <span>{project.problem}</span>
            </div>
            <div className="cs-item cs-solution">
              <strong>AI Solution:</strong> <span>{project.solution}</span>
            </div>
          </div>
        )}

        {/* Key Features List */}
        {project.keyFeatures && (
          <div className="project-key-features">
            <strong>Key Features:</strong>
            <ul>
              {project.keyFeatures.map((feat) => (
                <li key={feat}>✓ {feat}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="project-footer">
          <div className="project-footer-top">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="project-action-buttons">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-project-live" aria-label={`View Live Demo for ${project.title}`}>
                <span>Live Demo</span> <ExternalLink size={14} />
              </a>
            )}
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-project-github" aria-label={`View ${project.title} Source Code on GitHub`}>
              <span>GitHub</span> <Github size={14} />
            </a>
            {project.image && (
              <button
                type="button"
                className="btn-project-case"
                onClick={() => onSelectImage({
                  title: project.title,
                  img: project.image,
                  imgTitle: `${project.title} Case Study & Architecture`,
                  stageImg: project.stageImage,
                  stageTitle: project.stageTitle
                })}
              >
                <span>Case Study</span> <Eye size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}



function Achievements({ onSelectImage, portfolioData }) {
  const [activeTab, setActiveTab] = useState('hackathons')

  const tabs = [
    { id: 'hackathons', label: '🏆 Hackathons & Competitions (5)' },
    { id: 'certs', label: '📜 Verified Certifications (11)' },
    { id: 'leadership', label: '🎓 Leadership & Impact (2)' },
  ]

  const hackathons = portfolioData?.hackathons ?? defaultHackathons
  const certifications = portfolioData?.certifications ?? defaultCertifications

  const [certFilter, setCertFilter] = useState('all')
  const filteredCerts = certFilter === 'all'
    ? certifications
    : certifications.filter((item) => item.category === certFilter)

  return (
    <section className="achievements section-shell" id="achievements">
      <div className="section-heading compact">
        <div><span>Recognitions & Impact</span><span>05 / 07</span></div>
        <h2>Hackathons, certifications<br /><em>& leadership impact.</em></h2>
      </div>

      {/* Primary Sub-Section Tabs: Hackathons | Certifications | Leadership */}
      <div className="cert-filter-tabs">
        {tabs.map((tab) => (
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

      {/* Sub-Section 1: Hackathons & Competitions */}
      {activeTab === 'hackathons' && (
        <div className="hackathon-grid">
          {hackathons.map((item, index) => {
            const mediaCount = getMediaCount(item)
            return (
              <motion.article
                key={item.title}
                className={`hackathon-card ${item.tone}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onSelectImage({
                            title: item.title,
                            img: item.image,
                            imgTitle: item.imageTitle,
                            newsImg: item.newsImage,
                            newsTitle: item.newsTitle,
                            stageImg: item.stageImage,
                            stageTitle: item.stageTitle,
                            secImg: item.secImage,
                            secTitle: item.secTitle
                          })
                        }
                      }}
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onSelectImage({
                              title: item.title,
                              img: item.newsImage,
                              imgTitle: item.newsTitle,
                              newsImg: null,
                              stageImg: item.stageImage,
                              stageTitle: item.stageTitle,
                              secImg: item.secImage,
                              secTitle: item.secTitle
                            })
                          }
                        }}
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
      )}

      {/* Sub-Section 2: Verified Certifications */}
      {activeTab === 'certs' && (
        <>
          <div className="cert-filter-tabs" style={{ borderBottom: 'none', marginBottom: '20px' }}>
            {certCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cert-tab-btn ${certFilter === cat.id ? 'active' : ''}`}
                onClick={() => setCertFilter(cat.id)}
                style={{ padding: '8px 16px', fontSize: '10px' }}
              >
                {cat.label}
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
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                onSelectImage({
                                  title: cert.title,
                                  img: cert.image,
                                  imgTitle: cert.imageTitle,
                                  newsImg: cert.newsImage,
                                  newsTitle: cert.newsTitle,
                                  stageImg: cert.stageImage,
                                  stageTitle: cert.stageTitle,
                                  secImg: cert.secImage,
                                  secTitle: cert.secTitle
                                })
                              }
                            }}
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
                        </div>
                      )}

                      <div className="cert-skills">
                        {cert.skills.map((s) => <span key={s}>{s}</span>)}
                      </div>
                    </div>

                    <div className="cert-card-footer">
                      {cert.image ? (
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
        </>
      )}

      {/* Sub-Section 3: Leadership & Impact */}
      {activeTab === 'leadership' && (
        <div className="education-grid">
          <motion.article className="education-card lime" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="edu-top">
              <span className="edu-badge"><Award size={15} /> IEEE Secretary (E25)</span>
              <span className="edu-period"><Calendar size={13} /> Feb 2025 — Feb 2027</span>
            </div>
            <h3>Secretary — IEEE Student Branch</h3>
            <p className="edu-institution">Santhiram Engineering College (Autonomous)</p>
            <p className="edu-details" style={{ marginTop: '12px' }}>
              Serving as Student Branch Secretary, leading technical event planning, IEEE student member coordination, student workshops, and chapter administration.
            </p>
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="cert-view-btn"
                onClick={() => onSelectImage({
                  title: 'Certificate of IEEE Volunteering (Secretary)',
                  img: migrateAssetUrl('/assets/cert-ieee-volunteering-secretary.png'),
                  imgTitle: 'Certificate of IEEE Volunteering — Secretary (Santhiram Engg. College)',
                })}
              >
                <Eye size={15} /> View Appointment Certificate
              </button>
            </div>
          </motion.article>

          <motion.article className="education-card violet" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="edu-top">
              <span className="edu-badge"><Sparkles size={15} /> Presenter & Host</span>
              <span className="edu-period"><Calendar size={13} /> 2024 — Present</span>
            </div>
            <h3>Technical Workshop Presenter</h3>
            <p className="edu-institution">Dept of CSE (AI & ML) / SEC</p>
            <p className="edu-details" style={{ marginTop: '12px' }}>
              Organized and presented technical project showcases (such as SHOWLINK & Challenge AI live assistant) before faculty panel and 300+ engineering students in the main auditorium.
            </p>
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="cert-view-btn"
                onClick={() => onSelectImage({
                  title: 'Auditorium Presentation of SHOWLINK Project',
                  img: migrateAssetUrl('/assets/photo-showlink-presentation-1.jpg'),
                  imgTitle: 'Live Auditorium Stage Presentation of SHOWLINK Web Portal',
                })}
              >
                <Eye size={15} /> View Auditorium Photos
              </button>
            </div>
          </motion.article>
        </div>
      )}
    </section>
  )
}

function Education() {
  return (
    <section className="education section-shell" id="education">
      <div className="section-heading compact">
        <div><span>Academic Foundation</span><span>06 / 07</span></div>
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

function CurrentlyBuildingBanner() {
  return (
    <div className="currently-building-banner">
      <div className="cb-inner">
        <span className="cb-pulse" />
        <span className="cb-label">CURRENTLY BUILDING:</span>
        <span className="cb-text">IntelliAttend v2.0 & Multi-Modal AI Agent Workflows</span>
        <a href="https://dashboard.intelliattend.app/login" target="_blank" rel="noopener noreferrer" className="cb-link">
          Live Portal <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}

function FeaturedSpotlightHero({ onSelectImage }) {
  return (
    <motion.div 
      className="featured-spotlight-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="spotlight-badge">
        <Sparkles size={14} /> <span>FEATURED STARTUP SPOTLIGHT PROJECT</span>
      </div>
      <div className="spotlight-grid">
        <div className="spotlight-left">
          <h2>IntelliAttend</h2>
          <p className="spotlight-subtitle">AI-Powered Smart Attendance & Institutional Analytics Platform</p>
          <p className="spotlight-desc">
            Co-engineering an enterprise-grade automated attendance management engine leveraging Computer Vision facial recognition, real-time analytics dashboards, and automated fraud-prevention systems for academic institutions.
          </p>
          <div className="spotlight-metrics">
            <div><strong>45+ Mins</strong><small>Daily Time Saved</small></div>
            <div><strong>99.4%</strong><small>Verification Accuracy</small></div>
            <div><strong>Active ⚡</strong><small>Startup Status</small></div>
          </div>
          <div className="spotlight-actions">
            <a href="https://dashboard.intelliattend.app/login" target="_blank" rel="noopener noreferrer" className="btn-spotlight-live">
              <span>Launch Live Startup Portal</span> <ExternalLink size={15} />
            </a>
            <button 
              type="button"
              className="btn-spotlight-case"
              onClick={() => onSelectImage({
                title: 'IntelliAttend Startup Architecture',
                img: migrateAssetUrl('/assets/intelliattend-logo.png'),
                imgTitle: 'IntelliAttend AI Attendance Platform — Enterprise System Architecture'
              })}
            >
              <span>Explore Architecture</span> <Eye size={15} />
            </button>
          </div>
        </div>
        <div className="spotlight-right">
          <div className="spotlight-img-frame">
            <img src={migrateAssetUrl('/assets/intelliattend-logo.png')} alt="IntelliAttend Startup Logo & AI Dashboard" />
            <span className="spotlight-live-pill">LIVE ON PROD 🟢</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


function GitHubActivityWidget() {
  return (
    <motion.div 
      className="github-activity-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="gh-header">
        <div className="gh-title">
          <Github size={20} /> <h3>GitHub Contribution & Open Source Activity</h3>
        </div>
        <a href="https://github.com/rahulbariki" target="_blank" rel="noopener noreferrer" className="gh-profile-btn">
          <span>@rahulbariki</span> <ExternalLink size={13} />
        </a>
      </div>
      <p className="gh-desc">Active commit activity across Generative AI repositories, AI Agent tools, full-stack React applications, and FastAPI backends.</p>
      <div className="gh-stats-row">
        <div className="gh-stat">
          <GitCommit size={16} />
          <strong>150+</strong>
          <span>Commits Built</span>
        </div>
        <div className="gh-stat">
          <Code2 size={16} />
          <strong>Python / JS</strong>
          <span>Primary Stack</span>
        </div>
        <div className="gh-stat">
          <TrendingUp size={16} />
          <strong>4 Live</strong>
          <span>Deploys on Vercel</span>
        </div>
      </div>
    </motion.div>
  )
}

function InteractiveTimeline({ timelineEvents: events }) {
  const items = events ?? defaultTimelineEvents
  return (
    <div className="interactive-timeline-container">
      <div className="timeline-header">
        <Clock size={18} /> <h3>Career Journey & Strategic Milestones</h3>
      </div>
      <div className="timeline-track">
        {items.map((event, index) => (
          <motion.div 
            key={event.title}
            className={`timeline-step ${event.tone}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="timeline-node" />
            <div className="timeline-card">
              <div className="timeline-top">
                <span className="timeline-year"><Calendar size={12} /> {event.year}</span>
                <span className="timeline-badge">{event.badge}</span>
              </div>
              <h4>{event.title}</h4>
              <p className="timeline-role">{event.role}</p>
              <p className="timeline-detail">{event.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}


function TechnicalBlog({ blogPosts: posts }) {
  const items = posts ?? defaultBlogPosts
  return (
    <section className="blog-section section-shell" id="blog">
      <div className="section-heading compact">
        <div><span>Technical Insights & Engineering Notes</span><span>Engineering Notes & Insights</span></div>
        <h2>Writing on AI agents,<br /><em>prompting & full-stack systems.</em></h2>
      </div>
      <div className="blog-grid">
        {items.map((post, index) => (
          <motion.article 
            key={post.title}
            className="blog-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="blog-meta">
              <span><Calendar size={12} /> {post.date}</span>
              <span><Clock size={12} /> {post.readTime}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.snippet}</p>
            <div className="blog-tags">
              {(post.tags || []).map((t) => <span key={t}>{t}</span>)}
            </div>
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="blog-read-link">
              <span>Read Insight</span> <ArrowUpRight size={14} />
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function FAQAccordion({ faqItems: items }) {
  const faq = items ?? defaultFaqItems
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="faq-section section-shell" id="faq">
      <div className="section-heading compact">
        <div><span>Recruiter & Client FAQ</span><span>Frequently Asked Questions</span></div>
        <h2>Frequently asked<br /><em>questions.</em></h2>
      </div>
      <div className="faq-list">
        {faq.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button 
                type="button" 
                className="faq-question-btn"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <ChevronDown className={`faq-icon ${isOpen ? 'rotated' : ''}`} size={18} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Contact({ onOpenResume, profileInfo }) {
  const info = profileInfo || defaultProfileInfo
  return (
    <section className="contact section-shell" id="contact">
      <div className="contact-glow" />
      <div className="section-heading compact">
        <div><span>Get In Touch</span><span>07 / 07</span></div>
        <h2>Let's build<br /><em>something great.</em></h2>
      </div>

      <div className="contact-actions-row">
        <a href="mailto:rahulbariki24@gmail.com" className="contact-cta">
          <span>rahulbariki24@gmail.com</span> <Mail size={20} />
        </a>
        <a href="tel:+916281769623" className="contact-cta contact-cta-phone">
          <span>+91 62817 69623</span> <Phone size={20} />
        </a>
        <button type="button" className="contact-cta contact-cta-resume" onClick={onOpenResume}>
          <span>View Resume</span> <Eye size={20} />
        </button>
      </div>

      <div className="social-row">
        <a href="https://github.com/rahulbariki" target="_blank" rel="noopener noreferrer">
          <Github size={14} /> GitHub
        </a>
        <a href="https://linkedin.com/in/rahulbariki24" target="_blank" rel="noopener noreferrer">
          <Linkedin size={14} /> LinkedIn
        </a>
        <a href="mailto:rahulbariki24@gmail.com">
          <Mail size={14} /> Email
        </a>
        <a href={info.resumeUrl} download="Rahul_Bariki_Resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Download Resume of Rahul Bariki">
          <ArrowDown size={14} /> Download PDF
        </a>
      </div>

      <footer>
        <span>© {new Date().getFullYear()} Rahul Bariki</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  )
}

function ResumeModal({ open, onClose, profileInfo }) {
  const info = profileInfo || defaultProfileInfo

  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose() }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        className="resume-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="resume-modal-card"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="resume-modal-header">
            <div className="resume-header-title">
              <span className="dot-purple" />
              <h3>Rahul Bariki's Resume</h3>
            </div>
            <div className="resume-header-actions">
              <a
                href={info.resumeUrl}
                download="Rahul_Bariki_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-resume-download"
              >
                Download PDF <ArrowDown size={14} />
              </a>
              <button type="button" onClick={onClose} className="btn-resume-close" aria-label="Close preview">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="resume-modal-body">
            {/* Left Sidebar */}
            <div className="resume-sidebar">
              <div className="resume-profile-block">
                <h2>Rahul Bariki</h2>
                <p className="resume-subtitle">Generative AI & AI Automation Developer</p>
                <div className="resume-contact-list">
                  <div><Mail size={13} /> <span>rahulbariki24@gmail.com</span></div>
                  <div><Phone size={13} /> <span>+91 62817 69623</span></div>
                  <div><MapPin size={13} /> <span>Nandyal, AP, India</span></div>
                  <div><Linkedin size={13} /> <span>linkedin.com/in/rahulbariki24</span></div>
                  <div><Github size={13} /> <span>github.com/rahulbariki</span></div>
                </div>
              </div>

              <div className="resume-section-block">
                <h4>SKILLS</h4>
                <div className="resume-skills-pills">
                  <span>Python</span>
                  <span>Generative AI</span>
                  <span>AI Agents</span>
                  <span>Prompt Eng.</span>
                  <span>FastAPI</span>
                  <span>React.js</span>
                  <span>LLMs</span>
                  <span>LangChain</span>
                  <span>Node.js</span>
                  <span>PostgreSQL</span>
                  <span>Supabase</span>
                  <span>Docker</span>
                  <span>AWS</span>
                  <span>Azure</span>
                </div>
              </div>

              <div className="resume-section-block">
                <h4>CERTIFICATIONS</h4>
                <ul className="resume-cert-list">
                  <li>AWS Academy Data Engineering</li>
                  <li>Zscaler Cybersecurity Fundamentals</li>
                  <li>IEEE Student Branch Secretary</li>
                  <li>Google AI-ML Virtual Internship</li>
                </ul>
              </div>
            </div>

            {/* Right Content */}
            <div className="resume-content-main">
              <div className="resume-content-section">
                <h3>Projects</h3>
                <div className="resume-card-grid">
                  <div className="resume-item-card">
                    <div className="resume-card-top">
                      <h4>IntelliAttend</h4>
                      <span className="year-badge">2026</span>
                    </div>
                    <p className="resume-kicker">AI-POWERED SMART ATTENDANCE PLATFORM (STARTUP)</p>
                    <p className="resume-desc">
                      Co-engineering an enterprise-grade automated attendance management engine leveraging Computer Vision facial recognition, real-time analytics dashboards, and fraud-prevention systems.
                    </p>
                  </div>

                  <div className="resume-item-card">
                    <div className="resume-card-top">
                      <h4>BrandNova</h4>
                      <span className="year-badge">2026</span>
                    </div>
                    <p className="resume-kicker">AI BRAND AUTOMATION PLATFORM</p>
                    <p className="resume-desc">
                      Architected a Generative AI suite powered by LLM prompt engineering pipelines and vector SVG asset generators to automate complete brand identity creation for startups.
                    </p>
                  </div>

                  <div className="resume-item-card">
                    <div className="resume-card-top">
                      <h4>CampusPulse</h4>
                      <span className="year-badge">2025</span>
                    </div>
                    <p className="resume-kicker">SMART CAMPUS EVENT MANAGEMENT</p>
                    <p className="resume-desc">
                      Built a centralized campus intelligence portal unifying multi-department event discovery, one-click student registrations, QR tickets, and real-time participation analytics.
                    </p>
                  </div>

                  <div className="resume-item-card">
                    <div className="resume-card-top">
                      <h4>SHOWLINK</h4>
                      <span className="year-badge">2024</span>
                    </div>
                    <p className="resume-kicker">COLLEGE SEARCH & DISCOVERY PORTAL</p>
                    <p className="resume-desc">
                      Developed a college brochure discovery search engine with side-by-side metrics comparison. Presented live on auditorium stage before 300+ students.
                    </p>
                  </div>
                </div>
              </div>

              <div className="resume-content-section">
                <h3>Education</h3>
                <div className="resume-card-grid">
                  <div className="resume-item-card">
                    <div className="resume-card-top">
                      <h4>Santhiram Engineering College, Nandyal</h4>
                      <span className="year-badge">2023 - 2027</span>
                    </div>
                    <p className="resume-kicker">B.TECH. IN CSE - ARTIFICIAL INTELLIGENCE & MACHINE LEARNING (8.46 CGPA)</p>
                  </div>

                  <div className="resume-item-card">
                    <div className="resume-card-top">
                      <h4>Narayana Junior College, Nandyal</h4>
                      <span className="year-badge">2021 - 2023</span>
                    </div>
                    <p className="resume-kicker">INTERMEDIATE MPC (79% SCORE | JEE MAINS RANK: 58055)</p>
                  </div>
                </div>
              </div>

              <div className="resume-content-section">
                <h3>Achievements & Competitions</h3>
                <div className="resume-card-grid">
                  <div className="resume-item-card">
                    <div className="resume-card-top">
                      <h4>GenAI Forge Hackathon (NASSCOM / SmartBridge)</h4>
                      <span className="year-badge">2026</span>
                    </div>
                    <p className="resume-kicker">1ST RUNNER UP WINNER 🏆</p>
                  </div>

                  <div className="resume-item-card">
                    <div className="resume-card-top">
                      <h4>DEFEND-X National Technical Symposium</h4>
                      <span className="year-badge">2026</span>
                    </div>
                    <p className="resume-kicker">2ND PRIZE WINNER — PROMPT ENGINEERING 🥈</p>
                  </div>

                  <div className="resume-item-card">
                    <div className="resume-card-top">
                      <h4>14th National Technical Symposium (EMINENCE-SIGMA)</h4>
                      <span className="year-badge">2025</span>
                    </div>
                    <p className="resume-kicker">3RD PRIZE WINNER — CHALLENGE AI 🥉</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [portfolioData, setPortfolioData] = useState(loadPortfolioData)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rahul-portfolio-theme')
      if (saved === 'light' || saved === 'dark') return saved
    }
    return 'dark'
  })
  const { scrollYProgress } = useScroll()
  const { springX, springY } = usePointer()

  // Ctrl+Shift+A opens admin dashboard
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setAdminOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Manage body class when admin modal is open to restore native cursors & hide custom cursor
  useEffect(() => {
    if (adminOpen) {
      document.body.classList.add('admin-open')
    } else {
      document.body.classList.remove('admin-open')
    }
    return () => {
      document.body.classList.remove('admin-open')
    }
  }, [adminOpen])

  const handleAdminUpdate = (key, value) => {
    setPortfolioData((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'projects') {
        next.projects = rehydrateIcons(value)
      }
      savePortfolioKey(key, value)
      return next
    })
  }

  const handleFactoryReset = () => {
    ;['admin-profile','admin-projects','admin-hackathons','admin-certifications','admin-timeline','admin-blog','admin-faq'].forEach((k) => localStorage.removeItem(k))
    setPortfolioData(loadPortfolioData())
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('rahul-portfolio-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden'
  }, [loaded])

  useEffect(() => {
    if (!selectedImage) return undefined
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

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
      <Cursor x={springX} y={springY} disabled={adminOpen} />
      <Navigation onOpen={() => setMenuOpen(true)} theme={theme} onToggleTheme={toggleTheme} onAdminTrigger={() => setAdminOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <CurrentlyBuildingBanner />
        <Hero onOpenResume={() => setResumeOpen(true)} profileInfo={portfolioData.profileInfo} />
        <Manifesto />
        <section className="work section-shell" id="work">
          <div className="section-heading">
            <div><span>Selected systems</span><span>02 / 07</span></div>
            <h2>Work that moves<br /><em>ideas forward.</em></h2>
          </div>
          <FeaturedSpotlightHero onSelectImage={setSelectedImage} />
          <div className="project-grid">
            {portfolioData.projects.map((project) => (
              <ProjectCard project={project} onSelectImage={setSelectedImage} key={project.title} />
            ))}
          </div>
        </section>
        <section className="capabilities section-shell" id="skills">
          <div className="section-heading compact">
            <div><span>Technical Skills & Capabilities</span><span>03 / 07</span></div>
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
            {skillGroups.map((group) => {
              const Icon = group.icon
              return (
                <div className={`skill-cat-card ${group.tone}`} key={group.category}>
                  <div className="skill-cat-header">
                    <Icon size={20} /> <h3>{group.category}</h3>
                  </div>
                  <div className="skill-tags">
                    {group.skills.map((s) => (
                      <span key={s} className="skill-tag tech">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <GitHubActivityWidget />

          <div className="ticker" aria-hidden="true">
            <div>PYTHON · GENERATIVE AI · AI AGENTS · MACHINE LEARNING · NATURAL LANGUAGE PROCESSING · FASTAPI · REACT · PROMPT ENGINEERING · </div>
            <div>PYTHON · GENERATIVE AI · AI AGENTS · MACHINE LEARNING · NATURAL LANGUAGE PROCESSING · FASTAPI · REACT · PROMPT ENGINEERING · </div>
          </div>
        </section>
        <section className="experience section-shell" id="experience">
          <div className="section-heading compact">
            <div><span>Field Notes & Internships</span><span>04 / 07</span></div>
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
          <InteractiveTimeline timelineEvents={portfolioData.timelineEvents} />
        </section>
        <Achievements onSelectImage={setSelectedImage} portfolioData={portfolioData} />
        <Education />
        <TechnicalBlog blogPosts={portfolioData.blogPosts} />
        <FAQAccordion faqItems={portfolioData.faqItems} />
        <Contact onOpenResume={() => setResumeOpen(true)} profileInfo={portfolioData.profileInfo} />
      </main>

      {/* Interactive Resume Modal */}
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} profileInfo={portfolioData.profileInfo} />

      {/* Admin Dashboard */}
      <AnimatePresence>
        {adminOpen && (
          <AdminDashboardModal
            onClose={() => setAdminOpen(false)}
            portfolioData={portfolioData}
            onUpdate={handleAdminUpdate}
            onFactoryReset={handleFactoryReset}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
      </AnimatePresence>

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
