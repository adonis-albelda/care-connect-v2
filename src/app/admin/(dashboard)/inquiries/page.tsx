'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { MessageSquare, Clock, Reply } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import DataTable, { type Column } from '@/components/admin/DataTable'
import InquiryReplyDrawer from '@/components/admin/InquiryReplyDrawer'
import { isConvexConfigured } from '@/lib/convex-client'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
// Module-scope, not component-scope: runs once at page load, not on every
// render — calling Date.now() during render trips the React Compiler's
// impure-call check.
const weekCutoff = Date.now() - WEEK_MS

type InquiryRow = Doc<'inquiries'>

export default function InquiriesPage() {
  const rows = useQuery(api.inquiries.list, isConvexConfigured ? {} : 'skip')
  const all = rows ?? []
  const [selected, setSelected] = useState<InquiryRow | null>(null)

  const columns: Column<InquiryRow>[] = [
    { key: 'name', label: 'Name', render: (r) => `${r.firstName} ${r.lastName ?? ''}`.trim() },
    { key: 'emailAddress', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'message', label: 'Message', render: (r) => (r.message.length > 60 ? `${r.message.slice(0, 60)}…` : r.message) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            r.repliedAt ? 'bg-blue-light text-connect-blue' : 'bg-cloud text-slate'
          }`}
        >
          {r.repliedAt ? 'Replied' : 'New'}
        </span>
      ),
    },
    { key: '_creationTime', label: 'Received', render: (r) => new Date(r._creationTime).toLocaleDateString() },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setSelected(r)
          }}
          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate transition-colors duration-250 hover:border-connect-blue hover:text-connect-blue"
        >
          <Reply className="h-3.5 w-3.5" aria-hidden="true" />
          {r.repliedAt ? 'View reply' : 'Reply'}
        </button>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title="Inquiries"
        description="Contact form submissions. Not seeded — populated from real inquiries."
        columns={columns}
        rows={all}
        loading={isConvexConfigured && rows === undefined}
        error={null}
        connected={isConvexConfigured}
        searchPlaceholder="Search inquiries…"
        onRowClick={(row) => setSelected(row)}
        summary={[
          { label: 'Total inquiries', value: all.length, icon: MessageSquare },
          { label: 'Last 7 days', value: all.filter((r) => r._creationTime > weekCutoff).length, icon: Clock },
        ]}
      />
      <InquiryReplyDrawer inquiry={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  )
}
