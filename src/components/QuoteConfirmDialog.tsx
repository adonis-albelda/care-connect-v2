'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { CalendarDays, CircleCheck, Clock, Mail, ShieldCheck, X } from 'lucide-react'

interface QuoteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isSubmitting: boolean
  serviceTitle: string
  serviceImage?: string
  dateRangeLabel: string
  dayCountLabel: string | null
  timeLabel: string
  email?: string
}

const NEXT_STEPS = [
  'Our care team reviews your request within 24 hours.',
  "You'll get a personalized quote by email or phone — no payment due now.",
  'Dates and times can still be adjusted with our team afterward.',
]

export default function QuoteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  serviceTitle,
  serviceImage,
  dateRangeLabel,
  dayCountLabel,
  timeLabel,
  email,
}: QuoteConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/55 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[91] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-card-hover focus:outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
            <div>
              <Dialog.Title className="font-headline text-h3 text-connect-blue">Confirm your request</Dialog.Title>
              <Dialog.Description className="mt-1 text-small text-slate">
                Take a moment to check the details before we send this along.
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

          <div className="grid gap-5 px-6 py-5 sm:grid-cols-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:col-span-3">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-cloud p-4">
                <div className="h-14 w-14 flex-none overflow-hidden rounded-lg bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={serviceImage || '/images/icons/service-placeholder.svg'}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-small font-medium text-slate">Service</p>
                  <p className="text-body-lg font-semibold text-ink">{serviceTitle}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-border px-4 py-3">
                <CalendarDays className="mt-0.5 h-5 w-5 flex-none text-connect-blue" aria-hidden="true" />
                <div>
                  <p className="text-small font-medium text-slate">Dates</p>
                  <p className="text-body font-medium text-ink">
                    {dateRangeLabel}
                    {dayCountLabel && <span className="text-slate"> · {dayCountLabel}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border px-4 py-3">
                <Clock className="mt-0.5 h-5 w-5 flex-none text-connect-blue" aria-hidden="true" />
                <div>
                  <p className="text-small font-medium text-slate">Time</p>
                  <p className="text-body font-medium text-ink">{timeLabel}</p>
                </div>
              </div>
              {email && (
                <div className="flex items-start gap-3 rounded-xl border border-border px-4 py-3">
                  <Mail className="mt-0.5 h-5 w-5 flex-none text-connect-blue" aria-hidden="true" />
                  <div>
                    <p className="text-small font-medium text-slate">We&rsquo;ll reach you at</p>
                    <p className="text-body font-medium text-ink">{email}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-blue-light p-4 sm:col-span-2">
              <p className="flex items-center gap-2 text-small font-semibold text-connect-blue">
                <ShieldCheck className="h-4 w-4 flex-none" aria-hidden="true" />
                What happens next
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {NEXT_STEPS.map((step) => (
                  <li key={step} className="flex items-start gap-2 text-small text-ink">
                    <CircleCheck className="mt-0.5 h-3.5 w-3.5 flex-none text-connect-blue" aria-hidden="true" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border px-6 py-5 sm:flex-row-reverse sm:px-8">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Sending…' : 'Confirm & Send'}
            </button>
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={isSubmitting}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-border text-body font-medium text-slate transition-colors duration-250 hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-60"
              >
                Go back &amp; edit
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
