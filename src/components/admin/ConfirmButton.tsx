'use client'

import { useState, type MouseEvent, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface ConfirmButtonProps {
  onConfirm: () => Promise<void> | void
  title: string
  description: ReactNode
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

  return (
    <>
      <button type="button" onClick={handleTrigger} disabled={disabled} className={className}>
        {children}
      </button>

      <Dialog.Root open={open} onOpenChange={(next) => !busy && setOpen(next)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[95] bg-ink/55 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[96] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-card-hover focus:outline-none">
            <Dialog.Title className="font-headline text-h3 text-connect-blue">{title}</Dialog.Title>
            <Dialog.Description className="mt-2 text-small text-slate">{description}</Dialog.Description>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={busy}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-colors duration-250 hover:bg-blue-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? busyLabel : confirmLabel}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={busy}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-border text-body font-medium text-slate transition-colors duration-250 hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelLabel}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
