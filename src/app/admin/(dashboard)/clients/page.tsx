'use client'

import { useQuery } from 'convex/react'
import type { FunctionReturnType } from 'convex/server'
import { Users, UserCheck, Download } from 'lucide-react'
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

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}

function downloadClientsCsv(rows: ClientRow[]) {
  const header = ['Name', 'Email', 'Phone', 'Status', 'Joined']
  const lines = rows.map((r) =>
    [
      `${r.firstName} ${r.lastName ?? ''}`.trim(),
      r.email,
      r.phoneNumber ?? '',
      r.status ? 'Active' : 'Inactive',
      new Date(r._creationTime).toLocaleDateString(),
    ]
      .map(csvCell)
      .join(',')
  )
  const csv = [header.map(csvCell).join(','), ...lines].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `care-connect-clients-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

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
      actions={
        <button
          type="button"
          onClick={() => downloadClientsCsv(all)}
          disabled={!all.length}
          className="flex min-h-[44px] items-center gap-2 rounded-xl border border-border px-4 text-small font-semibold text-slate transition-colors duration-250 hover:border-connect-blue hover:text-connect-blue disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download list
        </button>
      }
    />
  )
}
