'use client'

import { useState, type MouseEvent, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CircleAlert, ShieldQuestion, type LucideIcon } from 'lucide-react'

interface ConfirmButtonProps {
  onConfirm: () => Promise<void> | void
  title: string
  description: ReactNode
  // Short supporting facts shown as a bulleted list — what will actually
  // happen, so the admin isn't guessing at the effect of "Yes, continue".
  details?: string[]
  icon?: LucideIcon
  tone?: 'default' | 'warning'
  confirmLabel?: string
  busyLabel?: string
  cancelLabel?: string
  className: string
  children: ReactNode
  disabled?: boolean
  stopPropagation?: boolean
}

// A trigger button that opens a "are you sure?" dialog before actually
// running the mutating action — for quick one-click actions with real side
// effects (sends an email, flips a visible status), not routine form saves.
export default function ConfirmButton({
  onConfirm,
  title,
  description,
  details,
  icon,
  tone = 'default',
  confirmLabel = 'Yes, continue',
  busyLabel = 'Working…',
  cancelLabel = 'Cancel',
  className,
  children,
  disabled,
  stopPropagation,
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleTrigger = (e: MouseEvent) => {
    if (stopPropagation) e.stopPropagation()
    setOpen(true)
  }

  const handleConfirm = async () => {
    if (busy) return
    setBusy(true)
    try {
      await onConfirm()
      setOpen(false)
    } finally {
      setBusy(false)
    }
  }

  const Icon = icon ?? (tone === 'warning' ? CircleAlert : ShieldQuestion)
  const iconWrapClass = tone === 'warning' ? 'bg-error/10 text-error' : 'bg-blue-light text-connect-blue'

  return (
    <>
      <button type="button" onClick={handleTrigger} disabled={disabled} className={className}>
        {children}
      </button>

      <Dialog.Root open={open} onOpenChange={(next) => !busy && setOpen(next)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[95] bg-ink/55 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[96] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-card-hover focus:outline-none">
            <div className="p-6 sm:p-8">
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${iconWrapClass}`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>

              <Dialog.Title className="mt-4 font-headline text-h3 text-ink">{title}</Dialog.Title>
              <Dialog.Description className="mt-2 text-body text-slate">{description}</Dialog.Description>

              {details && details.length > 0 && (
                <ul className="mt-4 flex flex-col gap-2 rounded-xl bg-cloud p-4">
                  {details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-small text-ink">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-connect-blue" aria-hidden="true" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={busy}
                  className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {busy ? busyLabel : confirmLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={busy}
                  className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-border text-body font-medium text-slate transition-colors duration-250 hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelLabel}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
