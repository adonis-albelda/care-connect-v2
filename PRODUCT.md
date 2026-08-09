# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user: adult child (roughly 40-60) arranging care for aging parent. Stressed, time-pressed, often unfamiliar with the care system. Elderly care recipient exists but is not the primary site user.

## Product Purpose

Care-Connect moves finding and managing care for aging loved ones from a stressful, confusing process into something simple, transparent, human. Success = family understands options fast, submits needs, gets a tailored quote, books with confidence.

## Positioning

Care-Connect is a **direct provider** — it employs/manages its own caregivers and delivers care itself (Home Support, Personal Care, Complex Care), not a marketplace matching families to third-party agencies. Pricing is a **custom quote per family** (via get-quote flow), not fixed subscription tiers — DESIGN-SYSTEM.md's "3 plan" language is stale/aspirational and should not be treated as current pricing structure.

## Operating Context

Family researches services (home-care, personal-care, complex-care service pages), requests a quote (get-quote flow), can book/manage via account (login, register, booking drawer). Support paths: contact, help. Auth flows: forgot-password, reset-password, verify-code.

## Capabilities and Constraints

- Three service lines: Home Support Services, Personal Care Services, Complex Care Services — each with its own service-detail/booking page.
- Quote request is the primary conversion mechanism, not a plan picker.
- Accounts exist (login/register) for managing bookings/care plans post-quote.
- Undecided: whether fixed plans/tiers will ever be introduced alongside custom quotes.

## Brand Commitments

Name: Care-Connect. Logo: two interlocking figures (blue + orange) symbolizing connection/support — this motif should echo through visual design. Full brand voice/tone/color/type system already documented in DESIGN-SYSTEM.md (treat as incumbent visual authority, not to be re-decided here); note its "3 plans" pricing references are stale against confirmed custom-quote model above.

## Evidence on Hand

No confirmed real testimonials, case studies, or press were verified during this session — TestimonialsSection/TestimonialPrompt components exist in code but content authenticity not confirmed. Do not treat existing placeholder copy as verified real evidence without checking with the user.

## Product Principles

1. Trust first — every screen should lower anxiety, not add to it.
2. Clarity over cleverness — elderly users, families, caregivers must understand instantly.
3. Warmth, not transactional — this is people caring for people.
4. Custom quote, not shelf pricing — the flow should feel tailored to each family's situation, not like picking a SaaS tier.
5. Modern polish as finishing layer only — never at the cost of usability for an older/anxious audience.

## Accessibility & Inclusion

WCAG 2.1 AA minimum (per DESIGN-SYSTEM.md), audience skews older — 16px minimum body text, high contrast, full keyboard nav. No product-specific needs beyond what DESIGN-SYSTEM.md already commits to.
