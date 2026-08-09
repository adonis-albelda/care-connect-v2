'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ShieldCheck } from 'lucide-react'

interface AuthLoadingOverlayProps {
  title: string
  description?: string
}

export default function AuthLoadingOverlay({ title, description }: AuthLoadingOverlayProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 backdrop-blur-sm"
    >
      <div className="mx-4 flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-white px-8 py-10 text-center shadow-card-hover">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-connect-blue/25" />
          <span className="absolute inline-flex h-11 w-11 animate-ping rounded-full bg-connect-blue/35 [animation-delay:200ms]" />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-connect-blue text-white shadow-card">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <div>
          <p className="text-body-lg font-semibold text-ink">{title}</p>
          <p className="mt-1 text-small text-slate">
            {description ?? "Hold tight — we're securely confirming your Care Connect account."}
          </p>
        </div>

        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-connect-blue [animation-delay:-200ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-connect-blue [animation-delay:-100ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-connect-blue" />
        </div>
      </div>
    </div>,
    document.body
  )
}
