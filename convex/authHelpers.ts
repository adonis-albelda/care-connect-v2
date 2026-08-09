import { getAuthUserId } from '@convex-dev/auth/server'
import type { QueryCtx, MutationCtx } from './_generated/server'

// Any signed-in Convex Auth user — currently only admin/staff accounts exist,
// so this and requireAdmin are equivalent today. Once public clients also
// authenticate through Convex Auth, this stops being safe for admin-only data:
// use requireAdmin below for anything under the admin dashboard.
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx)
  if (!userId) throw new Error('Not authenticated')
  return userId
}

// The actual admin security boundary: signed in AND flagged isAdmin in
// adminProfiles. Every admin-only query/mutation should call this, not
// requireAuth — being logged in is not the same as being staff.
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await requireAuth(ctx)
  const profile = await ctx.db
    .query('adminProfiles')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .unique()
  if (!profile?.isAdmin) throw new Error('Not authorized')
  return userId
}
