'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { useQuery } from 'convex/react'
import { differenceInCalendarDays } from 'date-fns'
import { Mail, MapPin, Phone, Printer } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { isConvexConfigured } from '@/lib/convex-client'
import QuotationSectionBar from '@/components/admin/QuotationSectionBar'
import QuotationSocialRow from '@/components/admin/QuotationSocialRow'

function money(value?: number) {
  return value != null ? `$${value.toFixed(2)}` : '—'
}

function dayCount(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1
  return Math.max(differenceInCalendarDays(end, start) + 1, 1)
}

export interface QuotationPricing {
  ratePerHour: number
  hst: string
  hstAmount: number
  serviceAmount: number
  total: number
  totalHours: number
  totalDays: number
}

interface QuotationDocumentProps {
  reservationId: string
  // Unsaved draft numbers from SendQuoteDrawer, before the admin actually
  // sends the quote — lets "Preview quotation" show exactly what the client
  // will get without writing to the reservation first.
  pricingOverride?: QuotationPricing
  hideActions?: boolean
}

// One physical page — quotation.pdf is a multi-page letter-size document,
// not a single continuous article, so each section here is its own page
// with page-break-after for print instead of one long scroll.
function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`mx-auto mb-6 flex w-full max-w-[8.5in] flex-col bg-white p-10 text-ink shadow-card break-after-page last:mb-0 print:mb-0 print:max-w-none print:p-12 print:shadow-none sm:p-12 ${className}`}
      style={{ minHeight: '11in' }}
    >
      {children}
    </section>
  )
}

function PageHeader() {
  return <Image src="/images/pdf-logo.png" alt="Care Connect — Care That Comes to You" width={160} height={42} className="h-auto w-36 flex-none" />
}

function PageFooter({ page }: { page: number }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-mist">
      <span>www.ucarecon.ca</span>
      <span>Page {page}</span>
    </div>
  )
}

function BodyHtml({ html }: { html: string }) {
  return (
    <div
      className="mt-4 text-body text-slate [&_li]:mb-1 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default function QuotationDocument({ reservationId, pricingOverride, hideActions }: QuotationDocumentProps) {
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

  const pricing: QuotationPricing = pricingOverride ?? {
    ratePerHour: reservation.ratePerHour ?? 0,
    hst: reservation.hst,
    hstAmount: reservation.hstAmount ?? 0,
    serviceAmount: reservation.serviceAmount ?? 0,
    total: reservation.total ?? 0,
    totalHours: reservation.totalHours ?? 0,
    totalDays: reservation.totalDays ?? dayCount(reservation.startDate, reservation.endDate),
  }
  const preparedForEmail = reservation.clientEmail

  return (
    <div>
      {!hideActions && (
        <div className="mx-auto mb-6 flex max-w-[8.5in] items-center justify-between print:hidden">
          <p className="text-small text-slate">
            {pricingOverride ? "Preview — this quote hasn't been sent yet." : "Print preview — use your browser's print dialog to save as PDF."}
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-connect-blue px-5 text-small font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </button>
        </div>
      )}

      {/* Page 1 — cover */}
      <Page className="justify-between">
        <PageHeader />
        <div className="my-10 h-56 w-full rounded-sm bg-connect-blue sm:h-72" />
        <div>
          <p className="text-small text-ink">
            Prepared for : {reservation.clientName || 'Valued client'} ({preparedForEmail})
          </p>
          <p className="mt-4 text-small text-ink">Prepared by : Care Connect</p>
        </div>
        <QuotationSocialRow />
      </Page>

      {template && (
        <>
          {/* Page 2 — company introduction */}
          <Page>
            <PageHeader />
            <div className="mt-10 flex-1">
              <h2 className="font-headline text-h2 text-ink">{template.introTitle}</h2>
              <BodyHtml html={template.introBody} />
            </div>
            <PageFooter page={2} />
          </Page>

          {/* Page 3 — staff */}
          <Page>
            <PageHeader />
            <div className="mt-10 flex-1">
              <h2 className="font-headline text-h2 text-ink">{template.staffTitle}</h2>
              <BodyHtml html={template.staffBody} />
            </div>
            <PageFooter page={3} />
          </Page>

          {/* Page 4 — home support services */}
          <Page>
            <PageHeader />
            <div className="mt-10 flex-1">
              <h2 className="font-headline text-h2 text-ink">{template.homeSupportTitle}</h2>
              <BodyHtml html={template.homeSupportBody} />
            </div>
            <PageFooter page={4} />
          </Page>

          {/* Page 5 — personal care + complex care */}
          <Page>
            <PageHeader />
            <div className="mt-10 flex-1">
              <h2 className="font-headline text-h2 text-ink">{template.personalCareTitle}</h2>
              <BodyHtml html={template.personalCareBody} />
              <h2 className="mt-8 font-headline text-h2 text-ink">{template.complexCareTitle}</h2>
              <BodyHtml html={template.complexCareBody} />
            </div>
            <PageFooter page={5} />
          </Page>
        </>
      )}

      {/* Page 6 — the quoted service, plus quote breakdown */}
      <Page>
        <PageHeader />
        <div className="mt-10 flex-1">
          <h2 className="font-headline text-h2 text-ink">{reservation.serviceTitle}</h2>
          <BodyHtml html={reservation.serviceDescription} />
          {reservation.serviceAssistance.length > 0 && (
            <ul className="mt-3 grid list-disc gap-1.5 pl-5 text-small text-ink sm:grid-cols-2">
              {reservation.serviceAssistance.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          )}

          <h2 className="mt-8 font-headline text-h2 text-ink">Quote</h2>

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
                  <td className="py-2.5 pr-2">{money(pricing.ratePerHour)}</td>
                  <td className="py-2.5 pr-2">
                    {reservation.startDate} – {reservation.endDate}
                  </td>
                  <td className="py-2.5 pr-2">{pricing.totalHours}</td>
                  <td className="py-2.5 text-right">{money(pricing.serviceAmount)}</td>
                </tr>
                <tr className="border-b border-border text-slate">
                  <td className="py-2.5 pr-2">HST ({pricing.hst}%)</td>
                  <td className="py-2.5 pr-2" />
                  <td className="py-2.5 pr-2">
                    {pricing.totalDays} day{pricing.totalDays === 1 ? '' : 's'}
                  </td>
                  <td className="py-2.5 pr-2" />
                  <td className="py-2.5 text-right">{money(pricing.hstAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <QuotationSectionBar>Total</QuotationSectionBar>
            <div className="flex items-center justify-between py-3 text-body font-semibold text-ink">
              <span>Total Service Fee</span>
              <span>{money(pricing.total)}</span>
            </div>
          </div>
        </div>
        <PageFooter page={6} />
      </Page>

      {/* Page 7 — back cover */}
      {template && (
        <Page className="items-center justify-between text-center">
          <div />
          <div className="flex flex-col items-center">
            <Image src="/images/logo.svg" alt="Care Connect" width={140} height={140} className="h-32 w-32" />
            <p className="mt-4 font-headline text-h2 text-ink">Care Connect</p>
            <p className="text-body text-slate">{template.footerNote}</p>

            <div className="mt-10 flex flex-col items-center gap-3 text-small text-ink">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-connect-blue" aria-hidden="true" />
                {template.contactEmail}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-connect-blue" aria-hidden="true" />
                {template.contactPhone}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-none text-connect-blue" aria-hidden="true" />
                {template.contactAddress}
              </span>
            </div>
          </div>

          <div className="w-full">
            <div
              className="h-40 w-full rounded-sm"
              style={{
                background:
                  'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 28px), radial-gradient(circle at 25% 30%, rgba(255,255,255,0.12), transparent 45%), radial-gradient(circle at 75% 70%, rgba(255,255,255,0.1), transparent 45%), #183891',
              }}
            />
            <div className="mt-4">
              <QuotationSocialRow />
            </div>
          </div>
        </Page>
      )}
    </div>
  )
}
