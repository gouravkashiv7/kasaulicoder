# Rules and decisions

## Who is a director
- `Staff.isDirector` (default `false`) is set by a superadmin in Management.
  It is independent of `role` (`superadmin`, `admin`, `editor`, `support`).
- Only **active** directors count. Deactivating a director removes them from
  vote counts, split checks and email recipients.
- Every `/api/director/*` route calls `requireDirector()`: no session gives
  401, a non-director gives 403. Sidebar tabs are hidden for non-directors.

## Money
- Stored as integer **paise**; shown as INR with Indian grouping (₹1,00,000.01).
- Input accepts up to 2 decimals, must be positive, maximum ₹10 crore.
- A payment is split by basis points (1% = 100 bps; company plus directors must
  total 10000). Each director gets the floor of their share and the **company
  keeps the rounding remainder**, so parts always add up exactly to the payment.

## Finance policy (revenue split)
- Every policy has a client and type `finance` (the only type for now). It holds
  the split: company % plus one % per active director, two decimals, total 100.
  It can also include one outsourced person (a name, not a director, such as an
  employee) with their own %, which counts toward the 100. Like the directors,
  they get the floor of their share and the company keeps the rounding
  remainder.
- Each client has its own. The most recently approved one for that client is in
  force; approving a new one marks the client's previous one `superseded`.
- Until the client has one, recording that client's payments is blocked
  (HTTP 409).
- Policies created before clients were required have no client, so no payment
  uses them. Propose a new policy per client.
- If the set of active directors changes so the split no longer covers exactly
  them, recording is blocked until a new split is approved.
- Each payment **snapshots** its split, so later policy changes never rewrite
  past shares.

## Policies
- Any director proposes. The proposer's vote counts as the first approval.
- **Passes** at 2 approvals (`APPROVALS_REQUIRED` in `backend/lib/governance.ts`,
  capped at the number of directors). **Rejected** once approval is impossible
  (with 3 directors: 2 "no" votes).
- A director can change their vote while the policy is open. Once decided it is
  final; changes need a new proposal.
- Votes are written atomically and the final transition happens once, so
  simultaneous votes can't double count or flip a result.

## Client payments
- Recorded by any director with client, amount, date received (not in the
  future), optional reference, note and screenshot.
- No approval step. Entries are never deleted: **void** needs a reason, is
  one-way, stays visible, and drops out of totals and shares.

## Expenses
- A director submits purpose, amount and a payment screenshot (required).
- **Every other director** must approve (2 of 2 today). One rejection (with a
  reason) ends it as rejected; the requester can **resubmit**, which creates a
  new request.
- A requester can't decide on their own expense.
- Once approved, a director **other than the requester** marks it **released**
  (optional transfer reference and screenshot). Releasing deducts it from the
  company balance. It can only happen once.
- Company balance = company share earned from non-void payments − released
  expenses. Approved-but-unreleased amounts are shown separately.

## Screenshots
- Resized in the browser (max 1600px, JPEG, under ~900 KB) and uploaded first;
  records then reference the attachment id.
- Server accepts JPEG/PNG/WebP data URLs only, max 1 MB, and checks the file's
  leading bytes match the declared type.
- Stored in their own `attachments` collection, never inside list responses.
  Served only to directors, with `nosniff`.
- An attachment id is accepted on a record only if the same director uploaded it.

## Discussions and email
- Threads with messages; unread tracking per director; sidebar badge.
- **Email this** sends one message to chosen other directors from
  `admin@kasaulicoder.com` (`ADMIN_FROM`). Replies go to the sender.
- A **subject is mandatory** (single line, max 150). Recipients must be other
  active directors; anything else is refused. The quoted message comes from the
  database, not the request, so it can't be forged. An optional note (max 2000)
  is added above it. All text is HTML-escaped.
- 10 emails per 10 minutes per IP. Each email is recorded on the message.

## Google Meet
- **Start Google Meet** in a thread opens `meet.google.com/new` in a new tab, which
  creates an instant meeting for whoever is signed in to Google.
- The director pastes the meeting link back and **Share** posts it as a normal
  message. Only `https://meet.google.com/abc-defg-hij` style links are accepted,
  and only those are made clickable in messages.
- No Google API or sign-in is involved, so nothing is stored beyond the message.
  Creating and sharing the meeting automatically would need Google Calendar OAuth
  (not built).

## Superadmin deletes
- A superadmin sees **Finance**, **Policies** and **Discussions** in the sidebar
  even when not a director. Without being a director they can only view and
  delete: no voting, recording payments or posting.
- A superadmin who is also a director keeps the normal view and gets a
  **Manage records** switch for the delete view.
- Deleting is a **soft delete**: the record gets `deletedAt` and `deletedBy` and
  is hidden from directors and admins everywhere (lists, totals, shares, badges,
  vote counts, email). Only the superadmin's delete view still shows it, greyed
  out and marked Deleted. There is no restore yet.
- Deletable: clients, payments, expenses, policies, whole threads and single
  messages. Nothing cascades: deleting a client leaves its payments and
  policies, and deleting a policy that is in force leaves that client with no
  split, so recording its payments is blocked (409) until a new one is approved.
  A deleted payment or expense drops out of totals and shares, like a void.

## Sidebar badges
Counts of what waits on the viewer: policies not yet voted on, expenses awaiting
their decision, unread threads. Refreshed on tab change and every 30 seconds.

## Deliberately not built
Director payout ledger, bank transfers, GST/invoicing, multi-currency, payment
edits, realtime chat, non-image attachments.
