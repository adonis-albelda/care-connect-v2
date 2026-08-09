import Image from 'next/image'
import type { FaqItem } from '@/lib/faq-data'

export default function FaqAccordion({ items, className = 'flex flex-col gap-3' }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={className}>
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-2xl border border-border bg-white p-2 shadow-card transition-shadow duration-250 open:shadow-card-hover"
        >
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3 text-body-lg font-medium text-ink hover:text-connect-blue">
            {item.question}
            <Image
              src="/images/icons/chevron-down.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="flex-none transition-transform duration-250 group-open:rotate-180"
            />
          </summary>
          <p className="px-4 pb-4 pt-1 text-body text-slate">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
