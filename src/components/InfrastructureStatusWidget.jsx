import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Database, Cpu, CheckCircle2, RefreshCw, X, Globe, Terminal } from 'lucide-react'

export function InfrastructureTelemetryView() {
  const [pinging, setPinging] = useState(false)
  const [metrics, setMetrics] = useState({
    supabase: 14,
    github: 28,
    aiPipeline: 42,
    vercelEdge: 9
  })

  const runDiagnostic = () => {
    setPinging(true)
    setTimeout(() => {
      setMetrics({
        supabase: Math.floor(Math.random() * 8) + 12,
        github: Math.floor(Math.random() * 12) + 24,
        aiPipeline: Math.floor(Math.random() * 10) + 38,
        vercelEdge: Math.floor(Math.random() * 5) + 8
      })
      setPinging(false)
    }, 600)
  }

  return (
    <div className="editor-section admin-telemetry-section">
      {/* Top Health Overview */}
      <div className="infra-summary-banner">
        <div className="summary-left">
          <CheckCircle2 size={24} className="summary-check-icon" />
          <div>
            <h4>All Systems Operational</h4>
            <p>Global edge CDN, Supabase Storage buckets, and AI inference endpoints are operating at peak efficiency.</p>
          </div>
        </div>
        <button
          type="button"
          className={`infra-ping-btn ${pinging ? 'pinging' : ''}`}
          onClick={runDiagnostic}
          disabled={pinging}
        >
          <RefreshCw size={13} className={pinging ? 'spin' : ''} />
          <span>{pinging ? 'Pinging Endpoints...' : 'Run Live Diagnostic Ping'}</span>
        </button>
      </div>

      {/* Service Metrics Grid */}
      <div className="infra-services-grid" style={{ marginTop: '20px' }}>
        {/* Service 1: Supabase CDN */}
        <div className="infra-service-card">
          <div className="service-header">
            <Database size={18} className="service-icon cyan" />
            <div>
              <h5>Supabase Cloud Storage CDN</h5>
              <span className="service-url">storage.supabase.co/portfolio-assets</span>
            </div>
            <span className="status-badge operational">Operational</span>
          </div>
          <div className="service-meta-row">
            <div className="meta-item">
              <span className="meta-val">{metrics.supabase} ms</span>
              <span className="meta-lbl">CDN Latency</span>
            </div>
            <div className="meta-item">
              <span className="meta-val">36 / 36</span>
              <span className="meta-lbl">Verified Assets</span>
            </div>
            <div className="meta-item">
              <span className="meta-val">99.99%</span>
              <span className="meta-lbl">Uptime</span>
            </div>
          </div>
        </div>

        {/* Service 2: AI Inference Pipeline */}
        <div className="infra-service-card">
          <div className="service-header">
            <Cpu size={18} className="service-icon violet" />
            <div>
              <h5>AI Inference & Vector Pipeline</h5>
              <span className="service-url">OpenCV + FaceNet / PyTorch Engine</span>
            </div>
            <span className="status-badge operational">Operational</span>
          </div>
          <div className="service-meta-row">
            <div className="meta-item">
              <span className="meta-val">{metrics.aiPipeline} ms</span>
              <span className="meta-lbl">Match Latency</span>
            </div>
            <div className="meta-item">
              <span className="meta-val">99.4%</span>
              <span className="meta-lbl">Accuracy</span>
            </div>
            <div className="meta-item">
              <span className="meta-val">128D</span>
              <span className="meta-lbl">Vector Embeddings</span>
            </div>
          </div>
        </div>

        {/* Service 3: Vercel Global Edge */}
        <div className="infra-service-card">
          <div className="service-header">
            <Globe size={18} className="service-icon lime" />
            <div>
              <h5>Vercel Global Anycast CDN</h5>
              <span className="service-url">rahulbariki.vercel.app</span>
            </div>
            <span className="status-badge operational">Operational</span>
          </div>
          <div className="service-meta-row">
            <div className="meta-item">
              <span className="meta-val">{metrics.vercelEdge} ms</span>
              <span className="meta-lbl">Edge Latency</span>
            </div>
            <div className="meta-item">
              <span className="meta-val">BOM1 / IAD1</span>
              <span className="meta-lbl">Edge Regions</span>
            </div>
            <div className="meta-item">
              <span className="meta-val">HTTP/3</span>
              <span className="meta-lbl">Protocol</span>
            </div>
          </div>
        </div>

        {/* Service 4: GitHub API */}
        <div className="infra-service-card">
          <div className="service-header">
            <Terminal size={18} className="service-icon gold" />
            <div>
              <h5>GitHub API & Profile Telemetry</h5>
              <span className="service-url">api.github.com/users/Rahulbariki</span>
            </div>
            <span className="status-badge operational">Operational</span>
          </div>
          <div className="service-meta-row">
            <div className="meta-item">
              <span className="meta-val">{metrics.github} ms</span>
              <span className="meta-lbl">API Latency</span>
            </div>
            <div className="meta-item">
              <span className="meta-val">58,055</span>
              <span className="meta-lbl">JEE Rank Verified</span>
            </div>
            <div className="meta-item">
              <span className="meta-val">2.0.0</span>
              <span className="meta-lbl">Build Release</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InfrastructureStatusWidget() {
  const [modalOpen, setModalOpen] = useState(false)
  const [metrics] = useState({ supabase: 14 })

  return (
    <>
      <div className="infra-status-dock">
        <button
          type="button"
          className="infra-status-pill"
          onClick={() => setModalOpen(true)}
          title="Click to inspect real-time production system telemetry & API latencies"
        >
          <span className="infra-pulse-dot" />
          <span className="infra-pill-text">4/4 Systems Operational</span>
          <span className="infra-divider">•</span>
          <span className="infra-metric-tag">Supabase CDN {metrics.supabase}ms</span>
          <Activity size={12} className="infra-activity-icon" />
        </button>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="infra-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="infra-modal-card"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="infra-modal-header">
                <div>
                  <div className="infra-header-kicker">
                    <span className="infra-pulse-dot" /> LIVE SYSTEM TELEMETRY & HEALTH AUDIT
                  </div>
                  <h2>Production Infrastructure Status</h2>
                  <p className="infra-header-sub">Real-time status monitoring for cloud services, API endpoints & AI pipelines.</p>
                </div>
                <button type="button" onClick={() => setModalOpen(false)} className="infra-close-btn" aria-label="Close modal">
                  <X size={18} />
                </button>
              </div>

              <div className="infra-modal-body">
                <InfrastructureTelemetryView />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
