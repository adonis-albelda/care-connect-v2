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
