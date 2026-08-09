'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ToastType = 'success' | 'error'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  showSuccess: (message: string) => void
  showError: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)
let idCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback((type: ToastType, message: string) => {
    const id = ++idCounter
    setToasts((current) => [...current, { id, type, message }])
    setTimeout(() => dismiss(id), 4000)
  }, [dismiss])

  const showSuccess = useCallback((message: string) => push('success', message), [push])
  const showError = useCallback((message: string) => push('error', message), [push])

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 left-6 z-50 flex w-[min(360px,calc(100vw-3rem))] flex-col gap-3"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`toast-in flex items-start gap-3 rounded-lg border bg-white p-4 shadow-card ${
              toast.type === 'success' ? 'border-success/30' : 'border-error/30'
            }`}
          >
            <span
              className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-white text-small ${
                toast.type === 'success' ? 'bg-success' : 'bg-error'
              }`}
              aria-hidden="true"
            >
              {toast.type === 'success' ? '✓' : '!'}
            </span>
            <div>
              <p className="font-headline text-body font-semibold text-ink">
                {toast.type === 'success' ? 'Success!' : "Something's not right"}
              </p>
              <p className="text-body text-slate">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
