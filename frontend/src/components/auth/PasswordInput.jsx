import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

function PasswordInput({ id, label, value, onChange, autoComplete, error, placeholder = 'Enter your password', name }) {
  const { isDark } = useTheme()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <label htmlFor={id} className={isDark ? 'mb-2 block text-sm font-medium text-slate-200' : 'mb-2 block text-sm font-medium text-slate-700'}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-2xl border px-4 py-3 pr-12 text-sm outline-none transition-all duration-200 ${
            isDark
              ? 'bg-[#071b1f]/80 text-white placeholder:text-cyan-100/40 border-cyan-200/10 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/10'
              : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10'
          } ${
            error ? 'border-rose-500/80 shadow-[0_0_0_3px_rgba(244,63,94,0.12)]' : ''
          }`}
        />

        <button
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((current) => !current)}
          className={isDark ? 'absolute inset-y-0 right-3 my-auto flex items-center rounded-lg px-2 text-xs font-medium text-cyan-100/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60' : 'absolute inset-y-0 right-3 my-auto flex items-center rounded-lg px-2 text-xs font-medium text-teal-700 transition hover:text-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs font-medium text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default PasswordInput
