# Code map

**Backend (`backend/`)**
- `lib/auth.ts`: `isDirector` on the session, `requireDirector()` guard.
- `lib/money.ts`: `toPaise`, `formatINR`, `splitPaise` (pure).
- `lib/governance.ts`: `APPROVALS_REQUIRED`, `evaluatePolicy`, `evaluateExpense` (pure).
- `lib/softDelete.ts`: `softDeleteFields`, `NOT_DELETED` filter, `SoftDeletable`; `lib/auth.ts` also has `requireSuperAdmin()`.
- `lib/directors.ts`: `getActiveDirectors()`.
- `lib/policies.ts`: `applyOutcome()` (single final transition, supersede), `getActiveSplit()`.
- `lib/attachments.ts`: image data-URL validation, ownership check.
- `lib/email.ts`: `sendDirectorEmail()` (uses `ADMIN_FROM`).
- `lib/__tests__/`: unit tests for money and governance.
- `models/`: see [data-model.md](data-model.md).

**API:** `app/api/director/**` and the superadmin `app/api/admin/records/**`, see [api.md](api.md).

**UI (`components/admin/`)**
- `director/Finance.tsx` with `PaymentsSection`, `ExpensesSection`, `ClientsSection`
- `director/Policies.tsx`, `director/modals/ProposePolicyModal.tsx`
- `director/Discussions.tsx`
- `director/modals/FinanceFormModal.tsx` (shared modal shell and field styles)
- `director/ScreenshotInput.tsx`, `director/imageCompress.ts`
- `director/useDirectorBadges.ts`
- `records/RecordsManager.tsx` (superadmin delete view), `records/RecordsTab.tsx` (picks director or delete view)
- `AdminSidebar.tsx`, `types.ts` (tabs, badges, record types)
- `modals/StaffModal.tsx`: the "Board director" checkbox
- `components/auth/AdminDashboard.tsx`: tab list and rendering (`isDirector` prop from `app/admin/dashboard/page.tsx`)

**MemberHub (`components/auth/MemberDashboard.tsx`)**
- "Directors" sidebar group for `isDirector` users (links into the admin panel,
  badges via `useDirectorBadges`).
- Settings: admins edit their own **Designation** (max 100) and **Role
  description** (max 500) next to name, email and password.
- Settings also has a **profile photo** control (admins only): the browser
  centre-crops to a 400×400 JPEG (`lib/imageResize.ts`), shows a preview, and
  sends it only when it changed. **Remove** clears it.
- "Update Profile" reads the field values from the form at submit time, so
  autofill, password managers and scripted fills are saved even when no change
  event fired.
- `app/api/member/profile/route.ts` (PATCH) accepts `designation`,
  `roleDescription` and `image` for `admin` and `superadmin` roles only; other
  roles stay read-only. The photo must be a JPEG/PNG/WebP data URL whose bytes
  match its type and is at most 200 KB; `""` removes it. It is validated before
  anything is changed.
- `AdminSidebar.tsx`: **My Workspace** link for non-superadmins.

**Management (superadmin, `?tab=management`)**
- Team Members are grouped into **Admins**, **Editors** and **Support** (with
  counts, sorted by name) and directors carry a **Director** badge.
- `GET /api/admin/staff` now returns `roleDescription` and `createdAt`. It
  previously omitted both, so the edit dialog opened with an empty role
  description (and saving would have blanked it) and "Joined" had no date.
- Wording: "Team member" for people with staff accounts (modal titles "Add Team
  Member" / "Edit Team Member", button "Add Team Member"), "Role" for the access
  level, "Designation" for the job title, "Role description" for the text shown
  on the dashboard and team section.
- Role descriptions in the dropdown match real access: Admin = blogs, projects,
  social media, edits own profile; Editor = blogs, projects, social media;
  Support = writes blogs only.

**Config:** `tsconfig.json` enables `allowImportingTsExtensions` (tests import
`.ts` files); `package.json` has `pnpm test`.
