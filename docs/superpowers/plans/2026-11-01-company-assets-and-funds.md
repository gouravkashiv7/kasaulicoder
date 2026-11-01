# Company assets, fund contributions and Cloudinary proofs: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Assets tab, an equal-share "fund the company" flow gated on every director's proof, and move proof files to private Cloudinary storage.

**Architecture:** Proofs are staged in the existing MongoDB `attachments` collection and published to Cloudinary (`type: authenticated`) the moment a record uses them; reads go through our director-only route. Assets and contributions are new soft-deletable Mongoose models behind `/api/director/*` routes, with delete handled by the existing superadmin `/api/admin/records` view.

**Tech Stack:** Next.js 16, Mongoose, `cloudinary` npm package (v2), node:test for pure modules, Biome.

**Spec:** `docs/superpowers/specs/2026-11-01-company-assets-and-funds-design.md`

## Global Constraints
- Money is integer paise; amounts shown with `formatINR`.
- Proof formats PNG, JPG, PDF; images ≤ 1 MB after browser downscale, PDFs ≤ 3 MB; magic bytes must match the declared type; WebP refused for new uploads, old WebP rows still served.
- Cloudinary env vars `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, server-only.
- All new records soft-deletable (`softDeleteFields`, `NOT_DELETED`); the app never deletes a linked proof.
- Pure logic lives in `backend/lib/*.ts` files with no `@/` imports so `pnpm test` (node:test) can load them.
- Match existing style; run `npx biome check` and `npx tsc --noEmit -p .` before each commit.

## Review Focus
- Two directors confirm the last two shares at the same moment: the contribution completes exactly once and counts once.
- A director is deactivated or added after a contribution starts: snapshot unchanged; cannot complete if a snapshot director is inactive.
- Cloudinary is down or env vars are missing at link time: 502, nothing saved, proof still staged.
- Same file uploaded twice, or reused on another record: 409.
- A PDF whose bytes aren't `%PDF-`, or a PNG with a `.pdf` mime: refused.
- Domain typed with capitals, spaces or `https://`: stored normalised; duplicate domain refused.
- A soft-deleted contribution, asset or proof-bearing record disappears from director views, totals and badges.

---

### Task 1: Pure helpers — proof validation and equal split

**Files:** Create `backend/lib/proofFormat.ts`, `backend/lib/__tests__/proofFormat.test.ts`; Modify `backend/lib/money.ts`, `backend/lib/__tests__/money.test.ts`

**Interfaces:**
- Produces: `parseProofDataUrl(dataUrl: unknown): { data: Buffer; mime: "image/png"|"image/jpeg"|"application/pdf" } | { error: string }` (images ≤ 1 MB, PDF ≤ 3 MB, bytes checked); `equalShares(totalPaise: number, count: number): { sharePaise: number; creditedPaise: number }`; `domainName(input: string): string | null`.

- [ ] Write failing tests: PNG/JPEG/PDF data URLs with correct bytes parse; PDF mime with PNG bytes → error; `image/webp` → error; 1 MB + 1 image → error; 3 MB PDF ok, 3 MB + 1 → error; `equalShares(10000000, 3)` → `{3333333, 9999999}`, `equalShares(9, 3)` → `{3, 9}`, `equalShares(2, 3)` → `{0, 0}`; `domainName(" HTTPS://WWW.Example.COM/path ")` → `"www.example.com"`, `domainName("not a domain")` → `null`.
- [ ] Run `pnpm test`; expect the new tests to fail (module missing).
- [ ] Implement the three functions; `equalShares` floors, `creditedPaise = sharePaise * count`.
- [ ] Run `pnpm test`; expect all pass.
- [ ] Commit `feat: proof format validation, equal split and domain normalising helpers`.

### Task 2: Proof storage on Cloudinary

**Files:** Create `backend/lib/cloudinary.ts`; Modify `backend/models/Attachment.ts`, `backend/lib/attachments.ts`, `app/api/director/finance/attachments/route.ts`, `app/api/director/finance/attachments/[id]/route.ts`, `app/api/director/finance/payments/route.ts`, `app/api/director/finance/expenses/route.ts`, `app/api/director/finance/expenses/[id]/release/route.ts`, `components/admin/director/ScreenshotInput.tsx`, `components/admin/director/imageCompress.ts`; `npm`: add `cloudinary`.

**Interfaces:**
- Consumes: Task 1 `parseProofDataUrl`.
- Produces: `Attachment` fields `storage: "db"|"cloudinary"` (missing = db), `publicId`, `version`, `sha256`, `linked: boolean` (default false), `linkedTo: { kind: string; id: ObjectId }`, `data` optional; `linkAttachment(id: string, staffId: string, kind: string, recordId: string): Promise<{ ok: true } | { error: string; status: number }>`; `readAttachment(doc): Promise<Buffer>`; `putProof(buf: Buffer, mime: string, key: string): Promise<{ publicId: string; version: number }>` and `getProof(publicId: string, mime: string): Promise<Buffer>` in `cloudinary.ts` (throws `"Cloudinary is not configured"` when env missing).

- [ ] Install `cloudinary`; check its current authenticated-upload and server-side fetch calls against its docs.
- [ ] Add model fields, a unique partial index on `sha256` (`$type: "string"`), and a TTL index of 24 h on `createdAt` with `partialFilterExpression: { linked: false }`.
- [ ] Upload route: use `parseProofDataUrl`, compute sha256; if the hash exists and is linked, or staged by someone else → 409 "This proof was already used"; if staged by the same director → return that id.
- [ ] `linkAttachment`: verify ownership and `linked: false`; if Cloudinary is configured upload under `kasaulicoder/proofs/<id>`, then conditionally set `storage`, `publicId`, `version`, `linked: true`, `linkedTo`, and unset `data`; Cloudinary failure → `{ error: "Could not store the proof, try again", status: 502 }`; unconfigured → same 502.
- [ ] Payments POST, expenses POST and release: pre-generate the record `_id`, call `linkAttachment` before creating the record, return its error if any.
- [ ] GET route: allow directors and superadmins; stream via `readAttachment`; PDFs add `Content-Security-Policy: sandbox`; keep `nosniff`, private immutable cache.
- [ ] `ScreenshotInput`: accept `image/*,application/pdf`; PDFs skip `compressImage`, error above 3 MB, preview shows a PDF label and file name.
- [ ] `npx tsc --noEmit -p .`, `npx biome check`; expected clean. Existing proofs still serve (no `storage` field).
- [ ] Commit `feat: store proofs in Cloudinary, accept PDFs, reject reused proofs`.

### Task 3: Assets tab

**Files:** Create `backend/models/CompanyAsset.ts`, `app/api/director/assets/route.ts`, `components/admin/director/Assets.tsx`; Modify `components/admin/types.ts` (SidebarView `"assets"`, `CompanyAssetRecord`, `DirectorBadges.assets`), `components/admin/AdminSidebar.tsx`, `components/auth/AdminDashboard.tsx`, `components/auth/MemberDashboard.tsx` (director links), `app/api/director/badges/route.ts`, `components/admin/director/useDirectorBadges.ts`.

**Interfaces:**
- Consumes: `domainName`, `NOT_DELETED`, `softDeleteFields`, `RecordsTab`.
- Produces: `CompanyAsset` (`kind` domain|software|hardware|account|other, `name`, `registrar`, `expiresOn`, `autoRenew`, `costPaise`, `costPeriod` one-time|monthly|yearly, `purchasedOn`, `notes`, `createdBy`); `GET/POST/PUT /api/director/assets`; badge `assets` = domains expiring within 30 days or expired.

- [ ] POST/PUT validate: name required, domains normalised with `domainName` and unique among non-deleted (409), amount via `toPaise`, dates valid; notes ≤ 1000.
- [ ] UI: list domains first by soonest expiry with expiry colour (expired red, ≤ 30 days amber), add/edit modal via `FinanceFormModal`; sidebar tab + badge; wrap in `RecordsTab` with `tab="assets"`.
- [ ] Typecheck and lint; commit `feat: company assets and domains tab`.

### Task 4: Fund the company

**Files:** Create `backend/models/Contribution.ts`, `app/api/director/finance/contributions/route.ts`, `.../contributions/[id]/confirm/route.ts`, `.../contributions/[id]/cancel/route.ts`, `components/admin/director/FundsSection.tsx`; Modify `app/api/director/finance/summary/route.ts`, `app/api/director/badges/route.ts`, `components/admin/director/Finance.tsx`, `components/admin/types.ts`.

**Interfaces:**
- Consumes: `equalShares`, `linkAttachment`, `getActiveDirectors`, `NOT_DELETED`.
- Produces: `Contribution` (`totalPaise` = credited, `note`, `createdBy`, `status` pending|completed|cancelled, `shares[{staff, paise, status, proof, confirmedAt}]`, `completedAt`, `cancelReason`, `cancelledBy`); `POST /contributions { amount, note? }` (400 if share is 0); `POST /contributions/[id]/confirm { attachmentId }` (only the share's own director; 409 if already confirmed or contribution not pending; completes the contribution with one conditional update when the last share confirms); `POST .../cancel { reason }`; summary gains `contributedPaise`, `awaitingContributionPaise`, and `companyBalancePaise` includes `contributedPaise`; badge `finance` also counts shares awaiting the viewer's proof.

- [ ] Confirm uses `updateOne({ _id, status: "pending", "shares": { $elemMatch: { staff: me, status: "pending" } } }, { $set: { "shares.$.status": "confirmed", ... } })`, then a second conditional update sets `completed` when no pending share remains.
- [ ] Block confirm when any snapshot director is inactive (409 with message).
- [ ] UI: "Funds" section with Fund the company button (total in, per-director and credited preview), list with per-director state and proof link, Confirm with proof on own pending share, Cancel with reason.
- [ ] Typecheck and lint; commit `feat: fund the company with equal director shares and proofs`.

### Task 5: Superadmin delete view, docs, tests

**Files:** Modify `app/api/admin/records/route.ts`, `app/api/admin/records/[type]/[id]/route.ts`, `components/admin/records/RecordsManager.tsx`, `docs/directors-area/{README,api,data-model,rules,code-map,setup}.md`.

- [ ] Records API: tab `assets` lists assets; `finance` also returns `contributions`; DELETE types `asset`, `contribution`; filters added to every new director query.
- [ ] Docs: new routes, models, rules (equal share, all-or-nothing, proof formats, Cloudinary setup and env vars, backup advice).
- [ ] Commit `docs: assets, contributions and Cloudinary proofs`.

### Task 6: End-to-end check
- [ ] With Cloudinary values present: temporary directors, assets CRUD, contribution lifecycle (start, partial confirm not counted, last confirm counts once even if raced, cancel, soft delete), PNG/JPG/PDF upload and fetch, duplicate refused, missing-env 502; then clean up records, proofs in `kasaulicoder/proofs/` created by the test, and test staff.
