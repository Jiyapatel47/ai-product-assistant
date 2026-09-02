import { useMemo, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import PasswordInput from './PasswordInput'
import PasswordStrength from './PasswordStrength'
import { register } from '../../services/authService'

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
}

const validateRegister = ({ fullName, email, password, confirmPassword, terms }) => {
  const nextErrors = {}

  if (!fullName.trim()) {
    nextErrors.fullName = 'Full name is required.'
  }

  if (!email.trim()) {
    nextErrors.email = 'Work email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    nextErrors.email = 'Enter a valid work email.'
  }

  if (!password) {
    nextErrors.password = 'Password is required.'
  } else if (password.length < 8) {
    nextErrors.password = 'Password must be at least 8 characters.'
  }

  if (!confirmPassword) {
    nextErrors.confirmPassword = 'Please confirm your password.'
  } else if (confirmPassword !== password) {
    nextErrors.confirmPassword = 'Passwords do not match.'
  }

  if (!terms) {
    nextErrors.terms = 'You must accept the terms to continue.'
  }

  return nextErrors
}

function RegisterForm() {
  const { isDark } = useTheme()
  const [form, setForm] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const isValid = useMemo(() => {
    const nextErrors = validateRegister(form)
    return Object.keys(nextErrors).length === 0
  }, [form])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateRegister(form)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      })

      setStatus('success')
      setErrors({})
    } catch (error) {
      setStatus('error')
      setErrors({ submit: 'Unable to create your account. Please try again.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="register-name" className={isDark ? 'mb-2 block text-sm font-medium text-slate-200' : 'mb-2 block text-sm font-medium text-slate-700'}>
          Full name
        </label>
        <input
          id="register-name"
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={handleChange}
          autoComplete="name"
          placeholder="Alex Morgan"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? 'register-name-error' : undefined}
          className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${
            isDark
              ? 'bg-[#071b1f]/80 text-white placeholder:text-cyan-100/40 border-cyan-200/10 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/10'
              : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10'
          } ${
            errors.fullName ? 'border-rose-500/80 shadow-[0_0_0_3px_rgba(244,63,94,0.12)]' : ''
          } `}
        />
        {errors.fullName ? (
          <p id="register-name-error" className="mt-2 text-xs font-medium text-rose-300">
            {errors.fullName}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="register-email" className={isDark ? 'mb-2 block text-sm font-medium text-slate-200' : 'mb-2 block text-sm font-medium text-slate-700'}>
          Work email
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="name@company.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
          className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${
            isDark
              ? 'bg-[#071b1f]/80 text-white placeholder:text-cyan-100/40 border-cyan-200/10 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/10'
              : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10'
          } ${
            errors.email ? 'border-rose-500/80 shadow-[0_0_0_3px_rgba(244,63,94,0.12)]' : ''
          }`}
        />
        {errors.email ? (
          <p id="register-email-error" className="mt-2 text-xs font-medium text-rose-300">
            {errors.email}
          </p>
        ) : null}
      </div>

      <PasswordInput
        id="register-password"
        name="password"
        label="Password"
        value={form.password}
        onChange={handleChange}
        autoComplete="new-password"
        error={errors.password}
      />

      {form.password ? <PasswordStrength password={form.password} /> : null}

      <PasswordInput
        id="register-confirm-password"
        name="confirmPassword"
        label="Confirm password"
        value={form.confirmPassword}
        onChange={handleChange}
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <label className={isDark ? 'flex items-start gap-3 text-sm text-slate-300' : 'flex items-start gap-3 text-sm text-slate-600'}>
        <input
          name="terms"
          type="checkbox"
          checked={form.terms}
          onChange={handleChange}
          className={isDark ? 'mt-1 h-4 w-4 rounded border-cyan-200/20 bg-[#071b1f] text-cyan-500 focus:ring-cyan-500' : 'mt-1 h-4 w-4 rounded border-slate-300 bg-white text-teal-600 focus:ring-teal-500'}
        />
        <span>
          I agree to the{' '}
          <a href="/terms" className={isDark ? 'font-medium text-cyan-300 hover:text-cyan-200' : 'font-medium text-teal-600 hover:text-teal-500'}>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className={isDark ? 'font-medium text-cyan-300 hover:text-cyan-200' : 'font-medium text-teal-600 hover:text-teal-500'}>
            Privacy Policy
          </a>
        </span>
      </label>
      {errors.terms ? (
        <p className="text-xs font-medium text-rose-300">{errors.terms}</p>
      ) : null}

      {status === 'success' ? (
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
          Account created successfully. Welcome to FEEDLYTIC.
        </div>
      ) : null}

      {status === 'error' && errors.submit ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {errors.submit}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === 'loading' || !isValid}
        className={isDark ? 'flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(34,211,238,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50' : 'flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(13,148,136,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50'}
      >
        {status === 'loading' ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}

export default RegisterForm
