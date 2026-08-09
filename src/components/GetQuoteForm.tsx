'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { differenceInCalendarDays } from 'date-fns'
import TimeField from '@/components/TimeField'
import { useQuoteBooking } from '@/hooks/useQuoteBooking'
import { useServicesQuery } from '@/hooks/useServicesQuery'
import { useAuth } from '@/lib/auth-context'
import type { DateRangeValue } from '@/lib/types'
import type { Service } from '@/lib/types'

interface GetQuoteFormProps {
  preselectServiceSlug: string | null
}

function formatRange(range?: DateRangeValue) {
  if (!range?.from) return 'Not selected yet'
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  if (!range.to || range.to.getTime() === range.from.getTime()) {
    return range.from.toLocaleDateString('en-US', opts)
  }
  return `${range.from.toLocaleDateString('en-US', opts)} – ${range.to.toLocaleDateString('en-US', opts)}`
}

function formatTime(t: { hour: string; minutes: string; period: string }) {
  return `${t.hour}:${t.minutes} ${t.period}`
}

function dayCount(range?: DateRangeValue) {
  if (!range?.from || !range?.to) return null
  return differenceInCalendarDays(range.to, range.from) + 1
}

function ServiceCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex animate-pulse gap-4 rounded-xl border border-border bg-white p-4">
      <div className="h-16 w-16 flex-none rounded-lg bg-border" />
      <div className="flex-1">
        <div className="h-5 w-2/3 rounded-md bg-border" />
        <div className="mt-2 h-4 w-full rounded-md bg-border" />
      </div>
    </div>
  )
}

export default function GetQuoteForm({ preselectServiceSlug }: GetQuoteFormProps) {
  const booking = useQuoteBooking()
  const { data: services = [], isLoading } = useServicesQuery()
  const { user } = useAuth()

  useEffect(() => {
    if (!preselectServiceSlug || !services.length) return
    const match = services.find((s) => s.slug === preselectServiceSlug)
    if (match) booking.setServiceId(match.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectServiceSlug, services])

  const selectedService = services.find((s) => s.id === booking.serviceId) as Service | undefined

  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <h1 className="mt-4 font-headline text-h1 text-connect-blue">Get a Quote</h1>
      <p className="mt-3 max-w-[65ch] text-body-lg text-slate">
        Pick a service, your dates, and a time — we&rsquo;ll follow up with a quote built around your family&rsquo;s situation.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          booking.submit()
        }}
        className="mt-10 grid gap-10 lg:grid-cols-3"
      >
        <div className="flex flex-col gap-10 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-headline text-h3 text-ink">1. Service</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {isLoading ? (
                <>
                  <ServiceCardSkeleton />
                  <ServiceCardSkeleton />
                  <ServiceCardSkeleton />
                </>
              ) : services.length ? (
                services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => booking.setServiceId(service.id)}
                    aria-pressed={booking.serviceId === service.id}
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-250 ${
                      booking.serviceId === service.id
                        ? 'border-connect-blue bg-blue-light shadow-card'
                        : 'border-border bg-white hover:-translate-y-0.5 hover:bg-cloud hover:shadow-card'
                    }`}
                  >
                    <div className="h-16 w-16 flex-none overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.banner || '/images/icons/service-placeholder.svg'}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-headline text-body-lg font-semibold text-ink">{service.title}</h3>
                      <p className="mt-1 line-clamp-2 text-small text-slate">{service.short_description}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-body text-slate sm:col-span-2">
                  We&rsquo;re updating our services list — reach out and we&rsquo;ll help directly.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-headline text-h3 text-ink">2. Dates</h2>
              {dayCount(booking.dateRange) != null && (
                <span className="rounded-full bg-blue-light px-3 py-1 text-small font-semibold text-connect-blue">
                  {dayCount(booking.dateRange)} day{dayCount(booking.dateRange) === 1 ? '' : 's'} selected
                </span>
              )}
            </div>
            <p className="mt-1 text-body text-slate">Select a start and end date. For a single day, select the same date twice.</p>
            <div className="mt-4">
              <DayPicker
                className="cc-daypicker cc-daypicker-full"
                mode="range"
                selected={booking.dateRange}
                onSelect={booking.setDateRange}
                numberOfMonths={1}
                disabled={{ before: new Date() }}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-headline text-h3 text-ink">3. Time</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <TimeField id="quote-start-time" label="Start Time" value={booking.startTime} onChange={booking.setStartTime} />
              <TimeField id="quote-end-time" label="End Time" value={booking.endTime} onChange={booking.setEndTime} />
            </div>
            <p className="mt-3 text-small text-mist">(GMT-05:00) Central Time (US &amp; Canada)</p>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-card-hover lg:sticky lg:top-24">
            <h2 className="font-headline text-h3 text-ink">Your request</h2>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex-none overflow-hidden rounded-lg bg-cloud">
                {selectedService?.banner && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedService.banner} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <p className="text-small font-medium text-slate">Service</p>
                <p className="text-body font-medium text-ink">{selectedService?.title ?? 'Not selected yet'}</p>
              </div>
            </div>

            <div>
              <p className="text-small font-medium text-slate">Dates</p>
              <p className="text-body font-medium text-ink">
                {formatRange(booking.dateRange)}
                {dayCount(booking.dateRange) != null && (
                  <span className="text-slate"> · {dayCount(booking.dateRange)} day{dayCount(booking.dateRange) === 1 ? '' : 's'}</span>
                )}
              </p>
            </div>

            <div>
              <p className="text-small font-medium text-slate">Time</p>
              <p className="text-body font-medium text-ink">
                {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
              </p>
            </div>

            {!user && (
              <p className="rounded-lg bg-cloud px-3 py-2 text-small text-slate">
                You&rsquo;ll be asked to log in before we send this request.
              </p>
            )}

            <button
              type="submit"
              disabled={booking.isRequesting}
              className="mt-2 flex min-h-[48px] items-center justify-center rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {booking.isRequesting ? 'Sending…' : 'Get A Quote'}
            </button>
            <Link
              href="/"
              className="flex min-h-[44px] items-center justify-center rounded-xl text-body font-medium text-slate hover:bg-cloud"
            >
              Cancel
            </Link>
          </div>
        </aside>
      </form>
    </div>
  )
}
