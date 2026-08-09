import { v } from 'convex/values'
import { internalMutation } from './_generated/server'

export const insertServices = internalMutation({
  args: {
    services: v.array(
      v.object({
        title: v.string(),
        shortDescription: v.string(),
        description: v.string(),
        isActive: v.boolean(),
        banner: v.optional(v.string()),
        slug: v.optional(v.string()),
        assistance: v.optional(v.array(v.string())),
      })
    ),
  },
  handler: async (ctx, { services }) => {
    for (const service of services) {
      const existing = service.slug
        ? await ctx.db
            .query('services')
            .withIndex('by_slug', (q) => q.eq('slug', service.slug))
            .unique()
        : null
      if (existing) {
        await ctx.db.patch(existing._id, service)
      } else {
        await ctx.db.insert('services', service)
      }
    }
    return services.length
  },
})

export const insertTestimonials = internalMutation({
  args: {
    testimonials: v.array(
      v.object({
        clientName: v.string(),
        testimony: v.string(),
      })
    ),
  },
  handler: async (ctx, { testimonials }) => {
    for (const t of testimonials) {
      await ctx.db.insert('testimonials', {
        clientId: undefined,
        clientName: t.clientName,
        testimony: t.testimony,
        status: 'approved',
      })
    }
    return testimonials.length
  },
})

// createAccount() (from @convex-dev/auth/server) needs an action context, not
// a mutation context, so it's called directly from the seed action in
// seed.ts. This mutation only handles the plain-db-write half: the
// adminProfiles row for whatever user id that produced.
export const insertAdminProfile = internalMutation({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const existingProfile = await ctx.db
      .query('adminProfiles')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique()

    if (existingProfile) return existingProfile._id

    return ctx.db.insert('adminProfiles', {
      userId,
      firstName: 'Care Connect',
      lastName: 'Admin',
      status: true,
      isAdmin: true,
    })
  },
})
