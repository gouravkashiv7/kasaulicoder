# Directors' area

A private part of the admin dashboard for the company's board of directors
(currently three admins holding 33.33% each). It adds three tabs:

- **Finance**: client payments, share calculation, company expenses.
- **Policies**: proposals that pass with two director approvals.
- **Discussions**: threaded chat with an "email this message" action.

Only staff with the **Board director** flag can see or call any of it.

| Document | What's in it |
|----------|--------------|
| [rules.md](rules.md) | Business rules and every decision made, with the reasoning |
| [data-model.md](data-model.md) | Mongo collections and fields |
| [api.md](api.md) | Every `/api/director/*` endpoint |
| [code-map.md](code-map.md) | Where each piece lives in the repo |
| [setup.md](setup.md) | Turning it on, environment variables, email sender |
| [testing.md](testing.md) | Unit tests, the end-to-end run and its results |
| [e2e/](e2e/) | The seed, end-to-end and cleanup scripts |

## Quick start

1. A superadmin opens **Management → Staff → Edit** on each director and ticks
   **Board director**.
2. Directors sign in at `/login` (Admin) and open **Finance**, **Policies** or
   **Discussions** from the sidebar.
3. Add a client, then propose a finance policy for that client under Policies
   (pick the client first, then set the split) and have a second director
   approve it. Until the client has one, their payments can't be recorded.

## Known limits

- Directors' own profit **payouts** are not tracked. Shares are calculated and
  shown, nothing records that a director was paid their share.
- "Released" on an expense records that someone paid it. The app moves no money.
- Discussions refresh by polling every 15 seconds, not live.
- Payments can't be edited. Void (with a reason) and re-enter.
- The director email send path has not been exercised against the real SMTP
  server (see [testing.md](testing.md)).
