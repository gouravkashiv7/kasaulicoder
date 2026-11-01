# API reference

All routes live under `/api/director/` and require a signed-in **director**
(401 without a session, 403 for non-directors). Bodies and responses are JSON
except attachment download.

## Policies
| Method & path | Purpose |
|---------------|---------|
| `GET /policies` | `{ policies, directors, me }`, newest first |
| `POST /policies` | Propose a finance policy for a client: `{ clientId, title, body, split }`, where `split = { companyPercent, directors: [{ staff, percent }], outsourced?: { name, percent } }` (`outsourced` is an optional share for a non-director such as an employee); every active director must appear and the total must be 100 |
| `POST /policies/[id]/vote` | `{ vote: "yes" \| "no", comment? }` → `{ status }` |

## Finance
| Method & path | Purpose |
|---------------|---------|
| `GET /finance/summary` | Totals, company balance, each director's share, `awaitingMyApproval` |
| `GET /finance/clients` · `POST` · `PUT` | List; add `{ name, email?, phone?, notes?, managedBy? }` (`managedBy` is an active director id, or blank for none); edit or archive `{ id, …, isActive? }` |
| `GET /finance/payments` | `{ payments, clientsWithPolicy }` (ids of clients with an approved finance policy) |
| `POST /finance/payments` | `{ clientId, amount, receivedOn (YYYY-MM-DD), reference?, note?, attachmentId? }`. 409 if no split or split no longer matches directors |
| `POST /finance/payments/[id]/void` | `{ reason }` |
| `GET /finance/expenses` | `{ expenses, me }` |
| `POST /finance/expenses` | `{ purpose, amount, attachmentId }` (screenshot required) |
| `POST /finance/expenses/[id]/decision` | `{ decision: "approve" \| "reject", comment? }` (comment required to reject; requester gets 403) |
| `POST /finance/expenses/[id]/release` | `{ reference?, attachmentId? }`; 409 if not approved, already released, or you are the requester |
| `POST /finance/attachments` | `{ dataUrl }` (JPEG/PNG/WebP, ≤1 MB) → `{ id }`; 30 per 10 min |
| `GET /finance/attachments/[id]` | The image |

## Discussions
| Method & path | Purpose |
|---------------|---------|
| `GET /discussions` | Threads with `preview`, `messageCount`, `unread` |
| `POST /discussions` | `{ title, body }` starts a thread |
| `GET /discussions/[id]` | Thread and messages; marks it read for you |
| `POST /discussions/[id]/messages` | `{ body }` |
| `POST /discussions/[id]/email` | `{ messageId, recipientIds[], subject, note? }` → `{ sentTo }`. 400 without a subject or valid recipients |

## Assets
`GET /assets` → all assets. `POST /assets` and `PUT /assets` (`{ id, ... }`) take
`{ kind (domain|software|hardware|account|other), name, registrar?, expiresOn?
(YYYY-MM-DD), autoRenew?, cost?, costPeriod (one-time|monthly|yearly),
purchasedOn?, notes? }`. A domain `name` is normalised and must be unique (409).
Blank dates or cost clear them.

## Fund the company (under `/finance`)
| Method & path | Purpose |
|---------------|---------|
| `GET /contributions` | `{ contributions, me }`, newest first |
| `POST /contributions` | `{ amount, note? }`; split equally between active directors; 400 if the share would be zero |
| `POST /contributions/[id]/confirm` | `{ attachmentId }`; only the director named on a share; 409 if already confirmed, not open, a director in the split is inactive, or the proof was already used; 502 if the proof can't be stored |
| `POST /contributions/[id]/cancel` | `{ reason }`; only while pending |

`GET /finance/summary` also returns `contributedPaise` and
`awaitingContributionPaise`; `companyBalancePaise` includes completed
contributions.

## Proof uploads
`POST /finance/attachments` takes `{ dataUrl }` (PNG, JPG or PDF) and returns
`{ id }`; 409 if the same file was already used. `GET /finance/attachments/[id]`
streams a proof (directors and superadmins).

## Badges
`GET /badges` → `{ policies, finance, discussions, assets }`. `finance` also counts contributions waiting for the viewer's proof; `assets` counts domains expiring within 30 days or expired.

## Superadmin records (`/api/admin/records`)
Superadmin only (401 without a session, 403 otherwise). Not under `/api/director/`.

| Method & path | Purpose |
|---------------|---------|
| `GET /records?tab=finance\|policies\|assets\|discussions` | Every record of that tab **including deleted ones** (`deletedAt` set). Finance: `{ clients, payments, expenses, contributions }`; assets: `{ assets }`; policies: `{ policies }`; discussions: `{ threads }`, each with its `messages` |
| `DELETE /records/[type]/[id]` | Soft-delete. `type` is `client`, `payment`, `expense`, `contribution`, `asset`, `policy`, `thread` or `message`. 404 if missing or already deleted |

Every `/api/director/*` read and write skips deleted records, so a deleted
record behaves as if it did not exist (404 on actions, absent from lists,
totals, split lookup and badges).

## Also changed
`/api/admin/staff` (GET/POST/PUT) now reads and writes `isDirector`; only a
superadmin can change it.
