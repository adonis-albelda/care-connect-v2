'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { useServicesQuery } from '@/hooks/useServicesQuery'
import type { Service } from '@/lib/types'

const ASSISTANCE_ICON_RULES: [RegExp, string][] = [
  [/bath|hygien|groom/i, '/images/icons/bathtub-icon.svg'],
  [/dress/i, '/images/icons/dress-icon.svg'],
  [/shop|errand|grocer/i, '/images/icons/shopping.svg'],
  [/health|medicat|medical|therap/i, '/images/icons/health.svg'],
  [/compan|social|support/i, '/images/icons/supportive.svg'],
  [/schedul|time|appointment/i, '/images/icons/stopwatch.svg'],
]

function iconFor(item: string) {
  const match = ASSISTANCE_ICON_RULES.find(([pattern]) => pattern.test(item))
  return match?.[1] ?? '/images/icons/info.svg'
}

const ASSISTANCE_LIMIT = 4

function ServiceRowSkeleton({ index }: { index: number }) {
  const imageOnRight = index % 2 === 1

  return (
    <div
      aria-hidden="true"
      className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card md:flex-row ${
        imageOnRight ? 'md:flex-row-reverse' : ''
      }`}
    >
      <div className="h-56 w-full flex-none animate-pulse bg-border md:h-auto md:w-2/5" />

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="h-6 w-2/3 animate-pulse rounded-md bg-border" />
        <div className="mt-3 h-4 w-full animate-pulse rounded-md bg-border" />
        <div className="mt-2 h-4 w-4/5 animate-pulse rounded-md bg-border" />

        <div className="mt-5 h-4 w-1/2 animate-pulse rounded-md bg-border" />
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: ASSISTANCE_LIMIT }, (_, i) => (
            <div key={i} className="h-7 w-24 animate-pulse rounded-full bg-border" />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="h-11 w-36 animate-pulse rounded-xl bg-border" />
          <div className="h-11 w-32 animate-pulse rounded-xl bg-border" />
        </div>
      </div>
    </div>
  )
}

function ServiceRow({
  service,
  index,
}: {
  service: Service
  index: number
}) {
  const [expanded, setExpanded] = useState(false)
  const [rotation, setRotation] = useState(0)
  const assistance = service.assistance ?? []
  const canRotate = !expanded && assistance.length > ASSISTANCE_LIMIT

  useEffect(() => {
    if (!canRotate) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setRotation((r) => (r + ASSISTANCE_LIMIT) % assistance.length)
    }, 4000)
    return () => clearInterval(id)
  }, [canRotate, assistance.length])

  const visibleAssistance = expanded
    ? assistance
    : Array.from({ length: Math.min(ASSISTANCE_LIMIT, assistance.length) }, (_, i) => assistance[(rotation + i) % assistance.length])
  const hiddenCount = assistance.length - Math.min(ASSISTANCE_LIMIT, assistance.length)
  const imageOnRight = index % 2 === 1

  return (
    <Reveal
      delay={index * 80}
      className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all duration-250 hover:shadow-card-hover md:flex-row ${
        imageOnRight ? 'md:flex-row-reverse' : ''
      }`}
    >
      <div className="relative h-56 w-full flex-none overflow-hidden md:h-auto md:w-2/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.banner || '/images/icons/service-placeholder.svg'}
          alt=""
          className="h-full w-full object-cover transition-transform duration-250 hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="font-headline text-h3 text-ink">{service.title}</h3>
        <p className="mt-2 text-body text-slate">{service.short_description}</p>

        {assistance.length > 0 && (
          <>
            <p className="mt-5 flex items-center gap-2 text-body font-medium text-ink">
              Includes assistance with day-to-day activities
              <span className="rounded-full bg-cloud px-2 py-0.5 text-small font-semibold text-slate">
                {assistance.length}
              </span>
            </p>
            <ul key={rotation} className="mt-3 flex flex-wrap gap-2">
              {visibleAssistance.map((item) => (
                <li
                  key={item}
                  className="toast-in flex items-center gap-1.5 rounded-full bg-blue-light py-1 pl-1.5 pr-3 text-small text-connect-blue"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={iconFor(item)} alt="" aria-hidden="true" className="h-4 w-4 flex-none" />
                  {item}
                </li>
              ))}
            </ul>
            {assistance.length > ASSISTANCE_LIMIT && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-3 self-start text-body font-medium text-connect-blue underline-offset-4 hover:underline"
              >
                {expanded ? 'Show less' : `View all activities (+${hiddenCount})`}
              </button>
            )}
          </>
        )}

        <p className="mt-4 text-body text-slate">
          We offer the option of live-in caregivers for short or long term placements.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={`/get-quote?service=${service.slug}`}
            className="flex min-h-[44px] items-center justify-center rounded-xl bg-connect-blue px-5 text-body font-semibold text-white transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep"
          >
            Get A Quote
          </Link>
          <Link
            href={`/service-details?type=${service.slug}`}
            className="flex min-h-[44px] items-center justify-center text-body font-medium text-connect-blue underline-offset-4 hover:underline"
          >
            See full details
          </Link>
        </div>
      </div>
    </Reveal>
  )
}

export default function ServicesBookList() {
  const { data: services = [], isLoading } = useServicesQuery()

  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <Reveal as="div" className="max-w-[65ch]">
        <h1 className="font-headline text-h1 text-connect-blue">Book a Service</h1>
        <p className="mt-3 text-body-lg text-slate">
          Every plan is built around your family&rsquo;s situation. Explore what&rsquo;s included below, then request a quote in minutes.
        </p>
      </Reveal>

      {isLoading ? (
        <div className="mt-10 flex flex-col gap-8">
          <span className="sr-only">Loading services…</span>
          {[0, 1, 2].map((i) => (
            <ServiceRowSkeleton key={i} index={i} />
          ))}
        </div>
      ) : services.length ? (
        <div className="mt-10 flex flex-col gap-8">
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-body-lg text-slate">
          We&rsquo;re updating our services list — check back in a moment, or reach out and we&rsquo;ll help directly.
        </p>
      )}
    </div>
  )
}
