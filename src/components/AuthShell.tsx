'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import { useServicesQuery } from '@/hooks/useServicesQuery'

const SOCIAL = [
  { href: 'https://facebook.com', icon: '/images/icons/facebook.svg', label: 'Care Connect on Facebook' },
  { href: 'https://twitter.com', icon: '/images/icons/twitter.svg', label: '@careconnectca on Twitter' },
  { href: 'https://instagram.com', icon: '/images/icons/instagram.svg', label: 'Care Connect on Instagram' },
]

const ROTATE_MS = 5000

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function ServiceHighlight() {
  const { data: services = [] } = useServicesQuery()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (services.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % services.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [services.length])

  if (!services.length) {
    return (
      <div>
        <h1 className="font-headline text-display leading-[1.1]">Care That Comes to You</h1>
        <p className="mt-4 max-w-[40ch] text-body-lg text-blue-light">
          Log in to book, track, and manage care for the people you love.
        </p>
      </div>
    )
  }

  const service = services[index % services.length]
  const activityCount = service.assistance?.length ?? 0

  return (
    <div>
      <p className="text-body font-medium uppercase tracking-wide text-blue-light">Why families choose us</p>
      <div key={service.id} className="toast-in mt-4">
        <h1 className="font-headline text-h1 leading-[1.15]">{service.title}</h1>
        <p className="mt-3 max-w-[42ch] text-body-lg text-blue-light">{stripHtml(service.short_description)}</p>
        {activityCount > 0 && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-small font-semibold">
            {activityCount} activities included
          </p>
        )}
      </div>
      {services.length > 1 && (
        <div className="mt-6 flex gap-2" role="tablist" aria-label="Service highlights">
          {services.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${s.title}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-8 rounded-full transition-colors duration-250 ${
                i === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AuthShell({
  children,
}: {
  children: ReactNode
  backHref?: string
  backLabel?: string
}) {
  return (
    <div className="grid min-h-[calc(100vh-64px)] bg-white lg:grid-cols-2">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="auth-wave-divider" clipPathUnits="objectBoundingBox">
            <path
              d="M0,0 L1,0
                 C1,0.15 0.85,0.25 0.85,0.4
                 C0.85,0.55 0.93,0.65 0.9,1
                 L0,1 Z"
            />
          </clipPath>
        </defs>
      </svg>

      <div
        className="relative z-10 hidden flex-col justify-between bg-cover bg-center p-12 text-white lg:-mr-16 lg:flex"
        style={{
          backgroundImage: "url('/images/hero-img.webp')",
          clipPath: 'url(#auth-wave-divider)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(15,36,97,0.85) 0%, rgba(24,56,145,0.7) 100%)' }}
          aria-hidden="true"
        />
        <div className="relative mt-16">
          <ServiceHighlight />
        </div>
        <div className="relative flex items-center gap-3">
          {SOCIAL.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition-colors duration-250 hover:bg-white/20"
            >
              <span className="sr-only">{s.label}</span>
              <Image src={s.icon} alt="" width={18} height={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col bg-white px-4 py-8 sm:px-10">
        <div className="mt-2 flex items-center justify-between lg:hidden">
          <Link href="/">
            <Image src="/images/login-logo.png" alt="Care Connect logo" width={40} height={40} />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-8">
          <Reveal className="w-full max-w-md">{children}</Reveal>
        </div>

        <p className="text-center text-small text-mist lg:text-right">
          Copyright © {new Date().getFullYear()} Care Connect — All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
