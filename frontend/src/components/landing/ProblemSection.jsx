import { useEffect, useRef, useState } from 'react'
import { Activity, TrendingDown, Zap, Clock } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const problems = [
  {
    icon: Activity,
    title: 'Scattered Feedback',
    description: 'Feedback spread across emails, support tickets, reviews, and analytics—impossible to see the full picture.',
  },
  {
    icon: TrendingDown,
    title: 'Manual Analysis',
    description: 'Hours spent reading and categorizing feedback manually, prone to human bias and inconsistency.',
  },
  {
    icon: Zap,
    title: 'Unclear Priorities',
    description: 'Without data-driven insights, prioritizing features becomes guesswork rather than strategy.',
  },
  {
    icon: Clock,
    title: 'Slow Product Planning',
    description: 'Writing PRDs and roadmaps from scratch takes weeks - time teams don\'t have.',
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

export default function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const { isDark } = useTheme()

  return (
    <section id="use-cases" ref={ref} className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-slate-900/50' : 'bg-white'
    }`}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Your customers already tell you what to build.{' '}
            <span className={`bg-linear-to-r ${
              isDark ? 'from-cyan-400 to-teal-400' : 'from-teal-600 to-cyan-500'
            } bg-clip-text text-transparent`}>
              FEEDLYTIC finds the signal.
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Traditional product management leaves money and insights on the table. Here's why.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${
                  isDark
                    ? 'border-cyan-500/20 bg-slate-800/50 shadow-sm hover:shadow-xl hover:border-cyan-400/50'
                    : 'border-slate-200/50 bg-white/80 shadow-sm hover:shadow-xl hover:border-teal-300/50'
                } ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
              >
                <div className={`mb-4 inline-block p-3 rounded-xl bg-linear-to-br transition-colors duration-300 ${
                  isDark
                    ? 'from-cyan-500/30 to-teal-500/20 group-hover:from-cyan-500/40 group-hover:to-teal-500/30'
                    : 'from-teal-100 to-teal-50 group-hover:from-teal-200 group-hover:to-teal-100'
                }`}>
                  <Icon className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                </div>

                <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{problem.title}</h3>
                <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{problem.description}</p>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  isDark
                    ? 'bg-linear-to-br from-cyan-400/0 to-teal-400/0 group-hover:from-cyan-400/5 group-hover:to-teal-400/5'
                    : 'bg-linear-to-br from-teal-600/0 to-cyan-500/0 group-hover:from-teal-600/5 group-hover:to-cyan-500/5'
                }`} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
