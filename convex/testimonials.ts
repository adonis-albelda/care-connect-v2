import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { requireAdmin, requireAuth } from './authHelpers'

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('testimonials').order('desc').collect()
  },
})

export const setStatus = mutation({
  args: { id: v.id('testimonials'), status: v.union(v.literal('pending'), v.literal('approved')) },
  handler: async (ctx, { id, status }) => {
    const adminId = await requireAdmin(ctx)
    await ctx.db.patch(id, { status, approver: status === 'approved' ? adminId : undefined })
  },
})

// Public site — signed-in client shares a testimonial. Goes in as pending;
// an admin approves it before it shows up in listApproved below.
export const create = mutation({
  args: { testimony: v.string() },
  handler: async (ctx, { testimony }) => {
    const userId = await requireAuth(ctx)
    const user = await ctx.db.get(userId)
    const profile = await ctx.db
      .query('clientProfiles')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique()
    const clientName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || user?.email

    return ctx.db.insert('testimonials', {
      clientId: userId,
      clientName,
      testimony,
      status: 'pending',
    })
  },
})

// Public — no auth. Only approved testimonials, shaped to match the existing
// frontend `Testimonial` type (matching what the old Laravel API returned) so
// the public site's components don't need to change, only the data source.
export const listApproved = query({
  args: {},
  handler: async (ctx) => {
    const testimonials = await ctx.db.query('testimonials').order('desc').collect()
    return testimonials
      .filter((t) => t.status === 'approved')
      .map((t) => ({
        id: t._id,
        client_name: t.clientName ?? 'Care Connect Client',
        message: t.testimony,
      }))
  },
})
