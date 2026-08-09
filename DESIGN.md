---
name: Care Connect
description: In-home care booking platform for families arranging care for aging loved ones
colors:
  trust-blue: "#183891"
  trust-blue-deep: "#0F2461"
  trust-blue-light: "#D6E0F5"
  warm-amber: "#E68A25"
  warm-amber-light: "#FCE3C5"
  warm-amber-deep: "#B5680F"
  ink: "#1A1D29"
  slate: "#5B6070"
  mist: "#9AA0B0"
  cloud: "#F4F6FA"
  white: "#FFFFFF"
  border: "#E3E6ED"
  success: "#2E9E5B"
  warning: "#E6A825"
  error: "#D64545"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "56px"
    fontWeight: 700
    lineHeight: 1.2
  headline-h1:
    fontFamily: "Poppins, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.25
  headline-h2:
    fontFamily: "Poppins, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.3
  headline-h3:
    fontFamily: "Poppins, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
spacing:
  scale: "4, 8, 16, 24, 32, 48, 64, 96 (8px base unit)"
components:
  button-primary:
    backgroundColor: "{colors.trust-blue}"
    textColor: "#FFFFFF"
    rounded: "{rounded.xl}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.trust-blue-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.trust-blue}"
    rounded: "{rounded.xl}"
    padding: "0 20px"
    height: "44px"
  card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.2xl}"
    padding: "24px"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    height: "48px"
---

# Design System: Care Connect

## Overview

**Creative North Star: "The Trusted Companion"**

Care Connect looks like a knowledgeable friend sitting down with you at the kitchen table, not a hospital intake form. Every surface is built to lower an anxious family member's cognitive load first and impress second: generous whitespace, large legible type, soft rounded geometry echoing the logo's two interlocking figures, and a blue-led palette used with restraint — deep trust-blue for structure, navigation, and every primary action, warm amber held in reserve as a rare secondary highlight. The system explicitly rejects clinical/cold hospital aesthetics (sterile whites, sharp corners, dense tables) and rejects flashy/gimmicky startup polish (aggressive motion, novelty for its own sake). Confidence is expressed through calm, not through volume.

**Key Characteristics:**
- Rounded, embracing geometry throughout (12–24px radii) — no sharp corners
- Blue-tinted soft shadows, not generic gray, tying elevation back to brand
- Trust Blue carries both structure and action; Warm Amber is a rare secondary highlight, not the CTA color
- Type sized up from typical SaaS defaults (16px body floor) for an older audience
- Motion is a whisper: 200–300ms ease-out fades and lifts, never parallax or flourish

## Colors

The palette reads as one confident family doing double duty: a deep structural blue that also carries every call to action, with a single warm amber kept in reserve for rare secondary highlights.

### Primary
- **Trust Blue** (`#183891`): Headers, primary nav text/active states, links, section headlines, focus/selection accents (day-picker range, plan-card frames), **and every primary CTA fill** ("Get A Quote," booking submit buttons) — white text at 10.43:1. The structural *and* action color — it's what the page is "made of" and what it wants you to do.
- **Deep Harbor** (`#0F2461`): Text-on-light emphasis and the darkest step of the blue family; used in the hero's gradient overlay to seat white headline text over photography, and as the hover/pressed fill for every primary button.
- **Blue Mist** (`#D6E0F5`): Light info/selected backgrounds — calendar range fill, hero subhead text over the dark overlay, badges.

### Secondary
- **Warm Amber** (`#E68A25`): Held in reserve — not the CTA color, and no longer the focus outline. Available for rare secondary highlights (badges) where a small, deliberate warm accent against the blue-dominant page earns its place. If reused as a solid fill, pair only with **Ink text** — white-on-amber measures 2.62:1 and fails WCAG AA; Ink-on-amber measures 6.41:1.
- **Amber Deep** (`#B5680F`): Reserved for future text/icon accents on light backgrounds. Not used as a button fill: darkening a solid amber button on hover fails AA under both white text (4.24:1) and Ink text (3.96:1).
- **Amber Light** (`#FCE3C5`): Highlight backgrounds and badges paired with amber elements.

### Neutral
- **Ink** (`#1A1D29`): Primary text.
- **Slate** (`#5B6070`): Secondary/body copy on cards and sections.
- **Mist** (`#9AA0B0`): Placeholder text, disabled states.
- **Cloud** (`#F4F6FA`): Page background — the resting surface everything else sits above.
- **White** (`#FFFFFF`): Cards and raised surfaces.
- **Border** (`#E3E6ED`): Dividers, input borders, mobile-menu separators.

### Semantic
- **Success** (`#2E9E5B`) · **Warning** (`#E6A825`) · **Error** (`#D64545`): confirmations, pending states, and destructive/error messaging (form field errors use error text + `role="alert"`, never color alone).

### Named Rules
**The Blue-First Rule.** Trust Blue says "act now" as well as "this is structure." Warm Amber does not appear as a CTA fill; it is held for rare secondary highlights only, so the page reads as one confident blue system rather than two competing accents.

## Typography

**Display/Headline Font:** Poppins (with sans-serif fallback) — geometric, rounded terminals that echo the logo's rounded figures.
**Body Font:** Inter (with sans-serif fallback) — humanist, built for screen legibility at small and large sizes for an audience that skews older.

**Character:** Confident and rounded up top, quietly legible underneath — headlines feel warm rather than corporate, body text disappears into readability.

### Hierarchy
- **Display** (700, 56px, 1.2 line-height): Hero headline only ("Care That Comes to You").
- **H1** (700, 36px, 1.25): Page titles (service detail pages, section headers like "Our Services").
- **H2** (600, 28px): Secondary section headers.
- **H3** (600, 22px): Card titles, pillar headings.
- **Body Large** (400, 18px, 1.6): Primary reading text, hero subhead.
- **Body** (400, 16px, 1.6): Default UI text — the accessibility floor, never set smaller for body copy.
- **Small** (400, 14px): Captions, field error text, helper copy only.

### Named Rules
**The 16px Floor Rule.** Body copy never renders below 16px anywhere in the product. This is a firm accessibility line for an audience that includes aging users and their families reading on small screens.

## Layout

Content is constrained to a 1280px max width (`max-w-content`) with 16–24px side gutters (`px-4 sm:px-6`), centered via `mx-auto`. Sections stack vertically with generous 80px (`py-20`) vertical rhythm, alternating `bg-white` and `bg-cloud` to separate sections without borders. Cards and grids use `gap-6`–`gap-10` (24–40px) between siblings. The header is sticky (`sticky top-0 z-40`) and gains a white/blur background plus `shadow-card` only after scroll, keeping the resting state unobtrusive. Mobile collapses the nav into a hamburger-triggered stacked menu with 44px-minimum tap targets throughout; desktop nav caps at 3 primary links plus one persistent high-contrast CTA, per the "no more than 5 nav items" rule.

## Elevation & Depth

Soft and tactile: the system uses a shallow, brand-tinted shadow rather than tonal layering or heavy elevation. Shadows are ambient at rest and intensify subtly as a direct response to hover, never as decoration. All shadow color is blue-tinted (`rgba(24,56,145,…)`) rather than generic gray, so elevation itself carries brand identity.

### Shadow Vocabulary
- **card** (`box-shadow: 0px 4px 20px rgba(24,56,145,0.08)`): Resting elevation for cards, the sticky header once scrolled, and CTA buttons.
- **card-hover** (`box-shadow: 0px 8px 28px rgba(24,56,145,0.14)`): Hover state for cards and buttons, always paired with a small `-translate-y` lift (2–4px) and a 250ms ease-out transition.

### Named Rules
**The Lift-on-Intent Rule.** Nothing elevates until the user's cursor says they're interested. Cards and buttons sit flat (`shadow-card`) at rest and rise to `shadow-card-hover` with a `-translate-y` nudge only on hover/focus — elevation is a response, not a static decoration.

## Shapes

Rounded corners throughout, scaled by surface importance: `8px` for the smallest chrome, `12px` as the default control radius (buttons, inputs, small badges), `16px` for the mobile menu and framed sections, `20–24px` for cards and the hero's floating quote widget. Sharp corners do not appear anywhere in the system — squareness reads as clinical and is explicitly avoided. Icons follow the same softness: 2px stroke, rounded caps, no sharp geometric icon sets.

## Components

Buttons, cards, and inputs all share one instinct: touchable, generous, forgiving of imprecise input.

### Buttons
- **Shape:** `12–20px` radius depending on context (`rounded-xl` most common), 44px minimum height/tap target everywhere.
- **Primary:** Trust Blue fill (`bg-connect-blue`), white text (10.43:1), `shadow-card` at rest → `shadow-card-hover` + `-translate-y-0.5` + `bg-blue-deep` on hover, 250ms ease-out. Used for the single dominant action per view ("Get A Quote," booking submit).
- **Secondary/Tertiary:** Trust Blue text, no fill; underline appears only on hover (`underline-offset-4 hover:underline`). Used for sign-in/sign-out and lower-emphasis links sitting beside a primary CTA.

### Cards / Containers
- **Corner Style:** `16–24px` radius (`rounded-2xl` for feature/service cards).
- **Background:** White on Cloud page background, `border border-border` hairline.
- **Shadow Strategy:** `shadow-card` at rest, `shadow-card-hover` + lift on hover (see Elevation & Depth).
- **Internal Padding:** 24px+ (`p-6`).

### Inputs / Fields
- **Style:** White background, `border-border` (or `border-error` when invalid), `rounded-xl`, 48px minimum height — larger than the 44px tap-target floor because typed input needs more room than a tap.
- **Labels:** Always above the field, always visible — never placeholder-only. Required fields marked with a leading red asterisk, not color alone.
- **Focus:** 2px Trust Blue outline (`#183891`, 2px offset), no separate radius override — the outline follows each element's own corner radius natively. Used on every interactive element, including inputs, links, and buttons — the one focus treatment used site-wide.
- **Error:** `border-error` + `text-error` helper text below the field with `role="alert"`, worded kindly per DESIGN-SYSTEM.md voice rules, never "Invalid input."

### Navigation
- Sticky header, white background that gains `bg-white/90 backdrop-blur` + `shadow-card` after 8px of scroll.
- Max 3 primary links (Home, Services, Contact us) plus one persistent Trust Blue CTA ("Get A Quote"), always visible at both desktop and mobile widths.
- Active link state: `text-connect-blue` plus `aria-current="page"`; inactive links sit in `text-slate` and shift to blue on hover.
- Mobile: hamburger → full-width stacked menu, `border-t border-border` separation, every row 44px minimum height.

### Reveal (signature motion component)
A shared `Reveal` wrapper fades content up 16px over 400ms ease-out when it enters the viewport (`opacity-0` → `.is-visible` triggers `@keyframes reveal`), with a per-item stagger delay used across pillar/testimonial grids. Fully disabled under `prefers-reduced-motion: reduce`. This is the system's one recurring "wow" motion signature — used for section entrances, never for persistent UI chrome.

## Do's and Don'ts

### Do:
- **Do** fill every primary CTA with Trust Blue + white text; blue carries both structure and action.
- **Do** keep every interactive element at a 44×44px minimum tap target, and inputs at 48px minimum height.
- **Do** use the blue-tinted `shadow-card` / `shadow-card-hover` pair for all elevation — never a generic gray box-shadow.
- **Do** label every form field above the input, permanently visible, never placeholder-only.
- **Do** honor `prefers-reduced-motion` on every animated element (Reveal, toast-in).
- **Do** pair any Warm Amber fill with Ink text, never white — white-on-amber measures 2.62:1 and fails WCAG AA.

### Don't:
- **Don't** use Warm Amber as a button/CTA fill — it's a reserve secondary highlight now, not the action color.
- **Don't** use sharp corners anywhere — the system has no 0px-radius surfaces.
- **Don't** let color alone signal state (error, required, active) — always pair with icon, text, or an asterisk.
- **Don't** set body copy below 16px, even for dense UI or captions-adjacent text.
- **Don't** add parallax, aggressive scroll effects, or motion longer than ~400ms — the audience skews older and easily disoriented by flashy motion.
