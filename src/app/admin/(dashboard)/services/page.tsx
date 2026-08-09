'use client'

import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { isConvexConfigured } from '@/lib/convex-client'

type ServiceRow = Doc<'services'>

const columns: Column<ServiceRow>[] = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug' },
  { key: 'isActive', label: 'Active', render: (r) => (r.isActive ? 'Yes' : 'No') },
  { key: 'assistance', label: 'Activities', render: (r) => r.assistance?.length ?? 0 },
]

export default function ServicesPage() {
  const rows = useQuery(api.services.list, isConvexConfigured ? {} : 'skip')

  return (
    <DataTable
      title="Services"
      description="Seeded from the live Care Connect API (npx convex run seed:run)."
      columns={columns}
      rows={rows ?? []}
      loading={isConvexConfigured && rows === undefined}
      error={null}
      connected={isConvexConfigured}
    />
  )
}
