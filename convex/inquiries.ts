import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { requireAdmin } from './authHelpers'

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('inquiries').order('desc').collect()
  },
})

// Admin — record a reply. Convex has no outbound email, so this just saves
// the reply as a record; the drawer hands the actual send off to the
// admin's own mail client.
export const reply = mutation({
  args: { id: v.id('inquiries'), reply: v.string() },
  handler: async (ctx, { id, reply }) => {
    await requireAdmin(ctx)
    await ctx.db.patch(id, { reply, repliedAt: Date.now() })
  },
})

// Public — no auth. The contact form is open to anonymous site visitors.
export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.optional(v.string()),
    emailAddress: v.string(),
    phoneNumber: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => ctx.db.insert('inquiries', args),
})
