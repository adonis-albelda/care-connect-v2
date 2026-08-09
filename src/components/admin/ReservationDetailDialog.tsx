'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation } from 'convex/react'
import { X } from 'lucide-react'
import type { FunctionReturnType } from 'convex/server'
import { api } from '@convex/_generated/api'

type ReservationRow = FunctionReturnType<typeof api.reservations.list>[number]

interface FormState {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  ratePerHour: string
  hst: string
  hstAmount: string
  serviceAmount: string
  total: string
  totalHours: string
  totalDays: string
}

function toForm(r: ReservationRow): FormState {
  return {
    startDate: r.startDate,
    endDate: r.endDate,
    startTime: r.startTime,
    endTime: r.endTime,
    ratePerHour: r.ratePerHour?.toString() ?? '',
    hst: r.hst,
    hstAmount: r.hstAmount?.toString() ?? '',
    serviceAmount: r.serviceAmount?.toString() ?? '',
    total: r.total?.toString() ?? '',
    totalHours: r.totalHours?.toString() ?? '',
    totalDays: r.totalDays?.toString() ?? '',
  }
}

function toNumber(value: string) {
  const n = Number(value)
  return value.trim() === '' || Number.isNaN(n) ? undefined : n
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-slate">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[40px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
      />
    </label>
  )
}

function NumberField({ label, value, onChange, prefix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-slate">{label}</span>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-small text-mist">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`min-h-[40px] w-full rounded-lg border border-border text-small text-ink focus:border-connect-blue focus:outline-none ${prefix ? 'pl-7 pr-3' : 'px-3'}`}
        />
      </div>
    </label>
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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[91] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-card-hover focus:outline-none">
          {/* Keyed by reservation id: remounts fresh form state per row
              instead of syncing via an effect when the selection changes. */}
          {reservation && (
            <ReservationEditForm key={reservation._id} reservation={reservation} onClose={() => onOpenChange(false)} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function ReservationEditForm({ reservation, onClose }: { reservation: ReservationRow; onClose: () => void }) {
  const updateReservation = useMutation(api.reservations.update)
  const [form, setForm] = useState<FormState>(() => toForm(reservation))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof FormState) => (value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      await updateReservation({
        id: reservation._id,
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: form.startTime,
        endTime: form.endTime,
        hst: form.hst,
        ratePerHour: toNumber(form.ratePerHour),
        hstAmount: toNumber(form.hstAmount),
        serviceAmount: toNumber(form.serviceAmount),
        total: toNumber(form.total),
        totalHours: toNumber(form.totalHours),
        totalDays: toNumber(form.totalDays),
      })
      onClose()
    } catch {
      setError("That didn't save — check the fields and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <Dialog.Title className="font-headline text-h3 text-connect-blue">Edit reservation</Dialog.Title>
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

      <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">Schedule</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <TextField label="Start date" value={form.startDate} onChange={set('startDate')} />
          <TextField label="End date" value={form.endDate} onChange={set('endDate')} />
          <TextField label="Start time" value={form.startTime} onChange={set('startTime')} />
          <TextField label="End time" value={form.endTime} onChange={set('endTime')} />
          <NumberField label="Total days" value={form.totalDays} onChange={set('totalDays')} />
          <NumberField label="Total hours" value={form.totalHours} onChange={set('totalHours')} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate">Pricing</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <NumberField label="Rate per hour" value={form.ratePerHour} onChange={set('ratePerHour')} prefix="$" />
          <NumberField label="Service amount" value={form.serviceAmount} onChange={set('serviceAmount')} prefix="$" />
          <TextField label="HST" value={form.hst} onChange={set('hst')} />
          <NumberField label="HST amount" value={form.hstAmount} onChange={set('hstAmount')} prefix="$" />
          <NumberField label="Total" value={form.total} onChange={set('total')} prefix="$" />
        </div>

        <p className="mt-5 text-xs text-mist">Requested {new Date(reservation._creationTime).toLocaleString()}</p>
      </div>

      <div className="border-t border-border px-6 py-4">
        {error && (
          <p className="mb-3 text-small text-error" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <Dialog.Close asChild>
            <button
              type="button"
              disabled={saving}
              className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-border text-body font-medium text-slate transition-colors duration-250 hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </Dialog.Close>
        </div>
      </div>
    </>
  )
}
