'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAdminAuth } from '@/lib/admin-auth-context'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, loading, signInWithPassword, signInWithOAuth } = useAdminAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<'google' | 'facebook' | null>(null)

  useEffect(() => {
    if (!loading && user) router.replace('/admin')
  }, [loading, user, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isRequesting) return
    setError('')
    setIsRequesting(true)
    try {
      await signInWithPassword(email, password)
      router.replace('/admin')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setIsRequesting(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setOauthProvider(provider)
    try {
      await signInWithOAuth(provider)
    } catch {
      setError('That sign-in method is not available yet.')
      setOauthProvider(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image src="/images/login-logo.png" alt="Care Connect logo" width={48} height={48} />
          <h1 className="mt-4 font-headline text-h2 text-connect-blue">Admin sign in</h1>
          <p className="mt-2 text-body text-slate">Care Connect internal dashboard</p>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={!!oauthProvider}
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-border bg-white transition-colors duration-250 hover:bg-cloud disabled:opacity-60"
            >
              <span className="sr-only">Continue with Google</span>
              <Image src="/images/icons/google-icon.svg" alt="" width={20} height={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('facebook')}
              disabled={!!oauthProvider}
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-border bg-white transition-colors duration-250 hover:bg-cloud disabled:opacity-60"
            >
              <span className="sr-only">Continue with Facebook</span>
              <Image src="/images/icons/facebook-icon.svg" alt="" width={20} height={20} aria-hidden="true" />
            </button>
          </div>

          <div className="my-6 flex items-center gap-4 text-small text-mist">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-body font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@careconnect.local"
                className="mt-2 min-h-[48px] w-full rounded-xl border border-border bg-white px-4 text-body text-ink placeholder:text-mist"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-body font-medium text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 min-h-[48px] w-full rounded-xl border border-border bg-white px-4 text-body text-ink placeholder:text-mist"
              />
            </div>

            {error && (
              <p className="text-small text-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isRequesting}
              className="mt-2 flex min-h-[48px] items-center justify-center rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isRequesting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 rounded-lg bg-cloud px-3 py-2 text-small text-slate">
            Default account: <code className="text-ink">admin@careconnect.local</code> — set via
            <code className="text-ink"> npx convex run seed:run</code>. Change the password after first login.
          </p>
        </div>

        <p className="mt-8 text-center text-small text-mist">Built by Double A Digital Solution</p>
      </div>
    </div>
  )
}
