import { useEffect, useRef, useState } from 'react'
import { Zap, Filter, TrendingUp, BookOpen, Sparkles, MessageSquare } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const features = [
  {
    icon: Zap,
    title: 'AI Feedback Intelligence',
    description: 'Automatically process and understand feedback at scale using advanced NLP.',
  },
  {
    icon: Filter,
    title: 'Theme Extraction',
    description: 'AI identifies recurring themes, pain points, and feature requests automatically.',
  },
  {
    icon: TrendingUp,
    title: 'Pain Point Detection',
    description: 'Surface the exact customer problems impacting retention and revenue.',
  },
  {
    icon: BookOpen,
    title: 'AI Prioritization',
    description: 'Intelligent scoring algorithm ranks opportunities by impact and effort.',
  },
  {
    icon: Sparkles,
    title: 'PRD Generator',
    description: 'Generate complete, ready-to-edit product requirements in minutes.',
  },
  {
    icon: MessageSquare,
    title: 'AI Copilot',
    description: 'Chat with your feedback data to get instant insights and recommendations.',
  },
]

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

export default function FeaturesGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const { isDark } = useTheme()

  return (
    <section id="features" ref={ref} className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-slate-900/30' : 'bg-white'
    }`}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Powerful Features
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Everything you need to turn feedback into products your customers love.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border transition-all duration-500 hover:scale-105 ${
                  isDark
                    ? 'border-cyan-500/20 bg-slate-800/50 hover:border-cyan-400/50 hover:bg-slate-800/70 hover:shadow-xl hover:shadow-cyan-500/10'
                    : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-gradient-to-br hover:from-white hover:to-teal-50/30 hover:shadow-xl hover:shadow-teal-500/20'
                } ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
              >
                {/* Icon */}
                <div className={`mb-6 inline-block p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                  isDark
                    ? 'bg-cyan-500/20 group-hover:bg-gradient-to-br group-hover:from-cyan-500/30 group-hover:to-teal-500/20'
                    : 'bg-teal-100 group-hover:bg-gradient-to-br group-hover:from-teal-200 group-hover:to-teal-100'
                }`}>
                  <Icon className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                </div>

                {/* Content */}
                <h3 className={`text-xl font-semibold mb-3 transition-colors ${
                  isDark
                    ? 'text-slate-100 group-hover:text-cyan-400'
                    : 'text-slate-900 group-hover:text-teal-600'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {feature.description}
                </p>

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-br from-cyan-400/0 to-teal-400/0 group-hover:from-cyan-400/5 group-hover:to-teal-400/5'
                    : 'bg-gradient-to-br from-teal-600/0 to-cyan-500/0 group-hover:from-teal-600/5 group-hover:to-cyan-500/5'
                }`} />

                {/* Sparkle on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-2xl transition-opacity duration-300">
                  ✨
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
