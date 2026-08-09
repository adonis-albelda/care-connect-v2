'use client'

import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { isConvexConfigured } from '@/lib/convex-client'

type TestimonialRow = Doc<'testimonials'>

const columns: Column<TestimonialRow>[] = [
  { key: 'clientName', label: 'Client', render: (r) => r.clientName ?? `Client ${r.clientId ?? '—'}` },
  {
    key: 'testimony',
    label: 'Testimony',
    render: (r) => (r.testimony.length > 80 ? `${r.testimony.slice(0, 80)}…` : r.testimony),
  },
  { key: 'status', label: 'Status', render: (r) => (r.status === 'approved' ? 'Approved' : 'Pending') },
  { key: '_creationTime', label: 'Submitted', render: (r) => new Date(r._creationTime).toLocaleDateString() },
]

export default function TestimonialsPage() {
  const rows = useQuery(api.testimonials.list, isConvexConfigured ? {} : 'skip')

  return (
    <DataTable
      title="Testimonials"
      description="Seeded from the live Care Connect API (npx convex run seed:run)."
      columns={columns}
      rows={rows ?? []}
      loading={isConvexConfigured && rows === undefined}
      error={null}
      connected={isConvexConfigured}
    />
  )
}
