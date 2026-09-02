import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import AuthLayout from '../../components/auth/AuthLayout'
import LoginForm from '../../components/auth/LoginForm'
import RegisterForm from '../../components/auth/RegisterForm'
import SocialButton from '../../components/auth/SocialButton'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M21.6 12.23c0-.7-.06-1.38-.18-2.03H12v3.84h5.39a4.62 4.62 0 0 1-2 3.03v2.52h3.23c1.9-1.75 2.98-4.34 2.98-7.36Z" fill="#4285F4" />
      <path d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.23-2.52c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H.7v2.65A10 10 0 0 0 12 22Z" fill="#34A853" />
      <path d="M6.39 19.85A6 6 0 0 1 6 16.7V14.05H2.8a9.9 9.9 0 0 0 0 8.89L6.39 19.85Z" fill="#FBBC05" />
      <path d="M12 4.98c1.47 0 2.79.5 3.83 1.48l2.86-2.86A9.9 9.9 0 0 0 12 2a10 10 0 0 0-9.3 5.95l3.6 2.8A6 6 0 0 1 12 4.98Z" fill="#EA4335" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M12 .5A12 12 0 0 0 8.2 23.5c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.3-4-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 2.2-.9 2.7-1.4.1-.7.4-1.2.7-1.4-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1.1-.4 3.4 1.3a11.6 11.6 0 0 1 6.2 0c2.3-1.7 3.4-1.3 3.4-1.3.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.7-2.8 5.6-5.5 5.9.4.4.7 1 .7 2.1v3.1c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M3 3h8.5v8.5H3V3Zm9.5 0H21v8.5h-8.5V3ZM3 12.5h8.5V21H3v-8.5Zm9.5 0H21V21h-8.5v-8.5Z" fill="#F25022" />
    </svg>
  )
}

function LoginPage() {
  const [mode, setMode] = useState('login')
  const [socialStatus, setSocialStatus] = useState({ type: 'idle', provider: '' })
  const { isDark } = useTheme()

  const handleSocialAuth = async (provider) => {
    setSocialStatus({ type: 'loading', provider })

    try {
      if (mode === 'login') {
        await import('../../services/authService').then(({ login }) =>
          login({
            email: `${provider.toLowerCase()}-user@example.com`,
            password: 'social-auth',
            rememberMe: true,
            provider,
          }),
        )
      } else {
        await import('../../services/authService').then(({ register }) =>
          register({
            fullName: `${provider} User`,
            email: `${provider.toLowerCase()}-user@example.com`,
            password: 'social-auth',
            provider,
          }),
        )
      }

      setSocialStatus({ type: 'success', provider })
    } catch (error) {
      setSocialStatus({ type: 'error', provider })
    }
  }

  const socialButtons = (
    <div className="space-y-3">
      <SocialButton
        provider="Google"
        icon={<GoogleIcon />}
        label={socialStatus.provider === 'Google' && socialStatus.type === 'loading' ? 'Connecting' : 'Continue'}
        onClick={() => handleSocialAuth('Google')}
      />
      <SocialButton
        provider="GitHub"
        icon={<GitHubIcon />}
        label={socialStatus.provider === 'GitHub' && socialStatus.type === 'loading' ? 'Connecting' : 'Continue'}
        onClick={() => handleSocialAuth('GitHub')}
      />
      <SocialButton
        provider="Microsoft"
        icon={<MicrosoftIcon />}
        label={socialStatus.provider === 'Microsoft' && socialStatus.type === 'loading' ? 'Connecting' : 'Continue'}
        onClick={() => handleSocialAuth('Microsoft')}
      />
    </div>
  )

  return (
    <AuthLayout
      title={mode === 'login' ? 'Welcome back' : 'Create your workspace'}
      subtitle={
        mode === 'login'
          ? 'Sign in to continue to your FEEDLYTIC workspace.'
          : 'Get started with product insight workflows for your team.'
      }
      secondaryAction={
        <p>
          {mode === 'login' ? 'New to FEEDLYTIC?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className={isDark ? 'font-semibold text-cyan-300 transition hover:text-cyan-200' : 'font-semibold text-teal-600 transition hover:text-teal-500'}
          >
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </button>
        </p>
      }
    >
      <div className="overflow-hidden">
        <div className={isDark ? 'mb-6 flex gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-1' : 'mb-6 flex gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1'}>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
              mode === 'login'
                ? isDark ? 'bg-cyan-100 text-cyan-950 shadow-sm' : 'bg-teal-500 text-white shadow-sm'
                : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
              mode === 'register'
                ? isDark ? 'bg-cyan-100 text-cyan-950 shadow-sm' : 'bg-teal-500 text-white shadow-sm'
                : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        <div className="relative min-h-[540px] sm:min-h-[600px]">
          <div
            className={`w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mode === 'login'
                ? 'relative translate-y-0 opacity-100'
                : 'pointer-events-none absolute inset-0 translate-y-5 opacity-0 sm:translate-y-0 sm:-translate-x-6'
            }`}
          >
            <div className="space-y-5">
              {socialButtons}

              {socialStatus.type === 'success' ? (
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
                  {socialStatus.provider} account connected successfully.
                </div>
              ) : null}

              {socialStatus.type === 'error' ? (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {socialStatus.provider} authentication could not be completed.
                </div>
              ) : null}

              <div className="relative flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                <span className="h-px flex-1 bg-white/10" />
                <span>or</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <LoginForm />
            </div>
          </div>

          <div
            className={`w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mode === 'register'
                ? 'relative translate-y-0 opacity-100'
                : 'pointer-events-none absolute inset-0 translate-y-5 opacity-0 sm:translate-y-0 sm:translate-x-6'
            }`}
          >
            <div className="space-y-5">
              {socialButtons}

              {socialStatus.type === 'success' ? (
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
                  {socialStatus.provider} account connected successfully.
                </div>
              ) : null}

              {socialStatus.type === 'error' ? (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {socialStatus.provider} authentication could not be completed.
                </div>
              ) : null}

              <div className="relative flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                <span className="h-px flex-1 bg-white/10" />
                <span>or</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default LoginPage