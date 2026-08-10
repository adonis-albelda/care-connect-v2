import type { ReactNode } from 'react'

// Matches quotation.pdf's solid blue "Service"/"Total" section bars.
export default function QuotationSectionBar({ children }: { children: ReactNode }) {
  return <div className="bg-connect-blue px-4 py-2.5 text-body-lg font-semibold text-white">{children}</div>
}
