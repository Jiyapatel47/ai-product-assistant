import AuthLayout from '../../components/auth/AuthLayout'
import RegisterForm from '../../components/auth/RegisterForm'

function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start turning customer feedback into actionable product strategy."
      secondaryAction={
        <p>
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Sign in
          </a>
        </p>
      }
    >
      <RegisterForm />
    </AuthLayout>
  )
}

export default RegisterPage
