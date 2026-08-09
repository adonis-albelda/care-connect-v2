export interface Column<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

export default function DataTable<T extends { _id: React.Key }>({
  title,
  description,
  columns,
  rows,
  loading,
  error,
  connected,
}: {
  title: string
  description: string
  columns: Column<T>[]
  rows: T[]
  loading: boolean
  error: string | null
  connected: boolean
}) {
  return (
    <div>
      <h1 className="font-headline text-h2 text-connect-blue">{title}</h1>
      <p className="mt-1 text-body text-slate">{description}</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-card">
        {!connected ? (
          <div className="p-8 text-center">
            <p className="text-body-lg font-medium text-ink">Convex isn&rsquo;t connected yet</p>
            <p className="mt-2 text-body text-slate">
              Run <code className="text-ink">npx convex dev</code>, copy{' '}
              <code className="text-ink">.env.local.example</code> to <code className="text-ink">.env.local</code>,
              fill in the real values, then <code className="text-ink">npx convex run seed:run</code>.
            </p>
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-3 p-6" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-border" />
            ))}
          </div>
        ) : error ? (
          <p className="p-8 text-center text-body text-error" role="alert">
            {error}
          </p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-body text-slate">No records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body">
              <thead className="border-b border-border bg-cloud text-small font-semibold uppercase tracking-wide text-slate">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={row._id} className="hover:bg-cloud">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-ink">
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
