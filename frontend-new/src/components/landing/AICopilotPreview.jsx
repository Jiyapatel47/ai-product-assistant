import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

const useInView = (ref, threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.unobserve(entry.target)
      }
    }, { threshold })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return isInView
}

const TypingAnimation = ({ text, isVisible, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('')
      return
    }

    const timer = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1))
          index++
        } else {
          clearInterval(interval)
        }
      }, 30)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [isVisible, text, delay])

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && <span className="animate-pulse">|</span>}
    </span>
  )
}

export default function AICopilorPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const { isDark } = useTheme()

  const aiResponse = "Based on your feedback data, I recommend prioritizing checkout optimization. We've identified 847 mentions of payment issues (9.2/10 impact), affecting 23% of users. I've generated a PRD and timeline that you can review. This could reduce churn by 3-5% based on industry benchmarks."

  return (
    <section ref={ref} className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-slate-900/30' : 'bg-linear-to-b from-purple-50/50 to-white'
    }`}>
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            AI Copilot
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Chat with your feedback data to get instant insights and recommendations.
          </p>
        </div>

        {/* Chat Interface */}
        <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-all duration-1000 ${
          isDark
            ? 'border-cyan-500/20 bg-slate-900 shadow-cyan-500/10'
            : 'border-slate-200 bg-white'
        } ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Chat Header */}
          <div className={`px-8 py-6 ${isDark ? 'bg-gradient-to-r from-cyan-600 to-teal-500' : 'bg-linear-to-r from-purple-600 to-purple-500'}`}>
            <h3 className="text-white font-semibold">FEEDLYTIC AI Assistant</h3>
            <p className={`text-sm ${isDark ? 'text-cyan-100' : 'text-purple-100'}`}>Online</p>
          </div>

          {/* Chat Messages */}
          <div className={`p-8 space-y-6 min-h-96 flex flex-col justify-end ${
            isDark ? 'bg-slate-950/80' : 'bg-linear-to-b from-white to-purple-50/30'
          }`}>
            {/* User Message */}
            <div className={`flex justify-end transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '0ms' }}>
              <div className="max-w-xs bg-gradient-to-br from-teal-600 to-cyan-500 text-white rounded-2xl px-6 py-4 shadow-lg">
                <p className="text-sm font-medium">What should we build next?</p>
              </div>
            </div>

            {/* AI Response */}
            <div className={`flex justify-start transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className={`max-w-xs rounded-2xl px-6 py-4 shadow-sm ${
                isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'
              }`}>
                <p className="text-sm leading-relaxed">
                  <TypingAnimation
                    text={aiResponse}
                    isVisible={isInView}
                    delay={500}
                  />
                </p>
                {isInView && <span className="inline-block ml-1 animate-pulse">|</span>}
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className={`px-8 py-6 border-t ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ask me anything about your feedback..."
                className={`flex-1 px-4 py-3 rounded-full border transition ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                }`}
              />
              <button className={`p-3 rounded-full bg-gradient-to-r ${
                isDark ? 'from-cyan-500 to-teal-500 hover:shadow-cyan-500/30' : 'from-purple-600 to-purple-500 hover:shadow-purple-500/30'
              } text-white hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
