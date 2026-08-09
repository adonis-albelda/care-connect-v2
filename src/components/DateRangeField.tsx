'use client'

import { useState, useRef, useEffect } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'
import type { DateRangeValue } from '@/lib/types'

function formatRange(range?: DateRangeValue) {
  if (!range?.from) return 'Select dates'
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  if (!range.to || range.to.getTime() === range.from.getTime()) {
    return range.from.toLocaleDateString('en-US', opts)
  }
  return `${range.from.toLocaleDateString('en-US', opts)} – ${range.to.toLocaleDateString('en-US', opts)}`
}

interface DateRangeFieldProps {
  value?: DateRangeValue
  onChange: (value: DateRange | undefined) => void
}

export default function DateRangeField({ value, onChange }: DateRangeFieldProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickAway)
    return () => document.removeEventListener('mousedown', onClickAway)
  }, [])

  return (
    <div className="relative flex-1 min-w-[220px]" ref={containerRef}>
      <span id="date-range-label" className="block text-body font-medium text-ink">
        Dates
      </span>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby="date-range-label"
        onClick={() => setOpen((o) => !o)}
        className="mt-2 flex min-h-[48px] w-full items-center rounded-xl border border-border bg-white px-4 text-left text-body text-ink"
      >
        {formatRange(value)}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose start and end date"
          className="absolute z-30 mt-2 rounded-2xl border border-border bg-white p-4 shadow-card-hover"
        >
          <p className="mb-2 max-w-[240px] text-small text-slate">
            Set your start and end date. For a single day, select the same date twice.
          </p>
          <DayPicker
            className="cc-daypicker"
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
          />
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                onChange(undefined)
              }}
              className="min-h-[44px] rounded-lg px-4 text-body font-medium text-slate hover:bg-cloud"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-[44px] rounded-lg bg-connect-blue px-5 text-body font-semibold text-white hover:bg-blue-deep"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
