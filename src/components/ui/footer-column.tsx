import type { ReactNode } from 'react'

export function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="text-center sm:text-left">
      <h3 className="font-headline text-body-lg font-semibold">{title}</h3>
      <ul className="mt-4 flex flex-col items-center gap-3 sm:items-start">{children}</ul>
    </div>
  )
}
