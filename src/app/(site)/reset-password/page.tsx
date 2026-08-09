import AuthShell from '@/components/AuthShell'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata = { title: 'Reset password — Care Connect' }

interface ResetPasswordPageProps {
  searchParams: Promise<{ code?: string; email?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { code, email } = await searchParams

  return (
    <AuthShell backHref="/" backLabel="Back to home">
      <ResetPasswordForm token={code} email={email} />
    </AuthShell>
  )
}
