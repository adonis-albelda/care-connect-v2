import Image from 'next/image'
import AuthShell from '@/components/AuthShell'

export const metadata = { title: 'Check your mail — Care Connect' }

export default function ResetPasswordEmailSentPage() {
  return (
    <AuthShell backHref="/login" backLabel="Back to login">
      <div className="text-center">
        <Image
          src="/images/check_your_email.png"
          alt=""
          width={110}
          height={110}
          className="mx-auto"
        />
        <h2 className="mt-6 font-headline text-h2 text-connect-blue">Check your mail!</h2>
        <p className="mt-3 text-body-lg text-slate">
          A link to reset your password has been sent to the email address you provided. Please check your inbox and follow the instructions.
        </p>
      </div>
    </AuthShell>
  )
}
