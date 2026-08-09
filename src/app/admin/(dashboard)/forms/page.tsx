'use client'

import { useQuery } from 'convex/react'
import { FileText, Tag } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { isConvexConfigured } from '@/lib/convex-client'

type FormRow = Doc<'forms'>

const columns: Column<FormRow>[] = [
  { key: 'title', label: 'Title' },
  { key: 'type', label: 'Type' },
  { key: 'filePath', label: 'File' },
  { key: '_creationTime', label: 'Uploaded', render: (r) => new Date(r._creationTime).toLocaleDateString() },
]

export default function FormsPage() {
  const rows = useQuery(api.forms.list, isConvexConfigured ? {} : 'skip')
  const all = rows ?? []

  return (
    <DataTable
      title="Forms"
      description="Uploaded documents. Not seeded — populated when a real form is added."
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
    />
  )
}
