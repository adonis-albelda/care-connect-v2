'use client'

import Link from 'next/link'
import ServiceDetailLayout from '@/components/ServiceDetailLayout'
import { useServiceQuery } from '@/hooks/useServiceQuery'

export default function ServiceDetailBooking({ slug }: { slug?: string }) {
  const { data: service, isLoading } = useServiceQuery(slug)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
        <p className="text-body-lg text-slate">Getting that service ready for you…</p>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
        <h1 className="font-headline text-h1 text-connect-blue">We couldn&rsquo;t find that service</h1>
        <p className="mt-3 text-body-lg text-slate">
          It may have moved — take a look at everything we offer instead.
        </p>
        <Link
          href="/services"
          className="mt-8 inline-flex min-h-[48px] items-center rounded-xl bg-connect-blue hover:bg-blue-deep px-8 text-body font-semibold text-white shadow-card"
        >
          View all services
        </Link>
      </div>
    )
  }

  return (
    <ServiceDetailLayout
      banner={service.banner || '/images/icons/service-placeholder.svg'}
      title={service.title}
      description={service.short_description}
      introLine={service.description}
      bullets={service.assistance}
      quoteHref={`/get-quote?service=${service.slug}`}
    />
  )
}
