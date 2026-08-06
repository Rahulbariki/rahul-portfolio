import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    console.warn('[ErrorBoundary Catch]', error)
    return { hasError: false }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[Portfolio Exception Handled]', error, errorInfo)
  }

  render() {
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

