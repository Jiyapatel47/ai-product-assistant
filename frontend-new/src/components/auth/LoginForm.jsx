import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { login } from '../../services/authService'

function LoginForm({ onSuccess }) {
  const { isDark } = useTheme()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await login(email, password)

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="space-y-2">
        <label
          htmlFor="email"
          className={
            isDark
              ? 'block text-sm font-medium text-slate-200'
              : 'block text-sm font-medium text-slate-700'
          }
        >
          Work email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@company.com"
          required
          className={
            isDark
              ? 'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20'
              : 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20'
          }
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className={
            isDark
              ? 'block text-sm font-medium text-slate-200'
              : 'block text-sm font-medium text-slate-700'
          }
        >
          Password
        </label>

        <div
          className={
            isDark
              ? 'flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2.5 transition focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/20'
              : 'flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-500/20'
          }
        >
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            className={
              isDark
                ? 'w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none'
                : 'w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none'
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className={
              isDark
                ? 'shrink-0 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-200 transition hover:border-cyan-400/40 hover:bg-cyan-500/10'
                : 'shrink-0 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-700 transition hover:border-teal-300 hover:bg-teal-50'
            }
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label
          className={
            isDark
              ? 'flex items-center gap-2 text-sm text-slate-300'
              : 'flex items-center gap-2 text-sm text-slate-600'
          }
        >
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className={
              isDark
                ? 'h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-400 focus:ring-cyan-500'
                : 'h-4 w-4 rounded border-slate-300 bg-white text-teal-600 focus:ring-teal-500'
            }
          />
          Remember me
        </label>

        <button
          type="button"
          className={
            isDark
              ? 'text-sm font-medium text-cyan-300 transition hover:text-cyan-200'
              : 'text-sm font-medium text-teal-600 transition hover:text-teal-500'
          }
        >
          Forgot password?
        </button>
      </div>

      {error && (
        <div
          className={
            isDark
              ? 'rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300'
              : 'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'
          }
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={
          isDark
            ? 'w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-cyan-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60'
            : 'w-full rounded-2xl bg-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60'
        }
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

    </form>
  )
}

export default LoginForm