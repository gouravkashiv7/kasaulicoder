# Pricing Page Design

## Intent
Replace the "Request a Proposal"-only `/pricing` page with a real pricing page: public "starting from" prices for builds and monthly managed plans, shown in ₹ for India and $ everywhere else, with discounts and a credibility block. Goal: visitors can self-qualify on price, then request a scoped quote.

## Goals
- Show build tiers, monthly managed plans, add-ons and discounts.
- Currency by visitor country (India = INR, rest = USD) with a manual toggle.
- Team credibility block: "average 3+ years of experience", "multiple projects delivered", link to `/projects`.
- Every tier ends in the existing proposal request (scoped quote).

## Non-goals / anti-goals
- No online checkout or payments.
- No runtime currency conversion; both prices are set by hand.
- No invented stats (no engineer count, no client count, no SEO ranking promises).
- No fake urgency: any "launch offer / slots left" element is a config value that is off unless the owner sets a real number.

## Constraints
- Next.js app, existing brand system (`brandoutline.md`), existing `lib/services.ts` pattern.
- Existing services copy avoids ranking guarantees; pricing copy must match.
- India prices shown "+ 18% GST"; global prices carry no tax line.

## Approaches
1. **Static data file `lib/pricing.ts` (chosen, my call).** Prices live in code like `lib/services.ts`. Simple, versioned, easy to review; changing a price is a small commit.
2. Reuse the admin `Plan` DB model. It has one price/currency, a student/professional audience field and no INR+USD pair, so it needs schema changes and admin work for no current benefit. Revisit if prices must be edited without deploys.
3. Keep proposal-only page. Rejected: does not meet the goal.

## Pricing (starting from)
Builds (INR / USD): Launch 14,999 / 349 · Business 39,999 / 899 (Most popular) · Growth (CRM site) 89,999 / 1,999 · SaaS/Custom 2,50,000+ / 5,500+ · Brand identity add-on 14,999 / 349.
Managed monthly: Care 2,999 / 59 (minimum) · Grow 9,999 / 199 · Scale 24,999 / 499.
Discounts: annual prepay = 2 months free; build + Care/Grow bundle = 10% off the build; referral credit 5% of referred client's first invoice; optional launch offer (off by default). Struck-through original price shown beside discounted price.
Plan contents are as in the chat plan (Care = hosting/deployment/SSL/updates/monitoring/bug fixes; Grow adds managed SEO + monthly report; Scale adds priority support, CRM/SaaS maintenance, dev-hours bank).

## Page structure
Hero + ₹/$ toggle → build tiers → managed plans (monthly/annual switch) → add-ons + discount banner → team block ("average 3+ years of experience", "multiple projects delivered", link to `/projects`; existing team cards reused) → FAQ → CTA to scoped quote (existing `ProposalRequest`).

## Currency detection
Server reads `x-vercel-ip-country` (fallback `cf-ipcountry`); `IN` = INR else USD. A client toggle overrides and is remembered in `localStorage` (wrapped in try/catch). Page must render correctly with no header.

## Left to the builder
Exact component split, copy wording within the above facts, FAQ answers (ownership, revisions, payment terms: flag any term not stated here as a question for the owner), SEO metadata, mobile layout.
