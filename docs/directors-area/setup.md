# Setup and operations

## Current state (2026-10-31)
The three active admins are flagged as directors in the live database:
Avinash Thakur, Gourav Kashiv and Mohit Thakur. Manish Gupta is an admin but
inactive, so is not a director. If he is reactivated and should be a director,
tick the box for him in Management and approve a new finance policy for each client (an active
split must cover exactly the active directors).

No client has a finance policy yet, so payments can't be recorded until one is
proposed and approved for that client.

## Where directors find it
Admins who are not superadmins land in **MemberHub** (`/member/dashboard`) after
login. Directors see a **Directors** group there (Finance, Policies,
Discussions, with the same badges as the admin panel). These links open the
admin panel (`/admin/dashboard?tab=...`). The admin panel's sidebar has a
**My Workspace** link back to MemberHub.

## Turn it on
1. Sign in as a superadmin → **Management → Staff** → edit each director →
   tick **Board director** → save. The tabs appear for them at next load.
2. Add clients.
3. A director proposes a finance policy for a client (company % plus one % per
   director, totalling 100) and another director approves it, then payments
   for that client can be recorded.

If a director is deactivated or a new one is added, the active split no longer
matches the directors: propose and approve a new finance policy for the client
before recording more of their payments.

## Environment variables
| Variable | Used for |
|----------|----------|
| `MONGODB_URI`, `JWT_SECRET` | Existing; required |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` | Existing mail transport |
| `ADMIN_FROM` | New, optional. Sender for director emails. Default `admin@kasaulicoder.com` |

**Email caveat:** the Hostinger SMTP login must be allowed to send as
`admin@kasaulicoder.com` (that mailbox, or an alias of it). Otherwise the server
rejects or rewrites the sender and "Email this" returns an error.

## Operating notes
- Rate limiting is in-memory and per instance (same as the rest of the app).
- Screenshots are stored in MongoDB (1 MB cap each), like staff photos. If volume
  grows, move them to object storage behind the same attachment routes.
- Backups: finance records are append-only (void, never delete). Keep normal
  database backups.
