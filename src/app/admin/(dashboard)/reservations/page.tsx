'use client'

import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { isConvexConfigured } from '@/lib/convex-client'

type ReservationRow = Doc<'reservations'>

const columns: Column<ReservationRow>[] = [
  { key: 'email', label: 'Email' },
  { key: 'serviceId', label: 'Service ID' },
  { key: 'dates', label: 'Dates', render: (r) => `${r.startDate} → ${r.endDate}` },
  { key: 'time', label: 'Time', render: (r) => `${r.startTime} – ${r.endTime}` },
  { key: 'total', label: 'Total', render: (r) => (r.total != null ? `$${r.total.toFixed(2)}` : '—') },
]

export default function ReservationsPage() {
  const rows = useQuery(api.reservations.list, isConvexConfigured ? {} : 'skip')

  return (
    <DataTable
      title="Reservations"
      description="Booking requests. Not seeded — populated from real quote requests."
      columns={columns}
      rows={rows ?? []}
      loading={isConvexConfigured && rows === undefined}
      error={null}
      connected={isConvexConfigured}
    />
  )
}
