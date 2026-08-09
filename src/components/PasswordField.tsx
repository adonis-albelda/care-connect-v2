'use client'

import { useState } from 'react'
import FormField, { inputClass } from '@/components/FormField'

interface PasswordFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
}

export default function PasswordField({ id, label, value, onChange, error, required, placeholder }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <FormField id={id} label={label} required={required} error={error}>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass(!!error)} pr-20`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 min-h-[36px] -translate-y-1/2 rounded-lg px-3 text-small font-medium text-connect-blue hover:bg-cloud"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </FormField>
  )
}
