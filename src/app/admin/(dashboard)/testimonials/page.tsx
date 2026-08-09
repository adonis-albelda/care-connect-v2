'use client'

import { useQuery } from 'convex/react'
import { Star, CheckCircle, Clock } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import DataTable, { type Column } from '@/components/admin/DataTable'
import TestimonialStatusToggle from '@/components/admin/TestimonialStatusToggle'
import { isConvexConfigured } from '@/lib/convex-client'

type TestimonialRow = Doc<'testimonials'>

const columns: Column<TestimonialRow>[] = [
  { key: 'clientName', label: 'Client', render: (r) => r.clientName ?? `Client ${r.clientId ?? '—'}` },
  {
    key: 'testimony',
    label: 'Testimony',
    render: (r) => (r.testimony.length > 80 ? `${r.testimony.slice(0, 80)}…` : r.testimony),
  },
  { key: 'status', label: 'Status', render: (r) => <TestimonialStatusToggle testimonial={r} /> },
  { key: '_creationTime', label: 'Submitted', render: (r) => new Date(r._creationTime).toLocaleDateString() },
]

export default function TestimonialsPage() {
  const rows = useQuery(api.testimonials.list, isConvexConfigured ? {} : 'skip')
  const all = rows ?? []

  return (
    <DataTable
      title="Testimonials"
      description="Click a status badge to approve or unapprove. Approved testimonials show on the public site."
      columns={columns}
      rows={all}
      loading={isConvexConfigured && rows === undefined}
      error={null}
      connected={isConvexConfigured}
      searchPlaceholder="Search testimonials…"
      summary={[
        { label: 'Total', value: all.length, icon: Star },
        { label: 'Approved', value: all.filter((r) => r.status === 'approved').length, icon: CheckCircle },
        { label: 'Pending', value: all.filter((r) => r.status === 'pending').length, icon: Clock },
      ]}
    />
  )
}
