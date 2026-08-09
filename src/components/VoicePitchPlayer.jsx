import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles, FastForward, Info } from 'lucide-react'

const PITCH_SCRIPT = `Hi there! I am Rahul Bariki, a Generative AI and AI Automation Developer specializing in AI agents, Computer Vision, and full-stack systems engineering. I co-engineered IntelliAttend, an automated attendance platform using facial recognition, and won 1st Runner Up at the GenAI Forge Hackathon organized by NASSCOM and SmartBridge. Feel free to explore my interactive AI copilot, system architecture visualizers, and verified credentials!`

export function VoicePitchPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [showScript, setShowScript] = useState(false)
  const [supported, setSupported] = useState(true)
  const synthRef = useRef(null)
  const utterRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    } else {
      setSupported(false)
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const handlePlay = () => {
    if (!supported || !synthRef.current) return

    if (isPaused) {
      synthRef.current.resume()
      setIsPlaying(true)
      setIsPaused(false)
      return
    }

    synthRef.current.cancel() // stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(PITCH_SCRIPT)
    utterance.rate = speed
    utterance.pitch = 0.9 // Deeper natural male voice resonance

    // Prioritize Male English voices across OS platforms (Windows, macOS, Android, iOS)
    const voices = synthRef.current.getVoices()
    const maleVoiceNames = ['David', 'Mark', 'George', 'Daniel', 'Alex', 'Fred', 'Guy', 'Ryan', 'Christopher', 'Eric', 'Male', 'James', 'Oliver', 'Rishi', 'Google US English Male', 'Google UK English Male']
    
    const maleVoice = voices.find(v => 
      v.lang.startsWith('en') && maleVoiceNames.some(m => v.name.includes(m))
    ) || voices.find(v => 
      v.lang.startsWith('en') && !v.name.includes('Zira') && !v.name.includes('Hazel') && !v.name.includes('Susan') && !v.name.includes('Samantha') && !v.name.includes('Victoria') && !v.name.includes('Female')
    ) || voices.find(v => v.lang.startsWith('en'))

    if (maleVoice) utterance.voice = maleVoice

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterRef.current = utterance
    synthRef.current.speak(utterance)
    setIsPlaying(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause()
      setIsPlaying(false)
      setIsPaused(true)
    }
  }

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsPlaying(false)
      setIsPaused(false)
    }
  }

  const toggleSpeed = () => {
    const nextSpeed = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1
    setSpeed(nextSpeed)
    if (isPlaying) {
      handleStop()
      setTimeout(handlePlay, 100)
    }
  }

  if (!supported) return null

  return (
    <div className="voice-pitch-container">
      <div className="voice-pitch-bar">
        {/* Play/Pause Button */}
        <button
          type="button"
          className={`voice-play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={isPlaying ? handlePause : handlePlay}
          aria-label={isPlaying ? 'Pause Voice Pitch' : 'Play 60-second AI Voice Pitch'}
          title={isPlaying ? 'Pause Elevator Pitch' : 'Listen to Rahul\'s 60s AI Elevator Pitch'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="play-icon-offset" />}
          <span>{isPlaying ? 'Pause Pitch' : isPaused ? 'Resume Pitch' : 'AI Voice Pitch (60s)'}</span>
        </button>

        {/* Animated Spectrum Waveform Equalizer */}
        <div className={`voice-waveform ${isPlaying ? 'active' : ''}`}>
          <span className="wave-bar bar-1" />
          <span className="wave-bar bar-2" />
          <span className="wave-bar bar-3" />
          <span className="wave-bar bar-4" />
          <span className="wave-bar bar-5" />
          <span className="wave-bar bar-6" />
          <span className="wave-bar bar-7" />
        </div>

        {/* Speed Toggle */}
        <button
          type="button"
          className="voice-speed-btn"
          onClick={toggleSpeed}
          title="Change Playback Speed"
        >
          <FastForward size={12} />
          <span>{speed}x</span>
        </button>

        {/* Reset / Replay */}
        {(isPlaying || isPaused) && (
          <button
            type="button"
            className="voice-reset-btn"
            onClick={handleStop}
            title="Stop & Reset Audio"
          >
            <RotateCcw size={12} />
          </button>
        )}

        {/* Info Script Toggle */}
        <button
          type="button"
          className={`voice-script-btn ${showScript ? 'active' : ''}`}
          onClick={() => setShowScript(!showScript)}
          title="Toggle Pitch Script Transcript"
        >
          <Info size={13} />
        </button>
      </div>

      {/* Transcript Drawer */}
      <AnimatePresence>
        {showScript && (
          <motion.div
            className="voice-transcript-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="transcript-header">
              <Sparkles size={12} /> <span>AI ELEVATOR PITCH SCRIPT</span>
            </div>
            <p className="transcript-text">"{PITCH_SCRIPT}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
