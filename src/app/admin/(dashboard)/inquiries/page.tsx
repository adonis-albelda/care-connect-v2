'use client'

import { useQuery } from 'convex/react'
import { MessageSquare, Clock } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { isConvexConfigured } from '@/lib/convex-client'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
// Module-scope, not component-scope: runs once at page load, not on every
// render — calling Date.now() during render trips the React Compiler's
// impure-call check.
const weekCutoff = Date.now() - WEEK_MS

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
  const all = rows ?? []

  return (
    <DataTable
      title="Inquiries"
      description="Contact form submissions. Not seeded — populated from real inquiries."
      columns={columns}
      rows={all}
      loading={isConvexConfigured && rows === undefined}
      error={null}
      connected={isConvexConfigured}
      searchPlaceholder="Search inquiries…"
      summary={[
        { label: 'Total inquiries', value: all.length, icon: MessageSquare },
        { label: 'Last 7 days', value: all.filter((r) => r._creationTime > weekCutoff).length, icon: Clock },
      ]}
    />
  )
}
