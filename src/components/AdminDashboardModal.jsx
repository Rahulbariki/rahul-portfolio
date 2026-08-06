import { useState, useRef, useCallback } from 'react'
import {
  X, Search, Download, Upload, RefreshCw, Plus, Trash2, ChevronUp, ChevronDown,
  BrainCircuit, Sparkles, Layers3, Code2, Lock, LayoutDashboard, FolderOpen,
  Image as ImageIcon, Database, FileText, Trophy, Clock, BookOpen, HelpCircle,
  CheckCircle, AlertTriangle, CloudUpload, Cpu, Eye, User, Moon, Sun,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadToSupabase } from '../uploadToSupabase.js'
import { isSupabaseReady } from '../supabaseClient.js'

/* ─────────────────────────────────────────────
   ICON MAP — used to rehydrate after JSON parse
────────────────────────────────────────────── */
export const ICON_MAP = { BrainCircuit, Sparkles, Layers3, Code2, Cpu }
export const ICON_KEYS = Object.keys(ICON_MAP)

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
    <div className="admin-gate-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div 
        className={`admin-gate-box ${error ? 'admin-gate-error' : ''}`}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      >
        <button 
          type="button" 
          className="admin-gate-close-btn" 
          onClick={(e) => { e.stopPropagation(); onClose() }}
          aria-label="Close gateway"
        >
          <X size={16} />
        </button>

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
            <button type="button" className="admin-gate-cancel-btn" onClick={(e) => { e.stopPropagation(); onClose() }}>
              ABORT
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   FILE UPLOAD INPUT
────────────────────────────────────────────── */
function FileUploadInput({ value, onChange, folder = 'media', label = 'Upload Image', accept = 'image/*,application/pdf' }) {
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
              {isCloud ? '☁ CLOUD' : '📎 LOCAL'}
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
    </div>
  )
}

/* ─────────────────────────────────────────────
   REORDER CONTROLS
────────────────────────────────────────────── */
function ReorderControls({ index, total, onMove }) {
  return (
    <div className="reorder-controls">
      <button type="button" className="admin-btn-icon" disabled={index === 0} onClick={() => onMove(index, index - 1)} title="Move up"><ChevronUp size={14} /></button>
      <button type="button" className="admin-btn-icon" disabled={index === total - 1} onClick={() => onMove(index, index + 1)} title="Move down"><ChevronDown size={14} /></button>
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
   PROJECTS EDITOR
────────────────────────────────────────────── */
function ProjectsEditor({ data, onChange }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

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
      keyFeatures: [],
      impact: '',
      description: '',
      result: '',
      tags: [],
      tone: 'cyan',
      iconKey: 'Code2',
      image: '',
      url: '',
      liveUrl: '',
    }])
  }

  const deleteItem = (index) => {
    const next = data.filter((_, i) => i !== index)
    onChange(next)
    if (expanded === index) setExpanded(null)
  }

  const globalIndex = (filteredItem) => data.indexOf(filteredItem)

  return (
    <div className="editor-section">
      <div className="editor-toolbar">
        <div className="admin-search-wrap"><Search size={14} /><input placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" /></div>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Project</button>
      </div>
      {filtered.map((project) => {
        const gi = globalIndex(project)
        const isOpen = expanded === gi
        return (
          <div key={gi} className="admin-card">
            <div className="admin-card-header" onClick={() => setExpanded(isOpen ? null : gi)}>
              <span className="admin-card-num">{project.number}</span>
              <span className="admin-card-title">{project.title}</span>
              <span className={`admin-tone-badge ${project.tone}`}>{project.tone}</span>
              <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                <ReorderControls index={gi} total={data.length} onMove={(f, t) => onChange(moveItem(data, f, t))} />
                <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
              </div>
            </div>
            {isOpen && (
              <div className="admin-card-body">
                <div className="admin-field-row">
                  <label>Title</label>
                  <input value={project.title} onChange={e => update(gi, 'title', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>Kicker</label>
                  <input value={project.kicker || ''} onChange={e => update(gi, 'kicker', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-row">
                  <label>Problem</label>
                  <textarea value={project.problem || ''} onChange={e => update(gi, 'problem', e.target.value)} className="admin-textarea" rows={2} />
                </div>
                <div className="admin-field-row">
                  <label>Solution</label>
                  <textarea value={project.solution || ''} onChange={e => update(gi, 'solution', e.target.value)} className="admin-textarea" rows={2} />
                </div>
                <div className="admin-field-row">
                  <label>Description</label>
                  <textarea value={project.description || ''} onChange={e => update(gi, 'description', e.target.value)} className="admin-textarea" rows={3} />
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
                  <label>Tone</label>
                  <select value={project.tone || 'cyan'} onChange={e => update(gi, 'tone', e.target.value)} className="admin-select">
                    <option value="cyan">Cyan</option><option value="lime">Lime</option><option value="violet">Violet</option>
                  </select>
                </div>
                <div className="admin-field-row">
                  <label>Project Logo</label>
                  <FileUploadInput value={project.image || ''} onChange={v => update(gi, 'image', v)} folder="projects" label="Upload Logo" />
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
   CERTIFICATIONS EDITOR
────────────────────────────────────────────── */
function CertificationsEditor({ data, onChange }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = data.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.issuer || '').toLowerCase().includes(search.toLowerCase())
  )

  const update = (index, field, value) => {
    const next = [...data]; next[index] = { ...next[index], [field]: value }; onChange(next)
  }
  const addItem = () => onChange([...data, { category: 'course', title: 'New Certification', kicker: '', issuer: '', date: '', certId: '', skills: [], image: '', credentialUrl: '', tone: 'cyan' }])
  const deleteItem = (index) => { onChange(data.filter((_, i) => i !== index)); if (expanded === index) setExpanded(null) }

  const globalIndex = (item) => data.indexOf(item)

  return (
    <div className="editor-section">
      <div className="editor-toolbar">
        <div className="admin-search-wrap"><Search size={14} /><input placeholder="Search certifications…" value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" /></div>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Cert</button>
      </div>
      {filtered.map((cert) => {
        const gi = globalIndex(cert)
        const isOpen = expanded === gi
        return (
          <div key={gi} className="admin-card">
            <div className="admin-card-header" onClick={() => setExpanded(isOpen ? null : gi)}>
              <span className={`admin-cat-badge ${cert.category}`}>{cert.category}</span>
              <span className="admin-card-title">{cert.title}</span>
              <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                <ReorderControls index={gi} total={data.length} onMove={(f, t) => onChange(moveItem(data, f, t))} />
                <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
              </div>
            </div>
            {isOpen && (
              <div className="admin-card-body">
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
                  <label>Certificate Image</label>
                  <FileUploadInput value={cert.image || ''} onChange={v => update(gi, 'image', v)} folder="certificates" label="Upload Certificate" accept="image/*,application/pdf" />
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
   HACKATHONS EDITOR
────────────────────────────────────────────── */
function HackathonsEditor({ data, onChange }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const filtered = data.filter(h => h.title.toLowerCase().includes(search.toLowerCase()))

  const update = (index, field, value) => {
    const next = [...data]; next[index] = { ...next[index], [field]: value }; onChange(next)
  }
  const addItem = () => onChange([...data, { title: 'New Hackathon', organizer: '', date: '', role: '', award: '', description: '', tags: [], image: '', tone: 'cyan' }])
  const deleteItem = (index) => { onChange(data.filter((_, i) => i !== index)); if (expanded === index) setExpanded(null) }
  const globalIndex = (item) => data.indexOf(item)

  return (
    <div className="editor-section">
      <div className="editor-toolbar">
        <div className="admin-search-wrap"><Search size={14} /><input placeholder="Search hackathons…" value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" /></div>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Hackathon</button>
      </div>
      {filtered.map((hack) => {
        const gi = globalIndex(hack)
        const isOpen = expanded === gi
        return (
          <div key={gi} className="admin-card">
            <div className="admin-card-header" onClick={() => setExpanded(isOpen ? null : gi)}>
              <span className={`admin-tone-badge ${hack.tone}`}>{hack.tone}</span>
              <span className="admin-card-title">{hack.title}</span>
              <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
                <ReorderControls index={gi} total={data.length} onMove={(f, t) => onChange(moveItem(data, f, t))} />
                <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
              </div>
            </div>
            {isOpen && (
              <div className="admin-card-body">
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
                  <label>Tone</label>
                  <select value={hack.tone || 'cyan'} onChange={e => update(gi, 'tone', e.target.value)} className="admin-select">
                    <option value="cyan">Cyan</option><option value="lime">Lime</option><option value="violet">Violet</option>
                  </select>
                </div>
                {[['Certificate / Award Image', 'image', 'hackathons'], ['News / Press Image', 'newsImage', 'hackathons'], ['Stage Photo', 'stageImage', 'hackathons'], ['Event Photo', 'secImage', 'hackathons']].map(([lbl, key, folder]) => (
                  <div className="admin-field-row" key={key}>
                    <label>{lbl}</label>
                    <FileUploadInput value={hack[key] || ''} onChange={v => update(gi, key, v)} folder={folder} label={`Upload ${lbl}`} />
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
   TIMELINE EDITOR
────────────────────────────────────────────── */
function TimelineEditor({ data, onChange }) {
  const [expanded, setExpanded] = useState(null)
  const update = (index, field, value) => {
    const next = [...data]; next[index] = { ...next[index], [field]: value }; onChange(next)
  }
  const addItem = () => onChange([...data, { year: 'New Year', title: 'New Event', role: '', detail: '', badge: '', tone: 'cyan' }])
  const deleteItem = (index) => { onChange(data.filter((_, i) => i !== index)); if (expanded === index) setExpanded(null) }

  return (
    <div className="editor-section">
      <div className="editor-toolbar">
        <span className="editor-count">{data.length} events</span>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Event</button>
      </div>
      {data.map((event, gi) => (
        <div key={gi} className="admin-card">
          <div className="admin-card-header" onClick={() => setExpanded(expanded === gi ? null : gi)}>
            <span className="admin-card-num">{event.year}</span>
            <span className="admin-card-title">{event.title}</span>
            <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
              <ReorderControls index={gi} total={data.length} onMove={(f, t) => onChange(moveItem(data, f, t))} />
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
                <label>Tone</label>
                <select value={event.tone || 'cyan'} onChange={e => update(gi, 'tone', e.target.value)} className="admin-select">
                  <option value="cyan">Cyan</option><option value="lime">Lime</option><option value="violet">Violet</option>
                </select>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   BLOG EDITOR
────────────────────────────────────────────── */
function BlogEditor({ data, onChange }) {
  const [expanded, setExpanded] = useState(null)
  const update = (index, field, value) => {
    const next = [...data]; next[index] = { ...next[index], [field]: value }; onChange(next)
  }
  const addItem = () => onChange([...data, { title: 'New Post', date: 'Aug 2026', readTime: '5 min read', snippet: '', tags: [], url: '' }])
  const deleteItem = (index) => { onChange(data.filter((_, i) => i !== index)); if (expanded === index) setExpanded(null) }

  return (
    <div className="editor-section">
      <div className="editor-toolbar">
        <span className="editor-count">{data.length} posts</span>
        <button type="button" className="admin-btn primary" onClick={addItem}><Plus size={14} /> Add Post</button>
      </div>
      {data.map((post, gi) => (
        <div key={gi} className="admin-card">
          <div className="admin-card-header" onClick={() => setExpanded(expanded === gi ? null : gi)}>
            <span className="admin-card-num">{post.date}</span>
            <span className="admin-card-title">{post.title}</span>
            <div className="admin-card-actions" onClick={e => e.stopPropagation()}>
              <ReorderControls index={gi} total={data.length} onMove={(f, t) => onChange(moveItem(data, f, t))} />
              <button type="button" className="admin-btn-icon danger" onClick={() => deleteItem(gi)}><Trash2 size={13} /></button>
            </div>
          </div>
          {expanded === gi && (
            <div className="admin-card-body">
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
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   FAQ EDITOR
────────────────────────────────────────────── */
function FAQEditor({ data, onChange }) {
  const [expanded, setExpanded] = useState(null)
  const update = (index, field, value) => {
    const next = [...data]; next[index] = { ...next[index], [field]: value }; onChange(next)
  }
  const addItem = () => onChange([...data, { question: 'New question?', answer: '' }])
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
              <ReorderControls index={gi} total={data.length} onMove={(f, t) => onChange(moveItem(data, f, t))} />
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
   PROFILE & RESUME EDITOR
────────────────────────────────────────────── */
function ProfileEditor({ data, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const fileInputRef = useRef(null)

  const activePhoto = data.profilePhoto || ''
  const photosList = Array.isArray(data.profilePhotos) && data.profilePhotos.length > 0
    ? data.profilePhotos
    : (activePhoto ? [activePhoto] : [])

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  const updatePhotos = (newPhotosList, newActivePhoto) => {
    const updatedActive = newActivePhoto !== undefined 
      ? newActivePhoto 
      : (newPhotosList.includes(activePhoto) ? activePhoto : (newPhotosList[0] || ''))

    onChange({
      ...data,
      profilePhoto: updatedActive,
      profilePhotos: newPhotosList
    })
  }

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return
    setUploading(true)
    const uploadedUrls = []
    for (const file of Array.from(files)) {
      try {
        const url = await uploadToSupabase(file, 'profile')
        if (url) uploadedUrls.push(url)
      } catch (err) {
        console.error('Failed to upload profile photo:', err)
      }
    }
    if (uploadedUrls.length > 0) {
      const combined = [...photosList, ...uploadedUrls]
      updatePhotos(combined, uploadedUrls[0])
    }
    setUploading(false)
  }

  const handleAddUrl = (e) => {
    e.preventDefault()
    if (!newUrl.trim()) return
    const url = newUrl.trim()
    if (!photosList.includes(url)) {
      updatePhotos([...photosList, url], url)
    } else {
      updateField('profilePhoto', url)
    }
    setNewUrl('')
  }

  const handleSetActive = (url) => {
    updateField('profilePhoto', url)
  }

  const handleDeletePhoto = (url) => {
    const nextList = photosList.filter(p => p !== url)
    let nextActive = activePhoto
    if (activePhoto === url) {
      nextActive = nextList[0] || ''
    }
    updatePhotos(nextList, nextActive)
  }

  return (
    <div className="editor-section">
      {/* Profile Details Card */}
      <div className="admin-card">
        <div className="admin-card-body" style={{ borderTop: 'none', background: 'transparent' }}>
          <div className="admin-field-row">
            <label>Name</label>
            <input value={data.name || ''} onChange={e => updateField('name', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field-row">
            <label>Role</label>
            <input value={data.role || ''} onChange={e => updateField('role', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field-row">
            <label>Email</label>
            <input value={data.email || ''} onChange={e => updateField('email', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field-row">
            <label>Phone</label>
            <input value={data.phone || ''} onChange={e => updateField('phone', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field-row">
            <label>Location</label>
            <input value={data.location || ''} onChange={e => updateField('location', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field-row">
            <label>Resume (PDF or Image)</label>
            <FileUploadInput value={data.resumeUrl || ''} onChange={v => updateField('resumeUrl', v)} folder="resumes" label="Upload Resume PDF" accept="application/pdf,image/*" />
          </div>
        </div>
      </div>

      {/* Profile Photo Library & Selector */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <div className="admin-card-header" style={{ cursor: 'default' }}>
          <span className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={16} /> Profile Photos Gallery ({photosList.length})
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Select active avatar or upload new ones</span>
        </div>
        <div className="admin-card-body" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Upload Dropzone for Multiple Photos */}
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
                <small>Drag &amp; drop multiple images or click to select</small>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleUploadFiles(e.target.files)}
            />
          </div>

          {/* Add via URL Form */}
          <form onSubmit={handleAddUrl} className="profile-url-add-form" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="url"
              placeholder="Or paste profile image URL here…"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              className="admin-input"
              style={{ flexGrow: 1 }}
            />
            <button type="submit" className="admin-btn primary" disabled={!newUrl.trim()}>
              <Plus size={14} /> Add Image URL
            </button>
          </form>

          {/* Photo Gallery Grid */}
          <div className="profile-photos-grid">
            {photosList.map((url, i) => {
              const isActive = url === activePhoto
              return (
                <div key={i} className={`profile-photo-card ${isActive ? 'active-photo' : ''}`}>
                  <div className="profile-photo-img-wrap">
                    <img 
                      src={url} 
                      alt={`Profile ${i + 1}`} 
                      className="profile-photo-img" 
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://pnvpjoekdwiifzsrxkrs.supabase.co/storage/v1/object/public/portfolio-assets/profile/rahul-profile.png'
                      }}
                    />
                    {isActive && (
                      <div className="active-photo-badge">
                        <CheckCircle size={10} /> ACTIVE
                      </div>
                    )}
                  </div>

                  <div className="profile-photo-card-actions">
                    {isActive ? (
                      <button type="button" className="admin-btn-sm active-indicator-btn" disabled style={{ flexGrow: 1, textAlign: 'center' }}>
                        Active Photo
                      </button>
                    ) : (
                      <button type="button" className="admin-btn-sm primary" onClick={() => handleSetActive(url)} style={{ flexGrow: 1 }}>
                        Set Active
                      </button>
                    )}
                    <button type="button" className="admin-btn-sm danger" onClick={() => handleDeletePhoto(url)} title="Delete Photo">
                      <Trash2 size={12} />
                    </button>
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
   MEDIA LIBRARY
────────────────────────────────────────────── */
function MediaLibrary() {
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
        {uploading ? <><span className="upload-spinner" /> Uploading files…</> : <><ImageIcon size={24} /><span>Drag &amp; drop files or click to upload</span><small>{isSupabaseReady ? '☁ Supabase CDN active' : '📎 Base64 fallback mode'}</small></>}
        <input ref={inputRef} type="file" multiple accept="image/*,application/pdf" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
      </div>
      <div className="media-grid">
        {mediaItems.map((item, i) => (
          <div key={i} className="media-thumb-card">
            {item.type?.startsWith('image') ? <img src={item.url} alt={item.name} className="media-thumb" /> : <div className="media-file-icon"><FileText size={28} /></div>}
            <div className="media-thumb-info">
              <span className="media-thumb-name">{item.name}</span>
              <div className="media-thumb-actions">
                <button type="button" className="admin-btn-sm" onClick={() => window.open(item.url, '_blank')}>Preview</button>
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

/* ─────────────────────────────────────────────
   DATA BACKUP
────────────────────────────────────────────── */
function DataBackup({ portfolioData, onRestore, onFactoryReset }) {
  const [importText, setImportText] = useState('')
  const [status, setStatus] = useState(null)

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
      <div className="backup-card">
        <h3><Download size={16} /> Export Data</h3>
        <p>Download all portfolio data as a JSON backup file.</p>
        <button type="button" className="admin-btn primary wide" onClick={exportJSON}><Download size={14} /> Export JSON Backup</button>
      </div>
      <div className="backup-card">
        <h3><Upload size={16} /> Import Data</h3>
        <p>Paste a previously exported JSON backup to restore all data.</p>
        <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="Paste your JSON backup here…" className="admin-textarea" rows={6} />
        <button type="button" className="admin-btn primary wide" onClick={importJSON} disabled={!importText}><Upload size={14} /> Import &amp; Restore</button>
      </div>
      <div className="backup-card danger-zone">
        <h3><RefreshCw size={16} /> Factory Reset</h3>
        <p>⚠️ This will delete all your customizations and restore default portfolio data. This cannot be undone.</p>
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

/* ─────────────────────────────────────────────
   SIDEBAR NAV CONFIG
────────────────────────────────────────────── */
const SIDEBAR_SECTIONS = [
  { group: 'Portfolio', items: [
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'certifications', label: 'Certifications', icon: CheckCircle },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy },
  ]},
  { group: 'Sections', items: [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ]},
  { group: 'System', items: [
    { id: 'profile', label: 'Profile & Resume', icon: User },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'backup', label: 'Data Backup', icon: Database },
  ]},
]

const SECTION_META = {
  projects:       { title: 'Projects', subtitle: 'Manage your featured portfolio projects' },
  certifications: { title: 'Certifications', subtitle: 'Edit credentials, skills, and certificate images' },
  hackathons:     { title: 'Hackathons & Competitions', subtitle: 'Update awards, photos, and press coverage' },
  timeline:       { title: 'Career Timeline', subtitle: 'Edit your experience timeline events' },
  blog:           { title: 'Blog & Insights', subtitle: 'Manage your technical blog posts' },
  faq:            { title: 'FAQ Accordion', subtitle: 'Edit recruiter Q&A pairs' },
  profile:        { title: 'Profile & Resume', subtitle: 'Edit contact info, avatar, and upload resume PDF' },
  media:          { title: 'Media Library', subtitle: 'Upload and manage all media assets' },
  backup:         { title: 'Data Backup', subtitle: 'Export, import, or reset all portfolio data' },
}

/* ─────────────────────────────────────────────
   MAIN ADMIN DASHBOARD MODAL
────────────────────────────────────────────── */
export function AdminDashboardModal({ onClose, portfolioData, onUpdate, onFactoryReset, theme, onToggleTheme }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('admin-unlocked') === 'true'
    } catch {
      return false
    }
  })
  const [activeSection, setActiveSection] = useState('projects')

  const handleUnlock = () => {
    setUnlocked(true)
    try {
      sessionStorage.setItem('admin-unlocked', 'true')
    } catch (e) {
      console.warn(e)
    }
  }

  const handleLockAndExit = (e) => {
    if (e) e.stopPropagation()
    try {
      sessionStorage.removeItem('admin-unlocked')
    } catch (err) {
      console.warn(err)
    }
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!unlocked) return <PasswordGate onUnlock={handleUnlock} onClose={onClose} />

  const meta = SECTION_META[activeSection]

  const countFor = (id) => {
    const map = {
      projects: portfolioData.projects?.length,
      certifications: portfolioData.certifications?.length,
      hackathons: portfolioData.hackathons?.length,
      timeline: portfolioData.timelineEvents?.length,
      blog: portfolioData.blogPosts?.length,
      faq: portfolioData.faqItems?.length,
    }
    return map[id]
  }

  const renderWorkspace = () => {
    switch (activeSection) {
      case 'projects':       return <ProjectsEditor data={portfolioData.projects || []} onChange={v => onUpdate('projects', v)} />
      case 'certifications': return <CertificationsEditor data={portfolioData.certifications || []} onChange={v => onUpdate('certifications', v)} />
      case 'hackathons':     return <HackathonsEditor data={portfolioData.hackathons || []} onChange={v => onUpdate('hackathons', v)} />
      case 'timeline':       return <TimelineEditor data={portfolioData.timelineEvents || []} onChange={v => onUpdate('timelineEvents', v)} />
      case 'blog':           return <BlogEditor data={portfolioData.blogPosts || []} onChange={v => onUpdate('blogPosts', v)} />
      case 'faq':            return <FAQEditor data={portfolioData.faqItems || []} onChange={v => onUpdate('faqItems', v)} />
      case 'profile':        return <ProfileEditor data={portfolioData.profileInfo || {}} onChange={v => onUpdate('profileInfo', v)} />
      case 'media':          return <MediaLibrary />
      case 'backup':         return <DataBackup portfolioData={portfolioData} onRestore={(d) => { Object.entries(d).forEach(([k, v]) => onUpdate(k, v)) }} onFactoryReset={onFactoryReset} />
      default:               return null
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
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
            <span className="admin-brand-icon">⚡</span>
            <div>
              <div className="admin-brand-title">Admin Panel</div>
              <div className="admin-brand-sub">Rahul Bariki Portfolio</div>
            </div>
          </div>

          <div className="admin-status-pill">
            <span className="admin-status-dot" />
            Portfolio is Live
          </div>

          <nav className="admin-nav">
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

          <button type="button" className="admin-lock-btn" onClick={handleLockAndExit}>
            <Lock size={14} />
            Lock &amp; Exit
          </button>
        </aside>

        {/* ── RIGHT WORKSPACE ── */}
        <div className="admin-workspace">
          <div className="admin-workspace-header">
            <div className="admin-workspace-title">
              <h2>{meta.title}</h2>
              <p>{meta.subtitle}</p>
            </div>
            <button 
              type="button" 
              className="admin-close-btn" 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }} 
              aria-label="Close admin panel"
            >
              <X size={18} />
            </button>
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
