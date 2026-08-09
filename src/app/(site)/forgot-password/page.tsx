import AuthShell from '@/components/AuthShell'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export const metadata = { title: 'Forgot password — Care Connect' }

export default function ForgotPasswordPage() {
  return (
    <AuthShell backHref="/login" backLabel="Back to login">
      <ForgotPasswordForm />
    </AuthShell>
  )
}
