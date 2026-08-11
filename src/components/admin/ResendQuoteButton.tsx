'use client'

import { useAction } from 'convex/react'
import { RotateCw, Mail } from 'lucide-react'
import type { FunctionReturnType } from 'convex/server'
import { api } from '@convex/_generated/api'
import { useToast } from '@/lib/toast-context'
import ConfirmButton from '@/components/admin/ConfirmButton'

type ReservationRow = FunctionReturnType<typeof api.reservations.list>[number]

// Re-sends the already-priced quotation email as-is — for when a client says
// they never got it. Reuses whatever pricing was saved on the reservation
// from the original send, no re-entry needed.
export default function ResendQuoteButton({ reservation }: { reservation: ReservationRow }) {
  const sendQuoteEmail = useAction(api.quotationEmail.send)
  const { showSuccess, showError } = useToast()

  const handleResend = async () => {
    try {
      await sendQuoteEmail({
        id: reservation._id,
        ratePerHour: reservation.ratePerHour ?? 0,
        hst: reservation.hst,
        hstAmount: reservation.hstAmount ?? 0,
        serviceAmount: reservation.serviceAmount ?? 0,
        total: reservation.total ?? 0,
        totalHours: reservation.totalHours ?? 0,
        totalDays: reservation.totalDays ?? 0,
      })
      showSuccess(`Quotation resent to ${reservation.clientEmail}.`)
    } catch {
      showError("That email didn't send — check Mailgun is configured and try again.")
    }
  }

  return (
    <ConfirmButton
      onConfirm={handleResend}
      title="Resend this quotation?"
      description={`We'll email the quotation PDF to ${reservation.clientEmail} again, using the pricing already on file.`}
      details={[
        `Rate: $${(reservation.ratePerHour ?? 0).toFixed(2)}/hr · Total: $${(reservation.total ?? 0).toFixed(2)}`,
        'A fresh copy of the PDF is generated and attached — nothing changes on the reservation.',
      ]}
      icon={Mail}
      confirmLabel="Yes, resend"
      busyLabel="Resending…"
      stopPropagation
      className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate transition-colors duration-250 hover:border-connect-blue hover:text-connect-blue disabled:cursor-not-allowed disabled:opacity-60"
    >
      <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
      Resend
    </ConfirmButton>
  )
}
