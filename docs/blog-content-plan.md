# KasauliCoder Blog Content Plan

Author byline for every post: **Gourav Kashiv**.
Plan date: 2026-10-31. Cadence: one post per week, Mondays, starting 2 Nov 2026 (16 posts).

## 1. Purpose

The blog is how a founder or small-business owner decides KasauliCoder is the right team before they ever fill in the proposal form. It should show, not claim, that we build software that is:

- **Customer-centric**: starts from the customer's problem, not from our tech stack.
- **Ethical**: honest about what software can and cannot do, respectful of user data and attention.
- **Useful to society**: tools that make work easier for real people and local businesses.
- **Win-win**: the client, their customers and we all come out ahead. No lock-in, no inflated promises.

This matches the site's existing positioning (SaaS and software product development, four service groups, proposals scoped per project instead of fixed packages, no promised search rankings).

## 2. Audience

| Reader | What they are trying to figure out | Where they land on the site |
| --- | --- | --- |
| Founder with an idea | "Can this become a SaaS product, and what does it take?" | /services (Product Engineering), /pricing |
| Owner of a small or local business | "How do I stop running on spreadsheets and WhatsApp?" | /services (Business Automation) |
| Operations or marketing lead | "Why is our site slow and invisible in search?" | /services (SEO & Digital Growth) |
| Non-technical decision maker | "Can I trust this team, and what will it cost me later?" | /about, /contact |

## 3. Content pillars

1. **Build it for the customer**: product thinking, discovery, MVPs, feedback loops.
2. **Build it right**: ethics, privacy, accessibility, honest AI and honest marketing.
3. **Practical guides**: automation, SEO, cloud and maintenance explained in plain language.
4. **Win-win in practice**: fair engagements, ownership, long-term care, local and social impact.

Target mix over 16 posts: 5 / 4 / 4 / 3.

## 4. Editorial rules

- Plain English. Short paragraphs. Explain every acronym on first use.
- Every post answers one real question a customer would ask, and ends with one clear next step linked to a service page or the proposal form.
- **No invented facts.** No made-up client stories, statistics, testimonials or results. Use only real projects we can name with permission, public sources we link to, or clearly labelled examples ("imagine a clinic that...").
- **No ranking or revenue promises.** Same rule as the SEO service note on /services.
- Say what we would not build or would advise against. That is where trust comes from.
- Credit sources and update posts when facts change.

## 5. Publishing calendar

Slugs are suggestions. Each post needs: `title`, `slug`, `tagline`, `description` (SEO summary, about 150 characters), `content`, `mainImageUrl`, `writtenBy` ("Gourav Kashiv"), and `status` set to active when ready (fields from `backend/models/Blog.ts`).

### Month 1: Set the tone (Nov 2026)

**1. Why We Build Software for People, Not Just for Clients** (2 Nov)
- Slug: `why-we-build-software-for-people`
- Pillar: Win-win. Our principles in one place: customer first, honest scope, useful over flashy.
- Outline: the problem with "build what the spec says"; our four principles; what that changes in how we quote, build and support; what we will say no to.
- CTA: /about

**2. From Idea to SaaS: What the First 90 Days Actually Look Like** (9 Nov)
- Slug: `idea-to-saas-first-90-days`
- Pillar: Customer. Audience: founders.
- Outline: discovery, one core workflow, first usable version, first real users, what gets cut and why.
- CTA: /services#product-engineering, /pricing

**3. Talk to Your Customers Before You Write a Line of Code** (16 Nov)
- Slug: `talk-to-customers-before-you-build`
- Pillar: Customer.
- Outline: five questions to ask ten potential users; how to tell a real problem from a nice idea; a one-page checklist readers can copy.
- CTA: /contact

**4. What Does Building Software Actually Cost? An Honest Guide** (23 Nov)
- Slug: `what-does-custom-software-cost`
- Pillar: Win-win.
- Outline: what drives cost (scope, integrations, design, hosting, upkeep); why we scope per project instead of selling fixed packages; red flags in quotes; how to start small. No price numbers unless Gourav supplies real ranges.
- CTA: /pricing (request a proposal)

**5. Ethical Software: The Checklist We Use Before We Ship** (30 Nov)
- Slug: `ethical-software-checklist`
- Pillar: Ethics.
- Outline: data we do not collect, consent in plain words, no dark patterns, accessibility, security basics, and a "who could this harm?" check. Turn it into a downloadable checklist.
- CTA: /contact

### Month 2: Practical value (Dec 2026)

**6. Is Your Business Ready for Automation? 7 Signs It Is** (7 Dec)
- Slug: `signs-your-business-needs-automation`
- Pillar: Practical. Audience: small business owners.
- Outline: re-typed data, manual follow-ups, lost bookings, tools that do not talk to each other; what to automate first and what to leave human.
- CTA: /services#business-automation

**7. Automation Should Help People, Not Replace Them** (14 Dec)
- Slug: `automation-that-helps-people`
- Pillar: Ethics.
- Outline: automating drudgery versus automating judgement; keeping a human in the loop; telling staff early and honestly; how it can free time for customer care.
- CTA: /services#business-automation

**8. Your Website Is Slow. Here Is Why It Costs You Customers** (21 Dec)
- Slug: `slow-website-costs-customers`
- Pillar: Practical.
- Outline: Core Web Vitals in plain words; the usual culprits (large images, heavy scripts, cheap hosting); free tools to measure; what to fix first.
- CTA: /services#seo-digital-growth

**9. SEO Without the Hype: What Is Actually in Your Control** (28 Dec)
- Slug: `seo-without-the-hype`
- Pillar: Ethics + Practical.
- Outline: technical basics, titles and metadata, useful content, site structure; why nobody can promise rank one and how to spot an agency that does.
- CTA: /services#seo-digital-growth

**10. Your Data, Your Customers: Privacy Basics for Small Business Software** (4 Jan)
- Slug: `privacy-basics-for-small-business-software`
- Pillar: Ethics.
- Outline: collect less, store safely, explain plainly, delete when asked; what a privacy policy should really say; link to our own /privacy page as the worked example. Not legal advice; say so.
- CTA: /privacy

### Month 3: Depth and proof (Jan to Feb 2027)

**11. Software Is Not "Done" at Launch: Why Maintenance Matters** (11 Jan)
- Slug: `why-software-maintenance-matters`
- Pillar: Win-win.
- Outline: updates, security patches, backups, monitoring; what ongoing support should include; how we hand over so you are never locked in.
- CTA: /services#cloud-support

**12. Accessible by Default: Building Products Everyone Can Use** (18 Jan)
- Slug: `accessible-software-by-default`
- Pillar: Ethics + Society.
- Outline: keyboard use, contrast, readable text, screen readers, slow connections and old phones; low-cost habits that cover most issues; why it also helps business.
- CTA: /services#product-engineering

**13. Using AI in Your Product Without Fooling Your Users** (25 Jan)
- Slug: `using-ai-honestly-in-products`
- Pillar: Ethics.
- Outline: tell users when AI is involved; keep a human check on important decisions; avoid making up facts; protect private data; where AI is not worth adding.
- CTA: /contact

**14. Build Local, Grow Local: Software for Small Towns and Small Businesses** (1 Feb)
- Slug: `software-for-small-businesses-and-towns`
- Pillar: Society.
- Outline: why local clinics, shops, schools and tourism businesses are underserved; simple tools (booking, billing, reminders) that fit their budget; how a hill-town team can serve clients anywhere. Use real examples only.
- CTA: /pricing

**15. A Fair Deal: How We Structure Engagements So Everyone Wins** (8 Feb)
- Slug: `fair-software-engagements`
- Pillar: Win-win.
- Outline: clear scope, milestone reviews, you own your code and data, plain-language contracts, what happens if plans change. Link /terms.
- CTA: /terms, /pricing

**16. What We Learned: A Look Back at Our First Season of Posts and Projects** (15 Feb)
- Slug: `what-we-learned-first-season`
- Pillar: Win-win.
- Outline: honest retrospective from real work; what changed in our approach; what is next. Use only real projects from /projects.
- CTA: /projects, /contact

## 6. Per-post workflow

1. Gourav picks or edits the topic and supplies any real examples, numbers or project names.
2. Draft (the `blog` skill researches the top search results for the keyword and writes the post in simple English).
3. Gourav reviews for accuracy and voice, and approves.
4. Add a cover image, then create the post in the admin dashboard with `writtenBy: "Gourav Kashiv"`.
5. Publish on the scheduled Monday, add a line to the sitemap if it is not generated automatically (check `app/sitemap.ts`), and share the link.

## 7. Open items for Gourav

- Which real projects and clients can be named in posts 14 and 16?
- Any real price ranges to share in post 4? If not, the post stays qualitative.
- Target search keywords above are not researched yet. Each post gets a keyword and top-result check at drafting time, so treat the titles as working titles.
- The blog page's hero text ("Insights from the edge", "AI integration, and the future of web architecture") reads more developer-focused than this plan. Worth aligning with the SaaS positioning later; not changed here.
