'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HexagonPattern } from '@/components/ui/hexagon-pattern'

const TABS = [
  { href: '/help/faq', label: 'F.A.Q.' },
  { href: '/help/terms_and_condition', label: 'Terms & Conditions' },
]

export default function HelpLayout({ children }) {
  const pathname = usePathname()

  return (
    <div className="bg-white">
      <div className="bg-connect-blue px-4 py-16 text-center sm:px-6">
        <h1 className="font-headline text-h1 text-white">How can we help?</h1>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-6 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="help-search" className="sr-only">
            Ask a question
          </label>
          <input
            id="help-search"
            type="text"
            placeholder="Ask a question"
            className="min-h-[48px] flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-body text-white placeholder:text-blue-light"
          />
          <button
            type="submit"
            className="min-h-[48px] rounded-xl bg-white px-6 text-body font-semibold text-connect-blue hover:bg-blue-light"
          >
            Search
          </button>
        </form>
      </div>

      <div className="relative overflow-hidden">
        <HexagonPattern radius={48} gap={6} className="fill-connect-blue/[0.04] stroke-connect-blue/[0.08]" />
        <div className="relative mx-auto grid max-w-content gap-10 px-4 py-12 sm:px-6 md:grid-cols-[220px_1fr]">
          <nav aria-label="Help topics" className="flex gap-2 md:flex-col">
            {TABS.map((tab) => {
              const active = pathname === tab.href
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-[44px] items-center rounded-lg px-3 text-body-lg font-semibold ${
                    active ? 'text-connect-blue' : 'text-ink hover:text-connect-blue'
                  }`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
