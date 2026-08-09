'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { Heart, CheckCircle } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import DataTable, { type Column } from '@/components/admin/DataTable'
import ServiceEditDrawer from '@/components/admin/ServiceEditDrawer'
import { isConvexConfigured } from '@/lib/convex-client'

type ServiceRow = Doc<'services'>

const columns: Column<ServiceRow>[] = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug', render: (r) => <span className="font-mono text-xs text-slate">{r.slug ?? '—'}</span> },
  {
    key: 'isActive',
    label: 'Status',
    render: (r) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
          r.isActive ? 'bg-blue-light text-connect-blue' : 'bg-cloud text-slate'
        }`}
      >
        {r.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  { key: 'assistance', label: 'Activities', render: (r) => r.assistance?.length ?? 0 },
]

export default function ServicesPage() {
  const rows = useQuery(api.services.list, isConvexConfigured ? {} : 'skip')
  const all = rows ?? []
  const [selected, setSelected] = useState<ServiceRow | null>(null)

  return (
    <>
      <DataTable
        title="Services"
        description="Seeded from the live Care Connect API (npx convex run seed:run). Click a row to edit."
        columns={columns}
        rows={all}
        loading={isConvexConfigured && rows === undefined}
        error={null}
        connected={isConvexConfigured}
        searchPlaceholder="Search services…"
        onRowClick={(row) => setSelected(row)}
        summary={[
          { label: 'Total services', value: all.length, icon: Heart },
          { label: 'Active', value: all.filter((r) => r.isActive).length, icon: CheckCircle },
        ]}
      />
      <ServiceEditDrawer service={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  )
}
