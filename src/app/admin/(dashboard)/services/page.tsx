'use client'

import { useQuery } from 'convex/react'
import { Heart, CheckCircle } from 'lucide-react'
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
  const all = rows ?? []

  return (
    <DataTable
      title="Services"
      description="Seeded from the live Care Connect API (npx convex run seed:run)."
      columns={columns}
      rows={all}
      loading={isConvexConfigured && rows === undefined}
      error={null}
      connected={isConvexConfigured}
      searchPlaceholder="Search services…"
      summary={[
        { label: 'Total services', value: all.length, icon: Heart },
        { label: 'Active', value: all.filter((r) => r.isActive).length, icon: CheckCircle },
      ]}
    />
  )
}
