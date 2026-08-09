'use client'

import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { isConvexConfigured } from '@/lib/convex-client'

export function useServiceQuery(slug?: string) {
  const data = useQuery(api.services.getBySlug, slug && isConvexConfigured ? { slug } : 'skip')
  return { data: data ?? undefined, isLoading: !!slug && isConvexConfigured && data === undefined }
}
