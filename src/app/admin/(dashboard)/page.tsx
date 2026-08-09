'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import type { FunctionReference } from 'convex/server'
import { Users, CalendarCheck, Heart, MessageSquare, FileText, Star, type LucideIcon } from 'lucide-react'
import { api } from '@convex/_generated/api'
import { isConvexConfigured } from '@/lib/convex-client'

type ListQuery = FunctionReference<'query', 'public', Record<string, never>, unknown[]>

const CARDS: { href: string; label: string; icon: LucideIcon; query: ListQuery }[] = [
  { href: '/admin/clients', label: 'Clients', icon: Users, query: api.clients.list },
  { href: '/admin/reservations', label: 'Reservations', icon: CalendarCheck, query: api.reservations.list },
  { href: '/admin/services', label: 'Services', icon: Heart, query: api.services.list },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare, query: api.inquiries.list },
  { href: '/admin/forms', label: 'Forms', icon: FileText, query: api.forms.list },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star, query: api.testimonials.list },
]

function OverviewCard({ href, label, icon: Icon, query }: (typeof CARDS)[number]) {
  const rows = useQuery(query, isConvexConfigured ? {} : 'skip')

  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-border bg-white p-6 shadow-card transition-all duration-250 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-blue-light">
        <Icon className="h-6 w-6 text-connect-blue" aria-hidden="true" />
      </span>
      <div>
        <p className="text-small font-medium text-slate">{label}</p>
        <p className="font-headline text-h2 text-ink">
          {!isConvexConfigured ? '—' : rows === undefined ? '…' : rows.length}
        </p>
      </div>
    </Link>
  )
}

export default function AdminDashboardHomePage() {
  return (
    <div>
      <h1 className="font-headline text-h2 text-connect-blue">Dashboard</h1>
      <p className="mt-1 text-body text-slate">Overview of everything happening across Care Connect.</p>

      {!isConvexConfigured && (
        <p className="mt-4 rounded-xl border border-border bg-white px-4 py-3 text-body text-slate">
          Convex isn&rsquo;t connected yet — counts below will read live once{' '}
          <code className="text-ink">.env.local</code> has a real deployment URL.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <OverviewCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  )
}
