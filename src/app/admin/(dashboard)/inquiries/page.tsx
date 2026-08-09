'use client'

import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { isConvexConfigured } from '@/lib/convex-client'

type InquiryRow = Doc<'inquiries'>

const columns: Column<InquiryRow>[] = [
  { key: 'name', label: 'Name', render: (r) => `${r.firstName} ${r.lastName ?? ''}`.trim() },
  { key: 'emailAddress', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone' },
  { key: 'message', label: 'Message', render: (r) => (r.message.length > 60 ? `${r.message.slice(0, 60)}…` : r.message) },
  { key: '_creationTime', label: 'Received', render: (r) => new Date(r._creationTime).toLocaleDateString() },
]

export default function InquiriesPage() {
  const rows = useQuery(api.inquiries.list, isConvexConfigured ? {} : 'skip')

  return (
    <DataTable
      title="Inquiries"
      description="Contact form submissions. Not seeded — populated from real inquiries."
      columns={columns}
      rows={rows ?? []}
      loading={isConvexConfigured && rows === undefined}
      error={null}
      connected={isConvexConfigured}
    />
  )
}
