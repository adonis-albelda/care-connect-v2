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
          status: reservation.status ?? 'pending',
          serviceTitle: service?.title ?? 'Unknown service',
          clientEmail: client?.email ?? reservation.email ?? '—',
        }
      })
    )
  },
})

// Admin — price a pending reservation and send the quote. Moves it from
// pending to quoted; nothing else about the request is editable here.
export const sendQuote = mutation({
  args: {
    id: v.id('reservations'),
    ratePerHour: v.number(),
    hst: v.string(),
    hstAmount: v.number(),
    serviceAmount: v.number(),
    total: v.number(),
    totalHours: v.number(),
    totalDays: v.number(),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx)
    await ctx.db.patch(id, { ...fields, status: 'quoted' })
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
      hst: '13',
      status: 'pending',
    })
  },
})
