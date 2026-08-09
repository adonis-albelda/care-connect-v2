'use node'

// Seeds Convex with the admin dashboard's starting data.
//
// Per explicit instruction: only `services` and `testimonials` are seeded.
// `clients`, `reservations`, and `inquiries` are intentionally left empty —
// those are real-world records that should come from actual usage, not fixtures.
//
// Service/testimonial content is fetched LIVE from the existing public API
// (the same one the Care Connect site already uses) rather than baked in as a
// stale hardcoded snapshot, so re-running this action picks up real changes.
//
// Actions run in Convex's Node runtime (needed for fetch()); the actual
// database writes live in seedMutations.ts, which runs in the default
// runtime — mutations can't run under 'use node'.
//
// Usage (after `npx convex dev` has a real deployment running):
//   npx convex run seed:run

import { action } from './_generated/server'
import { internal } from './_generated/api'
import { createAccount } from '@convex-dev/auth/server'

const API_BASE = process.env.CARE_CONNECT_API_BASE ?? 'https://admin.ucarecon.ca'
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@careconnect.local'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!'

export const run = action({
  args: {},
  handler: async (ctx) => {
    console.log(`Creating default admin account (${ADMIN_EMAIL})…`)
    const { user } = await createAccount(ctx, {
      provider: 'password',
      account: { id: ADMIN_EMAIL, secret: ADMIN_PASSWORD },
      profile: { email: ADMIN_EMAIL },
    })
    await ctx.runMutation(internal.seedMutations.insertAdminProfile, { userId: user._id })
    console.log('Default admin ready. Change this password after first login.')

    console.log('Fetching live services from', API_BASE, '…')
    const servicesRes = await fetch(`${API_BASE}/api/front/active/services`, {
      headers: { Accept: 'application/json' },
    })
    if (!servicesRes.ok) throw new Error(`Services fetch failed: ${servicesRes.status}`)
    const rawServices = (await servicesRes.json()) as Array<{
      title: string
      short_description: string
      description: string
      is_active: boolean
      banner?: string
      slug?: string
      assistance?: string[]
    }>

    const servicesCount = await ctx.runMutation(internal.seedMutations.insertServices, {
      services: rawServices.map((s) => ({
        title: s.title,
        shortDescription: s.short_description,
        description: s.description,
        isActive: !!s.is_active,
        banner: s.banner,
        slug: s.slug,
        assistance: s.assistance,
      })),
    })
    console.log(`Seeded ${servicesCount} service(s).`)

    console.log('Fetching live testimonials from', API_BASE, '…')
    const testimonialsRes = await fetch(`${API_BASE}/api/front/testimonials`, {
      headers: { Accept: 'application/json' },
    })
    if (!testimonialsRes.ok) throw new Error(`Testimonials fetch failed: ${testimonialsRes.status}`)
    const { data: rawTestimonials } = (await testimonialsRes.json()) as {
      data: Array<{ client_name: string; message: string }>
    }

    const testimonialsCount = await ctx.runMutation(internal.seedMutations.insertTestimonials, {
      testimonials: rawTestimonials.map((t) => ({ clientName: t.client_name, testimony: t.message })),
    })
    console.log(`Seeded ${testimonialsCount} testimonial(s).`)

    console.log('Done.')
  },
})
