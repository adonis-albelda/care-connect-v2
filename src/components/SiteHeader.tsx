'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import SiteUserMenu from '@/components/SiteUserMenu'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact us' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
    router.push('/login')
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow duration-250 ${
        scrolled ? 'bg-white/90 backdrop-blur shadow-card' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 rounded-md">
          <Image src="/images/logo.png" alt="Care Connect logo" width={40} height={40} priority />
          <span className="font-headline text-h3 text-connect-blue">Care Connect</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-body font-medium transition-colors duration-250 hover:text-connect-blue ${
                  active ? 'text-connect-blue' : 'text-slate'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/get-quote"
            className="flex min-h-[44px] items-center rounded-xl bg-connect-blue px-5 text-body font-semibold shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover"
          >
            <span className="gradient-shimmer-text">Get A Quote</span>
          </Link>
          {user ? (
            <SiteUserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <Link
              href="/login"
              className="min-h-[44px] content-center text-body font-medium text-connect-blue underline-offset-4 hover:underline"
            >
              Guest — Log in
            </Link>
          )}
        </div>

        <button
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`h-0.5 w-6 bg-ink transition-transform duration-250 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink transition-opacity duration-250 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink transition-transform duration-250 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-white px-4 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Primary mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex min-h-[44px] items-center rounded-lg px-2 text-body-lg font-medium text-ink hover:bg-cloud"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-border px-3 py-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-connect-blue to-blue-deep text-body font-semibold text-white">
                    {(user.first_name?.[0] ?? user.email[0] ?? '?').toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-body font-semibold text-ink">
                      {[user.first_name, user.last_name].filter(Boolean).join(' ') || user.email}
                    </p>
                    <p className="truncate text-small text-slate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="mt-1 flex min-h-[44px] items-center rounded-lg px-2 text-left text-body-lg font-medium text-error hover:bg-cloud"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu} className="flex min-h-[44px] items-center rounded-lg px-2 text-body-lg font-medium text-ink hover:bg-cloud">
                  Log in
                </Link>
                <Link href="/register" onClick={closeMenu} className="flex min-h-[44px] items-center rounded-lg px-2 text-body-lg font-medium text-ink hover:bg-cloud">
                  Sign up
                </Link>
              </>
            )}
            <Link
              href="/get-quote"
              onClick={closeMenu}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-xl bg-connect-blue hover:bg-blue-deep px-5 text-body font-semibold text-white shadow-card"
            >
              Get A Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
