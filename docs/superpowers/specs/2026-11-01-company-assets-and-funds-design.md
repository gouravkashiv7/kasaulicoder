# Company assets, domains and director fund contributions

Status: draft for approval. Nothing is built yet.

## Intent
Directors need one place to see what the company owns (especially domain names
and when they expire) and a way to put money into the company together, with
proof, so the company balance is backed by evidence.

## Goals
1. An **Assets** tab listing domains and other company assets.
2. A **Fund the company** flow: one amount, split equally across all active
   directors, counted in the company balance **only after every director has
   confirmed their part with a proof image**.
3. A written plan for where proof images live (Cloudinary, private), so
   storage stays safe and cheap.

## Non-goals
- No passwords, logins, API keys or 2FA codes in assets. Notes may say *where*
  a credential is kept, never the credential.
- No bank integration or real transfers; a contribution is a record backed by
  proof.
- No unequal contributions, withdrawals or per-director ledgers (same line the
  existing finance area draws).
- No automatic domain-expiry lookup (WHOIS); dates are typed in.

## Anti-goals (a failure even if it "works")
- A contribution counting toward the balance before everyone has proved
  payment.
- The same screenshot accepted as proof twice.
- Proof images readable by non-directors, or lost when a record is deleted.

## Constraints
- Same stack and rules as the directors area: Mongoose models in
  `backend/models/`, money in integer paise, `requireDirector()` on routes,
  soft delete with `deletedAt` / `deletedBy` and `NOT_DELETED` filters
  (`backend/lib/softDelete.ts`), superadmin delete view in
  `components/admin/records/`.
- **Proof formats: PNG, JPG and PDF** (confirmed by the owner). Validation
  extends today's `parseImageDataUrl` to a `parseProofDataUrl`: the declared
  type must match the file's leading bytes (`\x89PNG`, `\xFF\xD8`, `%PDF-`).
  Images up to 1 MB after the browser downscales them; PDFs up to 3 MB (the
  browser can't shrink a PDF, and the request must stay under typical
  serverless body limits once base64-encoded). WebP is no longer accepted for
  new proofs; existing WebP proofs keep displaying.

## 1. Assets and domains

**Model `CompanyAsset`** (soft-deletable): `kind` (`domain`, `software`,
`hardware`, `account`, `other`), `name` (for a domain, the domain itself,
lower-cased and unique among non-deleted), `registrar` (domains), `expiresOn`
(domains and subscriptions), `autoRenew` (boolean), `costPaise` and
`costPeriod` (`one-time`, `monthly`, `yearly`), `purchasedOn`, `notes`,
`createdBy`.

**API** `/api/director/assets`: `GET` list, `POST` add, `PUT` edit. Deleting is
the superadmin's soft delete through `/api/admin/records` (add `asset` type and
an `assets` tab).

**UI:** an **Assets** sidebar tab for directors and superadmins. Domains first,
sorted by soonest expiry; a badge on the tab counts domains expiring within 30
days or already expired. Superadmin gets the same Director view / Manage
records switch as the other tabs.

## 2. Fund the company

**Model `Contribution`** (soft-deletable): `totalPaise`, `note`, `createdBy`,
`status` (`pending`, `completed`, `cancelled`), `shares[{ staff, paise,
status: pending|confirmed, proof (attachment id), proofHash, confirmedAt }]`,
`completedAt`, `cancelReason`, `cancelledBy`.

**Rules**
- Any active director starts one by entering a **total**. It is split equally
  across the active directors at that moment: `share = floor(total / n)`. The
  credited total is `share × n`; odd paise are dropped and shown before the
  director submits, so the money always divides exactly. (Builder's call.)
- The split is a **snapshot**; later changes to who is a director don't change
  an open or finished contribution.
- Only the director named on a share can confirm it, by uploading a proof image
  of their transfer. The proof is required, must have been uploaded by that
  same director (the existing `ownsAttachment` check), and its SHA-256 hash must not
  match any proof already used on any record (payments, expenses, other
  contributions), otherwise 409.
- When the last share is confirmed the contribution becomes `completed`
  atomically (one conditional update, so simultaneous last confirmations can't
  complete it twice) and only then counts.
- While `pending`, any director may cancel with a reason (one-way, stays
  visible, like voiding a payment). If a director in the snapshot is later
  deactivated the contribution can't complete; it is cancelled and restarted.
- **Company balance** becomes: company share earned from non-void payments
  + completed contributions − released expenses. Pending amounts are shown
  separately ("awaiting confirmation") and never counted.

**API** (under `/api/director/finance/`): `GET /contributions`,
`POST /contributions` `{ amount, note? }`,
`POST /contributions/[id]/confirm` `{ attachmentId }`,
`POST /contributions/[id]/cancel` `{ reason }`. `GET /summary` gains
`contributedPaise` and `awaitingContributionPaise`.

**UI:** a **Funds** section in the Finance tab: a "Fund the company" button
(shows total, per-director amount and who must confirm), a list of
contributions with each director's confirmed/pending state and proof thumbnail,
and a **Confirm with proof** button on the viewer's own pending share (reusing
the existing `ScreenshotInput`). The Finance tab and sidebar badge also count
"contributions waiting for my proof".

## 3. Where proofs are stored: Cloudinary

**Today:** proofs are rows in the MongoDB Atlas `attachments` collection
(binary data, mime, size, uploader), served only to directors with `nosniff`.
No object storage exists in the project.

**Decision: store proof files in Cloudinary; keep their records in MongoDB.**
Env vars (server-only, never `NEXT_PUBLIC_`): `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. The `cloudinary` npm package is
the only new dependency.

### How it works
1. **Stage in MongoDB (unchanged upload step).** The browser still sends the
   proof to `POST /finance/attachments`. The server validates it (type, bytes,
   size, ownership), computes its SHA-256 and stores it in `attachments` as
   today, marked `storage: "db"`, `linkedTo: null`. Nothing goes to Cloudinary
   yet.
2. **Publish on link.** When a record actually uses the proof (recording a
   payment, requesting or releasing an expense, confirming a contribution
   share), one function `linkAttachment(id, kind, recordId)` in
   `backend/lib/attachments.ts` does the work: upload the bytes to Cloudinary,
   then update the `attachments` row to `storage: "cloudinary"`, keep
   `publicId`, `version`, `format`, set `linkedTo`, and **remove `data`**. The
   record is only saved if this succeeds; a Cloudinary failure returns 502 and
   leaves the proof staged so the director can retry.
3. **Serve through our API.** `GET /finance/attachments/[id]` keeps its
   director-only check. For `storage: "cloudinary"` it fetches the file
   server-side from Cloudinary and streams it with the same headers as today
   (`Content-Type`, `nosniff`, private immutable cache). Browsers never get a
   Cloudinary URL.
4. **Same code path for both stores.** A small `ProofStore` interface
   (`put`, `get`, `remove`) with two implementations, `DbStore` and
   `CloudinaryStore`, so old rows (`storage: "db"`) and new ones read the same
   way.

### Why this shape
- **Private by default.** Uploads use `type: "authenticated"`, so the files have
  no public URL and can't be guessed or shared. Only our API, which checks the
  director session, can read them.
- **No orphans in Cloudinary.** Unused uploads only ever exist in MongoDB,
  where a 24-hour TTL index (partial: unlinked rows only) removes them.
  Cloudinary only ever holds proofs that belong to a record.
- **Secrets stay server-side.** The browser never signs or uploads to
  Cloudinary directly, so the API secret never leaves the server and our
  validation can't be bypassed.
- **Proofs are small** (at most 1 MB each), well inside typical serverless
  request limits, so no direct-to-Cloudinary upload is needed.

### Data changes
`Attachment` gains `storage` (`db` | `cloudinary`), `publicId`, `version`,
`format`, `sha256` (unique index; the duplicate-proof rule) and `linkedTo`
(`{ kind, id }`); `data` becomes optional. Cloudinary assets live under
`kasaulicoder/proofs/<attachmentId>`.

### Existing proofs
They stay in MongoDB and keep working. A one-off, re-runnable script
`scripts/move-proofs-to-cloudinary.ts` copies each linked proof, checks the byte
length matches, then clears `data`. It backfills `sha256` first. Run it once
after the new code is live; it can be stopped and resumed.

### Rules that don't change
- Never delete a proof when its record is soft-deleted. Cloudinary assets are
  removed only by hand, never by the app (the app has no delete call, which
  also means a bug can't wipe evidence).
- Formats and caps as in Constraints: PNG, JPG, PDF. Images are downscaled in
  the browser to 1600 px and about 900 KB; PDFs pass through untouched (3 MB
  cap, checked in the browser too so the error is immediate).
- PDFs are served with `Content-Type: application/pdf`, `nosniff`,
  `Content-Disposition: inline` and `Content-Security-Policy: sandbox` so a
  hostile PDF can't run anything in our origin. The proof thumbnail for a PDF
  is a PDF icon with the file name and a link that opens it.
- A superadmin who is not a director can also view proofs (the delete view
  needs it).

### Failure handling
- Cloudinary down or misconfigured at link time: 502 "Could not store the
  proof, try again"; nothing else is saved.
- Record creation fails after a successful publish (rare): the asset stays in
  Cloudinary linked to a record id that doesn't exist. It is logged with the
  attachment id so it can be reviewed; the app never auto-deletes it.
- Missing env vars: a clear startup-time error from `getCloudinary()`, and
  linking falls back to refusing rather than silently keeping data in MongoDB.

### Testing
Unit tests run `linkAttachment` against a fake `ProofStore`. One real
end-to-end run uses the real credentials with a separate
`kasaulicoder-test/` folder, deletes what it uploaded, and uses the same
temporary-staff approach as the earlier checks.

### Cloudinary and PDFs (verify while building)
Cloudinary blocks delivery of PDF and ZIP files by default on many accounts
(Settings, Security, "PDF and ZIP files delivery"). Because we fetch files
server-side, the build must check that a stored PDF can be fetched back; if it
can't, the account setting needs enabling, or PDFs go in as `resource_type:
"raw"`. Images are unaffected. This is the one part of the integration I can't
confirm without your credentials.

### Backups and cost (to confirm)
- Cloudinary keeps the files but is not a backup of record, and there is no
  MongoDB backup today (see Answered by the owner): add the weekly export of the
  MongoDB `attachments`, `contributions`, `payments` and
  `expenses` collections (metadata and the link between records and files).
- Check the Cloudinary plan's storage and bandwidth allowance. Proofs are small
  (roughly 60 to 100 MB a year at today's volume), and every view is cached by
  the browser, so bandwidth should be low.
- I will confirm the current Cloudinary Node SDK calls (authenticated upload
  and server-side fetch) against their documentation when building.

## Left to the builder
Field labels, the exact expiry-badge threshold UI, list sorting, and the shape
of the migration that adds `sha256` / `linkedTo` to existing attachments (a
one-off script that hashes what is already stored).

## Calls I made (change any)
- Total entered, equal share rounded down so it divides exactly.
- All-or-nothing: a contribution counts only when every snapshot director has
  confirmed.
- Proofs: PNG, JPG or PDF (owner's answer). PDF cap 3 MB; WebP dropped for new
  uploads.
- Any director can add and edit assets; only a superadmin deletes them.
- Duplicate proofs are rejected across all records.
- Proofs go to Cloudinary (private, authenticated), staged in MongoDB until a
  record uses them, then published; old proofs move with a one-off script.

## Answered by the owner
- Assets are visible to **directors and superadmins only**.
- **There is no backup of the MongoDB database today.** The SSH host
  `esim-server` (Ubuntu, about 19 GB free) holds no MongoDB backup and has no
  `mongodump` installed. Setting one up there (a weekly `mongodump` of the
  finance collections, pulled over SSH) is a separate task and is not part of
  this build.
