'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useAction } from 'convex/react'
import { differenceInCalendarDays } from 'date-fns'
import { Eye, X } from 'lucide-react'
import type { FunctionReturnType } from 'convex/server'
import { api } from '@convex/_generated/api'
import QuotationDocument from '@/components/admin/QuotationDocument'
import { useToast } from '@/lib/toast-context'

type ReservationRow = FunctionReturnType<typeof api.reservations.list>[number]

function parseClockTime(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return null
  let hours = Number(match[1]) % 12
  if (match[3].toUpperCase() === 'PM') hours += 12
  return hours + Number(match[2]) / 60
}

function hoursPerDay(startTime: string, endTime: string) {
  const start = parseClockTime(startTime)
  const end = parseClockTime(endTime)
  if (start == null || end == null) return 0
  const diff = end - start
  return diff > 0 ? diff : diff + 24
}

function totalDaysBetween(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1
  return Math.max(differenceInCalendarDays(end, start) + 1, 1)
}

function money(value: number) {
  return `$${value.toFixed(2)}`
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate">{label}</p>
      <p className="mt-0.5 text-small text-ink">{value}</p>
    </div>
  )
}

export default function SendQuoteDrawer({
  reservation,
  onOpenChange,
}: {
  reservation: ReservationRow | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog.Root open={reservation !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/45 backdrop-blur-sm" />
        <Dialog.Content className="admin-drawer fixed inset-y-0 right-0 z-[91] flex w-full max-w-3xl flex-col bg-white shadow-card-hover focus:outline-none">
          {/* Keyed by reservation id: remounts fresh pricing state per row. */}
          {reservation && (
            <SendQuoteForm key={reservation._id} reservation={reservation} onClose={() => onOpenChange(false)} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function SendQuoteForm({ reservation, onClose }: { reservation: ReservationRow; onClose: () => void }) {
  const sendQuoteEmail = useAction(api.quotationEmail.send)
  const { showSuccess, showError } = useToast()
  const [rate, setRate] = useState('')
  const [hstPercent, setHstPercent] = useState('13')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const perDay = hoursPerDay(reservation.startTime, reservation.endTime)
  const days = totalDaysBetween(reservation.startDate, reservation.endDate)
  const totalHours = perDay * days
  const rateValue = Number(rate) || 0
  const hstValue = Number(hstPercent) || 0
  const subtotal = rateValue * totalHours
  const hstAmount = subtotal * (hstValue / 100)
  const grandTotal = subtotal + hstAmount
  const isQuoted = reservation.status === 'quoted'

  const handleSend = async () => {
    if (sending) return
    setSending(true)
    setError(null)
    try {
      await sendQuoteEmail({
        id: reservation._id,
        ratePerHour: rateValue,
        hst: hstPercent,
        hstAmount,
        serviceAmount: subtotal,
        total: grandTotal,
        totalHours,
        totalDays: days,
      })
      setConfirmOpen(false)
      showSuccess(`Quotation sent to ${reservation.clientEmail}.`)
      onClose()
    } catch {
      setError("That email didn't send — check Mailgun is configured and try again.")
      showError("That email didn't send — check Mailgun is configured and try again.")
      setConfirmOpen(false)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
        <div>
          <Dialog.Title className="font-headline text-h3 text-connect-blue">Send quote</Dialog.Title>
          <Dialog.Description className="mt-1 text-small text-slate">
            {reservation.serviceTitle} · {reservation.clientEmail}
          </Dialog.Description>
        </div>
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-mist transition-colors duration-250 hover:bg-cloud hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </Dialog.Close>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">Request details</p>
        <div className="mt-3 grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-3">
          <Field label="Client" value={reservation.clientEmail} />
          <Field label="Service" value={reservation.serviceTitle} />
          <Field label="Status" value={isQuoted ? 'Quoted' : 'Pending'} />
          <Field label="Dates" value={`${reservation.startDate} → ${reservation.endDate}`} />
          <Field label="Time" value={`${reservation.startTime} – ${reservation.endTime}`} />
          <Field label="Hours per day" value={perDay.toFixed(2)} />
          <Field label="Total days" value={days} />
          <Field label="Total hours" value={totalHours.toFixed(2)} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate">Pricing</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-small font-medium text-ink">Service rate per hour</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-small text-mist">$</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0.00"
                className="min-h-[44px] w-full rounded-lg border border-border py-2 pl-7 pr-3 text-small text-ink focus:border-connect-blue focus:outline-none"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-small font-medium text-ink">HST</span>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                value={hstPercent}
                onChange={(e) => setHstPercent(e.target.value)}
                className="min-h-[44px] w-full rounded-lg border border-border py-2 pl-3 pr-8 text-small text-ink focus:border-connect-blue focus:outline-none"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-small text-mist">%</span>
            </div>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-2 rounded-xl bg-cloud p-4">
          <div className="flex items-center justify-between text-small text-slate">
            <span>Subtotal ({totalHours.toFixed(2)} hrs × ${rateValue.toFixed(2)})</span>
            <span className="font-medium text-ink">{money(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-small text-slate">
            <span>HST ({hstValue}%)</span>
            <span className="font-medium text-ink">{money(hstAmount)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-border pt-2 text-body font-semibold text-ink">
            <span>Grand total</span>
            <span className="text-connect-blue">{money(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-6 py-5 sm:px-8">
        {error && (
          <p className="mb-3 text-small text-error" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={!rateValue}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            Send Quotation
          </button>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            disabled={!rateValue}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-border text-body font-medium text-slate transition-colors duration-250 hover:border-connect-blue hover:text-connect-blue disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Preview Quotation
          </button>
          <Dialog.Close asChild>
            <button
              type="button"
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-border text-body font-medium text-slate transition-colors duration-250 hover:bg-cloud"
            >
              Cancel
            </button>
          </Dialog.Close>
        </div>
      </div>

      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[92] bg-ink/55 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[93] flex h-[90vh] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-cloud shadow-card-hover focus:outline-none">
            <div className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
              <Dialog.Title className="font-headline text-h3 text-connect-blue">Quotation preview</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-mist transition-colors duration-250 hover:bg-cloud hover:text-ink"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <QuotationDocument
                reservationId={reservation._id}
                pricingOverride={{
                  ratePerHour: rateValue,
                  hst: hstPercent,
                  hstAmount,
                  serviceAmount: subtotal,
                  total: grandTotal,
                  totalHours,
                  totalDays: days,
                }}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[95] bg-ink/55 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[96] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-card-hover focus:outline-none">
            <Dialog.Title className="font-headline text-h3 text-connect-blue">Send this quote?</Dialog.Title>
            <Dialog.Description className="mt-2 text-small text-slate">
              We&rsquo;ll email {reservation.clientEmail} the quotation PDF for {money(grandTotal)} and mark this
              reservation as quoted. This can&rsquo;t be undone from here.
            </Dialog.Description>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-colors duration-250 hover:bg-blue-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? 'Sending…' : 'Yes, send it'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={sending}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-border text-body font-medium text-slate transition-colors duration-250 hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-60"
              >
                Go back
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
