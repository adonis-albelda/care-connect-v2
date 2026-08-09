'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import FormField, { inputClass } from '@/components/FormField'
import { api, ApiError } from '@/lib/api'
import { useToast } from '@/lib/toast-context'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ForgotPasswordForm() {
  const router = useRouter()
  const { showError } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !isValidEmail(email)) {
      setError("That doesn't look like a full email — check for a typo.")
      return
    }
    if (isRequesting) return
    setIsRequesting(true)

    try {
      await api.post('password/send-link', { email })
      router.push('/reset-password-email-sent')
    } catch (err) {
      const message = err instanceof ApiError ? (err.response.data as { message?: string })?.message : undefined
      showError(message || "That didn't go through — let's try that again.")
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-light">
        <Image src="/images/icons/mail.svg" alt="" width={22} height={22} aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-headline text-h2 text-connect-blue">Forgot password?</h2>
      <p className="mt-2 text-body text-slate">
        Enter the email associated with your account and we&rsquo;ll send an email with instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <FormField id="email" label="Email Address" error={error}>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="@mail.com"
            className={inputClass(!!error)}
          />
        </FormField>

        <button
          type="submit"
          disabled={isRequesting}
          className="min-h-[48px] rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isRequesting ? 'Sending…' : 'Send instructions'}
        </button>
        <Link
          href="/"
          className="flex min-h-[48px] items-center justify-center rounded-xl text-body font-medium text-slate hover:bg-cloud"
        >
          Cancel
        </Link>
      </form>
    </div>
  )
}
