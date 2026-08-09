'use client'

import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { isConvexConfigured } from '@/lib/convex-client'

export function useTestimonialsQuery() {
  const data = useQuery(api.testimonials.listApproved, isConvexConfigured ? {} : 'skip')
  return { data: data ?? [], isLoading: isConvexConfigured && data === undefined }
}
