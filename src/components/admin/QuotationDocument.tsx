'use client'

import Image from 'next/image'
import { useQuery } from 'convex/react'
import { differenceInCalendarDays } from 'date-fns'
import { Printer } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { isConvexConfigured } from '@/lib/convex-client'
import QuotationSectionBar from '@/components/admin/QuotationSectionBar'

function money(value?: number) {
  return value != null ? `$${value.toFixed(2)}` : '—'
}

function dayCount(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1
  return Math.max(differenceInCalendarDays(end, start) + 1, 1)
}

export default function QuotationDocument({ reservationId }: { reservationId: string }) {
  const reservation = useQuery(
    api.reservations.getForQuotation,
    isConvexConfigured ? { id: reservationId as Id<'reservations'> } : 'skip'
  )
  const template = useQuery(api.quotationTemplate.get, isConvexConfigured ? {} : 'skip')

  if (reservation === undefined || template === undefined) {
    return <p className="p-8 text-body text-slate">Loading…</p>
  }

  if (reservation === null) {
    return <p className="p-8 text-body text-error">Reservation not found.</p>
  }

  const days = dayCount(reservation.startDate, reservation.endDate)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <p className="text-small text-slate">Print preview — use your browser&rsquo;s print dialog to save as PDF.</p>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-connect-blue px-5 text-small font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Download PDF
        </button>
      </div>

      <article className="rounded-2xl border border-border bg-white p-8 text-ink shadow-card print:rounded-none print:border-none print:p-0 print:shadow-none sm:p-12">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <Image src="/images/pdf-logo.png" alt="Care Connect — Care That Comes to You" width={180} height={48} className="h-auto w-40" />
          <div className="text-right">
            <p className="font-headline text-h3 text-ink">Quotation</p>
            <p className="text-small text-slate">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </header>

        <section className="grid gap-6 border-b border-border py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate">Prepared for</p>
            <p className="mt-1 text-body font-medium text-ink">{reservation.clientName || 'Valued client'}</p>
            <p className="text-small text-slate">{reservation.clientEmail}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate">Prepared by</p>
            <p className="mt-1 text-body font-medium text-ink">Care Connect</p>
            <p className="text-small text-slate">{template?.contactEmail}</p>
          </div>
        </section>

        {template && (
          <>
            <section className="border-b border-border py-6">
              <h2 className="font-headline text-h3 text-ink">{template.introTitle}</h2>
              <div
                className="mt-3 text-body text-slate [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: template.introBody }}
              />
            </section>

            <section className="border-b border-border py-6">
              <h2 className="font-headline text-h3 text-ink">{template.staffTitle}</h2>
              <div
                className="mt-3 text-body text-slate [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: template.staffBody }}
              />
            </section>
          </>
        )}

        <section className="border-b border-border py-6">
          <h2 className="font-headline text-h3 text-ink">{reservation.serviceTitle}</h2>
          <div
            className="mt-3 text-body text-slate [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: reservation.serviceDescription }}
          />
          {reservation.serviceAssistance.length > 0 && (
            <ul className="mt-3 grid list-disc gap-1.5 pl-5 text-small text-ink sm:grid-cols-2">
              {reservation.serviceAssistance.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="py-6">
          <h2 className="font-headline text-h3 text-ink">Quote</h2>

          <div className="mt-4">
            <QuotationSectionBar>Service</QuotationSectionBar>
            <table className="w-full border-collapse text-small">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-slate">
                  <th className="py-2 pr-2">Service</th>
                  <th className="py-2 pr-2">Rate/Hr.</th>
                  <th className="py-2 pr-2">Days</th>
                  <th className="py-2 pr-2">Total Hours</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2.5 pr-2">{reservation.serviceTitle}</td>
                  <td className="py-2.5 pr-2">{money(reservation.ratePerHour)}</td>
                  <td className="py-2.5 pr-2">
                    {reservation.startDate} – {reservation.endDate}
                  </td>
                  <td className="py-2.5 pr-2">{reservation.totalHours ?? '—'}</td>
                  <td className="py-2.5 text-right">{money(reservation.serviceAmount)}</td>
                </tr>
                <tr className="border-b border-border text-slate">
                  <td className="py-2.5 pr-2">HST ({reservation.hst}%)</td>
                  <td className="py-2.5 pr-2" />
                  <td className="py-2.5 pr-2">{days} day{days === 1 ? '' : 's'}</td>
                  <td className="py-2.5 pr-2" />
                  <td className="py-2.5 text-right">{money(reservation.hstAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <QuotationSectionBar>Total</QuotationSectionBar>
            <div className="flex items-center justify-between py-3 text-body font-semibold text-ink">
              <span>Total Service Fee</span>
              <span>{money(reservation.total)}</span>
            </div>
          </div>
        </section>

        {template && (
          <footer className="border-t border-border pt-6 text-center text-small text-slate">
            <p className="font-medium text-ink">Care Connect — {template.footerNote}</p>
            <p className="mt-1">
              {template.contactEmail} · {template.contactPhone}
            </p>
            <p>{template.contactAddress}</p>
          </footer>
        )}
      </article>
    </div>
  )
}
