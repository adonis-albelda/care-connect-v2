import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { requireAdmin } from './authHelpers'

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('services').order('desc').collect()
  },
})

// Slug is set once at creation and not editable here; banner is managed
// separately via generateUploadUrl + setBanner below.
export const update = mutation({
  args: {
    id: v.id('services'),
    title: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    isActive: v.boolean(),
    assistance: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx)
    await ctx.db.patch(id, fields)
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

// Resolves the uploaded file's storageId to a servable URL and saves it as
// the banner — keeps `banner: string` the same shape everywhere else on the
// site instead of threading storage ids through every consumer.
export const setBanner = mutation({
  args: { id: v.id('services'), storageId: v.id('_storage') },
  handler: async (ctx, { id, storageId }) => {
    await requireAdmin(ctx)
    const url = await ctx.storage.getUrl(storageId)
    await ctx.db.patch(id, { banner: url ?? undefined })
    return url
  },
})

// Public — no auth. Services are marketing content, meant for anonymous
// site visitors. Shaped to match the existing frontend `Service` type
// (snake_case, matching what the old Laravel API returned) so the public
// site's components don't need to change, only the data source.
export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db.query('services').order('desc').collect()
    return services
      .filter((s) => s.isActive)
      .map((s) => ({
        id: s._id,
        title: s.title,
        slug: s.slug ?? '',
        short_description: s.shortDescription,
        description: s.description,
        banner: s.banner,
        assistance: s.assistance,
      }))
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const service = await ctx.db
      .query('services')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique()
    if (!service) return null
    return {
      id: service._id,
      title: service.title,
      slug: service.slug ?? '',
      short_description: service.shortDescription,
      description: service.description,
      banner: service.banner,
      assistance: service.assistance,
    }
  },
})
