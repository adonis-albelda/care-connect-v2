'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { FileText, Tag, Plus } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import DataTable, { type Column } from '@/components/admin/DataTable'
import AddFormDrawer from '@/components/admin/AddFormDrawer'
import { isConvexConfigured } from '@/lib/convex-client'

type FormRow = Doc<'forms'>

const columns: Column<FormRow>[] = [
  { key: 'title', label: 'Title' },
  {
    key: 'type',
    label: 'Type',
    render: (r) => (
      <span className="inline-flex items-center rounded-full bg-cloud px-2.5 py-1 text-xs font-semibold capitalize text-slate">
        {r.type}
      </span>
    ),
  },
  {
    key: 'filePath',
    label: 'File',
    render: (r) => (
      <a
        href={r.filePath}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-connect-blue underline-offset-2 hover:underline"
      >
        View file
      </a>
    ),
  },
  { key: '_creationTime', label: 'Uploaded', render: (r) => new Date(r._creationTime).toLocaleDateString() },
]

export default function FormsPage() {
  const rows = useQuery(api.forms.list, isConvexConfigured ? {} : 'skip')
  const all = rows ?? []
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <DataTable
        title="Forms"
        description="Uploaded documents for admin, client, and agent use."
        columns={columns}
        rows={all}
        loading={isConvexConfigured && rows === undefined}
        error={null}
        connected={isConvexConfigured}
        searchPlaceholder="Search forms…"
        summary={[
          { label: 'Total forms', value: all.length, icon: FileText },
          { label: 'Types', value: new Set(all.map((r) => r.type)).size, icon: Tag },
        ]}
        actions={
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-connect-blue px-4 text-small font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Upload form
          </button>
        }
      />
      <AddFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  )
}
