'use client'

import type { TimeValue } from '@/lib/types'

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']

interface TimeFieldProps {
  id: string
  label: string
  value: TimeValue
  onChange: (value: TimeValue) => void
}

export default function TimeField({ id, label, value, onChange }: TimeFieldProps) {
  return (
    <div className="flex-1 min-w-[200px]">
      <span id={`${id}-label`} className="block text-body font-medium text-ink">
        {label}
      </span>
      <div className="mt-2 flex min-h-[48px] items-center gap-2 rounded-xl border border-border bg-white px-3">
        <label htmlFor={`${id}-hour`} className="sr-only">
          {label} hour
        </label>
        <select
          id={`${id}-hour`}
          aria-labelledby={`${id}-label`}
          value={value.hour}
          onChange={(e) => onChange({ ...value, hour: e.target.value })}
          className="min-h-[44px] rounded-lg text-body text-ink"
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <span className="text-body text-mist" aria-hidden="true">:</span>
        <label htmlFor={`${id}-minutes`} className="sr-only">
          {label} minutes
        </label>
        <select
          id={`${id}-minutes`}
          aria-labelledby={`${id}-label`}
          value={value.minutes}
          onChange={(e) => onChange({ ...value, minutes: e.target.value })}
          className="min-h-[44px] rounded-lg text-body text-ink"
        >
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <div className="ml-auto flex gap-1" role="group" aria-label={`${label} AM or PM`}>
          {(['AM', 'PM'] as const).map((period) => (
            <button
              key={period}
              type="button"
              aria-pressed={value.period === period}
              onClick={() => onChange({ ...value, period })}
              className={`min-h-[44px] min-w-[44px] rounded-lg text-small font-semibold transition-colors duration-250 ${
                value.period === period
                  ? 'bg-connect-blue text-white'
                  : 'bg-cloud text-slate hover:bg-blue-light'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
