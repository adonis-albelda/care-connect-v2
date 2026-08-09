import AuthShell from '@/components/AuthShell'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = { title: 'Log in — Care Connect' }

export default function LoginPage() {
  return (
    <AuthShell backHref="/" backLabel="Back to home">
      <LoginForm />
    </AuthShell>
  )
}
