import { query } from './_generated/server'
import { requireAdmin } from './authHelpers'

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('forms').order('desc').collect()
  },
})
