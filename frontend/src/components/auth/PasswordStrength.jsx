const strengthConfig = {
  0: { label: 'No password', tone: 'bg-slate-700', text: 'text-slate-300' },
  1: { label: 'Weak', tone: 'bg-rose-500', text: 'text-rose-300' },
  2: { label: 'Fair', tone: 'bg-amber-500', text: 'text-amber-300' },
  3: { label: 'Good', tone: 'bg-cyan-500', text: 'text-cyan-300' },
  4: { label: 'Strong', tone: 'bg-cyan-500', text: 'text-cyan-300' },
}

function PasswordStrength({ password }) {
  const score = password
    ? [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
      ].filter(Boolean).length
    : 0

  const config = strengthConfig[score] || strengthConfig[0]

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-300">
        <span>Password strength</span>
        <span className={config.text}>{config.label}</span>
      </div>

      <div className="flex gap-2">
        {[0, 1, 2, 3].map((step) => (
          <span
            key={step}
            className={`h-2 flex-1 rounded-full transition-all ${
              step < score ? config.tone : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default PasswordStrength
