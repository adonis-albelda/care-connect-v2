'use client'

import { useEffect, useRef } from 'react'
import DateRangeField from '@/components/DateRangeField'
import TimeField from '@/components/TimeField'
import { useQuoteBooking } from '@/hooks/useQuoteBooking'
import type { Service } from '@/lib/types'

interface BookingDrawerProps {
  open: boolean
  onClose: () => void
  service: Service | null
}

export default function BookingDrawer({ open, onClose, service }: BookingDrawerProps) {
  const booking = useQuoteBooking({ initialServiceId: service?.id ?? null })
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    booking.setServiceId(service?.id ?? null)
    panelRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, service])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-drawer-title"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-6 shadow-card-hover sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-h3 text-slate hover:bg-cloud"
        >
          ×
        </button>

        <h2 id="booking-drawer-title" className="font-headline text-h2 text-connect-blue">
          {service?.title || 'Request a quote'}
        </h2>
        {service?.short_description && (
          <p className="mt-2 text-body text-slate">{service.short_description}</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            booking.submit()
          }}
          className="mt-8 flex flex-col gap-6"
        >
          <div>
            <h3 className="font-headline text-h3 text-ink">Preferred dates</h3>
            <div className="mt-3">
              <DateRangeField value={booking.dateRange} onChange={booking.setDateRange} />
            </div>
          </div>

          <div>
            <h3 className="font-headline text-h3 text-ink">Preferred time</h3>
            <div className="mt-3 flex flex-col gap-3">
              <TimeField id="drawer-start-time" label="Start Time" value={booking.startTime} onChange={booking.setStartTime} />
              <TimeField id="drawer-end-time" label="End Time" value={booking.endTime} onChange={booking.setEndTime} />
            </div>
          </div>

          <p className="text-small text-mist">(GMT-05:00) Central Time (US & Canada)</p>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={booking.isRequesting}
              className="min-h-[48px] flex-1 rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {booking.isRequesting ? 'Sending…' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] rounded-xl px-6 text-body font-medium text-slate hover:bg-cloud"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
