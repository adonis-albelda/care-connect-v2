'use client'

import Link from 'next/link'
import Reveal from '@/components/Reveal'
import Carousel from '@/components/Carousel'
import { useServicesQuery } from '@/hooks/useServicesQuery'

function ServiceCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full flex-none animate-pulse rounded-2xl border border-border bg-white p-6 shadow-card sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]"
    >
      <div className="h-48 w-full rounded-xl bg-border" />
      <div className="mt-5 h-6 w-3/4 rounded-md bg-border" />
      <div className="mt-3 h-4 w-full rounded-md bg-border" />
      <div className="mt-2 h-4 w-4/5 rounded-md bg-border" />
      <div className="mt-6 h-11 w-full rounded-xl bg-border" />
    </div>
  )
}

export default function ServicesSection() {
  const { data: services = [], isLoading } = useServicesQuery()

  return (
    <section className="bg-cloud px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-content">
        <Reveal as="h2" className="font-headline text-h1 text-connect-blue">
          Our Services
        </Reveal>
        <Reveal as="p" className="mt-3 max-w-[65ch] text-body-lg text-slate" delay={100}>
          Three ways we support your family, each tailored around the level of care that fits your situation.
        </Reveal>

        {isLoading ? (
          <div className="mt-10 flex flex-wrap gap-6">
            <span className="sr-only">Loading services…</span>
            {[0, 1, 2].map((i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : services.length ? (
          <div className="mt-10">
            <Carousel
              items={services}
              ariaLabel="Our services"
              renderItem={(service) => (
                <article className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-card transition-all duration-250 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="h-48 w-full overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.banner || '/images/icons/service-placeholder.svg'}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-250 hover:scale-105"
                    />
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-2">
                    <h3 className="font-headline text-h3 text-ink">{service.title}</h3>
                    {service.assistance?.length > 0 && (
                      <span className="flex-none rounded-full bg-blue-light px-2 py-0.5 text-small font-semibold text-connect-blue">
                        {service.assistance.length} activities
                      </span>
                    )}
                  </div>
                  <div
                    className="mt-2 flex-1 text-body text-slate"
                    dangerouslySetInnerHTML={{ __html: service.short_description }}
                  />
                  <Link
                    href={`/service-details?type=${service.slug}`}
                    className="mt-6 flex min-h-[44px] items-center justify-center rounded-xl bg-connect-blue px-5 text-body font-semibold text-white transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep"
                  >
                    Learn more
                  </Link>
                </article>
              )}
            />
          </div>
        ) : (
          <p className="mt-10 text-body-lg text-slate">
            We&rsquo;re updating our services list — check back in a moment, or reach out and we&rsquo;ll help directly.
          </p>
        )}
      </div>
    </section>
  )
}
