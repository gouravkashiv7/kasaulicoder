# Code map

**Backend (`backend/`)**
- `lib/auth.ts`: `isDirector` on the session, `requireDirector()` guard.
- `lib/money.ts`: `toPaise`, `formatINR`, `splitPaise` (pure).
- `lib/governance.ts`: `APPROVALS_REQUIRED`, `evaluatePolicy`, `evaluateExpense` (pure).
- `lib/directors.ts`: `getActiveDirectors()`.
- `lib/policies.ts`: `applyOutcome()` (single final transition, supersede), `getActiveSplit()`.
- `lib/attachments.ts`: image data-URL validation, ownership check.
- `lib/email.ts`: `sendDirectorEmail()` (uses `ADMIN_FROM`).
- `lib/__tests__/`: unit tests for money and governance.
- `models/`: see [data-model.md](data-model.md).

**API:** `app/api/director/**`, see [api.md](api.md).

**UI (`components/admin/`)**
- `director/Finance.tsx` with `PaymentsSection`, `ExpensesSection`, `ClientsSection`
- `director/Policies.tsx`, `director/modals/ProposePolicyModal.tsx`
- `director/Discussions.tsx`
- `director/modals/FinanceFormModal.tsx` (shared modal shell and field styles)
- `director/ScreenshotInput.tsx`, `director/imageCompress.ts`
- `director/useDirectorBadges.ts`
- `AdminSidebar.tsx`, `types.ts` (tabs, badges, record types)
- `modals/StaffModal.tsx`: the "Board director" checkbox
- `components/auth/AdminDashboard.tsx`: tab list and rendering (`isDirector` prop from `app/admin/dashboard/page.tsx`)

**Config:** `tsconfig.json` enables `allowImportingTsExtensions` (tests import
`.ts` files); `package.json` has `pnpm test`.
