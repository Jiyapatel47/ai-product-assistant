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

export default function FinalCTA({ onNavigate }) {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const { isDark } = useTheme()

  return (
    <section ref={ref} className={`relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br rounded-full blur-3xl animate-pulse ${
          isDark ? 'from-cyan-500/20 to-transparent opacity-0' : 'from-teal-400 to-transparent opacity-400'
        }`} style={{ animation: 'rotate-slow 20s linear infinite' }} />
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-bl rounded-full blur-3xl ${
          isDark ? 'from-teal-400/15 to-transparent opacity-0' : 'from-cyan-300 to-transparent opacity-300'
        }`} style={{ animation: 'rotate-slow 25s linear infinite reverse' }} />
      </div>

      <style>{`
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className={`transition-all duration-1000 ${
          isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          {/* Gradient Background */}
          <div className={`absolute -inset-8 rounded-3xl blur-2xl ${
            isDark
              ? 'bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-cyan-500/10'
              : 'bg-gradient-to-r from-teal-600/20 via-cyan-500/20 to-teal-600/20'
          }`} />

          {/* Content */}
          <div className={`relative rounded-3xl p-12 sm:p-16 shadow-2xl border ${
            isDark
              ? 'bg-gradient-to-br from-slate-800 via-slate-800/95 to-slate-900 border-cyan-500/20'
              : 'bg-gradient-to-br from-teal-600 via-cyan-500 to-teal-700 border-teal-400/30'
          }`}>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
              isDark ? 'text-slate-100' : 'text-white'
            }`}>
              Build products your customers actually want.
            </h2>

            <p className={`text-lg sm:text-xl mb-10 max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-purple-100'
            }`}>
              Turn feedback into strategy. Join hundreds of product teams using FEEDLYTIC to make smarter decisions, faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => onNavigate('auth')} className={`px-10 py-4 font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl text-lg ${
                isDark
                  ? 'bg-slate-200 text-slate-900 hover:bg-white'
                  : 'bg-white text-teal-600 hover:bg-teal-50'
              }`}>
                Explore FEEDLYTIC
              </button>
              <button className={`px-10 py-4 border-2 font-semibold rounded-full transition-all duration-300 hover:scale-105 text-lg ${
                isDark
                  ? 'border-slate-400 text-slate-200 hover:bg-white/10'
                  : 'border-white text-white hover:bg-white/10'
              }`}>
                Request Demo
              </button>
            </div>

            {/* Trust Badge */}
            <div className={`mt-12 pt-8 border-t flex items-center justify-center gap-6 flex-wrap ${
              isDark ? 'border-slate-700/50 text-slate-400' : 'border-purple-400/30 text-purple-100'
            }`}>
              <div className="text-sm font-medium">✓ 30-day free trial</div>
              <div className="text-sm font-medium">✓ No credit card required</div>
              <div className="text-sm font-medium">✓ Full feature access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
