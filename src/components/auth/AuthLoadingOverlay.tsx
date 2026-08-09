'use client'

import { Loader2 } from 'lucide-react'

export default function AuthLoadingOverlay({ label }: { label: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-10 shadow-card-hover">
        <Loader2 className="h-10 w-10 animate-spin text-connect-blue" aria-hidden="true" />
        <p className="text-body font-medium text-ink">{label}</p>
      </div>
    </div>
  )
}
