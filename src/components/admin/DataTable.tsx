'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Column<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

export interface SummaryCard {
  label: string
  value: string | number
  icon?: LucideIcon
}

function rowMatches(row: unknown, query: string) {
  if (!query) return true
  const q = query.toLowerCase()
  return Object.values(row as Record<string, unknown>).some((value) => {
    if (value == null) return false
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value).toLowerCase().includes(q)
    }
    if (Array.isArray(value)) return value.some((v) => String(v).toLowerCase().includes(q))
    return false
  })
}

export default function DataTable<T extends { _id: React.Key }>({
  title,
  description,
  columns,
  rows,
  loading,
  error,
  connected,
  summary,
  searchPlaceholder = 'Search…',
  onRowClick,
  actions,
}: {
  title: string
  description: string
  columns: Column<T>[]
  rows: T[]
  loading: boolean
  error: string | null
  connected: boolean
  summary?: SummaryCard[]
  searchPlaceholder?: string
  onRowClick?: (row: T) => void
  actions?: ReactNode
}) {
  const [query, setQuery] = useState('')
  const filteredRows = useMemo(() => rows.filter((row) => rowMatches(row, query)), [rows, query])

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-headline text-h2 text-connect-blue">{title}</h1>
          <p className="mt-1 text-small text-slate">{description}</p>
        </div>
        {actions}
      </div>

      {summary && summary.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((card) => (
            <div key={card.label} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-card">
              {card.icon && (
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-light">
                  <card.icon className="h-5 w-5 text-connect-blue" aria-hidden="true" />
                </span>
              )}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate">{card.label}</p>
                <p className="font-headline text-h3 text-ink">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {connected && !loading && !error && rows.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="min-h-[40px] w-full rounded-lg border border-border bg-white pl-9 pr-3 text-small text-ink transition-colors duration-250 focus:border-connect-blue focus:outline-none"
            />
          </div>
          <p className="text-xs text-slate">
            {query ? `${filteredRows.length} of ${rows.length}` : `${rows.length}`} {rows.length === 1 ? 'record' : 'records'}
          </p>
        </div>
      )}

      <div className="mt-4 border border-border bg-white">
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
        ) : filteredRows.length === 0 ? (
          <p className="p-8 text-center text-body text-slate">No records match &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead className="border-b border-border bg-cloud text-xs font-semibold uppercase tracking-wide text-slate">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-2.5">
                      {col.label}
                    </th>
                  ))}
                  {onRowClick && <th className="w-10 px-2 py-2.5" aria-hidden="true" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRows.map((row) => (
                  <tr
                    key={row._id}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={
                      onRowClick
                        ? 'group cursor-pointer transition-colors duration-150 hover:bg-cloud'
                        : 'transition-colors duration-150 hover:bg-cloud'
                    }
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-2.5 text-ink">
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                      </td>
                    ))}
                    {onRowClick && (
                      <td className="px-2 py-2.5 text-mist">
                        <ChevronRight className="h-4 w-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100" aria-hidden="true" />
                      </td>
                    )}
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
