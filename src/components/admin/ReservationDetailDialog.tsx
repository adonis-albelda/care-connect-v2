'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { FunctionReturnType } from 'convex/server'
import type { api } from '@convex/_generated/api'

type ReservationRow = FunctionReturnType<typeof api.reservations.list>[number]

function money(value?: number) {
  return value != null ? `$${value.toFixed(2)}` : '—'
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-border py-2.5 last:border-b-0">
      <p className="text-xs font-medium uppercase tracking-wide text-slate">{label}</p>
      <p className="mt-0.5 text-small text-ink">{value}</p>
    </div>
  )
}

export default function ReservationDetailDialog({
  reservation,
  onOpenChange,
}: {
  reservation: ReservationRow | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog.Root open={reservation !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[91] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-card-hover focus:outline-none">
          {reservation && (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
                <div>
                  <Dialog.Title className="font-headline text-h3 text-connect-blue">Reservation details</Dialog.Title>
                  <Dialog.Description className="mt-1 text-small text-slate">{reservation.serviceTitle}</Dialog.Description>
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

              <div className="max-h-[70vh] overflow-y-auto px-6 py-2">
                <Field label="Client email" value={reservation.clientEmail} />
                <Field label="Service" value={reservation.serviceTitle} />
                <Field label="Dates" value={`${reservation.startDate} → ${reservation.endDate}`} />
                <Field label="Time" value={`${reservation.startTime} – ${reservation.endTime}`} />
                <Field label="Total days" value={reservation.totalDays ?? '—'} />
                <Field label="Total hours" value={reservation.totalHours ?? '—'} />
                <Field label="Rate per hour" value={money(reservation.ratePerHour)} />
                <Field label="Service amount" value={money(reservation.serviceAmount)} />
                <Field label="HST" value={reservation.hst} />
                <Field label="HST amount" value={money(reservation.hstAmount)} />
                <Field label="Total" value={money(reservation.total)} />
                <Field label="Requested" value={new Date(reservation._creationTime).toLocaleString()} />
              </div>

              <div className="border-t border-border px-6 py-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-border text-body font-medium text-slate transition-colors duration-250 hover:bg-cloud"
                  >
                    Close
                  </button>
                </Dialog.Close>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
