import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { requireAdmin } from './authHelpers'

export const get = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('quotationTemplates').first()
  },
})

// Singleton — patches the one existing row, or creates it on first save.
export const update = mutation({
  args: {
    introTitle: v.string(),
    introBody: v.string(),
    staffTitle: v.string(),
    staffBody: v.string(),
    homeSupportTitle: v.string(),
    homeSupportBody: v.string(),
    personalCareTitle: v.string(),
    personalCareBody: v.string(),
    complexCareTitle: v.string(),
    complexCareBody: v.string(),
    contactEmail: v.string(),
    contactPhone: v.string(),
    contactAddress: v.string(),
    footerNote: v.string(),
  },
  handler: async (ctx, fields) => {
    await requireAdmin(ctx)
    const existing = await ctx.db.query('quotationTemplates').first()
    if (existing) {
      await ctx.db.patch(existing._id, fields)
    } else {
      await ctx.db.insert('quotationTemplates', fields)
    }
  },
})
