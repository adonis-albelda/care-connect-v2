'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import FormField, { inputClass } from '@/components/FormField'
import PasswordField from '@/components/PasswordField'
import AuthLoadingOverlay from '@/components/auth/AuthLoadingOverlay'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/lib/toast-context'
import { useMinVisibleDuration } from '@/hooks/useMinVisibleDuration'
import type { RegisterPayload } from '@/lib/types'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const INITIAL: RegisterPayload = {
  first_name: '',
  last_name: '',
  phone_number: '',
  email: '',
  password: '',
  password_confirmation: '',
}

type FormErrors = Partial<Record<keyof RegisterPayload, string>>

export default function RegisterForm() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const { signUp, signInWithOAuth, loading: verifying } = useAuth()

  const [cameFromOAuth] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('code')
  )
  const showVerifying = useMinVisibleDuration(cameFromOAuth && verifying, 3000)

  const [user, setUser] = useState<RegisterPayload>(INITIAL)
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

  const update = (field: keyof RegisterPayload) => (value: string) => setUser((u) => ({ ...u, [field]: value }))

  const validate = () => {
    const next: FormErrors = {}
    if (!user.first_name || user.first_name.length < 2) next.first_name = 'Add your first name.'
    if (!user.email) next.email = 'Add your email address.'
    else if (!isValidEmail(user.email)) next.email = "That doesn't look like a full email — check for a typo."
    if (!user.password) next.password = 'Choose a password.'
    if (user.password_confirmation !== user.password) next.password_confirmation = "Those passwords don't match yet."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate() || isRequesting) return
    setIsRequesting(true)

    try {
      await signUp({
        firstName: user.first_name,
        lastName: user.last_name || undefined,
        phoneNumber: user.phone_number || undefined,
        email: user.email,
        password: user.password,
      })
      showSuccess("You're in! Welcome to Care Connect.")
      router.push('/')
    } catch {
      showError('That email is already registered, or something went wrong — try again.')
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div>
      {(showVerifying || isRequesting) && (
        <AuthLoadingOverlay
          title={isRequesting ? 'Creating your account' : 'Verifying your identity'}
          description={
            isRequesting
              ? 'Setting up your profile securely. This only takes a moment.'
              : 'Hold tight — we’re securely confirming your Care Connect account.'
          }
        />
      )}

      <h2 className="font-headline text-h2 text-connect-blue">Sign up to Care Connect</h2>
      <p className="mt-2 text-body text-slate">Create a new account</p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          disabled={!!oauthProvider}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-border bg-white transition-colors duration-250 hover:bg-cloud disabled:opacity-60"
        >
          <span className="sr-only">Sign up with Google</span>
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
          <span className="sr-only">Sign up with Facebook</span>
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
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="first_name" label="First name" required error={errors.first_name}>
            <input
              id="first_name"
              value={user.first_name}
              onChange={(e) => update('first_name')(e.target.value)}
              placeholder="Type first name"
              className={inputClass(!!errors.first_name)}
            />
          </FormField>
          <FormField id="last_name" label="Last name" error={errors.last_name}>
            <input
              id="last_name"
              value={user.last_name}
              onChange={(e) => update('last_name')(e.target.value)}
              placeholder="Type last name"
              className={inputClass(!!errors.last_name)}
            />
          </FormField>
        </div>

        <FormField id="phone_number" label="Phone number" error={errors.phone_number}>
          <input
            id="phone_number"
            type="tel"
            value={user.phone_number}
            onChange={(e) => update('phone_number')(e.target.value)}
            placeholder="Type phone number here"
            className={inputClass(!!errors.phone_number)}
          />
        </FormField>

        <FormField id="email" label="Email Address" required error={errors.email}>
          <input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => update('email')(e.target.value)}
            placeholder="Type email here"
            className={inputClass(!!errors.email)}
          />
        </FormField>

        <PasswordField id="password" label="Password" required value={user.password} onChange={update('password')} error={errors.password} placeholder="Password" />
        <PasswordField
          id="password_confirmation"
          label="Confirm Password"
          required
          value={user.password_confirmation}
          onChange={update('password_confirmation')}
          error={errors.password_confirmation}
          placeholder="Confirm Password"
        />

        <button
          type="submit"
          disabled={isRequesting}
          className="min-h-[48px] rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isRequesting ? 'Signing up…' : 'Sign up'}
        </button>

        <p className="text-center text-body text-slate">
          Already a member?{' '}
          <Link href="/login" className="font-medium text-connect-blue hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
