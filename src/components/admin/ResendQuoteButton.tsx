'use client'

import { useState, type MouseEvent } from 'react'
import { useAction } from 'convex/react'
import { RotateCw } from 'lucide-react'
import type { FunctionReturnType } from 'convex/server'
import { api } from '@convex/_generated/api'
import { useToast } from '@/lib/toast-context'

type ReservationRow = FunctionReturnType<typeof api.reservations.list>[number]

// Re-sends the already-priced quotation email as-is — for when a client says
// they never got it. Reuses whatever pricing was saved on the reservation
// from the original send, no re-entry needed.
export default function ResendQuoteButton({ reservation }: { reservation: ReservationRow }) {
  const sendQuoteEmail = useAction(api.quotationEmail.send)
  const { showSuccess, showError } = useToast()
  const [sending, setSending] = useState(false)

  const handleResend = async (e: MouseEvent) => {
    e.stopPropagation()
    if (sending) return
    setSending(true)
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
    } finally {
      setSending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={sending}
      className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate transition-colors duration-250 hover:border-connect-blue hover:text-connect-blue disabled:cursor-not-allowed disabled:opacity-60"
    >
      <RotateCw className={`h-3.5 w-3.5 ${sending ? 'animate-spin' : ''}`} aria-hidden="true" />
      {sending ? 'Resending…' : 'Resend'}
    </button>
  )
}
