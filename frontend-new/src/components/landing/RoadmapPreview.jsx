import { useEffect, useRef, useState } from 'react'
import { Check, Circle, Sparkles } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const roadmap = [
  {
    phase: '01',
    title: 'Collect Feedback',
    description: 'Import customer feedback, reviews, and support tickets into one workspace.',
    status: 'Completed',
  },
  {
    phase: '02',
    title: 'Understand Insights',
    description: 'AI extracts themes, pain points, feature requests, and customer sentiment.',
    status: 'In Progress',
  },
  {
    phase: '03',
    title: 'Prioritize Opportunities',
    description: 'Identify and rank the most important product opportunities using AI.',
    status: 'Upcoming',
  },
  {
    phase: '04',
    title: 'Generate Product Plans',
    description: 'Turn insights into structured PRDs, roadmaps, and actionable product plans.',
    status: 'Upcoming',
  },
]

const useInView = (ref, threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, threshold])

  return isInView
}

export default function RoadmapPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const { isDark } = useTheme()

  return (
    <section
      ref={ref}
      className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 ${
        isDark
          ? 'bg-slate-900/30'
          : 'bg-gradient-to-b from-white to-teal-50/30'
      }`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-300/50 bg-teal-50 text-teal-700 text-sm font-medium mb-6">
            <Sparkles size={16} />
            AI-Powered Roadmap
          </div>

          <h2
            className={`text-4xl sm:text-5xl font-bold tracking-tight mb-6 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            From Feedback to Product Roadmap
          </h2>

          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Transform scattered customer feedback into clear,
            actionable product priorities.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div
            className={`absolute left-6 top-8 bottom-8 w-px ${
              isDark ? 'bg-cyan-500/20' : 'bg-teal-200'
            }`}
          />

          <div className="space-y-8">
            {roadmap.map((item, index) => {
              const completed = item.status === 'Completed'
              const active = item.status === 'In Progress'

              return (
                <div
                  key={item.phase}
                  className={`relative flex gap-6 transition-all duration-700 ${
                    isInView
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: isInView
                      ? `${index * 150}ms`
                      : '0ms',
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`relative z-10 shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      completed
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : active
                        ? 'bg-cyan-500 border-cyan-500 text-white'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-500'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {completed ? (
                      <Check size={20} />
                    ) : active ? (
                      <Sparkles size={18} />
                    ) : (
                      <Circle size={16} />
                    )}
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 p-6 rounded-2xl border transition-all duration-300 ${
                      isDark
                        ? 'border-cyan-500/20 bg-slate-800/50 hover:border-cyan-400/40'
                        : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <span
                          className={`text-xs font-bold tracking-widest ${
                            isDark ? 'text-cyan-400' : 'text-teal-600'
                          }`}
                        >
                          PHASE {item.phase}
                        </span>

                        <h3
                          className={`text-xl font-semibold mt-1 ${
                            isDark ? 'text-slate-100' : 'text-slate-900'
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          completed
                            ? 'bg-teal-100 text-teal-700'
                            : active
                            ? 'bg-cyan-100 text-cyan-700'
                            : isDark
                            ? 'bg-slate-700 text-slate-300'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p
                      className={`leading-relaxed ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}