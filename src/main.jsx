import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Portfolio Fatal Render Error]', error, errorInfo)
  }

  handleReset = () => {
    try {
      ;['admin-profile','admin-projects','admin-hackathons','admin-certifications','admin-timeline','admin-blog','admin-faq'].forEach(k => localStorage.removeItem(k))
    } catch (e) {
      console.error(e)
    }
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07090f',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#a78bfa' }}>
            System Recovery Mode
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '420px', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
            A data loading anomaly occurred. Click below to reset local state and restore portfolio defaults.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reset Portfolio &amp; Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

