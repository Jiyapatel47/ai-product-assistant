import { useEffect, useRef, useState } from 'react'
import { Upload, Brain, Target, FileText, Map } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const steps = [
  { icon: Upload, label: 'Collect Feedback', description: 'Connect all feedback sources' },
  { icon: Brain, label: 'AI Understands Themes', description: 'Automatic categorization' },
  { icon: Target, label: 'Prioritize Opportunities', description: 'Data-driven ranking' },
  { icon: FileText, label: 'Generate PRDs', description: 'AI-written requirements' },
  { icon: Map, label: 'Plan Roadmap', description: 'Strategic timeline' },
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

export default function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const { isDark } = useTheme()

  return (
    <section id="how-it-works" ref={ref} className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-slate-900/30' : 'bg-gradient-to-b from-white via-purple-50/30 to-white'
    }`}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            How FEEDLYTIC Works
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            From raw feedback to actionable roadmaps in minutes, not weeks.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated line */}
          <div className={`absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 hidden lg:block ${
            isDark ? 'bg-gradient-to-r from-slate-700 via-cyan-500 to-slate-700' : 'bg-gradient-to-r from-slate-200 via-teal-300 to-slate-200'
          }`}>
            <div
              className={`h-full bg-gradient-to-r from-teal-600 to-cyan-500 rounded-full transition-all duration-1000 ease-out ${
                isInView ? 'w-full' : 'w-0'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className={`relative flex flex-col items-center transition-all duration-700 ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: isInView ? `${index * 150}ms` : '0ms' }}
                >
                  {/* Step number circle */}
                  <div className="mb-6 relative z-10">
                    <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20'
                        : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/20'
                    }`}>
                      <Icon className={`w-8 h-8 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-white text-xs font-semibold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>

                  {/* Step content */}
                  <h3 className={`text-lg font-semibold text-center mb-2 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {step.label}
                  </h3>
                  <p className={`text-sm text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {step.description}
                  </p>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className={`hidden lg:flex absolute top-1/2 -right-8 transform -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-300'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                  {index < steps.length - 1 && (
                    <div className={`lg:hidden mt-6 ${isDark ? 'text-slate-500' : 'text-slate-300'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
