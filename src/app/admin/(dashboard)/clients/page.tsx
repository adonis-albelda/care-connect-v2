'use client'

import { useQuery } from 'convex/react'
import type { FunctionReturnType } from 'convex/server'
import { Users, UserCheck } from 'lucide-react'
import { api } from '@convex/_generated/api'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { isConvexConfigured } from '@/lib/convex-client'

type ClientRow = FunctionReturnType<typeof api.clients.list>[number]

const columns: Column<ClientRow>[] = [
  { key: 'name', label: 'Name', render: (r) => `${r.firstName} ${r.lastName ?? ''}`.trim() },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone' },
  { key: 'status', label: 'Status', render: (r) => (r.status ? 'Active' : 'Inactive') },
  { key: '_creationTime', label: 'Joined', render: (r) => new Date(r._creationTime).toLocaleDateString() },
]

export default function ClientsPage() {
  const rows = useQuery(api.clients.list, isConvexConfigured ? {} : 'skip')
  const all = rows ?? []

  return (
    <DataTable
      title="Clients"
      description="Families with an account. Not seeded — populated from real signups."
      columns={columns}
      rows={all}
      loading={isConvexConfigured && rows === undefined}
      error={null}
      connected={isConvexConfigured}
      searchPlaceholder="Search clients…"
      summary={[
        { label: 'Total clients', value: all.length, icon: Users },
        { label: 'Active', value: all.filter((r) => r.status).length, icon: UserCheck },
      ]}
    />
  )
}
