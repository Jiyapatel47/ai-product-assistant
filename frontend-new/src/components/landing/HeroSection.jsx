import { useState, useEffect } from 'react'
import useMousePosition from "../../hooks/useMousePosition";
import { useTheme } from '../../hooks/useTheme'

const feedbackExamples = [
  { id: 1, text: 'Checkout payment failed.', color: 'from-red-500' },
  { id: 2, text: 'Please add Apple Pay.', color: 'from-blue-500' },
  { id: 3, text: 'Search feels slow.', color: 'from-amber-500' },
]

const themes = ['Checkout', 'Payments', 'Mobile UX', 'Search']

export default function HeroSection({ onNavigate }) {
  const [phase, setPhase] = useState(0)
  const [priority, setPriority] = useState(0)
  const [showInsight, setShowInsight] = useState(false)
  const mousePosition = useMousePosition()
  const { isDark } = useTheme()

  useEffect(() => {
    const phases = [0, 1, 2, 3, 4, 5]
    let currentPhase = 0

    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % phases.length
      setPhase(phases[currentPhase])

      if (phases[currentPhase] === 3) {
        setPriority(0)
        const priorityInterval = setInterval(() => {
          setPriority((prev) => (prev < 92 ? prev + 2 : 92))
        }, 30)
        return () => clearInterval(priorityInterval)
      }

      if (phases[currentPhase] === 4) {
        setShowInsight(false)
        setTimeout(() => setShowInsight(true), 500)
      }

      if (phases[currentPhase] === 5) {
        setTimeout(() => {}, 3000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const parallaxStyle = {
    transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
  }

  return (
    <section id="product" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 px-4 sm:px-6 lg:px-8">
    
    {/* Full Hero Background - No White Strips */}
<div className="absolute inset-0 pointer-events-none overflow-hidden">
  {/* Base dark gradient (same as middle theme) */}
<div
  className={`absolute inset-0 ${
    isDark
      ? "bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_60%,#020617_100%)]"
      : "bg-[radial-gradient(circle_at_center,#ffffff_0%,#f8fafc_55%,#ecfeff_100%)]"
  }`}
/>

{/* Left glow */}
<div
  className={`absolute -left-40 top-20 w-[500px] h-[500px] rounded-full blur-[120px] ${
    isDark ? "bg-cyan-500/20" : "bg-teal-300/20"
  }`}
/>

{/* Right glow */}
<div
  className={`absolute -right-40 top-32 w-[500px] h-[500px] rounded-full blur-[120px] ${
    isDark ? "bg-teal-400/20" : "bg-cyan-300/20"
  }`}
/>

  {/* Bottom glow */}
  <div
    className={`absolute left-1/2 -translate-x-1/2 bottom-[-180px] w-[700px] h-[400px] rounded-full blur-[140px] ${
      isDark ? "bg-blue-500/10" : "bg-cyan-200/20"
    }`}
  />
</div>

      {/* Animated Grid */}
      <div className={`absolute inset-0 pointer-events-none ${isDark ? 'opacity-5' : 'opacity-10'}`}>
        <svg className="w-full h-full" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full opacity-60 ${
              isDark ? 'bg-cyan-400' : 'bg-purple-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Headline */}
        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight animate-fade-in ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          Turn Customer Feedback Into{' '}
          <span className={`bg-gradient-to-r ${
            isDark ? 'from-cyan-400 via-teal-400 to-cyan-400' : 'from-teal-600 via-cyan-500 to-teal-600'
          } bg-clip-text text-transparent`}>
            Smarter Product Decisions
          </span>
        </h1>

        {/* Subheadline */}
        <p className={`text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`} style={{ animationDelay: '0.2s' }}>
          AI-powered workspace that analyzes customer feedback, identifies pain points, prioritizes features, generates PRDs and helps teams build better products.
        </p>

        {/* Workflow Progress */}
        <div className={`mb-12 inline-block px-6 py-3 border rounded-full text-sm font-medium animate-fade-in ${
          isDark
            ? 'bg-slate-800/50 border-cyan-500/30 text-cyan-300'
            : 'bg-teal-50 border-teal-200 text-teal-700'
        }`} style={{ animationDelay: '0.4s' }}>
          <span className={`bg-gradient-to-r ${
            isDark ? 'from-cyan-400 to-teal-400' : 'from-teal-600 to-cyan-500'
          } bg-clip-text text-transparent`}>
            Feedback → Insights → Priorities → PRDs → Roadmaps
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button onClick={() => onNavigate('auth')} className={`px-8 py-4 bg-gradient-to-r font-semibold rounded-full transition-all duration-300 hover:scale-105 text-lg ${
            isDark
              ? 'from-cyan-500 to-teal-400 text-slate-900 hover:shadow-xl hover:shadow-cyan-500/30'
              : 'from-teal-600 to-cyan-500 text-white hover:shadow-xl hover:shadow-teal-500/30'
          }`}>
            Explore FEEDLYTIC
          </button>
          <button className={`px-8 py-4 border-2 font-semibold rounded-full transition-all duration-300 text-lg ${
            isDark
              ? 'border-cyan-500/50 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10'
              : 'border-slate-300 text-slate-900 hover:border-teal-500 hover:bg-teal-50'
          }`}>
            Watch Demo
          </button>
        </div>
      </div>

      {/* Animated AI Workflow */}
      <div className="relative z-10 w-full max-w-2xl h-96 mb-12" style={parallaxStyle}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Phase 1: Feedback Cards */}
          {(phase === 0 || phase === 1) && (
            <div className="absolute inset-0 flex items-center justify-center">
              {feedbackExamples.map((feedback, index) => (
                <div
                  key={feedback.id}
                  className={`absolute px-4 py-3 border rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-1000 ${
                    isDark
                      ? 'bg-slate-800/90 border-cyan-500/30 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-700'
                  } ${
                    phase === 1 ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{
                    transform: phase === 1 ? `translate(-50%, -50%) scale(0.8)` : `translate(calc(-50% + ${Math.cos(index * 2.1) * 100}px), calc(-50% + ${Math.sin(index * 2.1) * 100}px))`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <p className="text-sm font-medium">{feedback.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Phase 2: AI Orb */}
          {(phase === 1 || phase === 2) && (
            <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-500">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 blur-2xl opacity-50 animate-pulse" style={{ animation: 'pulse-scale 2s ease-in-out infinite' }} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-medium text-center px-4">
                  {phase === 2 ? 'Analyzing...' : 'Analyzing Feedback...'}
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: Theme Extraction */}
          {(phase === 2 || phase === 3) && (
            <div className="absolute inset-0 flex items-center justify-center flex-wrap gap-3 content-center justify-center">
              {themes.map((theme, index) => (
                <div
                  key={theme}
                  className={`px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-50 border border-teal-300 rounded-full text-sm font-medium text-teal-700 transition-all duration-500 ${
                    phase === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {theme}
                </div>
              ))}
            </div>
          )}

          {/* Phase 4: Priority Score */}
          {(phase === 3 || phase === 4) && (
            <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-500">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="55" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="60"
                      cy="60"
                      r="55"
                      fill="none"
                      stroke="url(#gradientCircle)"
                      strokeWidth="8"
                      strokeDasharray={`${(priority / 100) * 345} 345`}
                      strokeLinecap="round"
                      className="transition-all duration-200"
                    />
                    <defs>
                      <linearGradient id="gradientCircle" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0d9488" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-teal-600">{Math.round(priority)}</div>
                      <div className="text-xs text-slate-500">/100</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-600">Priority Score</p>
              </div>
            </div>
          )}

          {/* Phase 5: AI Insight */}
          {(phase === 4 || phase === 5) && (
            <div
              className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-500 ${
                showInsight ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-white/80 backdrop-blur-xl border border-teal-200/50 rounded-2xl p-6 shadow-xl max-w-md">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white text-lg">
                      ✨
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      AI identified <span className="text-teal-600 font-semibold">Checkout Reliability</span> as the highest customer pain point.
                    </p>
                    <p className="text-xs text-slate-500 mt-2">Mentioned in 847 feedback items • Impact score: 9.2/10</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center gap-2 animate-bounce">
        <div className="text-sm font-medium text-slate-500">Scroll to explore</div>
        <svg className="w-6 h-6 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
