import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, AlertCircle, Zap } from 'lucide-react'
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

const AnimatedCounter = ({ target, isInView, delay = 0 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const timer = setTimeout(() => {
      const increment = target / 100
      const interval = setInterval(() => {
        setCount((prev) => (prev + increment < target ? prev + increment : target))
      }, 50)
      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [isInView, target, delay])

  return <span>{Math.round(count)}</span>
}

export default function ProductPreviewSection() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const { isDark } = useTheme()

  return (
    <section id="ai-copilot" ref={ref} className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-slate-900/30' : 'bg-gradient-to-b from-white to-purple-50/50'
    }`}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Dashboard Preview
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            See customer insights at a glance with our intelligent analytics dashboard.
          </p>
        </div>

        {/* Main Dashboard Container */}
        <div className={`rounded-3xl border backdrop-blur-xl p-8 sm:p-12 shadow-2xl transition-all duration-1000 ${
          isDark
            ? 'border-cyan-500/20 bg-slate-900/80 shadow-cyan-500/10'
            : 'border-slate-200 bg-white/80'
        } ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Feedback', value: 2847, icon: Users, color: 'purple' },
              { label: 'Themes Identified', value: 23, icon: Zap, color: 'blue' },
              { label: 'Pain Points', value: 8, icon: AlertCircle, color: 'red' },
              { label: 'Avg Priority', value: 87, icon: TrendingUp, color: 'green', suffix: '/100' },
            ].map((stat, index) => {
              const Icon = stat.icon
              const colorClasses = {
                purple: isDark ? 'from-slate-800 to-slate-800 text-teal-400' : 'from-teal-100 text-teal-600',
                blue: isDark ? 'from-slate-800 to-slate-800 text-cyan-400' : 'from-cyan-100 text-cyan-600',
                red: isDark ? 'from-slate-800 to-slate-800 text-rose-400' : 'from-red-100 text-red-600',
                green: isDark ? 'from-slate-800 to-slate-800 text-emerald-400' : 'from-emerald-100 text-emerald-600',
              }

              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border bg-gradient-to-br transition-all duration-500 hover:shadow-lg ${colorClasses[stat.color]} ${
                    isDark ? 'border-slate-700' : 'border-slate-200'
                  } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
                      <div className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        {isInView ? (
                          <>
                            <AnimatedCounter target={stat.value} isInView={isInView} delay={index * 100} />
                            {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                          </>
                        ) : (
                          '0'
                        )}
                      </div>
                    </div>
                    <Icon className="w-8 h-8 opacity-80" />
                  </div>
                  <div className={`w-full h-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-700/80' : 'bg-slate-200/50'}`}>
                    <div
                      className={`h-full bg-linear-to-r ${
                        stat.color === 'purple' ? 'from-teal-600 to-teal-500' :
                        stat.color === 'blue' ? 'from-cyan-600 to-cyan-500' :
                        stat.color === 'red' ? 'from-red-600 to-red-500' :
                        'from-emerald-600 to-emerald-500'
                      } rounded-full transition-all duration-1000`}
                      style={{ width: isInView ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback Trend Chart */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-700 ${
                isDark
                  ? 'border-slate-700 bg-slate-800/80'
                  : 'border-slate-200 bg-gradient-to-br from-slate-50 to-white'
              } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: isInView ? '400ms' : '0ms' }}
            >
              <h3 className={`font-semibold mb-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Feedback Trend</h3>
              <div className="h-40 flex items-end justify-around gap-2">
                {[40, 65, 55, 80, 72, 95, 88].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-lg bg-linear-to-t from-teal-500 to-cyan-500 transition-all duration-700"
                    style={{
                      height: isInView ? `${height}%` : '0%',
                      transitionDelay: isInView ? `${400 + i * 50}ms` : '0ms',
                    }}
                  />
                ))}
              </div>
              <p className={`text-xs mt-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Last 7 days</p>
            </div>

            {/* Theme Distribution */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-700 ${
                isDark
                  ? 'border-slate-700 bg-slate-800/80'
                  : 'border-slate-200 bg-gradient-to-br from-slate-50 to-white'
              } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: isInView ? '500ms' : '0ms' }}
            >
              <h3 className={`font-semibold mb-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Top Themes</h3>
              <div className="space-y-4">
                {[
                  { label: 'Performance', value: 35, color: 'purple' },
                  { label: 'Usability', value: 28, color: 'blue' },
                  { label: 'Features', value: 22, color: 'pink' },
                  { label: 'Integration', value: 15, color: 'green' },
                ].map((theme, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{theme.label}</span>
                      <span className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{theme.value}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                        theme.color === 'purple' ? 'bg-teal-600' :
                        theme.color === 'blue' ? 'bg-cyan-600' :
                        theme.color === 'pink' ? 'bg-pink-600' :
                        'bg-emerald-600'
                        }`}
                        style={{
                          width: isInView ? `${theme.value}%` : '0%',
                          transitionDelay: isInView ? `${500 + i * 100}ms` : '0ms',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Recommendation Card */}
          <div
            className={`mt-6 p-6 rounded-2xl border transition-all duration-700 ${
              isDark
                ? 'border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900'
                : 'border-teal-200/50 bg-gradient-to-br from-teal-50/80 to-white'
            } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: isInView ? '600ms' : '0ms' }}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">🤖</div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>AI Recommendation</h4>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Based on 847 feedback items and customer sentiment analysis, we recommend prioritizing <span className="font-semibold text-teal-600">Performance Optimization</span> for your Q2 roadmap. This addresses the #1 customer pain point and has high business impact.
                </p>
              </div>
              <div className="text-2xl animate-pulse">✨</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
