'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import type { FunctionReturnType } from 'convex/server'
import { CalendarCheck, DollarSign, Clock, Send, FileText } from 'lucide-react'
import { api } from '@convex/_generated/api'
import DataTable, { type Column } from '@/components/admin/DataTable'
import SendQuoteDrawer from '@/components/admin/SendQuoteDrawer'
import { isConvexConfigured } from '@/lib/convex-client'

type ReservationRow = FunctionReturnType<typeof api.reservations.list>[number]

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
// Module-scope, not component-scope: runs once at page load, not on every
// render — calling Date.now() during render trips the React Compiler's
// impure-call check.
const weekCutoff = Date.now() - WEEK_MS

export default function ReservationsPage() {
  const rows = useQuery(api.reservations.list, isConvexConfigured ? {} : 'skip')
  const all = rows ?? []
  const [selected, setSelected] = useState<ReservationRow | null>(null)

  const columns: Column<ReservationRow>[] = [
    { key: 'clientEmail', label: 'Client' },
    { key: 'serviceTitle', label: 'Service' },
    { key: 'dates', label: 'Dates', render: (r) => `${r.startDate} → ${r.endDate}` },
    { key: 'time', label: 'Time', render: (r) => `${r.startTime} – ${r.endTime}` },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            r.status === 'quoted' ? 'bg-blue-light text-connect-blue' : 'bg-cloud text-slate'
          }`}
        >
          {r.status === 'quoted' ? 'Quoted' : 'Pending'}
        </span>
      ),
    },
    { key: 'total', label: 'Total', render: (r) => (r.total != null ? `$${r.total.toFixed(2)}` : '—') },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) =>
        r.status === 'quoted' ? (
          <Link
            href={`/admin/reservations/${r._id}/quotation`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate transition-colors duration-250 hover:border-connect-blue hover:text-connect-blue"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            View Quotation
          </Link>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSelected(r)
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate transition-colors duration-250 hover:border-connect-blue hover:text-connect-blue"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Send Quote
          </button>
        ),
    },
  ]

  return (
    <>
      <DataTable
        title="Reservations"
        description="Booking requests. Not seeded — populated from real quote requests."
        columns={columns}
        rows={all}
        loading={isConvexConfigured && rows === undefined}
        error={null}
        connected={isConvexConfigured}
        searchPlaceholder="Search reservations…"
        onRowClick={(row) => row.status !== 'quoted' && setSelected(row)}
        summary={[
          { label: 'Total reservations', value: all.length, icon: CalendarCheck },
          { label: 'Last 7 days', value: all.filter((r) => r._creationTime > weekCutoff).length, icon: Clock },
          {
            label: 'Priced total',
            value: `$${all.reduce((sum, r) => sum + (r.total ?? 0), 0).toFixed(2)}`,
            icon: DollarSign,
          },
        ]}
      />
      <SendQuoteDrawer reservation={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  )
}
