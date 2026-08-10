import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { requireAdmin } from './authHelpers'

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('forms').order('desc').collect()
  },
})

// Returns a short-lived URL the browser can POST a file to directly.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.storage.generateUploadUrl()
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal('admin'), v.literal('client'), v.literal('agent')),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, { title, type, storageId }) => {
    await requireAdmin(ctx)
    const url = await ctx.storage.getUrl(storageId)
    if (!url) throw new Error('Upload failed')
    return ctx.db.insert('forms', { title, type, filePath: url })
  },
})
