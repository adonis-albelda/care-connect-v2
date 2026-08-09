import { ConvexReactClient } from 'convex/react'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

export const isConvexConfigured = Boolean(convexUrl)

if (!convexUrl) {
  // Expected until `npx convex dev` gives you a real deployment URL — see .env.local.example.
  console.warn('NEXT_PUBLIC_CONVEX_URL is not set. The admin dashboard will not be able to reach Convex yet.')
}

export const convex = new ConvexReactClient(convexUrl || 'https://placeholder.convex.cloud')
