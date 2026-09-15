import { useTheme } from '../../hooks/useTheme'
const featureCards = [
  '30,000+ feedback records analyzed',
  'AI-powered theme clustering',
  'Evidence-based product insights',
]

function AuthLayout({ children, title, subtitle, secondaryAction, showBrand = true }) {
  const { isDark } = useTheme()

  return (
    <main className={isDark ? 'min-h-screen bg-[#071a1d] text-slate-100' : 'min-h-screen bg-slate-100 text-slate-900'}>
      <div className="relative min-h-screen overflow-hidden">
        <div className={isDark ? 'absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(70,140,170,0.22),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(48,196,164,0.16),_transparent_30%)]' : 'absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.12),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.08),_transparent_30%)]'} />
        <div className={isDark ? 'absolute inset-0 bg-[linear-gradient(135deg,_rgba(11,20,28,0.85),_rgba(5,14,18,0.96))]' : 'absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(240,249,255,0.92))]'} />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className={isDark ? 'grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-cyan-200/10 bg-[#0b1d22]/80 shadow-[0_40px_120px_rgba(5,18,22,0.9)] backdrop-blur-2xl lg:grid-cols-[1.08fr_0.92fr]' : 'grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur-2xl lg:grid-cols-[1.08fr_0.92fr]'}>
            {showBrand ? (
              <section className="relative hidden overflow-hidden p-8 lg:flex lg:flex-col lg:justify-between">
                <div className={isDark ? 'absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-sky-500/10 to-emerald-500/10' : 'absolute inset-0 bg-gradient-to-br from-teal-100 via-cyan-50 to-emerald-50'} />
                <div className={isDark ? 'absolute -left-16 top-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl' : 'absolute -left-16 top-16 h-64 w-64 rounded-full bg-cyan-200/50 blur-3xl'} />
                <div className={isDark ? 'absolute bottom-12 right-10 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl' : 'absolute bottom-12 right-10 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl'} />

                <div className="relative z-10">
                  <div className={isDark ? 'inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-cyan-100 uppercase' : 'inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-teal-700 uppercase'}>
                    FEEDLYTIC
                  </div>

                  <h1 className={isDark ? 'mt-7 max-w-xl text-4xl font-semibold tracking-[-0.06em] text-white xl:text-5xl' : 'mt-7 max-w-xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 xl:text-5xl'}>
                    Customer feedback intelligence for teams that move fast.
                  </h1>

                  <p className={isDark ? 'mt-5 max-w-lg text-base text-slate-300' : 'mt-5 max-w-lg text-base text-slate-600'}>
                    Turn customer conversations into product decisions with live insight synthesis, workflow automation, and AI-powered prioritization.
                  </p>
                </div>

                <div className="relative z-10 mt-8 flex flex-col gap-4">
                  <div className={isDark ? 'rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl' : 'rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-md backdrop-blur-xl'}>
                    <div className={isDark ? 'mb-4 flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-slate-300' : 'mb-4 flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-slate-600'}>
                      <span>Insight Pulse</span>
                      <span className={isDark ? 'rounded-full bg-cyan-500/15 px-2 py-1 text-[10px] font-medium text-cyan-300' : 'rounded-full bg-teal-100 px-2 py-1 text-[10px] font-medium text-teal-700'}>+24.6%</span>
                    </div>
                    <div className="flex h-10 items-end gap-2">
                      {[34, 46, 52, 68, 74, 58, 88].map((height, index) => (
                        <span
                          key={height + index}
                          className={isDark ? 'w-full rounded-t-xl bg-gradient-to-t from-cyan-500 to-emerald-300' : 'w-full rounded-t-xl bg-gradient-to-t from-teal-500 to-cyan-400'}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {featureCards.map((card) => (
                      <div
                        key={card}
                        className={isDark ? 'rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl' : 'rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm'}
                      >
                        {card}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            <section className={isDark ? 'relative flex items-center justify-center bg-[#0b1a1d]/70 p-5 sm:p-6 lg:p-8' : 'relative flex items-center justify-center bg-slate-50/80 p-5 sm:p-6 lg:p-8'}>
              <div className="w-full max-w-md">
                <div className={isDark ? 'rounded-[28px] border border-cyan-200/10 bg-white/[0.03] p-5 shadow-[0_24px_80px_rgba(5,14,18,0.8)] backdrop-blur-2xl sm:p-7' : 'rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-7'}>
                  <div className="mb-6">
                    {title ? <h2 className={isDark ? 'text-3xl font-semibold tracking-[-0.04em] text-white' : 'text-3xl font-semibold tracking-[-0.04em] text-slate-900'}>{title}</h2> : null}
                    {subtitle ? <p className={isDark ? 'mt-2 text-sm text-slate-300' : 'mt-2 text-sm text-slate-600'}>{subtitle}</p> : null}
                  </div>

                  {children}

                  {secondaryAction ? (
                    <div className={isDark ? 'mt-6 border-t border-white/10 pt-5 text-center text-sm text-slate-300' : 'mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600'}>
                      {secondaryAction}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AuthLayout
