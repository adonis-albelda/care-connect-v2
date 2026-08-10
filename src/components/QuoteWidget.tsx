'use client'

import { useEffect, useState } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import ServiceSelect from '@/components/ServiceSelect'
import DateRangeField from '@/components/DateRangeField'
import TimeField from '@/components/TimeField'
import QuoteConfirmDialog from '@/components/QuoteConfirmDialog'
import { useQuoteBooking } from '@/hooks/useQuoteBooking'
import { useServicesQuery } from '@/hooks/useServicesQuery'
import { useAuth } from '@/lib/auth-context'
import type { DateRangeValue, TimeValue } from '@/lib/types'

function formatRange(range?: DateRangeValue) {
  if (!range?.from) return 'Not selected yet'
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  if (!range.to || range.to.getTime() === range.from.getTime()) {
    return range.from.toLocaleDateString('en-US', opts)
  }
  return `${range.from.toLocaleDateString('en-US', opts)} – ${range.to.toLocaleDateString('en-US', opts)}`
}

function formatTime(t: TimeValue) {
  return `${t.hour}:${t.minutes} ${t.period}`
}

function dayCount(range?: DateRangeValue) {
  if (!range?.from || !range?.to) return null
  return differenceInCalendarDays(range.to, range.from) + 1
}

export default function QuoteWidget() {
  const booking = useQuoteBooking()
  const { data: services = [] } = useServicesQuery()
  const { user } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const selectedService = services.find((s) => s.id === booking.serviceId)
  const days = dayCount(booking.dateRange)

  useEffect(() => {
    if (!booking.autoConfirm) return
    const id = setTimeout(() => {
      setConfirmOpen(true)
      booking.clearAutoConfirm()
    }, 0)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.autoConfirm])

  const handleConfirm = async () => {
    const success = await booking.submit()
    if (success) {
      setConfirmOpen(false)
      booking.reset()
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (booking.validate()) setConfirmOpen(true)
        }}
        className="mx-auto flex w-full max-w-content flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-card-hover sm:p-8 lg:flex-row lg:items-end"
      >
        <ServiceSelect services={services} value={booking.serviceId} onChange={booking.setServiceId} />
        <DateRangeField value={booking.dateRange} onChange={booking.setDateRange} />
        <TimeField id="start-time" label="Start Time" value={booking.startTime} onChange={booking.setStartTime} />
        <TimeField id="end-time" label="End Time" value={booking.endTime} onChange={booking.setEndTime} />
        <button
          type="submit"
          disabled={booking.isRequesting}
          className="min-h-[48px] flex-none rounded-xl bg-connect-blue px-8 text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          Get A Quote
        </button>
      </form>

      <QuoteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirm}
        isSubmitting={booking.isRequesting}
        serviceTitle={selectedService?.title ?? 'Not selected yet'}
        serviceImage={selectedService?.banner}
        dateRangeLabel={formatRange(booking.dateRange)}
        dayCountLabel={days != null ? `${days} day${days === 1 ? '' : 's'}` : null}
        timeLabel={`${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`}
        email={user?.email}
      />
    </>
  )
}
