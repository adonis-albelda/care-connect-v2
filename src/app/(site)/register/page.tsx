import AuthShell from '@/components/AuthShell'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = { title: 'Sign up — Care Connect' }

export default function RegisterPage() {
  return (
    <AuthShell backHref="/" backLabel="Back to home">
      <RegisterForm />
    </AuthShell>
  )
}
