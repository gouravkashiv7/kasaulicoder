# Pricing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the proposal-only `/pricing` page with a pricing page showing build tiers, monthly managed plans, add-ons, discounts and a team-credibility block, priced in INR for India and USD elsewhere.

**Architecture:** Prices and copy live in a pure, dependency-free `lib/pricing.ts` (unit-tested with `node --test`). `app/pricing/page.tsx` is a server component that reads the country header and passes an initial currency to a client `PricingView` that owns the ₹/$ toggle and the monthly/annual switch. Section components are small and presentational.

**Tech Stack:** Next.js 16 (app router), React 19, Tailwind, `node --test` (existing runner), existing `@/components/ui/marketing` helpers.

**Spec:** `docs/superpowers/specs/2026-11-25-pricing-page-design.md`

## Global Constraints

- Prices (INR / USD), "starting from": Launch 14,999 / 349 · Business 39,999 / 899 (Most popular) · Growth 89,999 / 1,999 · SaaS/Custom 2,50,000+ / 5,500+ · Brand identity add-on 14,999 / 349.
- Managed monthly (INR / USD): Care 2,999 / 59 (the minimum) · Grow 9,999 / 199 · Scale 24,999 / 499.
- Discounts: annual prepay = 2 months free (price = monthly × 10); build + Care/Grow bundle = 10% off the build; referral credit 5% of referred client's first invoice; launch offer is off by default and only renders when a real slot count is configured.
- India: "+ 18% GST" note; international: no tax line.
- Currency: `IN` → INR, anything else or missing → USD. Both prices stored by hand, no conversion. Toggle override persisted in `localStorage` inside try/catch.
- Team block copy: "average 3+ years of experience", "multiple projects delivered", link to `/projects`. No other invented stats; no ranking/position promises for SEO.
- Follow brand system in `brandoutline.md` and existing helpers (`primaryButton`, `secondaryButton`, `SectionIntro`, `Icon`).
- Quote CTAs link to `/contact?service=<serviceGroup id>` (ids from `lib/services.ts`).

## Review Focus

- Missing/empty/lowercase country header → USD, never a crash (`currencyForCountry`).
- `localStorage` throwing or empty → page still renders in the server-chosen currency.
- Annual price for each managed plan equals monthly × 10 in both currencies.
- INR formatting uses Indian grouping (`₹2,50,000`), USD uses `$5,500`; "+" suffix preserved for SaaS/Custom.
- Launch offer with no slot count configured renders nothing.

---

### Task 1: Pricing data and helpers

**Files:**
- Create: `lib/pricing.ts`
- Test: `backend/lib/__tests__/pricing.test.ts` (imports `../../../lib/pricing.ts`)

**Interfaces:**
- Produces:
  - `type Currency = "INR" | "USD"`
  - `type Money = { INR: number; USD: number }`
  - `interface BuildTier { id: string; name: string; summary: string; features: string[]; price: Money; startingFrom: true; popular?: boolean; serviceId: string }`
  - `interface ManagedPlan { id: string; name: string; features: string[]; monthly: Money; serviceId: string }`
  - `interface Addon { id: string; name: string; summary: string; price: Money }`
  - `export const buildTiers: BuildTier[]`, `managedPlans: ManagedPlan[]`, `addons: Addon[]`
  - `export const discounts: { annualMonthsPaid: 10; bundlePercent: 10; referralPercent: 5; launchOffer: { slotsLeft: number | null; label: string } }`
  - `currencyForCountry(code: string | null | undefined): Currency`
  - `formatPrice(amount: number, currency: Currency, plus?: boolean): string`
  - `annualPrice(monthly: number): number`
  - `bundleBuildPrice(price: number): number`
  - `faqs: { q: string; a: string }[]`

- [ ] **Step 1: Write failing tests** in `pricing.test.ts`: `currencyForCountry("IN") === "INR"`, `"in"` → `"INR"`, `"US"`, `""`, `null`, `undefined` → `"USD"`; `formatPrice(250000,"INR",true) === "₹2,50,000+"`; `formatPrice(899,"USD") === "$899"`; `annualPrice(2999) === 29990`; `bundleBuildPrice(39999) === 35999`; every `buildTiers`/`managedPlans` price matches the Global Constraints table exactly (assert INR and USD per id); exactly one tier has `popular`; `discounts.launchOffer.slotsLeft === null`.
- [ ] **Step 2: Run** `pnpm test` — expect FAIL (module not found).
- [ ] **Step 3: Implement** `lib/pricing.ts` per the Interfaces block. Use `Intl.NumberFormat("en-IN")` for INR and `"en-US"` for USD; `bundleBuildPrice` rounds with `Math.round`. Tier/plan feature lists come from the design doc (Care = hosting and deployment, SSL and domain, updates, uptime monitoring, bug fixes; Grow adds managed SEO and monthly report and content tweaks; Scale adds priority support, CRM/SaaS maintenance, monthly dev-hours bank). Service ids: Launch/Business/Growth/SaaS → `product-engineering`, Care/Scale → `cloud-support`, Grow → `seo-digital-growth`. FAQ answers cover included scope, SEO honesty ("we do not promise positions"), custom scoping, and discounts; do not state revision counts, ownership or payment terms (not decided) — answer "discussed in your proposal".
- [ ] **Step 4: Run** `pnpm test` — expect all PASS.
- [ ] **Step 5: Commit** `feat: add pricing data and helpers`

### Task 2: Currency and billing state (client view shell)

**Files:**
- Create: `components/pricing/PricingView.tsx`
- Modify: `app/pricing/page.tsx`

**Interfaces:**
- Consumes: `Currency`, `currencyForCountry` from Task 1.
- Produces: `PricingView({ initialCurrency }: { initialCurrency: Currency })` (client component) rendering the sections from Tasks 3–4 in order; exposes `currency` and `billing: "monthly" | "annual"` to them as props; `CurrencyToggle` inline in this file.

- [ ] **Step 1: Implement** `app/pricing/page.tsx` as an async server component: read `headers()`, country = `x-vercel-ip-country` ?? `cf-ipcountry`, render `<PricingView initialCurrency={currencyForCountry(country)} />`. Update metadata title to "Pricing" and description to mention INR/USD starting prices and scoped quotes; keep canonical `/pricing`.
- [ ] **Step 2: Implement** `PricingView`: state `currency` initialised from prop; in `useEffect`, read `localStorage["kc-currency"]` (try/catch) and apply if `INR`/`USD`; toggle writes it (try/catch). Sections are imported placeholders until Tasks 3–4 land (render only what exists).
- [ ] **Step 3: Verify** `pnpm build` passes and, in `pnpm dev`, `/pricing` loads; with the toggle clicked the choice survives reload; blocking storage (private window) still renders.
- [ ] **Step 4: Commit** `feat: pricing page shell with currency toggle`

### Task 3: Build tiers, managed plans, add-ons, discounts

**Files:**
- Create: `components/pricing/BuildTiers.tsx`, `components/pricing/ManagedPlans.tsx`, `components/pricing/DiscountBanner.tsx`
- Modify: `components/pricing/PricingView.tsx`

**Interfaces:**
- Consumes: Task 1 exports; `currency`, `billing` from Task 2.
- Produces: `BuildTiers({ currency })` (tier cards + add-ons; "Starting from" label, Popular badge, CTA to `/contact?service=<serviceId>`, "+ 18% GST" note when INR); `ManagedPlans({ currency, billing, onBillingChange })` (monthly/annual switch; annual shows `annualPrice` with "2 months free" and struck-through `monthly × 12`); `DiscountBanner()` listing annual, bundle (show bundled Business price via `bundleBuildPrice`), referral, and the launch offer only when `discounts.launchOffer.slotsLeft` is a positive number.

- [ ] **Step 1: Implement** the three components using brand helpers; cards stack on mobile with 16px gutters.
- [ ] **Step 2: Verify** in dev at 375px and desktop: INR shows `₹39,999`, USD shows `$899`; annual switch shows `₹29,990` for Care in INR and `$590` in USD; no launch-offer text appears; no horizontal scroll.
- [ ] **Step 3: Commit** `feat: pricing tiers, managed plans and discounts`

### Task 4: Team proof, FAQ, closing CTA, site links

**Files:**
- Create: `components/pricing/TeamProof.tsx`, `components/pricing/PricingFaq.tsx`
- Modify: `components/pricing/PricingView.tsx`, `components/layout/GlobalFooter.tsx:84`, `app/sitemap.ts` (no change needed unless route list differs), `components/marketing/ProposalRequest.tsx` (delete if now unreferenced)

**Interfaces:**
- Consumes: `faqs` from Task 1.
- Produces: `TeamProof()` — headline with "average 3+ years of experience" and "multiple projects delivered", a link "See our projects" to `/projects`, and a link to `/about` for the team; `PricingFaq()` — accessible `<details>` list from `faqs`; closing CTA to `/contact`.

- [ ] **Step 1: Implement** the two components and mount them plus a closing CTA in `PricingView`.
- [ ] **Step 2: Modify** footer link label at `GlobalFooter.tsx:84` from "Request a Proposal" to "Pricing" (same `/pricing` href). Run `grep -rn ProposalRequest app components`; if the only reference was the old page, delete `ProposalRequest.tsx`.
- [ ] **Step 3: Verify** `pnpm lint` and `pnpm build` pass; `pnpm test` passes; in dev, both links in the team block resolve and the FAQ opens with keyboard.
- [ ] **Step 4: Commit** `feat: pricing team proof, FAQ and site links`

### Task 5: End-to-end check

- [ ] **Step 1:** In dev, simulate India vs elsewhere by requesting `/pricing` with header `x-vercel-ip-country: IN` and `US` (`curl -s -H ... localhost:3000/pricing | grep -o "₹39,999\|\$899"`); expect ₹ for IN and $ for US and for no header.
- [ ] **Step 2:** Screenshot desktop and 375px, light check of brand consistency; report results faithfully.
