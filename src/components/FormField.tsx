import type { ReactNode } from 'react'

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}

export default function FormField({ id, label, required, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body font-medium text-ink">
        {required && <span className="text-error" aria-hidden="true">* </span>}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-small text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export const inputClass = (hasError: boolean) =>
  `min-h-[48px] w-full rounded-xl border bg-white px-4 text-body text-ink placeholder:text-mist ${
    hasError ? 'border-error' : 'border-border'
  }`
