import { query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const user = await ctx.db.get(userId)
    const profile = await ctx.db
      .query('adminProfiles')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique()

    return { ...user, profile }
  },
})
