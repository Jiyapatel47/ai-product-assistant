import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

const dataSources = [
  'Customer Feedback',
  'Reviews',
  'Support Tickets',
  'Product Analytics',
  'Feature Requests',
  'Meeting Notes',
]

export default function TrustedSourcesStrip() {
  const [isPaused, setIsPaused] = useState(false)
  const { isDark } = useTheme()

  return (
    <section className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-slate-900/30' : 'bg-linear-to-b from-white to-purple-50/50'
    }`}>
      <div className="mx-auto max-w-7xl">
        <p className={`text-center text-sm font-semibold uppercase tracking-widest mb-8 ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Connect Your Data
        </p>

        <div className="relative overflow-hidden" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee {
              animation: marquee 30s linear infinite;
            }
            .marquee.paused {
              animation-play-state: paused;
            }
          `}</style>

          <div className={`marquee flex gap-4 ${isPaused ? 'paused' : ''}`}>
            {[...dataSources, ...dataSources].map((source, index) => (
              <div
                key={index}
                className={`shrink-0 px-6 py-3 border rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                {source}
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </section>
  )
}
