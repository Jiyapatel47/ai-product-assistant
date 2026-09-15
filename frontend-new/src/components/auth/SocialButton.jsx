import { useTheme } from '../../hooks/useTheme'

function SocialButton({ provider, icon, onClick, label = 'Continue', disabled = false }) {
  const { isDark } = useTheme()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${provider} ${label.toLowerCase()}`}
      className={isDark ? 'flex w-full items-center justify-between rounded-2xl border border-cyan-200/10 bg-[#071b1f]/80 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-[#0d1f25] disabled:cursor-not-allowed disabled:opacity-60' : 'flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60'}
    >
      <span className="flex items-center gap-3">
        <span className={isDark ? 'flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/80' : 'flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100'}>{icon}</span>
        <span>{provider}</span>
      </span>

      <span className={isDark ? 'rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200' : 'rounded-full border border-teal-200 bg-teal-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700'}>
        {label}
      </span>
    </button>
  )
}

export default SocialButton
