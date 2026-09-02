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

const roadmapItems = {
  now: [
    { id: 1, title: 'Checkout Optimization', progress: 85, priority: 'High' },
    { id: 2, title: 'Payment Integration', progress: 60, priority: 'High' },
  ],
  next: [
    { id: 3, title: 'Mobile UX Redesign', progress: 40, priority: 'Medium' },
    { id: 4, title: 'Search Performance', progress: 25, priority: 'Medium' },
  ],
  later: [
    { id: 5, title: 'Analytics Dashboard', progress: 10, priority: 'Low' },
    { id: 6, title: 'API Expansion', progress: 5, priority: 'Low' },
  ],
}

export default function RoadmapPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const { isDark } = useTheme()

  return (
    <section ref={ref} className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-slate-900/30' : 'bg-white'
    }`}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Roadmap Preview
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            AI-powered strategic roadmap aligned with customer priorities.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Progress Line */}
          <div className={`absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 hidden lg:block ${
            isDark ? 'bg-slate-700' : 'bg-linear-to-r from-slate-200 to-slate-200'
          }`}>
            <div
              className={`h-full bg-linear-to-r from-teal-600 to-cyan-500 rounded-full transition-all duration-1000 ease-out ${
                isInView ? 'w-full' : 'w-0'
              }`}
            />
          </div>

          {/* Roadmap Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {Object.entries(roadmapItems).map(([phase, items], phaseIndex) => (
              <div key={phase}>
                {/* Phase Header */}
                <h3 className={`text-2xl font-bold text-center mb-8 transition-all duration-500 ${
                  isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                } ${isDark ? 'text-slate-100' : 'text-slate-900'}`} style={{ transitionDelay: isInView ? `${phaseIndex * 100}ms` : '0ms' }}>
                  {phase === 'now' ? 'NOW' : phase === 'next' ? 'NEXT' : 'LATER'}
                  <div className={`inline-block ml-2 px-3 py-1 text-sm font-medium rounded-full ${
                    phase === 'now' ? (isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-green-100 text-green-700') :
                    phase === 'next' ? (isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-blue-100 text-blue-700') :
                    (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700')
                  }`}>
                    {phase === 'now' ? '0-30d' : phase === 'next' ? '30-90d' : '90d+'}
                  </div>
                </h3>

                {/* Items */}
                <div className="space-y-4">
                  {items.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border-2 transition-all duration-700 hover:shadow-lg hover:scale-105 ${
                        phase === 'now'
                          ? isDark
                            ? 'border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-400 hover:bg-emerald-500/15'
                            : 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-400 hover:bg-emerald-50'
                          : phase === 'next'
                            ? isDark
                              ? 'border-cyan-500/30 bg-cyan-500/10 hover:border-cyan-400 hover:bg-cyan-500/15'
                              : 'border-cyan-200 bg-cyan-50/50 hover:border-cyan-400 hover:bg-cyan-50'
                            : isDark
                              ? 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
                              : 'border-slate-200 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50'
                      } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                      style={{
                        transitionDelay: isInView ? `${phaseIndex * 100 + itemIndex * 150}ms` : '0ms',
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.title}</h4>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          item.priority === 'High' ? (isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-red-100 text-red-700') :
                          item.priority === 'Medium' ? (isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700') :
                          (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700')
                        }`}>
                          {item.priority}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Progress</span>
                          <span className={`text-xs font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.progress}%</span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              phase === 'now' ? 'bg-emerald-500' :
                              phase === 'next' ? 'bg-cyan-500' :
                              'bg-slate-400'
                            }`}
                            style={{
                              width: isInView ? `${item.progress}%` : '0%',
                              transitionDelay: isInView ? `${phaseIndex * 100 + itemIndex * 150 + 300}ms` : '0ms',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
