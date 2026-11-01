# API reference

All routes live under `/api/director/` and require a signed-in **director**
(401 without a session, 403 for non-directors). Bodies and responses are JSON
except attachment download.

## Policies
| Method & path | Purpose |
|---------------|---------|
| `GET /policies` | `{ policies, directors, me }`, newest first |
| `POST /policies` | Propose a finance policy for a client: `{ clientId, title, body, split }`, where `split = { companyPercent, directors: [{ staff, percent }] }`; every active director must appear and the total must be 100 |
| `POST /policies/[id]/vote` | `{ vote: "yes" \| "no", comment? }` → `{ status }` |

## Finance
| Method & path | Purpose |
|---------------|---------|
| `GET /finance/summary` | Totals, company balance, each director's share, `awaitingMyApproval` |
| `GET /finance/clients` · `POST` · `PUT` | List; add `{ name, email?, phone?, notes? }`; edit or archive `{ id, …, isActive? }` |
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

## Badges
`GET /badges` → `{ policies, finance, discussions }`.

## Also changed
`/api/admin/staff` (GET/POST/PUT) now reads and writes `isDirector`; only a
superadmin can change it.
