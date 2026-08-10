import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

// Translated from careconnect-back (Laravel) migrations.
//
// Notable departures from the Laravel schema, and why:
//   * No manual `id`/`created_at`/`updated_at` columns — Convex gives every
//     document `_id` and `_creationTime` automatically.
//   * Foreign keys are `v.id("<table>")` references instead of bare bigints —
//     Convex's native relation type, enforced at the type level.
//   * Admin/staff login (`users`) is owned entirely by `authTables` from
//     @convex-dev/auth (email/password + Google/Facebook OAuth). Custom staff
//     profile fields live in a separate `adminProfiles` table keyed by
//     `userId: v.id("users")`, so we never redefine convex-auth's own table.
//   * `testimonials.clientId` is optional, and a new optional `clientName`
//     field was added. Reason: the seed data comes from the live public API,
//     which returns a display name but no client record, and clients are
//     intentionally not seeded — so seeded testimonials can't reference a real
//     client. Testimonials created from the admin dashboard for a real client
//     should still set clientId normally.
//   * Public clients (site visitors, not staff) also authenticate through
//     Convex Auth's `users` table now — one login system, not two. The
//     original standalone `clients` table (a plain data mirror of Laravel's
//     schema, never actually populated) is gone; a `clientProfiles` table
//     keyed by `userId: v.id("users")` holds the customer-specific fields,
//     the same sidecar pattern as `adminProfiles`. `reservations.clientId`
//     and `testimonials.clientId` now reference `users`, not the old table.

export default defineSchema({
  ...authTables,

  adminProfiles: defineTable({
    userId: v.id('users'),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone1: v.optional(v.string()),
    phone2: v.optional(v.string()),
    birthday: v.optional(v.string()),
    address1: v.optional(v.string()),
    address2: v.optional(v.string()),
    profile: v.optional(v.string()),
    status: v.boolean(),
    isAdmin: v.boolean(),
  }).index('by_user', ['userId']),

  clientProfiles: defineTable({
    userId: v.id('users'),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    status: v.boolean(),
  }).index('by_user', ['userId']),

  services: defineTable({
    title: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    isActive: v.boolean(),
    banner: v.optional(v.string()),
    slug: v.optional(v.string()),
    assistance: v.optional(v.array(v.string())),
  }).index('by_slug', ['slug']),

  reservations: defineTable({
    email: v.optional(v.string()),
    serviceId: v.id('services'),
    startTime: v.string(),
    endTime: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    clientId: v.id('users'),
    ratePerHour: v.optional(v.number()),
    hst: v.string(),
    total: v.optional(v.number()),
    hstAmount: v.optional(v.number()),
    serviceAmount: v.optional(v.number()),
    totalHours: v.optional(v.number()),
    totalDays: v.optional(v.number()),
    // Optional (not backfilled on existing rows) — code treats a missing
    // status as 'pending'. New rows always set it explicitly.
    status: v.optional(v.union(v.literal('pending'), v.literal('quoted'))),
  })
    .index('by_client', ['clientId'])
    .index('by_service', ['serviceId']),

  inquiries: defineTable({
    firstName: v.string(),
    lastName: v.optional(v.string()),
    emailAddress: v.string(),
    phoneNumber: v.string(),
    message: v.string(),
    // Convex can't send email itself — reply is saved here as a record and
    // handed to the admin's own mail client (mailto:) to actually send.
    reply: v.optional(v.string()),
    repliedAt: v.optional(v.number()),
  }),

  forms: defineTable({
    title: v.string(),
    type: v.string(),
    filePath: v.string(),
  }),

  testimonials: defineTable({
    clientId: v.optional(v.id('users')),
    clientName: v.optional(v.string()),
    testimony: v.string(),
    status: v.union(v.literal('pending'), v.literal('approved')),
    approver: v.optional(v.id('users')),
  }).index('by_client', ['clientId']),

  // Singleton (one row) — the editable boilerplate text used on the printed
  // quotation document. Quoted service details and pricing come from
  // services/reservations instead of being duplicated here.
  quotationTemplates: defineTable({
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
  }),
})
