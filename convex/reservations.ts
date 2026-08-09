import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { requireAdmin, requireAuth } from './authHelpers'

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const reservations = await ctx.db.query('reservations').order('desc').collect()
    return Promise.all(
      reservations.map(async (reservation) => {
        const [service, client] = await Promise.all([
          ctx.db.get(reservation.serviceId),
          ctx.db.get(reservation.clientId),
        ])
        return {
          ...reservation,
          serviceTitle: service?.title ?? 'Unknown service',
          clientEmail: client?.email ?? reservation.email ?? '—',
        }
      })
    )
  },
})

// Admin — edit a reservation's schedule and pricing after staff review it.
export const update = mutation({
  args: {
    id: v.id('reservations'),
    startDate: v.string(),
    endDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    ratePerHour: v.optional(v.number()),
    hst: v.string(),
    hstAmount: v.optional(v.number()),
    serviceAmount: v.optional(v.number()),
    total: v.optional(v.number()),
    totalHours: v.optional(v.number()),
    totalDays: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx)
    await ctx.db.patch(id, fields)
  },
})

// Public site — signed-in client requests a booking. Rate/total fields are
// left for the admin dashboard to fill in once staff price the request.
export const create = mutation({
  args: {
    serviceId: v.id('services'),
    startDate: v.string(),
    endDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx)
    const user = await ctx.db.get(userId)
    return ctx.db.insert('reservations', {
      ...args,
      clientId: userId,
      email: user?.email,
      hst: '0',
    })
  },
})
