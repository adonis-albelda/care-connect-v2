'use client'

import type { ReactNode } from 'react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { convex } from '@/lib/convex-client'

export default function SiteConvexProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
}
