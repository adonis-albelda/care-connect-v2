'use client'

import ServiceSelect from '@/components/ServiceSelect'
import DateRangeField from '@/components/DateRangeField'
import TimeField from '@/components/TimeField'
import { useQuoteBooking } from '@/hooks/useQuoteBooking'
import { useServicesQuery } from '@/hooks/useServicesQuery'

export default function QuoteWidget() {
  const booking = useQuoteBooking()
  const { data: services = [] } = useServicesQuery()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        booking.submit()
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
        {booking.isRequesting ? 'Sending…' : 'Get A Quote'}
      </button>
    </form>
  )
}
