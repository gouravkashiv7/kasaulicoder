# Testing

## Unit tests
```bash
pnpm test
```
18 tests in `backend/lib/__tests__/` for the pure modules: paise parsing and
limits, INR formatting, split rounding (always sums exactly, remainder to the
company), policy pass/reject thresholds, and expense approval rules
(requester and non-director votes ignored).

## End-to-end run (2026-10-31)
Run against the dev server and the database from `.env`, as instructed, using
four clearly marked test staff (`E2E-TEST`, `@e2e.kasaulicoder.test`) created
for the run and deleted afterwards. The real admins were not touched, and no
real directors were flagged at the time (they were flagged afterwards, see
[setup.md](setup.md)).

**18 of 18 API checks passed:** access control (401/403 everywhere); payment
blocked before a split exists; split not totalling 100% refused; proposer's vote
counts; two approvals pass, simultaneous final votes safe; decided policy final;
payment split sums exactly (₹1,00,000.01 → company ₹20,000.01, directors
₹26,670 / ₹26,670 / ₹26,660); screenshots directors-only and fake/non-image
uploads refused; summary totals; expense needs both others, own and reason-less
rejects blocked; requester can't release own expense, release deducts the
balance once; rejection ends an expense; two "no" votes reject a policy; new
split supersedes the old one while old payments keep their shares; void needs a
reason, is one-way, leaves totals; bad amounts refused; threads, replies and
unread tracking; email refused without subject or valid recipients.

**UI check (signed in as a test director):** director tabs shown in the sidebar;
Finance totals in Indian format; Policies shows the active split; Discussions
shows the unread badge, thread, "Email this" dialog; the Send button stays
disabled until a subject is entered. No console errors.

**Cleanup:** every test record was deleted, confirmed by counts (all director
collections empty, zero `E2E-TEST` staff).

## Not verified
- **A real email send.** Only the validation path was tested, because sending
  would use the live SMTP account. Try it once after setting up the sender.
- Behaviour with the three real directors.
- Mobile layout beyond a 1024px-wide window, and light/other themes.

## Re-running the end-to-end check
The scripts in `e2e/` write to the database in `.env` and clean up after
themselves. From the project root:

```bash
export NODE_PATH=$PWD/node_modules
mkdir -p /tmp/e2e-run
node --env-file=.env docs/directors-area/e2e/seed.cjs /tmp/e2e-run
pnpm dev   # in another terminal
node docs/directors-area/e2e/e2e.mjs /tmp/e2e-run
node --env-file=.env docs/directors-area/e2e/cleanup.cjs
rm -rf /tmp/e2e-run
```

**Warning:** these scripts cannot be re-run as they are now that the three real
directors are flagged. A revenue split must cover every active director, so the
split checks would fail (the test accounts and the real directors would all
count). Re-running needs either a separate test database, or temporarily
un-flagging the real directors, which is not recommended on live data.
`cleanup.cjs` deletes only records created by `E2E-TEST` staff. It finds them by
`designation: "E2E-TEST"`, so if a test changes that field (as the profile-edit
check did), delete the account by email instead.

## MemberHub changes (2026-10-31)
Checked in the browser with one temporary director account, deleted afterwards:
the Directors group appears, Finance opens in the admin panel with the real
directors' share cards, My Workspace links back, and Settings saves designation
and role description (PATCH 200, "Profile updated successfully").
