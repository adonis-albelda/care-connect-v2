import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { requireAdmin, requireAuth } from './authHelpers'
import { getAuthUserId } from '@convex-dev/auth/server'

// Source of truth is `users`, not `clientProfiles` — a client who signs up
// via OAuth never calls upsertProfile (only the password signUp flow does),
// so they'd have no clientProfiles row and silently never show up here.
// clientProfiles is joined in for the extra fields when present.
export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const [users, adminProfiles] = await Promise.all([
      ctx.db.query('users').order('desc').collect(),
      ctx.db.query('adminProfiles').collect(),
    ])
    const adminUserIds = new Set(adminProfiles.map((p) => p.userId))
    const clientUsers = users.filter((u) => !adminUserIds.has(u._id))

    return Promise.all(
      clientUsers.map(async (user) => {
        const profile = await ctx.db
          .query('clientProfiles')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .unique()
        return {
          _id: user._id,
          _creationTime: user._creationTime,
          firstName: profile?.firstName ?? '',
          lastName: profile?.lastName,
          phoneNumber: profile?.phoneNumber,
          status: profile?.status ?? true,
          email: user.email ?? '',
        }
      })
    )
  },
})

// Public site — signed-in client's own user + clientProfile, shaped to match
// the old Laravel ApiUser (email + first/last name at the top level) so
// SiteHeader/GetQuoteForm etc. don't need shape changes, only the data source.
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const user = await ctx.db.get(userId)
    const profile = await ctx.db
      .query('clientProfiles')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique()

    return {
      id: userId,
      email: user?.email ?? '',
      first_name: profile?.firstName,
      last_name: profile?.lastName,
    }
  },
})

// Self-serve — creates or updates the caller's own clientProfile. Called
// right after sign-up (no email verification step, see schema.ts) and
// available for a future "edit profile" page.
export const upsertProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx)
    const existing = await ctx.db
      .query('clientProfiles')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, args)
      return existing._id
    }

    return ctx.db.insert('clientProfiles', { userId, status: true, ...args })
  },
})
