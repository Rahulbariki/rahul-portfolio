import { useState, useRef, useCallback } from 'react'
import {
  X, Search, Download, Upload, RefreshCw, Plus, Trash2, ChevronUp, ChevronDown,
  BrainCircuit, Sparkles, Layers3, Code2, Lock, LayoutDashboard, FolderOpen,
  Image as ImageIcon, Database, FileText, Trophy, Clock, BookOpen, HelpCircle,
  CheckCircle, AlertTriangle, CloudUpload, Cpu, Eye, EyeOff, User, Moon, Sun, Activity,
  Copy, Edit3, Check, Zap, Globe, MessageSquare, GraduationCap, Award, Sliders,
  Shield, ArrowRight, Tag, Bookmark, CheckSquare, Send, Wand2, Key, Bot
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadToSupabase } from '../uploadToSupabase.js'
import { isSupabaseReady } from '../supabaseClient.js'
import { publishCentralPortfolioData } from '../cloudSync.js'
import { InfrastructureTelemetryView } from './InfrastructureStatusWidget.jsx'
import {
  analyzeCertificateWithGemini,
  analyzeProjectScreenshotWithGemini,
  enhanceContentWithGemini,
  getGeminiApiKey,
  setGeminiApiKey,
  testGeminiConnection
} from '../geminiService.js'

/* ─────────────────────────────────────────────
   ICON MAP — used to rehydrate after JSON parse
────────────────────────────────────────────── */
export const ICON_MAP = {
  BrainCircuit,
  Sparkles,
  Layers3,
  Code2,
  Cpu,
  Zap,
  Globe,
  MessageSquare,
  GraduationCap,
  Trophy,
  Award,
  BookOpen,
  Clock,
  Bot
}
const ICON_KEYS = Object.keys(ICON_MAP)

function PasswordGate({ onUnlock, onClose }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const ADMIN_PASSWORD = 'rahul2026'

  const submit = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      onUnlock()
    } else {
      setError(true)
      setPw('')
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div className="admin-gate-backdrop">
      <motion.div 
        className={`admin-gate-box ${error ? 'admin-gate-error' : ''}`}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      >
        <div className="portrait-frame" style={{ width: '80px', height: '80px', margin: '0 auto 24px auto', position: 'relative' }}>
          <div className="portrait-glow" style={{ opacity: 0.5 }} />
          <motion.div 
            className="orbit-ring" 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            style={{ width: '100%', height: '100%' }}
          >
            <span className="orbit-dot" style={{ top: '-2px', left: 'calc(50% - 3px)' }} />
          </motion.div>
          <div className="portrait-border-ring" />
          <div className="admin-gate-avatar-fallback">
            <Lock size={22} />
          </div>
        </div>

        <h2 className="admin-gate-title">SYSTEM_GATEWAY // SEC</h2>
        <p className="admin-gate-subtitle">AUTHORIZATION REQUIRED</p>
        
        <form onSubmit={submit} className="admin-gate-form">
          <div className="admin-input-container">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter Access Key"
              autoFocus
              className="admin-gate-input"
            />
            <span className="input-glow-border" />
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.p 
                className="admin-gate-err-msg"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ACCESS_DENIED: Invalid Key Card
              </motion.p>
            )}
          </AnimatePresence>

          <div className="admin-gate-btn-group">
            <button type="submit" className="admin-gate-btn">
              <span>INITIALIZE_SESSION</span>
            </button>
            <button type="button" className="admin-gate-cancel-btn" onClick={onClose}>
              ABORT
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   REUSABLE EDITING ATOMS (Tone, Icon, File, Reorder)
────────────────────────────────────────────── */
function FileUploadInput({ value, onChange, folder = 'media', label = 'Upload Image', accept = 'image/*,application/pdf', onAiAnalyze = null, aiLabel = 'Auto-Fill with Gemini AI', isAiAnalyzing = false }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadToSupabase(file, folder)
      onChange(url)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }, [folder, onChange])

  const isPdf = value && (value.toLowerCase().includes('.pdf') || value.startsWith('data:application/pdf'))
  const isCloud = value && value.startsWith('http')
  const isBase64 = value && value.startsWith('data:')

  return (
    <div className="file-upload-wrap">
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
      >
        {uploading ? (
          <div className="upload-spinner-wrap"><span className="upload-spinner" />Uploading…</div>
        ) : value ? (
          <div className="upload-preview">
            {isPdf ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#a78bfa' }}>
                <FileText size={32} />
                <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>PDF Document</span>
              </div>
            ) : (
              (isCloud || isBase64) && <img src={value} alt="preview" className="upload-thumb" />
            )}
            <span className={`upload-badge ${isCloud ? 'cloud' : 'local'}`}>
              {isCloud ? 'CLOUD CDN' : 'LOCAL ASSET'}
            </span>
          </div>
        ) : (
          <div className="upload-empty">
            <CloudUpload size={22} />
            <span>{label}</span>
            <small>Drag & drop or click</small>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
      {value && (
        <div className="upload-url-row">
          <input readOnly value={value} className="upload-url-input" />
          <button type="button" className="admin-btn-sm" onClick={() => window.open(value, '_blank')} title="Preview file in new tab">
            <Eye size={12} style={{ marginRight: '4px' }} /> Preview
          </button>
          <button type="button" className="admin-btn-sm" onClick={() => navigator.clipboard.writeText(value)}>Copy</button>
          <button type="button" className="admin-btn-sm danger" onClick={() => onChange('')}>✕</button>
        </div>
      )}
      {value && onAiAnalyze && (
        <div style={{ marginTop: '8px' }}>
          <button
            type="button"
            className="admin-btn-ai-magic"
            onClick={() => onAiAnalyze(value)}
            disabled={isAiAnalyzing}
            title="Scan this image with Gemini Multimodal Vision and auto-fill details"
          >
            {isAiAnalyzing ? <RefreshCw size={13} className="spin" /> : <Sparkles size={13} />}
            <span>{isAiAnalyzing ? 'Gemini Analyzing Image…' : aiLabel}</span>
          </button>
        </div>
      )}
    </div>
  )
}

function ReorderControls({ index, total, onMove, onDuplicate, onToggleExpand, isExpanded }) {
  return (
    <div className="reorder-controls" onClick={(e) => e.stopPropagation()}>
      {onDuplicate && (
        <button type="button" className="admin-btn-icon" onClick={onDuplicate} title="Duplicate / Clone Item">
          <Copy size={13} />
        </button>
      )}
      <button type="button" className="admin-btn-icon" disabled={index === 0} onClick={() => onMove(index, index - 1)} title="Move Up">
        <ChevronUp size={14} />
      </button>
      <button type="button" className="admin-btn-icon" disabled={index === total - 1} onClick={() => onMove(index, index + 1)} title="Move Down">
        <ChevronDown size={14} />
      </button>
    </div>
  )
}

function TonePicker({ value, onChange }) {
  const tones = [
    { id: 'cyan', label: 'Cyan', color: '#38bdf8' },
    { id: 'lime', label: 'Lime', color: '#84cc16' },
    { id: 'violet', label: 'Violet', color: '#a78bfa' },
    { id: 'gold', label: 'Gold', color: '#f59e0b' },
  ]
  return (
    <div className="admin-tone-picker" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {tones.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`admin-tone-chip ${value === t.id ? 'active' : ''}`}
          style={{
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            border: value === t.id ? `1.5px solid ${t.color}` : '1px solid rgba(255,255,255,0.1)',
            background: value === t.id ? `${t.color}22` : 'rgba(255,255,255,0.03)',
            color: t.color,
            transition: 'all 0.2s ease',
          }}
          onClick={() => onChange(t.id)}
        >
          ● {t.label}
        </button>
      ))}
    </div>
  )
}

function IconPicker({ value, onChange }) {
  return (
    <div className="admin-icon-picker-row" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {ICON_KEYS.map((k) => {
        const IconComp = ICON_MAP[k]
        const isActive = value === k
        return (
          <button
            key={k}
            type="button"
            className={`admin-icon-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(k)}
            title={k}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: isActive ? '1.5px solid #a78bfa' : '1px solid rgba(255,255,255,0.1)',
              background: isActive ? 'rgba(124, 58, 237, 0.25)' : 'rgba(255,255,255,0.03)',
              color: isActive ? '#c4b5fd' : '#94a3b8',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
            }}
          >
            <IconComp size={14} />
            <span>{k}</span>
          </button>
        )
      })}
    </div>
  )
}

function moveItem(arr, from, to) {
  const next = [...arr]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

/* ─────────────────────────────────────────────
   1. HERO, BIO & STATUS EDITOR
────────────────────────────────────────────── */
function HeroEditor({ profileData, buildingData, statsData, onChangeProfile, onChangeBuilding, onChangeStats }) {
  const profile = profileData || {}
  const building = buildingData || {
    active: true,
    text: 'IntelliAttend v2.0 & Multi-Modal AI Agent Workflows',
    url: 'https://dashboard.intelliattend.app/login'
  }
  const stats = statsData || [
    { value: '8.46', label: 'B.Tech CGPA' },
    { value: '58,055', label: 'JEE Mains Rank' },
    { value: '6+', label: 'Live Apps' },
    { value: '03', label: 'AI Internships' },
  ]
  const [aiLoading, setAiLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState(null)

  const updateProfile = (field, val) => onChangeProfile({ ...profile, [field]: val })
  const updateBuilding = (field, val) => onChangeBuilding({ ...building, [field]: val })
  const updateStat = (index, field, val) => {
    const next = [...stats]
    next[index] = { ...next[index], [field]: val }
    onChangeStats(next)
  }

  const handleAiEnhanceBio = async () => {
    setAiLoading(true)
    setAiStatus(null)
    try {
      const enhanced = await enhanceContentWithGemini('bio', {
        name: profile.name,
        role: profile.role,
        tagline: profile.tagline,
        bio: profile.bio
      })
      if (enhanced.tagline) updateProfile('tagline', enhanced.tagline)
      if (enhanced.bio) updateProfile('bio', enhanced.bio)
      setAiStatus({ type: 'success', msg: 'Bio & Tagline enhanced with Gemini AI!' })
      setTimeout(() => setAiStatus(null), 3500)
    } catch (err) {
      setAiStatus({ type: 'error', msg: err.message })
      setTimeout(() => setAiStatus(null), 4500)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="editor-section">
      {aiStatus && (
        <div className={`backup-status ${aiStatus.type}`} style={{ marginBottom: '16px' }}>
          {aiStatus.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          {aiStatus.msg}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header" style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="admin-card-title">Hero Headline, Tagline & Bio</span>
          <button
            type="button"
            className="admin-btn-ai-magic"
            onClick={handleAiEnhanceBio}
            disabled={aiLoading}
            title="Polish bio and tagline using Gemini AI"
          >
            {aiLoading ? <RefreshCw size={13} className="spin" /> : <Sparkles size={13} />}
            <span>{aiLoading ? 'Gemini Enhancing…' : 'AI Polish Bio & Tagline'}</span>
          </button>
        </div>
        <div className="admin-card-body">
          <div className="admin-field-row">
            <label>Name</label>
            <input value={profile.name || 'Rahul Bariki'} onChange={e => updateProfile('name', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field-row">
            <label>Role / Subtitle</label>
            <input value={profile.role || ''} onChange={e => updateProfile('role', e.target.value)} className="admin-input" placeholder="Generative AI & AI Automation Developer" />
          </div>
          <div className="admin-field-row">
            <label>Memorable Hero Tagline</label>
            <input value={profile.tagline || 'Building AI Products that Solve Real Problems.'} onChange={e => updateProfile('tagline', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field-row">
            <label>Hero Description / Bio</label>
            <textarea value={profile.bio || 'Final-year AI & ML student specializing in AI Agents, Automation, and Full-Stack Development.'} onChange={e => updateProfile('bio', e.target.value)} className="admin-textarea" rows={3} />
          </div>
          <div className="admin-field-row">
            <label>Startup Status Pill Text</label>
            <input value={profile.startupPill || 'Co-Builder @ IntelliAttend Startup'} onChange={e => updateProfile('startupPill', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field-row">
            <label>Location</label>
            <input value={profile.location || 'Nandyal, AP, India'} onChange={e => updateProfile('location', e.target.value)} className="admin-input" />
          </div>
        </div>
      </div>

      {/* Currently Building Top Banner */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title">"Currently Building" Live Banner</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
            <input type="checkbox" checked={building.active !== false} onChange={e => updateBuilding('active', e.target.checked)} />
            <span>Enable Banner</span>
          </label>
        </div>
        <div className="admin-card-body">
          <div className="admin-field-row">
            <label>Banner Text</label>
            <input value={building.text || ''} onChange={e => updateBuilding('text', e.target.value)} className="admin-input" placeholder="IntelliAttend v2.0 & Multi-Modal AI Agent Workflows" />
          </div>
          <div className="admin-field-row">
            <label>Live URL</label>
            <input value={building.url || ''} onChange={e => updateBuilding('url', e.target.value)} className="admin-input" placeholder="https://dashboard.intelliattend.app/login" />
          </div>
        </div>
      </div>

      {/* 4 Hero Highlight Stats */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title">4 Hero Highlight Metrics</span>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {stats.map((st, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 700 }}>Stat #{i + 1}</span>
                <div style={{ marginTop: '6px' }}>
                  <label style={{ fontSize: '10px', color: '#64748b' }}>Value (e.g. 8.46)</label>
                  <input value={st.value || ''} onChange={e => updateStat(i, 'value', e.target.value)} className="admin-input" style={{ marginBottom: '6px' }} />
                  <label style={{ fontSize: '10px', color: '#64748b' }}>Label (e.g. B.Tech CGPA)</label>
                  <input value={st.label || ''} onChange={e => updateStat(i, 'label', e.target.value)} className="admin-input" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   2. SKILLS & CAPABILITIES EDITOR
────────────────────────────────────────────── */
function SkillsEditor({ skillGroups, capabilities, onChangeSkills, onChangeCapabilities }) {
  const [tab, setTab] = useState('groups')
  const [expandedGroup, setExpandedGroup] = useState(null)
  const [expandedCap, setExpandedCap] = useState(null)

  const groups = skillGroups || []
  const caps = capabilities || []

  // Group Handlers
  const updateGroup = (index, field, val) => {
    const next = [...groups]
    next[index] = { ...next[index], [field]: val }
    onChangeSkills(next)
  }
  const addGroup = () => onChangeSkills([...groups, { category: 'New Category', iconKey: 'BrainCircuit', skills: ['Skill 1', 'Skill 2'], tone: 'cyan' }])
  const deleteGroup = (index) => onChangeSkills(groups.filter((_, i) => i !== index))
  const duplicateGroup = (index) => {
    const clone = { ...groups[index], category: `${groups[index].category} (Copy)` }
    const next = [...groups]
    next.splice(index + 1, 0, clone)
    onChangeSkills(next)
  }

  // Capability Handlers
  const updateCap = (index, field, val) => {
    const next = [...caps]
    next[index] = { ...next[index], [field]: val }
    onChangeCapabilities(next)
  }
  const addCap = () => onChangeCapabilities([...caps, { title: 'New Capability', text: 'Description of capability', iconKey: 'BrainCircuit' }])
  const deleteCap = (index) => onChangeCapabilities(caps.filter((_, i) => i !== index))
  const duplicateCap = (index) => {
    const clone = { ...caps[index], title: `${caps[index].title} (Copy)` }
    const next = [...caps]
    next.splice(index + 1, 0, clone)
    onChangeCapabilities(next)
  }

  return (
    <div className="editor-section">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          className={`admin-btn ${tab === 'groups' ? 'primary' : 'outline'}`}
          onClick={() => setTab('groups')}
        >
          <Layers3 size={14} /> Categorized Skill Groups ({groups.length})
        </button>
        <button
          type="button"
          className={`admin-btn ${tab === 'caps' ? 'primary' : 'outline'}`}
          onClick={() => setTab('caps')}
        >
          <BrainCircuit size={14} /> Core Capabilities Cards ({caps.length})
        </button>
      </div>

      {tab === 'groups' ? (
        <>
          <div className="editor-toolbar">
            <span className="editor-count">{groups.length} Skill Categories</span>
            <button type="button" className="admin-btn primary" onClick={addGroup}><Plus size={14} /> Add Category</button>
          </div>
          {groups.map((group, gi) => {
            const isOpen = expandedGroup === gi
            return (
              <div key={gi} className="admin-card">
                <div className="admin-card-header" onClick={() => setExpandedGroup(isOpen ? null : gi)}>
                  <span className={`admin-tone-badge ${group.tone}`}>{group.tone}</span>
                  <span className="admin-card-title">{group.category}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>({(group.skills || []).length} badges)</span>
                  <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                    <ReorderControls
                      index={gi}
                      total={groups.length}
                      onMove={(f, t) => onChangeSkills(moveItem(groups, f, t))}
                      onDuplicate={() => duplicateGroup(gi)}
                    />
                    <button type="button" className="admin-btn-icon danger" onClick={() => deleteGroup(gi)}><Trash2 size={13} /></button>
                  </div>
                </div>
                {isOpen && (
                  <div className="admin-card-body">
                    <div className="admin-field-row">
                      <label>Category Title</label>
                      <input value={group.category} onChange={e => updateGroup(gi, 'category', e.target.value)} className="admin-input" />
                    </div>
                    <div className="admin-field-row">
                      <label>Color Tone</label>
                      <TonePicker value={group.tone || 'cyan'} onChange={t => updateGroup(gi, 'tone', t)} />
                    </div>
                    <div className="admin-field-row">
                      <label>Category Icon</label>
                      <IconPicker value={group.iconKey || 'Layers3'} onChange={k => updateGroup(gi, 'iconKey', k)} />
                    </div>
                    <div className="admin-field-row">
                      <label>Skill Badges (comma-separated)</label>
                      <textarea
                        value={(group.skills || []).join(', ')}
                        onChange={e => updateGroup(gi, 'skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="admin-textarea"
                        rows={3}
                        placeholder="Python, OpenAI, LangChain, FastAPI..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </>
      ) : (
        <>
          <div className="editor-toolbar">
            <span className="editor-count">{caps.length} Capability Cards</span>
            <button type="button" className="admin-btn primary" onClick={addCap}><Plus size={14} /> Add Capability</button>
          </div>
          {caps.map((cap, ci) => {
            const isOpen = expandedCap === ci
            return (
              <div key={ci} className="admin-card">
                <div className="admin-card-header" onClick={() => setExpandedCap(isOpen ? null : ci)}>
                  <span className="admin-card-num">0{ci + 1}</span>
                  <span className="admin-card-title">{cap.title}</span>
                  <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                    <ReorderControls
                      index={ci}
                      total={caps.length}
                      onMove={(f, t) => onChangeCapabilities(moveItem(caps, f, t))}
                      onDuplicate={() => duplicateCap(ci)}
                    />
                    <button type="button" className="admin-btn-icon danger" onClick={() => deleteCap(ci)}><Trash2 size={13} /></button>
                  </div>
                </div>
                {isOpen && (
                  <div className="admin-card-body">
                    <div className="admin-field-row">
                      <label>Capability Title</label>
                      <input value={cap.title} onChange={e => updateCap(ci, 'title', e.target.value)} className="admin-input" />
                    </div>
                    <div className="admin-field-row">
                      <label>Icon</label>
                      <IconPicker value={cap.iconKey || 'BrainCircuit'} onChange={k => updateCap(ci, 'iconKey', k)} />
                    </div>
                    <div className="admin-field-row">
                      <label>Description</label>
                      <textarea value={cap.text || ''} onChange={e => updateCap(ci, 'text', e.target.value)} className="admin-textarea" rows={3} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   3. EDUCATION & ACADEMICS EDITOR
────────────────────────────────────────────── */
function EducationEditor({ data, onChange }) {
  const [expanded, setExpanded] = useState(null)
  const items = data || []

  const update = (index, field, val) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: val }
    onChange(next)
  }
  const addItem = () => onChange([...items, { degree: 'New Degree / Course', institution: 'University / College Name', period: '2023 — 2027', scoreLabel: 'CGPA', scoreValue: '8.46', badge: '8.46 CGPA', details: '', tone: 'lime' }])
  const deleteItem = (index) => onChange(items.filter((_, i) => i !== index))
  const duplicateItem = (index) => {
    const clone = { ...items[index], degree: `${items[index].degree} (Copy)` }
    const next = [...items]
    next.splice(index + 1, 0, clone)
    onChange(next)
  }

  return (
    <div className="editor-section">
      <div className="editor-toolbar">
        <span className="editor-count">{items.length} Academic Qualifications</span>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Education</button>
      </div>
      {items.map((item, gi) => {
        const isOpen = expanded === gi
        return (
          <div key={gi} className="admin-card">
            <div className="admin-card-header" onClick={() => setExpanded(isOpen ? null : gi)}>
              <span className={`admin-tone-badge ${item.tone}`}>{item.tone}</span>
              <span className="admin-card-title">{item.degree}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>({item.period})</span>
              <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                <ReorderControls
                  index={gi}
                  total={items.length}
                  onMove={(f, t) => onChange(moveItem(items, f, t))}
                  onDuplicate={() => duplicateItem(gi)}
                />
                <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
              </div>
            </div>
            {isOpen && (
              <div className="admin-card-body">
                <div className="admin-field-row">
                  <label>Degree / Qualification Title</label>
                  <input value={item.degree} onChange={e => update(gi, 'degree', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>Institution Name</label>
                  <input value={item.institution} onChange={e => update(gi, 'institution', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>Duration / Period</label>
                  <input value={item.period} onChange={e => update(gi, 'period', e.target.value)} className="admin-input" placeholder="2023 — 2027 (Expected)" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-field-row">
                    <label>Score Label (e.g. CGPA / Percentage)</label>
                    <input value={item.scoreLabel || 'CGPA'} onChange={e => update(gi, 'scoreLabel', e.target.value)} className="admin-input" />
                  </div>
                  <div className="admin-field-row">
                    <label>Score Value (e.g. 8.46 / 79%)</label>
                    <input value={item.scoreValue || ''} onChange={e => update(gi, 'scoreValue', e.target.value)} className="admin-input" />
                  </div>
                </div>
                <div className="admin-field-row">
                  <label>Badge Text</label>
                  <input value={item.badge || ''} onChange={e => update(gi, 'badge', e.target.value)} className="admin-input" placeholder="8.46 CGPA" />
                </div>
                <div className="admin-field-row">
                  <label>Color Tone</label>
                  <TonePicker value={item.tone || 'lime'} onChange={t => update(gi, 'tone', t)} />
                </div>
                <div className="admin-field-row">
                  <label>Academic Details & Coursework</label>
                  <textarea value={item.details || ''} onChange={e => update(gi, 'details', e.target.value)} className="admin-textarea" rows={3} />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────
   4. AI COPILOT KNOWLEDGE BASE EDITOR
────────────────────────────────────────────── */
function CopilotKnowledgeEditor({ data, onChange }) {
  const [expanded, setExpanded] = useState(null)
  const kb = data || {}
  const keys = Object.keys(kb)

  const update = (k, field, val) => {
    onChange({
      ...kb,
      [k]: { ...kb[k], [field]: val }
    })
  }

  const addEntry = () => {
    const key = `custom_${Date.now()}`
    onChange({
      ...kb,
      [key]: {
        title: 'New Knowledge Topic',
        response: 'AI response text here...',
        pills: ['Tell me about IntelliAttend', 'Open Resume'],
        status: '[200 OK — KNOWLEDGE MATCH]'
      }
    })
  }

  const deleteEntry = (key) => {
    const next = { ...kb }
    delete next[key]
    onChange(next)
  }

  const duplicateEntry = (key) => {
    const cloneKey = `${key}_copy`
    onChange({
      ...kb,
      [cloneKey]: {
        ...kb[key],
        title: `${kb[key].title} (Copy)`
      }
    })
  }

  return (
    <div className="editor-section">
      <div className="editor-toolbar">
        <span className="editor-count">{keys.length} Copilot Knowledge Topics</span>
        <button type="button" className="admin-btn primary" onClick={addEntry}><Plus size={14} /> Add Topic</button>
      </div>
      {keys.map((k) => {
        const item = kb[k] || {}
        const isOpen = expanded === k
        return (
          <div key={k} className="admin-card">
            <div className="admin-card-header" onClick={() => setExpanded(isOpen ? null : k)}>
              <span className="admin-tone-badge violet">topic: {k}</span>
              <span className="admin-card-title">{item.title || k}</span>
              <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                <button type="button" className="admin-btn-icon" onClick={() => duplicateEntry(k)} title="Duplicate Topic">
                  <Copy size={13} />
                </button>
                <button type="button" className="admin-btn-icon danger" onClick={() => deleteEntry(k)} title="Delete Topic">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            {isOpen && (
              <div className="admin-card-body">
                <div className="admin-field-row">
                  <label>Topic Title</label>
                  <input value={item.title || ''} onChange={e => update(k, 'title', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>AI Assistant Response Text (Markdown / Bullet Points)</label>
                  <textarea value={item.response || ''} onChange={e => update(k, 'response', e.target.value)} className="admin-textarea" rows={4} />
                </div>
                <div className="admin-field-row">
                  <label>Interactive Suggested Pills (comma-separated)</label>
                  <input
                    value={(item.pills || []).join(', ')}
                    onChange={e => update(k, 'pills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className="admin-input"
                    placeholder="Why hire Rahul for GenAI?, View IntelliAttend, Open Resume"
                  />
                </div>
                <div className="admin-field-row">
                  <label>Status Badge Text</label>
                  <input value={item.status || '[200 OK — KNOWLEDGE MATCH]'} onChange={e => update(k, 'status', e.target.value)} className="admin-input" />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────
   5. PROJECTS EDITOR (Enhanced)
────────────────────────────────────────────── */
function ProjectsEditor({ data, onChange }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [aiLoading, setAiLoading] = useState(null)
  const [aiStatus, setAiStatus] = useState(null)

  const filtered = data.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.kicker || '').toLowerCase().includes(search.toLowerCase())
  )

  const update = (index, field, value) => {
    const next = [...data]
    next[index] = { ...next[index], [field]: value }
    onChange(next)
  }

  const addItem = () => {
    onChange([...data, {
      number: String(data.length + 1).padStart(2, '0'),
      title: 'New Project',
      kicker: '',
      problem: '',
      solution: '',
      keyFeatures: ['Feature 1', 'Feature 2'],
      impact: '',
      description: '',
      result: '',
      tags: ['React', 'Python'],
      tone: 'cyan',
      iconKey: 'Code2',
      image: '',
      url: '',
      liveUrl: '',
    }])
  }

  const duplicateItem = (index) => {
    const item = data[index]
    const clone = {
      ...item,
      number: String(data.length + 1).padStart(2, '0'),
      title: `${item.title} (Copy)`
    }
    const next = [...data]
    next.splice(index + 1, 0, clone)
    onChange(next)
  }

  const deleteItem = (index) => {
    const next = data.filter((_, i) => i !== index)
    onChange(next)
    if (expanded === index) setExpanded(null)
  }

  const handleAiExtract = async (index, imageUrl) => {
    if (!imageUrl) return
    setAiLoading(index)
    setAiStatus(null)
    try {
      const extracted = await analyzeProjectScreenshotWithGemini(imageUrl)
      const next = [...data]
      const current = next[index]
      next[index] = {
        ...current,
        title: extracted.title && extracted.title !== 'New Project' ? extracted.title : current.title,
        kicker: extracted.kicker || current.kicker,
        problem: extracted.problem || current.problem,
        solution: extracted.solution || current.solution,
        keyFeatures: extracted.keyFeatures?.length ? extracted.keyFeatures : current.keyFeatures,
        description: extracted.description || current.description,
        tags: extracted.tags?.length ? extracted.tags : current.tags,
        tone: extracted.tone || current.tone
      }
      onChange(next)
      setAiStatus({ type: 'success', msg: `Extracted project details for "${next[index].title}" using Gemini Vision!` })
      setTimeout(() => setAiStatus(null), 3500)
    } catch (err) {
      setAiStatus({ type: 'error', msg: err.message })
      setTimeout(() => setAiStatus(null), 4500)
    } finally {
      setAiLoading(null)
    }
  }

  const handleAiEnhance = async (index) => {
    setAiLoading(index)
    setAiStatus(null)
    try {
      const enhanced = await enhanceContentWithGemini('project', data[index])
      const next = [...data]
      next[index] = {
        ...next[index],
        kicker: enhanced.kicker || next[index].kicker,
        problem: enhanced.problem || next[index].problem,
        solution: enhanced.solution || next[index].solution,
        keyFeatures: enhanced.keyFeatures?.length ? enhanced.keyFeatures : next[index].keyFeatures,
        description: enhanced.description || next[index].description,
        tags: enhanced.tags?.length ? enhanced.tags : next[index].tags
      }
      onChange(next)
      setAiStatus({ type: 'success', msg: `Enhanced copy for "${next[index].title}" using Gemini AI!` })
      setTimeout(() => setAiStatus(null), 3500)
    } catch (err) {
      setAiStatus({ type: 'error', msg: err.message })
      setTimeout(() => setAiStatus(null), 4500)
    } finally {
      setAiLoading(null)
    }
  }

  const globalIndex = (filteredItem) => data.indexOf(filteredItem)

  return (
    <div className="editor-section">
      {aiStatus && (
        <div className={`backup-status ${aiStatus.type}`} style={{ marginBottom: '16px' }}>
          {aiStatus.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          {aiStatus.msg}
        </div>
      )}

      <div className="editor-toolbar">
        <div className="admin-search-wrap">
          <Search size={14} />
          <input placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" />
        </div>
        <button type="button" className="admin-btn primary" onClick={addItem}>
          <Plus size={14} /> Add Project
        </button>
      </div>
      {filtered.map((project) => {
        const gi = globalIndex(project)
        const isOpen = expanded === gi
        const isAnalyzing = aiLoading === gi

        return (
          <div key={gi} className="admin-card">
            <div className="admin-card-header" onClick={() => setExpanded(isOpen ? null : gi)}>
              <span className="admin-card-num">{project.number}</span>
              <span className="admin-card-title">{project.title}</span>
              <span className={`admin-tone-badge ${project.tone}`}>{project.tone}</span>
              <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                <ReorderControls
                  index={gi}
                  total={data.length}
                  onMove={(f, t) => onChange(moveItem(data, f, t))}
                  onDuplicate={() => duplicateItem(gi)}
                />
                <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
              </div>
            </div>
            {isOpen && (
              <div className="admin-card-body">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <button
                    type="button"
                    className="admin-btn-ai-magic"
                    onClick={() => handleAiEnhance(gi)}
                    disabled={isAnalyzing}
                    title="Enhance project description, problem, solution, and key metrics using Gemini AI"
                  >
                    {isAnalyzing ? <RefreshCw size={13} className="spin" /> : <Sparkles size={13} />}
                    <span>{isAnalyzing ? 'Gemini Enhancing…' : 'AI Polish Project Copy'}</span>
                  </button>
                </div>

                <div className="admin-field-row">
                  <label>Title</label>
                  <input value={project.title} onChange={e => update(gi, 'title', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>Kicker / Subheading</label>
                  <input value={project.kicker || ''} onChange={e => update(gi, 'kicker', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>Color Tone</label>
                  <TonePicker value={project.tone || 'cyan'} onChange={t => update(gi, 'tone', t)} />
                </div>
                <div className="admin-field-row">
                  <label>Project Icon</label>
                  <IconPicker value={project.iconKey || 'Code2'} onChange={k => update(gi, 'iconKey', k)} />
                </div>
                <div className="admin-field-row">
                  <label>The Problem</label>
                  <textarea value={project.problem || ''} onChange={e => update(gi, 'problem', e.target.value)} className="admin-textarea" rows={2} />
                </div>
                <div className="admin-field-row">
                  <label>AI Solution</label>
                  <textarea value={project.solution || ''} onChange={e => update(gi, 'solution', e.target.value)} className="admin-textarea" rows={2} />
                </div>
                <div className="admin-field-row">
                  <label>Full Description</label>
                  <textarea value={project.description || ''} onChange={e => update(gi, 'description', e.target.value)} className="admin-textarea" rows={3} />
                </div>
                <div className="admin-field-row">
                  <label>Key Features (comma-separated)</label>
                  <textarea
                    value={(project.keyFeatures || []).join(', ')}
                    onChange={e => update(gi, 'keyFeatures', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    className="admin-textarea"
                    rows={3}
                  />
                </div>
                <div className="admin-field-row">
                  <label>Tags (comma-separated)</label>
                  <input value={(project.tags || []).join(', ')} onChange={e => update(gi, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>Live URL</label>
                  <input value={project.liveUrl || ''} onChange={e => update(gi, 'liveUrl', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>GitHub URL</label>
                  <input value={project.url || ''} onChange={e => update(gi, 'url', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>Project Logo / UI Screenshot</label>
                  <FileUploadInput
                    value={project.image || ''}
                    onChange={v => update(gi, 'image', v)}
                    folder="projects"
                    label="Upload Project Logo or Screenshot"
                    onAiAnalyze={v => handleAiExtract(gi, v)}
                    aiLabel="Auto-Extract Details from Screenshot"
                    isAiAnalyzing={isAnalyzing}
                  />
                </div>
                <div className="admin-field-row">
                  <label>Stage / Demo Presentation Image (Optional)</label>
                  <FileUploadInput
                    value={project.stageImage || ''}
                    onChange={v => update(gi, 'stageImage', v)}
                    folder="projects"
                    label="Upload Presentation Photo"
                    onAiAnalyze={v => handleAiExtract(gi, v)}
                    aiLabel="Auto-Extract from Presentation Photo"
                    isAiAnalyzing={isAnalyzing}
                  />
                </div>
                <div className="admin-field-row">
                  <label>Stage Presentation Title</label>
                  <input value={project.stageTitle || ''} onChange={e => update(gi, 'stageTitle', e.target.value)} className="admin-input" />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────
   6. CERTIFICATIONS EDITOR (Enhanced)
────────────────────────────────────────────── */
function CertificationsEditor({ data, onChange }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [aiLoading, setAiLoading] = useState(null)
  const [aiStatus, setAiStatus] = useState(null)

  const filtered = data.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.issuer || '').toLowerCase().includes(search.toLowerCase())
  )

  const update = (index, field, value) => {
    const next = [...data]; next[index] = { ...next[index], [field]: value }; onChange(next)
  }
  const addItem = () => onChange([...data, { category: 'course', title: 'New Certification', kicker: '', issuer: '', date: '', certId: '', skills: [], image: '', credentialUrl: '', tone: 'cyan' }])
  const duplicateItem = (index) => {
    const clone = { ...data[index], title: `${data[index].title} (Copy)` }
    const next = [...data]
    next.splice(index + 1, 0, clone)
    onChange(next)
  }
  const deleteItem = (index) => { onChange(data.filter((_, i) => i !== index)); if (expanded === index) setExpanded(null) }

  const handleAiCertAutoFill = async (index, certUrl) => {
    if (!certUrl) return
    setAiLoading(index)
    setAiStatus(null)
    try {
      const extracted = await analyzeCertificateWithGemini(certUrl)
      const next = [...data]
      next[index] = {
        ...next[index],
        title: extracted.title || next[index].title,
        kicker: extracted.kicker || next[index].kicker,
        issuer: extracted.issuer || next[index].issuer,
        date: extracted.date || next[index].date,
        certId: extracted.certId || next[index].certId,
        skills: extracted.skills?.length ? extracted.skills : next[index].skills,
        tone: extracted.tone || next[index].tone
      }
      onChange(next)
      setAiStatus({ type: 'success', msg: `Auto-filled details for "${next[index].title}" using Gemini Vision!` })
      setTimeout(() => setAiStatus(null), 3500)
    } catch (err) {
      setAiStatus({ type: 'error', msg: err.message })
      setTimeout(() => setAiStatus(null), 4500)
    } finally {
      setAiLoading(null)
    }
  }

  const globalIndex = (item) => data.indexOf(item)

  return (
    <div className="editor-section">
      {aiStatus && (
        <div className={`backup-status ${aiStatus.type}`} style={{ marginBottom: '16px' }}>
          {aiStatus.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          {aiStatus.msg}
        </div>
      )}

      <div className="editor-toolbar">
        <div className="admin-search-wrap"><Search size={14} /><input placeholder="Search certifications…" value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" /></div>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Cert</button>
      </div>
      {filtered.map((cert) => {
        const gi = globalIndex(cert)
        const isOpen = expanded === gi
        const isAnalyzing = aiLoading === gi

        return (
          <div key={gi} className="admin-card">
            <div className="admin-card-header" onClick={() => setExpanded(isOpen ? null : gi)}>
              <span className={`admin-cat-badge ${cert.category}`}>{cert.category}</span>
              <span className="admin-card-title">{cert.title}</span>
              <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                <ReorderControls
                  index={gi}
                  total={data.length}
                  onMove={(f, t) => onChange(moveItem(data, f, t))}
                  onDuplicate={() => duplicateItem(gi)}
                />
                <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
              </div>
            </div>
            {isOpen && (
              <div className="admin-card-body">
                {cert.image && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                    <button
                      type="button"
                      className="admin-btn-ai-magic"
                      onClick={() => handleAiCertAutoFill(gi, cert.image)}
                      disabled={isAnalyzing}
                      title="Scan certificate image with Gemini Vision and auto-fill issuer, title, date, cert ID, and skills"
                    >
                      {isAnalyzing ? <RefreshCw size={13} className="spin" /> : <Sparkles size={13} />}
                      <span>{isAnalyzing ? 'Gemini Analyzing Certificate…' : 'Auto-Fill from Certificate with Gemini'}</span>
                    </button>
                  </div>
                )}

                {[['Title', 'title'], ['Kicker', 'kicker'], ['Issuer', 'issuer'], ['Date', 'date'], ['Cert ID', 'certId'], ['Credential URL', 'credentialUrl']].map(([lbl, key]) => (
                  <div className="admin-field-row" key={key}>
                    <label>{lbl}</label>
                    <input value={cert[key] || ''} onChange={e => update(gi, key, e.target.value)} className="admin-input" />
                  </div>
                ))}
                <div className="admin-field-row">
                  <label>Skills (comma-separated)</label>
                  <input value={(cert.skills || []).join(', ')} onChange={e => update(gi, 'skills', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>Category</label>
                  <select value={cert.category || 'course'} onChange={e => update(gi, 'category', e.target.value)} className="admin-select">
                    <option value="ieee">IEEE</option><option value="course">Course / Internship</option><option value="participation">Workshop / Training</option>
                  </select>
                </div>
                <div className="admin-field-row">
                  <label>Color Tone</label>
                  <TonePicker value={cert.tone || 'cyan'} onChange={t => update(gi, 'tone', t)} />
                </div>
                <div className="admin-field-row">
                  <label>Certificate Image / Document</label>
                  <FileUploadInput
                    value={cert.image || ''}
                    onChange={v => update(gi, 'image', v)}
                    folder="certificates"
                    label="Upload Certificate (Image / PDF)"
                    accept="image/*,application/pdf"
                    onAiAnalyze={v => handleAiCertAutoFill(gi, v)}
                    aiLabel="Scan & Auto-Fill with Gemini AI"
                    isAiAnalyzing={isAnalyzing}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────
   7. HACKATHONS EDITOR (Enhanced)
────────────────────────────────────────────── */
function HackathonsEditor({ data, onChange }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [aiLoading, setAiLoading] = useState(null)
  const [aiStatus, setAiStatus] = useState(null)

  const filtered = data.filter(h => h.title.toLowerCase().includes(search.toLowerCase()))

  const update = (index, field, value) => {
    const next = [...data]; next[index] = { ...next[index], [field]: value }; onChange(next)
  }
  const addItem = () => onChange([...data, { title: 'New Hackathon', organizer: '', date: '', role: '', award: '', description: '', tags: [], image: '', tone: 'cyan' }])
  const duplicateItem = (index) => {
    const clone = { ...data[index], title: `${data[index].title} (Copy)` }
    const next = [...data]
    next.splice(index + 1, 0, clone)
    onChange(next)
  }
  const deleteItem = (index) => { onChange(data.filter((_, i) => i !== index)); if (expanded === index) setExpanded(null) }

  const handleAiHackathonAutoFill = async (index, proofUrl) => {
    if (!proofUrl) return
    setAiLoading(index)
    setAiStatus(null)
    try {
      const extracted = await analyzeCertificateWithGemini(proofUrl)
      const next = [...data]
      next[index] = {
        ...next[index],
        title: extracted.title || next[index].title,
        organizer: extracted.issuer || next[index].organizer,
        date: extracted.date || next[index].date,
        role: extracted.kicker || next[index].role,
        award: extracted.kicker || next[index].award,
        description: extracted.details || next[index].description,
        tags: extracted.skills?.length ? extracted.skills : next[index].tags,
        tone: extracted.tone || next[index].tone
      }
      onChange(next)
      setAiStatus({ type: 'success', msg: `Auto-filled hackathon details from document using Gemini Vision!` })
      setTimeout(() => setAiStatus(null), 3500)
    } catch (err) {
      setAiStatus({ type: 'error', msg: err.message })
      setTimeout(() => setAiStatus(null), 4500)
    } finally {
      setAiLoading(null)
    }
  }

  const handleAiHackathonEnhance = async (index) => {
    setAiLoading(index)
    setAiStatus(null)
    try {
      const enhanced = await enhanceContentWithGemini('hackathon', data[index])
      const next = [...data]
      next[index] = {
        ...next[index],
        role: enhanced.role || next[index].role,
        award: enhanced.award || next[index].award,
        description: enhanced.description || next[index].description
      }
      onChange(next)
      setAiStatus({ type: 'success', msg: `Enhanced hackathon description using Gemini AI!` })
      setTimeout(() => setAiStatus(null), 3500)
    } catch (err) {
      setAiStatus({ type: 'error', msg: err.message })
      setTimeout(() => setAiStatus(null), 4500)
    } finally {
      setAiLoading(null)
    }
  }

  const globalIndex = (item) => data.indexOf(item)

  return (
    <div className="editor-section">
      {aiStatus && (
        <div className={`backup-status ${aiStatus.type}`} style={{ marginBottom: '16px' }}>
          {aiStatus.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          {aiStatus.msg}
        </div>
      )}

      <div className="editor-toolbar">
        <div className="admin-search-wrap"><Search size={14} /><input placeholder="Search hackathons…" value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" /></div>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Hackathon</button>
      </div>
      {filtered.map((hack) => {
        const gi = globalIndex(hack)
        const isOpen = expanded === gi
        const isAnalyzing = aiLoading === gi

        return (
          <div key={gi} className="admin-card">
            <div className="admin-card-header" onClick={() => setExpanded(isOpen ? null : gi)}>
              <span className={`admin-tone-badge ${hack.tone}`}>{hack.tone}</span>
              <span className="admin-card-title">{hack.title}</span>
              <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                <ReorderControls
                  index={gi}
                  total={data.length}
                  onMove={(f, t) => onChange(moveItem(data, f, t))}
                  onDuplicate={() => duplicateItem(gi)}
                />
                <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
              </div>
            </div>
            {isOpen && (
              <div className="admin-card-body">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <button
                    type="button"
                    className="admin-btn-ai-magic"
                    onClick={() => handleAiHackathonEnhance(gi)}
                    disabled={isAnalyzing}
                    title="Enhance hackathon description and impact using Gemini AI"
                  >
                    {isAnalyzing ? <RefreshCw size={13} className="spin" /> : <Sparkles size={13} />}
                    <span>{isAnalyzing ? 'Gemini Enhancing…' : 'AI Polish Hackathon Description'}</span>
                  </button>
                </div>

                {[['Title', 'title'], ['Organizer', 'organizer'], ['Date', 'date'], ['Role / Award text', 'role'], ['Award badge', 'award']].map(([lbl, key]) => (
                  <div className="admin-field-row" key={key}>
                    <label>{lbl}</label>
                    <input value={hack[key] || ''} onChange={e => update(gi, key, e.target.value)} className="admin-input" />
                  </div>
                ))}
                <div className="admin-field-row">
                  <label>Description</label>
                  <textarea value={hack.description || ''} onChange={e => update(gi, 'description', e.target.value)} className="admin-textarea" rows={3} />
                </div>
                <div className="admin-field-row">
                  <label>Tags (comma-separated)</label>
                  <input value={(hack.tags || []).join(', ')} onChange={e => update(gi, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>Color Tone</label>
                  <TonePicker value={hack.tone || 'cyan'} onChange={t => update(gi, 'tone', t)} />
                </div>
                {[['Certificate / Award Image', 'image', 'hackathons'], ['News / Press Image', 'newsImage', 'hackathons'], ['Stage Photo', 'stageImage', 'hackathons'], ['Felicitation / Event Photo', 'secImage', 'hackathons']].map(([lbl, key, folder]) => (
                  <div className="admin-field-row" key={key}>
                    <label>{lbl}</label>
                    <FileUploadInput
                      value={hack[key] || ''}
                      onChange={v => update(gi, key, v)}
                      folder={folder}
                      label={`Upload ${lbl}`}
                      onAiAnalyze={v => handleAiHackathonAutoFill(gi, v)}
                      aiLabel="Auto-Fill Details with Gemini"
                      isAiAnalyzing={isAnalyzing}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────
   8. TIMELINE EDITOR (Enhanced)
────────────────────────────────────────────── */
function TimelineEditor({ data, onChange }) {
  const [expanded, setExpanded] = useState(null)
  const update = (index, field, value) => {
    const next = [...data]; next[index] = { ...next[index], [field]: value }; onChange(next)
  }
  const addItem = () => onChange([...data, { year: '2026', title: 'New Strategic Event', role: '', detail: '', badge: '', tone: 'cyan' }])
  const duplicateItem = (index) => {
    const clone = { ...data[index], title: `${data[index].title} (Copy)` }
    const next = [...data]
    next.splice(index + 1, 0, clone)
    onChange(next)
  }
  const deleteItem = (index) => { onChange(data.filter((_, i) => i !== index)); if (expanded === index) setExpanded(null) }

  return (
    <div className="editor-section">
      <div className="editor-toolbar">
        <span className="editor-count">{data.length} Career Events</span>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Event</button>
      </div>
      {data.map((event, gi) => (
        <div key={gi} className="admin-card">
          <div className="admin-card-header" onClick={() => setExpanded(expanded === gi ? null : gi)}>
            <span className="admin-card-num">{event.year}</span>
            <span className="admin-card-title">{event.title}</span>
            <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
              <ReorderControls
                index={gi}
                total={data.length}
                onMove={(f, t) => onChange(moveItem(data, f, t))}
                onDuplicate={() => duplicateItem(gi)}
              />
              <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
            </div>
          </div>
          {expanded === gi && (
            <div className="admin-card-body">
              {[['Year', 'year'], ['Title', 'title'], ['Role', 'role'], ['Badge text', 'badge']].map(([lbl, key]) => (
                <div className="admin-field-row" key={key}>
                  <label>{lbl}</label>
                  <input value={event[key] || ''} onChange={e => update(gi, key, e.target.value)} className="admin-input" />
                </div>
              ))}
              <div className="admin-field-row">
                <label>Detail</label>
                <textarea value={event.detail || ''} onChange={e => update(gi, 'detail', e.target.value)} className="admin-textarea" rows={3} />
              </div>
              <div className="admin-field-row">
                <label>Color Tone</label>
                <TonePicker value={event.tone || 'cyan'} onChange={t => update(gi, 'tone', t)} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   9. BLOG & FAQ EDITORS
────────────────────────────────────────────── */
function BlogEditor({ data, onChange }) {
  const [expanded, setExpanded] = useState(null)
  const [aiLoading, setAiLoading] = useState(null)
  const [aiStatus, setAiStatus] = useState(null)

  const update = (index, field, value) => {
    const next = [...data]; next[index] = { ...next[index], [field]: value }; onChange(next)
  }
  const addItem = () => onChange([...data, { title: 'New Insight', date: 'Aug 2026', readTime: '5 min read', snippet: '', tags: [], url: '' }])
  const duplicateItem = (index) => {
    const clone = { ...data[index], title: `${data[index].title} (Copy)` }
    const next = [...data]
    next.splice(index + 1, 0, clone)
    onChange(next)
  }
  const deleteItem = (index) => { onChange(data.filter((_, i) => i !== index)); if (expanded === index) setExpanded(null) }

  const handleAiBlogEnhance = async (index) => {
    setAiLoading(index)
    setAiStatus(null)
    try {
      const enhanced = await enhanceContentWithGemini('blog', data[index])
      const next = [...data]
      next[index] = {
        ...next[index],
        title: enhanced.title || next[index].title,
        snippet: enhanced.snippet || next[index].snippet,
        readTime: enhanced.readTime || next[index].readTime
      }
      onChange(next)
      setAiStatus({ type: 'success', msg: `Enhanced blog article using Gemini AI!` })
      setTimeout(() => setAiStatus(null), 3500)
    } catch (err) {
      setAiStatus({ type: 'error', msg: err.message })
      setTimeout(() => setAiStatus(null), 4500)
    } finally {
      setAiLoading(null)
    }
  }

  return (
    <div className="editor-section">
      {aiStatus && (
        <div className={`backup-status ${aiStatus.type}`} style={{ marginBottom: '16px' }}>
          {aiStatus.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          {aiStatus.msg}
        </div>
      )}

      <div className="editor-toolbar">
        <span className="editor-count">{data.length} Technical Blog Posts</span>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Post</button>
      </div>
      {data.map((post, gi) => {
        const isAnalyzing = aiLoading === gi
        return (
          <div key={gi} className="admin-card">
            <div className="admin-card-header" onClick={() => setExpanded(expanded === gi ? null : gi)}>
              <span className="admin-card-num">{post.date}</span>
              <span className="admin-card-title">{post.title}</span>
              <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                <ReorderControls
                  index={gi}
                  total={data.length}
                  onMove={(f, t) => onChange(moveItem(data, f, t))}
                  onDuplicate={() => duplicateItem(gi)}
                />
                <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
              </div>
            </div>
            {expanded === gi && (
              <div className="admin-card-body">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <button
                    type="button"
                    className="admin-btn-ai-magic"
                    onClick={() => handleAiBlogEnhance(gi)}
                    disabled={isAnalyzing}
                    title="Enhance article snippet and calculate estimated reading time using Gemini AI"
                  >
                    {isAnalyzing ? <RefreshCw size={13} className="spin" /> : <Sparkles size={13} />}
                    <span>{isAnalyzing ? 'Gemini Enhancing…' : 'AI Polish Article Copy'}</span>
                  </button>
                </div>

                {[['Title', 'title'], ['Date', 'date'], ['Read Time', 'readTime'], ['URL', 'url']].map(([lbl, key]) => (
                  <div className="admin-field-row" key={key}>
                    <label>{lbl}</label>
                    <input value={post[key] || ''} onChange={e => update(gi, key, e.target.value)} className="admin-input" />
                  </div>
                ))}
                <div className="admin-field-row">
                  <label>Snippet</label>
                  <textarea value={post.snippet || ''} onChange={e => update(gi, 'snippet', e.target.value)} className="admin-textarea" rows={3} />
                </div>
                <div className="admin-field-row">
                  <label>Tags (comma-separated)</label>
                  <input value={(post.tags || []).join(', ')} onChange={e => update(gi, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} className="admin-input" />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function FAQEditor({ data, onChange }) {
  const [expanded, setExpanded] = useState(null)
  const update = (index, field, value) => {
    const next = [...data]; next[index] = { ...next[index], [field]: value }; onChange(next)
  }
  const addItem = () => onChange([...data, { question: 'New question?', answer: '' }])
  const duplicateItem = (index) => {
    const clone = { ...data[index], question: `${data[index].question} (Copy)` }
    const next = [...data]
    next.splice(index + 1, 0, clone)
    onChange(next)
  }
  const deleteItem = (index) => { onChange(data.filter((_, i) => i !== index)); if (expanded === index) setExpanded(null) }

  return (
    <div className="editor-section">
      <div className="editor-toolbar">
        <span className="editor-count">{data.length} Q&amp;As</span>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Q&amp;A</button>
      </div>
      {data.map((item, gi) => (
        <div key={gi} className="admin-card">
          <div className="admin-card-header" onClick={() => setExpanded(expanded === gi ? null : gi)}>
            <span className="admin-card-title" style={{ fontStyle: 'italic' }}>{item.question}</span>
            <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
              <ReorderControls
                index={gi}
                total={data.length}
                onMove={(f, t) => onChange(moveItem(data, f, t))}
                onDuplicate={() => duplicateItem(gi)}
              />
              <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
            </div>
          </div>
          {expanded === gi && (
            <div className="admin-card-body">
              <div className="admin-field-row">
                <label>Question</label>
                <input value={item.question || ''} onChange={e => update(gi, 'question', e.target.value)} className="admin-input" />
              </div>
              <div className="admin-field-row">
                <label>Answer</label>
                <textarea value={item.answer || ''} onChange={e => update(gi, 'answer', e.target.value)} className="admin-textarea" rows={4} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   10. PROFILE & RESUMES EDITOR
────────────────────────────────────────────── */
function ProfileEditor({ data, onChange, onPreviewFile }) {
  const [newResumeName, setNewResumeName] = useState('')
  const [uploadingResume, setUploadingResume] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const fileInputRef = useRef(null)

  const update = (field, val) => onChange({ ...data, [field]: val })

  const resumes = (data.resumes && Array.isArray(data.resumes))
    ? data.resumes
    : [{ id: 'default', name: 'Primary Resume', url: data.resumeUrl || '', active: true }]

  const activePhoto = data.profilePhoto || '/assets/rahul-hero.png'
  const photosList = (data.profilePhotos && Array.isArray(data.profilePhotos) && data.profilePhotos.length > 0)
    ? data.profilePhotos
    : [activePhoto]

  const handleSetActive = (photoUrl) => {
    update('profilePhoto', photoUrl)
  }

  const handleDeletePhoto = (photoUrl) => {
    const nextList = photosList.filter(p => p !== photoUrl)
    const nextActive = (photoUrl === activePhoto)
      ? (nextList[0] || '/assets/rahul-hero.png')
      : activePhoto

    onChange({
      ...data,
      profilePhotos: nextList.length > 0 ? nextList : ['/assets/rahul-hero.png'],
      profilePhoto: nextActive
    })
  }

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return
    setUploading(true)
    const newUploaded = []
    for (const f of Array.from(files)) {
      try {
        const url = await uploadToSupabase(f, 'profile')
        newUploaded.push(url)
      } catch (err) {
        console.error('Error uploading photo:', err)
      }
    }
    const combined = [...photosList, ...newUploaded]
    onChange({
      ...data,
      profilePhotos: combined,
      profilePhoto: data.profilePhoto || combined[0]
    })
    setUploading(false)
  }

  const handleAddUrl = (e) => {
    e.preventDefault()
    if (!newUrl.trim()) return
    const combined = [...photosList, newUrl.trim()]
    onChange({
      ...data,
      profilePhotos: combined,
      profilePhoto: data.profilePhoto || combined[0]
    })
    setNewUrl('')
  }

  const handleAddResume = async (file) => {
    if (!file) return
    setUploadingResume(true)
    try {
      const url = await uploadToSupabase(file, 'resumes')
      const newResume = {
        id: `resume-${Date.now()}`,
        name: newResumeName.trim() || file.name.replace(/\.[^/.]+$/, ''),
        url,
        active: resumes.length === 0,
      }
      const updated = [...resumes, newResume]
      onChange({
        ...data,
        resumes: updated,
        resumeUrl: newResume.active ? url : (data.resumeUrl || url)
      })
      setNewResumeName('')
    } catch (e) {
      console.error(e)
    } finally {
      setUploadingResume(false)
    }
  }

  const handleSetActiveResume = (id) => {
    const updated = resumes.map(r => ({ ...r, active: r.id === id }))
    const activeOne = updated.find(r => r.id === id)
    onChange({
      ...data,
      resumes: updated,
      resumeUrl: activeOne ? activeOne.url : data.resumeUrl
    })
  }

  const handleDeleteResume = (id) => {
    const updated = resumes.filter(r => r.id !== id)
    if (updated.length > 0 && !updated.some(r => r.active)) {
      updated[0].active = true
    }
    const activeOne = updated.find(r => r.active)
    onChange({
      ...data,
      resumes: updated,
      resumeUrl: activeOne ? activeOne.url : ''
    })
  }

  return (
    <div className="editor-section">
      <div className="admin-card">
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title">Contact & Social Links</span>
        </div>
        <div className="admin-card-body">
          {[['Personal Email', 'email'], ['SHNOOR Company Email', 'shnoorEmail'], ['Phone', 'phone'], ['LinkedIn URL', 'linkedin'], ['GitHub URL', 'github'], ['Portfolio URL', 'portfolio']].map(([lbl, key]) => (
            <div className="admin-field-row" key={key}>
              <label>{lbl}</label>
              <input value={data[key] || (key === 'shnoorEmail' ? 'bariki@shnoor.com' : '')} onChange={e => update(key, e.target.value)} className="admin-input" />
            </div>
          ))}
          <div style={{ marginTop: '14px', padding: '12px 16px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <div>
              <strong style={{ fontSize: '13px', color: '#fbbf24' }}>SHNOOR Email Visibility on Portfolio</strong>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                Toggle displaying bariki@shnoor.com in the post-hero credential spotlight and contact links
              </p>
            </div>
            <button
              type="button"
              className="admin-btn-sm"
              style={{
                background: data.showShnoorEmail !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: data.showShnoorEmail !== false ? '#34d399' : '#f87171',
                borderColor: data.showShnoorEmail !== false ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                cursor: 'pointer'
              }}
              onClick={() => update('showShnoorEmail', data.showShnoorEmail === false ? true : false)}
            >
              {data.showShnoorEmail !== false ? <><Eye size={12} /> Visible (Showing)</> : <><EyeOff size={12} /> Hidden</>}
            </button>
          </div>
        </div>
      </div>

      {/* Tailored Resumes Manager */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} /> Targeted Resumes Library ({resumes.length})
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Select active version for visitor downloads</span>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Resume Name (e.g. GenAI Specialist Resume)"
              value={newResumeName}
              onChange={e => setNewResumeName(e.target.value)}
              className="admin-input"
              style={{ flexGrow: 1, minWidth: '220px' }}
            />
            <label className="admin-btn primary" style={{ cursor: 'pointer', margin: 0 }}>
              <Upload size={14} /> {uploadingResume ? 'Uploading PDF…' : 'Upload New Resume PDF'}
              <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => handleAddResume(e.target.files[0])} />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {resumes.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: r.active ? 'rgba(124, 58, 237, 0.12)' : 'rgba(255,255,255,0.02)', border: r.active ? '1px solid rgba(167, 139, 250, 0.4)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} color={r.active ? '#a78bfa' : '#64748b'} />
                  <div>
                    <strong style={{ color: '#fff', fontSize: '13px' }}>{r.name}</strong>
                    {r.active && <span className="menu-active-pill" style={{ marginLeft: '8px' }}>Active Default</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button type="button" className="admin-btn-sm" onClick={() => onPreviewFile?.({ title: r.name, img: r.url, isPdf: true })}>Preview</button>
                  {!r.active && <button type="button" className="admin-btn-sm primary" onClick={() => handleSetActiveResume(r.id)}>Set Active</button>}
                  {resumes.length > 1 && <button type="button" className="admin-btn-sm danger" onClick={() => handleDeleteResume(r.id)}>✕</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Photo Library */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={16} /> Profile Photos Gallery ({photosList.length})
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Select active avatar</span>
        </div>
        <div className="admin-card-body">
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUploadFiles(e.dataTransfer.files) }}
            style={{ marginBottom: '16px' }}
          >
            {uploading ? (
              <div className="upload-spinner-wrap"><span className="upload-spinner" /> Uploading Profile Photos…</div>
            ) : (
              <div className="upload-empty">
                <CloudUpload size={24} />
                <span>Upload Profile Photos</span>
                <small>Drag &amp; drop images or click to select</small>
              </div>
            )}
            <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => handleUploadFiles(e.target.files)} />
          </div>

          <form onSubmit={handleAddUrl} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input type="url" placeholder="Or paste image URL here…" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="admin-input" style={{ flexGrow: 1 }} />
            <button type="submit" className="admin-btn primary" disabled={!newUrl.trim()}><Plus size={14} /> Add URL</button>
          </form>

          <div className="profile-photos-grid">
            {photosList.map((url, i) => {
              const isActive = url === activePhoto
              return (
                <div key={i} className={`profile-photo-card ${isActive ? 'active-photo' : ''}`}>
                  <div className="profile-photo-img-wrap">
                    <img src={url} alt={`Profile ${i + 1}`} className="profile-photo-img" onError={(e) => { e.target.onerror = null; e.target.src = '/assets/rahul-hero.png' }} />
                    {isActive && <div className="active-photo-badge"><CheckCircle size={10} /> ACTIVE</div>}
                  </div>
                  <div className="profile-photo-card-actions">
                    {isActive ? (
                      <button type="button" className="admin-btn-sm active-indicator-btn" disabled style={{ flexGrow: 1, textAlign: 'center' }}>Active Photo</button>
                    ) : (
                      <button type="button" className="admin-btn-sm primary" onClick={() => handleSetActive(url)} style={{ flexGrow: 1 }}>Set Active</button>
                    )}
                    <button type="button" className="admin-btn-sm danger" onClick={() => handleDeletePhoto(url)} title="Delete Photo"><Trash2 size={12} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   11. MEDIA LIBRARY
────────────────────────────────────────────── */
function MediaLibrary({ onPreviewFile }) {
  const [mediaItems, setMediaItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin-media-library')) || [] } catch { return [] }
  })
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const saveMedia = (items) => {
    setMediaItems(items)
    localStorage.setItem('admin-media-library', JSON.stringify(items))
  }

  const handleFiles = async (files) => {
    setUploading(true)
    const newItems = []
    for (const file of Array.from(files)) {
      try {
        const url = await uploadToSupabase(file, 'media')
        newItems.push({ name: file.name, url, type: file.type, date: new Date().toLocaleDateString() })
      } catch (e) {
        console.error(e)
      }
    }
    saveMedia([...mediaItems, ...newItems])
    setUploading(false)
  }

  return (
    <div className="editor-section">
      <div
        className={`media-drop-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
      >
        {uploading ? <><span className="upload-spinner" /> Uploading files…</> : <><ImageIcon size={24} /><span>Drag &amp; drop files or click to upload</span><small>{isSupabaseReady ? 'Supabase CDN Active' : 'Base64 Local Fallback'}</small></>}
        <input ref={inputRef} type="file" multiple accept="image/*,application/pdf" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
      </div>
      <div className="media-grid">
        {mediaItems.map((item, i) => (
          <div key={i} className="media-thumb-card">
            {item.type?.startsWith('image') ? <img src={item.url} alt={item.name} className="media-thumb" /> : <div className="media-file-icon"><FileText size={28} /></div>}
            <div className="media-thumb-info">
              <span className="media-thumb-name">{item.name}</span>
              <div className="media-thumb-actions">
                <button
                  type="button"
                  className="admin-btn-sm"
                  onClick={() => onPreviewFile?.({ title: item.name, img: item.url, isPdf: item.url?.includes('.pdf') || item.type?.includes('pdf') })}
                >
                  Preview
                </button>
                <button type="button" className="admin-btn-sm" onClick={() => navigator.clipboard.writeText(item.url)}>Copy URL</button>
                <button type="button" className="admin-btn-sm danger" onClick={() => saveMedia(mediaItems.filter((_, j) => j !== i))}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GeminiConfigCard() {
  const [key, setKey] = useState(getGeminiApiKey())
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleSave = (newKey) => {
    setKey(newKey)
    setGeminiApiKey(newKey)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    const res = await testGeminiConnection(key)
    setTesting(false)
    setTestResult(res)
  }

  return (
    <div className="backup-card" style={{ border: '1px solid rgba(56, 189, 248, 0.35)', background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(15,17,26,0.9))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Bot size={18} style={{ color: '#38bdf8' }} />
        <h3 style={{ color: '#7dd3fc', margin: 0 }}>Google Gemini AI Vision & Engine Settings</h3>
      </div>
      <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px', lineHeight: '1.5' }}>
        Configures the Gemini 1.5 / 2.5 Flash Multimodal OCR & Generation engine for 1-click certificate scanning, project screenshot extraction, and intelligent copy polish.
      </p>

      <div className="admin-field-row">
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Gemini API Key (Google AI Studio)</span>
          <button type="button" className="admin-btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => setShowKey(!showKey)}>
            {showKey ? 'Hide Key' : 'Show Key'}
          </button>
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => handleSave(e.target.value)}
            placeholder="AIzaSy... (Paste your Gemini API key)"
            className="admin-input"
            style={{ flexGrow: 1 }}
          />
          <button
            type="button"
            className="admin-btn primary"
            onClick={handleTest}
            disabled={testing || !key.trim()}
          >
            {testing ? <RefreshCw size={13} className="spin" /> : <Sparkles size={13} />}
            {testing ? 'Testing…' : 'Test Connection'}
          </button>
        </div>
        <small style={{ color: '#64748b', display: 'block', marginTop: '6px', fontSize: '11px' }}>
          Key is securely stored in your local admin environment. Need a key? Create one at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Google AI Studio ↗</a>.
        </small>
      </div>

      {testResult && (
        <div className={`backup-status ${testResult.ok ? 'success' : 'error'}`} style={{ marginTop: '12px', fontSize: '12px' }}>
          {testResult.ok ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          <span>{testResult.message}</span>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   12. DATA BACKUP & GLOBAL CLOUD PUBLISHER
────────────────────────────────────────────── */
function DataBackup({ portfolioData, onRestore, onFactoryReset }) {
  const [importText, setImportText] = useState('')
  const [status, setStatus] = useState(null)
  const [publishing, setPublishing] = useState(false)

  const handlePublishCloud = async () => {
    setPublishing(true)
    try {
      await publishCentralPortfolioData(portfolioData)
      setStatus({ type: 'success', msg: 'Successfully published all portfolio changes to Global Supabase CDN!' })
      setTimeout(() => setStatus(null), 4000)
    } catch (e) {
      setStatus({ type: 'error', msg: `Publish failed: ${e.message}` })
      setTimeout(() => setStatus(null), 4000)
    } finally {
      setPublishing(false)
    }
  }

  const exportJSON = () => {
    const json = JSON.stringify(portfolioData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click(); URL.revokeObjectURL(url)
    setStatus({ type: 'success', msg: 'JSON exported successfully!' })
    setTimeout(() => setStatus(null), 3000)
  }

  const importJSON = () => {
    try {
      const parsed = JSON.parse(importText)
      onRestore(parsed)
      setStatus({ type: 'success', msg: 'Data imported successfully!' })
      setImportText('')
      setTimeout(() => setStatus(null), 3000)
    } catch {
      setStatus({ type: 'error', msg: 'Invalid JSON — check the format and try again.' })
      setTimeout(() => setStatus(null), 3000)
    }
  }

  return (
    <div className="editor-section backup-section">
      {status && (
        <div className={`backup-status ${status.type}`}>
          {status.type === 'success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
          {status.msg}
        </div>
      )}

      {/* Gemini AI API Configuration Card */}
      <GeminiConfigCard />

      {/* 1-Click Cloud CDN Publish */}
      <div className="backup-card" style={{ border: '1px solid rgba(124, 58, 237, 0.4)', background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(15,17,26,0.9))' }}>
        <h3 style={{ color: '#c4b5fd' }}><Globe size={16} /> 1-Click Global Cloud CDN Publish</h3>
        <p>Sync all local changes instantly to Supabase Storage so every live visitor across the world sees your updates immediately.</p>
        <button
          type="button"
          className="admin-btn primary wide"
          onClick={handlePublishCloud}
          disabled={publishing}
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', padding: '12px' }}
        >
          <RefreshCw size={14} className={publishing ? 'spin' : ''} />
          {publishing ? 'Publishing to Global Edge CDN…' : 'Publish to Global CDN Now'}
        </button>
      </div>

      <div className="backup-card">
        <h3><Download size={16} /> Export Data</h3>
        <p>Download all portfolio data as a JSON backup file.</p>
        <button type="button" className="admin-btn primary wide" onClick={exportJSON}><Download size={14} /> Export JSON Backup</button>
      </div>

      <div className="backup-card">
        <h3><Upload size={16} /> Import Data</h3>
        <p>Paste a previously exported JSON backup to restore all data.</p>
        <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="Paste your JSON backup here…" className="admin-textarea" rows={5} />
        <button type="button" className="admin-btn primary wide" onClick={importJSON} disabled={!importText}><Upload size={14} /> Import &amp; Restore</button>
      </div>

      <div className="backup-card danger-zone">
        <h3><RefreshCw size={16} /> Factory Reset</h3>
        <p>This will delete all your customizations and restore default portfolio data. This cannot be undone.</p>
        <button type="button" className="admin-btn danger wide" onClick={() => {
          if (window.confirm('Are you sure? This will permanently reset all portfolio data to defaults.')) {
            onFactoryReset()
            setStatus({ type: 'success', msg: 'Portfolio reset to factory defaults.' })
            setTimeout(() => setStatus(null), 3000)
          }
        }}>
          <RefreshCw size={14} /> Factory Reset
        </button>
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange, label, description, badge, highlight }) {
  return (
    <div 
      className="visibility-toggle-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: checked 
          ? (highlight ? 'rgba(245, 158, 11, 0.08)' : 'rgba(124, 58, 237, 0.08)') 
          : 'rgba(255, 255, 255, 0.02)',
        border: checked 
          ? (highlight ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(167, 139, 250, 0.3)') 
          : '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
        gap: '16px',
        transition: 'all 0.25s ease',
        cursor: 'pointer'
      }}
      onClick={() => onChange(!checked)}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <strong style={{ color: checked ? '#ffffff' : '#94a3b8', fontSize: '14px' }}>
            {label}
          </strong>
          {badge && (
            <span style={{
              fontSize: '10px',
              fontFamily: "'DM Mono', monospace",
              padding: '2px 8px',
              borderRadius: '100px',
              background: highlight ? 'rgba(245, 158, 11, 0.15)' : 'rgba(124, 58, 237, 0.15)',
              color: highlight ? '#fbbf24' : '#c4b5fd',
              border: highlight ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(167, 139, 250, 0.3)'
            }}>
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>

      <div 
        style={{
          width: '46px',
          height: '26px',
          borderRadius: '100px',
          background: checked 
            ? (highlight ? 'linear-gradient(135deg, #d97706, #f59e0b)' : 'linear-gradient(135deg, #7c3aed, #6366f1)') 
            : 'rgba(255, 255, 255, 0.12)',
          position: 'relative',
          transition: 'all 0.25s ease',
          flexShrink: 0,
          border: checked ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div 
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ffffff',
            position: 'absolute',
            top: '3px',
            left: checked ? '23px' : '3px',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {checked ? (
            <Eye size={11} color={highlight ? '#b45309' : '#6d28d9'} />
          ) : (
            <EyeOff size={11} color="#94a3b8" />
          )}
        </div>
      </div>
    </div>
  )
}

function FeatureVisibilityEditor({ data = {}, profileData = {}, onChange, onChangeProfile }) {
  const current = {
    showShnoorEmail: true,
    showShnoorSpotlight: true,
    showShnoorIdInExp: true,
    showCurrentlyBuilding: true,
    showStartupPill: true,
    showCopilotTerminal: true,
    showHeroStats: true,
    showIntelliAttendSpotlight: true,
    showVoicePitch: true,
    showBizCard: true,
    showGitHubWidget: true,
    showBlogSection: true,
    showFaqSection: true,
    showTimelineSection: true,
    showPhone: true,
    showEmail: true,
    ...data,
  }

  // If user changed showShnoorEmail in profileData, stay in sync
  if (profileData.showShnoorEmail !== undefined && current.showShnoorEmail !== profileData.showShnoorEmail) {
    current.showShnoorEmail = profileData.showShnoorEmail
  }

  const toggle = (key) => {
    const nextVal = !current[key]
    const updated = {
      ...current,
      [key]: nextVal,
    }
    onChange(updated)
    if (key === 'showShnoorEmail' && onChangeProfile) {
      onChangeProfile({ ...profileData, showShnoorEmail: nextVal })
    }
  }

  const enableAll = () => {
    const allOn = {}
    Object.keys(current).forEach((k) => { allOn[k] = true })
    onChange(allOn)
    if (onChangeProfile) onChangeProfile({ ...profileData, showShnoorEmail: true })
  }

  const activeCount = Object.values(current).filter(Boolean).length
  const totalCount = Object.keys(current).length

  return (
    <div className="editor-section">
      {/* Top Controls Bar */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="dot-purple" />
              <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Portfolio Feature &amp; Visibility Switchboard</h4>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Live control to hide or unhide modules, sensitive professional emails, sections, and interactive widgets.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontFamily: "'DM Mono', monospace", color: '#34d399', background: 'rgba(16, 185, 129, 0.12)', padding: '5px 12px', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              {activeCount} of {totalCount} Features Visible
            </span>
            <button
              type="button"
              className="admin-btn-sm"
              style={{ background: 'rgba(124, 58, 237, 0.2)', color: '#c4b5fd', borderColor: 'rgba(167, 139, 250, 0.4)' }}
              onClick={enableAll}
            >
              <Eye size={12} /> Show All
            </button>
          </div>
        </div>
      </div>

      {/* 1. SHNOOR & Executive Credentials (Target Feature) */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
            <Shield size={16} /> SHNOOR International LLC &amp; Professional Credentials
          </span>
          <span style={{ fontSize: '11px', color: '#f59e0b', fontFamily: "'DM Mono', monospace" }}>Requested Controls</span>
        </div>
        <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ToggleSwitch
            checked={current.showShnoorEmail !== false}
            onChange={() => toggle('showShnoorEmail')}
            label="SHNOOR Professional Email (bariki@shnoor.com)"
            description="Toggle visibility of your official SHNOOR company email (bariki@shnoor.com) across the post-hero ID card spotlight, contact section, and action buttons."
            badge="bariki@shnoor.com"
            highlight={true}
          />

          <ToggleSwitch
            checked={current.showShnoorSpotlight !== false}
            onChange={() => toggle('showShnoorSpotlight')}
            label="SHNOOR SDE Appointment &amp; ID Card Spotlight Section"
            description="Show or hide the illuminated credential spotlight section placed directly after the Hero section."
            badge="Post-Hero Spotlight"
            highlight={true}
          />

          <ToggleSwitch
            checked={current.showShnoorIdInExp !== false}
            onChange={() => toggle('showShnoorIdInExp')}
            label="Official ID Card Button in Experience Section"
            description="Show or hide the 'View Official ID Card' certificate button under SHNOOR International LLC in Field Notes &amp; Internships."
            badge="Experience Section"
            highlight={true}
          />
        </div>
      </div>

      {/* 2. Startup Highlights & Banners */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} /> Startup Highlights &amp; Live Status Banners
          </span>
        </div>
        <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ToggleSwitch
            checked={current.showCurrentlyBuilding !== false}
            onChange={() => toggle('showCurrentlyBuilding')}
            label="Currently Building Live Status Banner"
            description="Top animated pill banner displaying real-time build status (IntelliAttend v2.0 &amp; Multi-Modal AI Agent Workflows)."
            badge="Top Banner"
          />

          <ToggleSwitch
            checked={current.showIntelliAttendSpotlight !== false}
            onChange={() => toggle('showIntelliAttendSpotlight')}
            label="IntelliAttend Featured Startup Spotlight Card"
            description="Large glowing showcase card highlighting the IntelliAttend platform above the featured project grid."
            badge="Projects Showcase"
          />

          <ToggleSwitch
            checked={current.showStartupPill !== false}
            onChange={() => toggle('showStartupPill')}
            label="Hero Status Pill (SDE Intern @ SHNOOR • Co-Builder @ IntelliAttend)"
            description="Display the startup affiliation badge in the upper right hero topbar."
            badge="Hero Topbar"
          />

          <ToggleSwitch
            checked={current.showHeroStats !== false}
            onChange={() => toggle('showHeroStats')}
            label="Hero 4-Key Metrics Grid"
            description="Showcase the 4 primary stats (B.Tech CGPA, JEE Mains, Live Projects, Internships) beneath hero CTA buttons."
            badge="Hero Metrics"
          />
        </div>
      </div>

      {/* 3. Interactive Widgets & AI Copilot */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={16} /> Interactive AI &amp; Recruiter Widgets
          </span>
        </div>
        <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ToggleSwitch
            checked={current.showCopilotTerminal !== false}
            onChange={() => toggle('showCopilotTerminal')}
            label="Interactive AI Agent Live Terminal"
            description="Cyber terminal widget embedded in Hero enabling recruiters to run interactive terminal prompts about your background."
            badge="Hero Terminal"
          />

          <ToggleSwitch
            checked={current.showVoicePitch !== false}
            onChange={() => toggle('showVoicePitch')}
            label="Voice Pitch Audio Player Widget"
            description="Ambient interactive speech player delivering a 30-second synthesized elevator pitch to visitors."
            badge="Audio Player"
          />

          <ToggleSwitch
            checked={current.showBizCard !== false}
            onChange={() => toggle('showBizCard')}
            label="Recruiter Smart Business Card &amp; vCard QR Button"
            description="Interactive 3D business card modal with QR code and downloadable .vcf address book card."
            badge="vCard Modal"
          />

          <ToggleSwitch
            checked={current.showGitHubWidget !== false}
            onChange={() => toggle('showGitHubWidget')}
            label="GitHub Open Source Activity Card"
            description="GitHub contribution metrics and repository activity visualizer located in the Capabilities section."
            badge="GitHub Card"
          />
        </div>
      </div>

      {/* 4. Portfolio Sections */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers3 size={16} /> Major Page Sections
          </span>
        </div>
        <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ToggleSwitch
            checked={current.showTimelineSection !== false}
            onChange={() => toggle('showTimelineSection')}
            label="Interactive Career Timeline (#timeline)"
            description="Chronological journey with expandable milestones located inside the Field Notes &amp; Internships section."
            badge="Timeline"
          />

          <ToggleSwitch
            checked={current.showBlogSection !== false}
            onChange={() => toggle('showBlogSection')}
            label="Technical Blog &amp; Engineering Insights (#blog)"
            description="Engineering deep dives and architecture write-ups section."
            badge="Technical Blog"
          />

          <ToggleSwitch
            checked={current.showFaqSection !== false}
            onChange={() => toggle('showFaqSection')}
            label="Recruiter FAQ Accordion (#faq)"
            description="Collapsible answers to common recruiter questions regarding full-time roles and availability."
            badge="FAQ"
          />
        </div>
      </div>

      {/* 5. Contact & Privacy */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} /> Privacy &amp; Direct Contact Information
          </span>
        </div>
        <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ToggleSwitch
            checked={current.showPhone !== false}
            onChange={() => toggle('showPhone')}
            label="Direct Phone Number (+91 62817 69623)"
            description="Show or hide your personal mobile phone number across the hero topbar, contact section, and interactive resume."
            badge="Privacy Control"
          />

          <ToggleSwitch
            checked={current.showEmail !== false}
            onChange={() => toggle('showEmail')}
            label="Primary Personal Email (rahulbariki24@gmail.com)"
            description="Show or hide your primary personal email across contact points."
            badge="Primary Email"
          />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SIDEBAR NAV CONFIG
────────────────────────────────────────────── */
const SIDEBAR_SECTIONS = [
  { group: 'Hero & Stacks', items: [
    { id: 'hero', label: 'Hero & Live Status', icon: Zap },
    { id: 'skills', label: 'Skills & Capabilities', icon: Layers3 },
    { id: 'education', label: 'Education & Academics', icon: GraduationCap },
  ]},
  { group: 'Featured Work', items: [
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'certifications', label: 'Certifications', icon: CheckCircle },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy },
  ]},
  { group: 'Content & Copilot', items: [
    { id: 'timeline', label: 'Career Timeline', icon: Clock },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'copilot', label: 'AI Copilot KB', icon: MessageSquare },
  ]},
  { group: 'System & Controls', items: [
    { id: 'visibility', label: 'Feature Visibility', icon: Sliders },
    { id: 'profile', label: 'Profile & Resumes', icon: User },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'telemetry', label: 'System Telemetry', icon: Activity },
    { id: 'backup', label: 'Backup & Cloud Sync', icon: Database },
  ]},
]

const SECTION_META = {
  hero:           { title: 'Hero, Tagline & Live Status', subtitle: 'Customize hero headline, bio, currently building banner & 4 highlight stats' },
  skills:         { title: 'Skills Matrix & Core Capabilities', subtitle: 'Manage categorized skill badges and engineering capability cards' },
  education:      { title: 'Education & Academic Honors', subtitle: 'Edit degrees, CGPA/marks, institutions, and coursework' },
  projects:       { title: 'Projects & Case Studies', subtitle: 'Manage your featured software platforms, problem/solution breakdowns, and logos' },
  certifications: { title: 'Verified Certifications', subtitle: 'Edit credentials, skill tags, category filters, and certificate media' },
  hackathons:     { title: 'Hackathons & Competitions', subtitle: 'Update awards, organizer details, press clippings, and stage photos' },
  timeline:       { title: 'Career Timeline Milestones', subtitle: 'Edit your chronological journey and strategic milestones' },
  blog:           { title: 'Technical Blog & Insights', subtitle: 'Manage your engineering write-ups and tags' },
  faq:            { title: 'Recruiter FAQ Accordion', subtitle: 'Edit recruiter Q&A pairs and career notes' },
  copilot:        { title: 'Interactive AI Copilot Knowledge Base', subtitle: 'Configure AI terminal questions, answers, and clickable action pills' },
  visibility:     { title: 'Feature Visibility & Module Toggles', subtitle: 'Hide or unhide specific portfolio modules, professional emails, and widgets' },
  profile:        { title: 'Profile & Targeted Resumes', subtitle: 'Manage contact info, avatar photos, and multiple PDF resumes' },
  media:          { title: 'Media Library', subtitle: 'Upload and organize media assets on Supabase CDN' },
  telemetry:      { title: 'System Telemetry & Health Audit', subtitle: 'Real-time production infrastructure latency & API audit' },
  backup:         { title: 'Data Backup & Global Cloud Publish', subtitle: 'Export JSON, import backups, or publish live to Supabase CDN' },
}

/* ─────────────────────────────────────────────
   MAIN ADMIN DASHBOARD MODAL
────────────────────────────────────────────── */
export function AdminDashboardModal({ onClose, portfolioData, onUpdate, onFactoryReset, theme, onToggleTheme, onPreviewFile }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('admin-unlocked') === 'true'
    } catch {
      return false
    }
  })
  const [activeSection, setActiveSection] = useState('hero')
  const [isSaving, setIsSaving] = useState(false)

  const handleUnlock = () => {
    setUnlocked(true)
    try {
      sessionStorage.setItem('admin-unlocked', 'true')
    } catch (e) {
      console.warn(e)
    }
  }

  const handleLockAndExit = async () => {
    setIsSaving(true)
    try {
      await publishCentralPortfolioData(portfolioData)
    } catch (e) {
      console.warn(e)
    }
    setTimeout(() => {
      setIsSaving(false)
      setUnlocked(false)
      try {
        sessionStorage.removeItem('admin-unlocked')
      } catch (e) {
        console.warn(e)
      }
      onClose()
    }, 500)
  }

  if (!unlocked) return <PasswordGate onUnlock={handleUnlock} onClose={onClose} />

  const meta = SECTION_META[activeSection] || SECTION_META.hero

  const countFor = (id) => {
    const map = {
      projects: portfolioData.projects?.length,
      certifications: portfolioData.certifications?.length,
      hackathons: portfolioData.hackathons?.length,
      timeline: portfolioData.timelineEvents?.length,
      blog: portfolioData.blogPosts?.length,
      faq: portfolioData.faqItems?.length,
      education: portfolioData.educationList?.length,
      skills: portfolioData.skillGroups?.length,
      copilot: portfolioData.copilotKnowledge ? Object.keys(portfolioData.copilotKnowledge).length : undefined,
      visibility: portfolioData.featureVisibility ? `${Object.values(portfolioData.featureVisibility).filter(Boolean).length} Active` : undefined,
    }
    return map[id]
  }

  const renderWorkspace = () => {
    switch (activeSection) {
      case 'hero':
        return (
          <HeroEditor
            profileData={portfolioData.profileInfo || {}}
            buildingData={portfolioData.currentlyBuilding}
            statsData={portfolioData.heroStats}
            onChangeProfile={v => onUpdate('profileInfo', v)}
            onChangeBuilding={v => onUpdate('currentlyBuilding', v)}
            onChangeStats={v => onUpdate('heroStats', v)}
          />
        )
      case 'skills':
        return (
          <SkillsEditor
            skillGroups={portfolioData.skillGroups}
            capabilities={portfolioData.capabilities}
            onChangeSkills={v => onUpdate('skillGroups', v)}
            onChangeCapabilities={v => onUpdate('capabilities', v)}
          />
        )
      case 'education':
        return (
          <EducationEditor
            data={portfolioData.educationList}
            onChange={v => onUpdate('educationList', v)}
          />
        )
      case 'copilot':
        return (
          <CopilotKnowledgeEditor
            data={portfolioData.copilotKnowledge}
            onChange={v => onUpdate('copilotKnowledge', v)}
          />
        )
      case 'projects':
        return <ProjectsEditor data={portfolioData.projects || []} onChange={v => onUpdate('projects', v)} />
      case 'certifications':
        return <CertificationsEditor data={portfolioData.certifications || []} onChange={v => onUpdate('certifications', v)} />
      case 'hackathons':
        return <HackathonsEditor data={portfolioData.hackathons || []} onChange={v => onUpdate('hackathons', v)} />
      case 'timeline':
        return <TimelineEditor data={portfolioData.timelineEvents || []} onChange={v => onUpdate('timelineEvents', v)} />
      case 'blog':
        return <BlogEditor data={portfolioData.blogPosts || []} onChange={v => onUpdate('blogPosts', v)} />
      case 'faq':
        return <FAQEditor data={portfolioData.faqItems || []} onChange={v => onUpdate('faqItems', v)} />
      case 'visibility':
        return (
          <FeatureVisibilityEditor
            data={portfolioData.featureVisibility || {}}
            profileData={portfolioData.profileInfo || {}}
            onChange={v => onUpdate('featureVisibility', v)}
            onChangeProfile={v => onUpdate('profileInfo', v)}
          />
        )
      case 'profile':
        return <ProfileEditor data={portfolioData.profileInfo || {}} onChange={v => onUpdate('profileInfo', v)} onPreviewFile={onPreviewFile} />
      case 'media':
        return <MediaLibrary onPreviewFile={onPreviewFile} />
      case 'telemetry':
        return <InfrastructureTelemetryView />
      case 'backup':
        return <DataBackup portfolioData={portfolioData} onRestore={(d) => { Object.entries(d).forEach(([k, v]) => onUpdate(k, v)) }} onFactoryReset={onFactoryReset} />
      default:
        return null
    }
  }

  return (
    <motion.div 
      className="admin-overlay" 
      role="dialog" 
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div 
        className="admin-modal"
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      >
        {/* ── LEFT SIDEBAR ── */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <span className="admin-brand-icon"><Zap size={16} /></span>
            <div>
              <div className="admin-brand-title">Admin CMS</div>
              <div className="admin-brand-sub">Rahul Bariki Portfolio</div>
            </div>
          </div>

          <div className="admin-status-pill">
            <span className="admin-status-dot" />
            Portfolio CMS Live
          </div>

          <nav className="admin-nav" style={{ overflowY: 'auto' }}>
            {SIDEBAR_SECTIONS.map(group => (
              <div key={group.group} className="admin-nav-group">
                <div className="admin-nav-group-label">{group.group}</div>
                {group.items.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`admin-nav-item ${activeSection === id ? 'active' : ''}`}
                    onClick={() => setActiveSection(id)}
                  >
                    <Icon size={15} />
                    <span>{label}</span>
                    {countFor(id) != null && <span className="admin-nav-count">{countFor(id)}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <button type="button" className={`admin-lock-btn ${isSaving ? 'saving' : ''}`} onClick={handleLockAndExit} disabled={isSaving}>
            <CheckCircle size={14} />
            {isSaving ? 'Saving & Publishing…' : 'Save & Exit'}
          </button>
        </aside>

        {/* ── RIGHT WORKSPACE ── */}
        <div className="admin-workspace">
          <div className="admin-workspace-header">
            <div className="admin-workspace-title">
              <h2>{meta.title}</h2>
              <p>{meta.subtitle}</p>
            </div>
            <button type="button" className="admin-close-btn" onClick={onClose} aria-label="Close admin panel"><X size={18} /></button>
          </div>
          <div className="admin-workspace-body">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%' }}
              >
                {renderWorkspace()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
