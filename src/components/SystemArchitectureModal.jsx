import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cpu, Database, Activity, Zap, Layers, Server, Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'

const ARCHITECTURES = {
  IntelliAttend: {
    title: 'IntelliAttend — AI Smart Attendance Architecture',
    subtitle: 'Real-time Computer Vision & Anti-Proxy Liveness Verification Pipeline',
    techBadges: ['OpenCV', 'FaceNet', 'Python', 'FastAPI', 'Supabase', 'WebSockets', 'React'],
    metrics: [
      { label: 'Face Match Latency', value: '42ms' },
      { label: 'Liveness Accuracy', value: '99.4%' },
      { label: 'Anti-Proxy Fraud Rate', value: '0%' }
    ],
    nodes: [
      {
        id: 'n1',
        name: 'Video Stream Ingestion',
        role: 'Client Frame Capture',
        tech: 'HTML5 Video API / WebSockets',
        desc: 'Captures 30fps video stream from classroom cameras & converts frames to normalized tensor matrices.',
        icon: Cpu,
        tone: 'cyan'
      },
      {
        id: 'n2',
        name: 'OpenCV & Liveness Engine',
        role: 'Computer Vision',
        tech: 'OpenCV / PyTorch / FaceNet',
        desc: 'Detects facial landmarks, verifies 3D liveness (prevents photo/video spoofing), and extracts 128D embedding vectors.',
        icon: ShieldCheck,
        tone: 'violet'
      },
      {
        id: 'n3',
        name: 'Vector Cosine Matcher',
        role: 'Biometric Search Engine',
        tech: 'FastAPI / NumPy Vectorization',
        desc: 'Performs high-speed cosine similarity search matching face embeddings against enrolled student database vectors.',
        icon: Activity,
        tone: 'lime'
      },
      {
        id: 'n4',
        name: 'Supabase PostgreSQL DB',
        role: 'Database & Cache',
        tech: 'PostgreSQL / Supabase Realtime',
        desc: 'Logs verified attendance timestamps, updates student presence percentages, and triggers instant alerts.',
        icon: Database,
        tone: 'cyan'
      },
      {
        id: 'n5',
        name: 'Faculty & Admin UI',
        role: 'Real-Time Web App',
        tech: 'React.js / Recharts / Tailwind',
        desc: 'Displays live classroom attendance count, fraud alerts, and automated PDF export reports for institutional admins.',
        icon: Server,
        tone: 'violet'
      }
    ]
  },
  BrandNova: {
    title: 'BrandNova — AI Brand Automation Architecture',
    subtitle: 'Multi-Model LLM Prompt Engineering & SVG Generation Pipeline',
    techBadges: ['GPT-4o', 'LangChain', 'Python', 'FastAPI', 'React', 'Vector SVG', 'Supabase'],
    metrics: [
      { label: 'Generation Speed', value: '< 3.2s' },
      { label: 'Asset Types', value: 'SVG / PDF / Copy' },
      { label: 'API Pipeline', value: 'Async Parallel' }
    ],
    nodes: [
      {
        id: 'b1',
        name: 'User Prompt & Niche Input',
        role: 'Client Request',
        tech: 'React State / Form Validation',
        desc: 'Collects startup niche, target audience persona, color preferences, and core brand mission statement.',
        icon: Sparkles,
        tone: 'cyan'
      },
      {
        id: 'b2',
        name: 'LangChain Orchestrator',
        role: 'LLM Pipeline',
        tech: 'LangChain / Python / Asyncio',
        desc: 'Coordinates parallel prompt chains for brand naming, marketing taglines, color psychology palettes, and SVG parameters.',
        icon: Layers,
        tone: 'violet'
      },
      {
        id: 'b3',
        name: 'Vector SVG Generator',
        role: 'Design Engine',
        tech: 'Python SVG Engine / Cairo',
        desc: 'Dynamically constructs clean vector SVG logo graphics based on generated geometrical parameters.',
        icon: Zap,
        tone: 'lime'
      },
      {
        id: 'b4',
        name: 'Supabase CDN Package Exporter',
        role: 'Cloud Delivery',
        tech: 'Supabase Storage / PDFKit',
        desc: 'Bundles logo vector files, brand guidelines PDF, and typography specs into downloadable asset packages.',
        icon: Database,
        tone: 'cyan'
      }
    ]
  },
  CampusPulse: {
    title: 'CampusPulse — Event Intelligence Architecture',
    subtitle: 'Centralized Campus Event Aggregation & QR Verification Platform',
    techBadges: ['React', 'Node.js', 'FastAPI', 'PostgreSQL', 'QR Engine', 'Tailwind'],
    metrics: [
      { label: 'Notice Processing', value: 'Instant' },
      { label: 'QR Scan Speed', value: '< 150ms' },
      { label: 'Ticket Delivery', value: 'Automated' }
    ],
    nodes: [
      {
        id: 'c1',
        name: 'Event Aggregator Engine',
        role: 'Data Ingestion',
        tech: 'Node.js / Express / Parser',
        desc: 'Normalizes incoming campus announcements from department notices into structured event schema objects.',
        icon: Layers,
        tone: 'cyan'
      },
      {
        id: 'c2',
        name: 'PostgreSQL Relational DB',
        role: 'Data Store',
        tech: 'PostgreSQL / Prisma ORM',
        desc: 'Stores event details, department tags, registration limits, and student participation history.',
        icon: Database,
        tone: 'violet'
      },
      {
        id: 'c3',
        name: 'QR Ticket Security Engine',
        role: 'Verification System',
        tech: 'Python / HMAC Signature',
        desc: 'Generates cryptographically signed QR entry passes sent to registered student devices.',
        icon: ShieldCheck,
        tone: 'lime'
      },
      {
        id: 'c4',
        name: 'Student & Faculty Portal',
        role: 'Responsive Web UI',
        tech: 'React / Vite / CSS',
        desc: 'Provides one-click registration, instant digital ticket display, and real-time attendance analytics.',
        icon: Server,
        tone: 'cyan'
      }
    ]
  }
}

export function SystemArchitectureModal({ project, onClose }) {
  const projectName = project?.title || 'IntelliAttend'
  const archKey = Object.keys(ARCHITECTURES).find(k => k.toLowerCase() === projectName.toLowerCase()) || 'IntelliAttend'
  const data = ARCHITECTURES[archKey]
  const [selectedNode, setSelectedNode] = useState(data.nodes[0])

  useEffect(() => {
    setSelectedNode(data.nodes[0])
  }, [archKey])

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

  if (!data) return null

  return (
    <AnimatePresence>
      <motion.div
        className="arch-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="arch-modal-card"
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="arch-modal-header">
            <div>
              <div className="arch-header-kicker">
                <span className="arch-live-pulse" /> SYSTEM ARCHITECTURE EXPLORER
              </div>
              <h2>{data.title}</h2>
              <p className="arch-header-sub">{data.subtitle}</p>
            </div>
            <button type="button" onClick={onClose} className="arch-close-btn" aria-label="Close modal">
              <X size={18} />
            </button>
          </div>

          {/* Metrics & Tech Badges Bar */}
          <div className="arch-meta-bar">
            <div className="arch-metrics-row">
              {data.metrics.map((m) => (
                <div className="arch-metric-card" key={m.label}>
                  <span className="arch-metric-val">{m.value}</span>
                  <span className="arch-metric-lbl">{m.label}</span>
                </div>
              ))}
            </div>
            <div className="arch-tech-badges">
              {data.techBadges.map((b) => (
                <span className="arch-tech-pill" key={b}>{b}</span>
              ))}
            </div>
          </div>

          {/* Main Visualizer Body */}
          <div className="arch-modal-body">
            {/* Left Flow Canvas */}
            <div className="arch-flow-canvas">
              <div className="arch-flow-title">
                <span>SYSTEM DATA PIPELINE FLOW</span>
                <small>(Click any node to inspect details)</small>
              </div>

              <div className="arch-nodes-chain">
                {data.nodes.map((node, idx) => {
                  const Icon = node.icon
                  const isSelected = selectedNode.id === node.id
                  return (
                    <React.Fragment key={node.id}>
                      <motion.div
                        className={`arch-node-card ${node.tone} ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedNode(node)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="node-step-num">0{idx + 1}</div>
                        <div className="node-icon-box">
                          <Icon size={20} />
                        </div>
                        <div className="node-info">
                          <h4>{node.name}</h4>
                          <span className="node-tech-tag">{node.tech}</span>
                        </div>
                        {isSelected && <span className="node-active-indicator" />}
                      </motion.div>

                      {idx < data.nodes.length - 1 && (
                        <div className="arch-connector-line">
                          <div className="flow-arrow-head"><ArrowRight size={14} /></div>
                          <span className="flow-pulse-particle" />
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>

            {/* Right Node Detail Inspector Panel */}
            <div className="arch-inspector-panel">
              {selectedNode && (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="inspector-badge">{selectedNode.role}</div>
                  <h3>{selectedNode.name}</h3>
                  <div className="inspector-tech">
                    <CheckCircle2 size={13} />
                    <span>Implemented with <strong>{selectedNode.tech}</strong></span>
                  </div>

                  <p className="inspector-desc">{selectedNode.desc}</p>

                  <div className="inspector-role-box">
                    <h4>ENGINEERING RESPONSIBILITY</h4>
                    <p>Designed data contracts, component orchestration, error resilience, and high-performance throughput for this pipeline stage.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
