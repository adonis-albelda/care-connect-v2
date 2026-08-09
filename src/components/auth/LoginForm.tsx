'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import FormField, { inputClass } from '@/components/FormField'
import PasswordField from '@/components/PasswordField'
import AuthLoadingOverlay from '@/components/auth/AuthLoadingOverlay'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/lib/toast-context'
import { useMinVisibleDuration } from '@/hooks/useMinVisibleDuration'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginForm() {
  const router = useRouter()
  const { signInWithPassword, signInWithOAuth, loading: verifying } = useAuth()
  const { showSuccess, showError } = useToast()

  // A `code` param in the URL means we just landed back from the provider's
  // account picker — only then should the verifying overlay hold for 3s.
  // A plain page visit's brief initial session check shouldn't trigger it.
  const [cameFromOAuth] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('code')
  )
  const showVerifying = useMinVisibleDuration(cameFromOAuth && verifying, 3000)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isRequesting, setIsRequesting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<'google' | 'facebook' | null>(null)

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setOauthProvider(provider)
    try {
      await signInWithOAuth(provider)
    } catch {
      showError("That didn't go through — let's try that again.")
      setOauthProvider(null)
    }
  }

  const validate = () => {
    const next: FormErrors = {}
    if (!email) next.email = 'Add your email address to continue.'
    else if (!isValidEmail(email)) next.email = "That doesn't look like a full email — check for a typo."
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate() || isRequesting) return
    setIsRequesting(true)

    try {
      await signInWithPassword(email, password)
      showSuccess("You're in! Welcome back.")
      router.push('/')
    } catch {
      showError("We couldn't find that account — check your email and password.")
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div>
      {(showVerifying || isRequesting) && (
        <AuthLoadingOverlay
          title={isRequesting ? 'Logging in' : 'Verifying your identity'}
          description={
            isRequesting
              ? 'Matching your details securely. This only takes a moment.'
              : 'Hold tight — we’re securely confirming your Care Connect account.'
          }
        />
      )}

      <h2 className="font-headline text-h2 text-connect-blue">Welcome to Care Connect</h2>
      <p className="mt-2 text-body text-slate">Care That Comes to You</p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          disabled={!!oauthProvider}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-border bg-white transition-colors duration-250 hover:bg-cloud disabled:opacity-60"
        >
          <span className="sr-only">Continue with Google</span>
          {oauthProvider === 'google' ? (
            <Loader2 className="h-5 w-5 animate-spin text-connect-blue" aria-hidden="true" />
          ) : (
            <Image src="/images/icons/google-icon.svg" alt="" width={20} height={20} aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={() => handleOAuth('facebook')}
          disabled={!!oauthProvider}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-border bg-white transition-colors duration-250 hover:bg-cloud disabled:opacity-60"
        >
          <span className="sr-only">Continue with Facebook</span>
          {oauthProvider === 'facebook' ? (
            <Loader2 className="h-5 w-5 animate-spin text-connect-blue" aria-hidden="true" />
          ) : (
            <Image src="/images/icons/facebook-icon.svg" alt="" width={20} height={20} aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="my-6 flex items-center gap-4 text-small text-mist">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FormField id="email" label="Email Address" error={errors.email}>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass(!!errors.email)}
          />
        </FormField>

        <PasswordField id="password" label="Password" value={password} onChange={setPassword} error={errors.password} placeholder="Password" />

        <div className="flex items-center justify-between">
          <label className="flex min-h-[44px] items-center gap-2 text-body text-slate">
            <input type="checkbox" className="h-5 w-5 rounded border-border" />
            Remember me
          </label>
          <Link href="/forgot-password" className="min-h-[44px] content-center text-body font-medium text-connect-blue hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isRequesting}
          className="min-h-[48px] rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isRequesting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="text-center text-body text-slate">
          Don&rsquo;t have an account?{' '}
          <Link href="/register" className="font-medium text-connect-blue hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
