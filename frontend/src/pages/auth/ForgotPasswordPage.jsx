import { useState } from 'react'
import AuthLayout from '../../components/auth/AuthLayout'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your work email and we’ll send a secure reset link."
      secondaryAction={
        <p>
          Remembered your password?{' '}
          <a href="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Back to sign in
          </a>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="forgot-email" className="mb-2 block text-sm font-medium text-slate-200">
            Work email
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="name@company.com"
            className="w-full rounded-2xl border border-cyan-200/10 bg-[#071b1f]/80 px-4 py-3 text-sm text-white placeholder:text-cyan-100/40 outline-none transition focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/10"
          />
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            A reset link has been sent to {email || 'your email'}.
          </div>
        ) : null}

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-cyan-500 via-sky-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(34,211,238,0.28)] transition hover:brightness-110"
        >
          Send reset link
        </button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
