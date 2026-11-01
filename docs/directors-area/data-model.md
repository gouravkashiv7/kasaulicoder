# Data model

All collections are Mongoose models in `backend/models/`. Amounts are in paise.

| Model | File | Fields |
|-------|------|--------|
| Staff (changed) | `Staff.ts` | `isDirector: boolean` (default false) |
| Policy | `Policy.ts` | `title`, `body` (Markdown), `type` (`finance`, the only type for now), `client`, `split { companyBps, directors[{staff, bps}], outsourced? { name, bps } }`, `proposedBy`, `votes[{staff, vote yes/no, comment, at}]`, `status` (`proposed` \| `approved` \| `rejected` \| `superseded`), `decidedAt` |
| Client | `Client.ts` | `name`, `email`, `phone`, `notes`, `managedBy` (optional, an active director), `isActive`, `createdBy` |
| Payment | `Payment.ts` | `client`, `amountPaise`, `receivedOn`, `reference`, `note`, `attachment`, `recordedBy`, `allocation { policy, companyPaise, shares[{staff, paise}], outsourced? { name, paise } }`, `status` (`recorded` \| `void`), `voidReason`, `voidedBy`, `voidedAt` |
| Expense | `Expense.ts` | `purpose`, `amountPaise`, `attachment`, `requestedBy`, `approvals[{staff, decision approve/reject, comment, at}]`, `status` (`pending` \| `approved` \| `rejected` \| `released`), `release { by, at, reference, attachment }` |
| Attachment | `Attachment.ts` | `mime` (png/jpeg/pdf), `size`, `uploadedBy`, `sha256` (unique), `linked`, `linkedTo { kind, id }`, `storage` (`cloudinary`; missing = MongoDB), `publicId`, `version`, `format`, `data` (Buffer, only while staged or for pre-Cloudinary rows). Unlinked rows expire after 24 h |
| CompanyAsset | `CompanyAsset.ts` | `kind`, `name` (normalised domain for domains), `registrar`, `expiresOn`, `autoRenew`, `costPaise`, `costPeriod`, `purchasedOn`, `notes`, `createdBy` |
| Contribution | `Contribution.ts` | `totalPaise` (credited), `note`, `createdBy`, `shares[{staff, paise, status pending/confirmed, proof, confirmedAt}]`, `status` (`pending` \| `completed` \| `cancelled`), `completedAt`, `cancelReason`, `cancelledBy` |
| Thread | `Thread.ts` | `title`, `createdBy`, `lastMessageAt`, `readBy` (map staff id → date) |
| ThreadMessage | `ThreadMessage.ts` | `thread`, `author`, `body`, `emails[{to[], subject, sentBy, at}]` |

Client, Payment, Expense, Contribution, CompanyAsset, Policy, Thread and ThreadMessage also carry
`deletedAt` and `deletedBy` (soft delete, see `backend/lib/softDelete.ts`). A
missing `deletedAt` means not deleted, so existing records need no migration.

Mongo collection names are the Mongoose defaults: `staffs`, `policies`,
`clients`, `payments`, `expenses`, `contributions`, `companyassets`, `attachments`, `threads`, `threadmessages`.
