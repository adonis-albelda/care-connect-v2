'use client'

import * as Select from '@radix-ui/react-select'
import Image from 'next/image'
import type { Service } from '@/lib/types'

interface ServiceSelectProps {
  id?: string
  services: Service[]
  value: string | null
  onChange: (value: string | null) => void
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function ServiceSelect({ id = 'service', services, value, onChange }: ServiceSelectProps) {
  const selected = services.find((service) => service.id === value)

  return (
    <div className="flex-1 min-w-[220px]">
      <label htmlFor={id} className="block text-body font-medium text-ink">
        Service
      </label>
      <Select.Root value={value ?? undefined} onValueChange={(next) => onChange(next || null)}>
        <Select.Trigger
          id={id}
          className="mt-2 flex min-h-[48px] w-full items-center justify-between gap-2 rounded-xl border border-border bg-white px-4 text-body text-ink data-[placeholder]:text-mist"
        >
          <Select.Value placeholder="Select a service">{selected?.title}</Select.Value>
          <Select.Icon>
            <Image src="/images/icons/chevron-down.svg" alt="" width={16} height={16} aria-hidden="true" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={8}
            className="z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-white shadow-card-hover"
          >
            <Select.Viewport className="max-h-80 p-2">
              {services.map((service) => (
                <Select.Item
                  key={service.id}
                  value={String(service.id)}
                  className="flex cursor-pointer flex-col gap-1 rounded-lg px-3 py-2.5 outline-none data-[highlighted]:bg-cloud data-[state=checked]:bg-blue-light"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Select.ItemText>
                      <span className="text-body font-medium text-ink">{service.title}</span>
                    </Select.ItemText>
                    <Select.ItemIndicator>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#183891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Select.ItemIndicator>
                  </div>
                  {service.short_description && (
                    <p className="line-clamp-2 text-small text-slate">{stripHtml(service.short_description)}</p>
                  )}
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
