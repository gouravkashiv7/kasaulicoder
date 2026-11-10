"use client";

import { useState } from "react";
import { formatINR } from "@/backend/lib/money";
import type { ContributionRecord } from "../types";
import MonthFilter, { useMonthFilter } from "./MonthFilter";
import FinanceFormModal, {
  fieldClass,
  labelClass,
} from "./modals/FinanceFormModal";
import ScreenshotInput from "./ScreenshotInput";

interface DirectorOption {
  id: string;
  name: string;
  email: string;
}

interface FundsSectionProps {
  contributions: ContributionRecord[];
  me: string;
  isMohit?: boolean;
  directors?: DirectorOption[];
  directorCount: number;
  onChanged: () => void;
}

const STATUS_CONFIG: Record<string, { tone: string; label: string }> = {
  pending: {
    tone: "bg-amber-500/15 text-amber-500 border border-amber-500/30",
    label: "Awaiting Mohit's Approval",
  },
  approved: {
    tone: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30",
    label: "Approved & Added to Company",
  },
  completed: {
    tone: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30",
    label: "Approved & Added to Company",
  },
  cancelled: {
    tone: "bg-rose-500/15 text-rose-500 border border-rose-500/30",
    label: "Rejected / Cancelled",
  },
  rejected: {
    tone: "bg-rose-500/15 text-rose-500 border border-rose-500/30",
    label: "Rejected",
  },
};

const FundsSection = ({
  contributions,
  me,
  isMohit = false,
  directors = [],
  onChanged,
}: FundsSectionProps) => {
  const monthly = useMonthFilter(contributions, (c) => c.createdAt);
  const [dialog, setDialog] = useState<
    | { kind: "start" }
    | { kind: "approve"; contribution: ContributionRecord }
    | { kind: "reject"; contribution: ContributionRecord }
    | { kind: "cancel"; contribution: ContributionRecord }
    | null
  >(null);

  const [amount, setAmount] = useState("");
  const [fundedBy, setFundedBy] = useState(me || "");
  const [customFunder, setCustomFunder] = useState("");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setDialog(null);
    setAmount("");
    setFundedBy(me || "");
    setCustomFunder("");
    setNote("");
    setReason("");
    setProof(null);
    setError("");
  };

  const send = async (url: string, body: object) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      close();
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const completedPaise = monthly.filtered
    .filter((c) => c.status === "completed" || c.status === "approved")
    .reduce((s, c) => s + c.totalPaise, 0);

  const pendingPaise = monthly.filtered
    .filter((c) => c.status === "pending")
    .reduce((s, c) => s + c.totalPaise, 0);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold">Company Funds</h2>
          <p className="text-xs text-foreground/60">
            Anyone can request to add funds. Requests must be approved by
            Director Mohit to update company finances.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFundedBy(me || (directors[0]?.id ?? ""));
            setDialog({ kind: "start" });
          }}
          className="px-5 py-2.5 bg-primary text-primary-content font-black rounded-xl hover:brightness-110 shadow-sm"
        >
          + Add Funds
        </button>
      </div>

      <MonthFilter
        months={monthly.months}
        value={monthly.month}
        onChange={monthly.setMonth}
        summary={`${monthly.filtered.length} fund requests · ${formatINR(
          completedPaise,
        )} approved${
          pendingPaise > 0
            ? ` · ${formatINR(pendingPaise)} awaiting approval`
            : ""
        }`}
      />

      {contributions.length === 0 ? (
        <div className="rounded-2xl border border-foreground/10 p-10 text-center font-bold text-foreground/40">
          No fund records yet.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground/50">
              Fund History & Requests ({monthly.filtered.length})
            </h3>
            {isMohit && (
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                You are Director Mohit (Authorized Approver)
              </span>
            )}
          </div>

          <ul className="space-y-3">
            {monthly.filtered.map((c) => {
              const statusCfg =
                STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
              const isCreator = c.createdBy?._id === me;
              const funderName =
                c.fundedBy?.name ||
                c.fundedByName ||
                c.createdBy?.name ||
                "Not specified";

              return (
                <li
                  key={c._id}
                  className="rounded-2xl border border-foreground/10 bg-background/50 backdrop-blur-sm p-5 transition-all hover:border-foreground/20"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xl font-black text-foreground">
                          {formatINR(c.totalPaise)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase ${statusCfg.tone}`}
                        >
                          {statusCfg.label}
                        </span>
                      </div>

                      <div className="text-xs text-foreground/70 space-y-1">
                        <p>
                          <span className="font-bold text-foreground/90">
                            Funded by:
                          </span>{" "}
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">
                            {funderName}
                          </span>
                          {" · "}
                          <span className="text-foreground/50">
                            Requested by {c.createdBy?.name ?? "Unknown"} on{" "}
                            {new Date(c.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </p>

                        {c.note && (
                          <div className="mt-2 rounded-xl bg-foreground/5 p-3 text-xs text-foreground/80 border border-foreground/5">
                            <span className="font-bold text-foreground/90 block mb-0.5">
                              Reason / Note:
                            </span>
                            <span className="whitespace-pre-wrap">
                              {c.note}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          {c.proof && (
                            <a
                              href={`/api/director/finance/attachments/${c.proof}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                            >
                              📎 View Attached Proof
                            </a>
                          )}

                          {c.approvedBy && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              ✓ Approved by {c.approvedBy.name}
                              {c.approvedAt &&
                                ` on ${new Date(c.approvedAt).toLocaleDateString("en-IN")}`}
                            </span>
                          )}

                          {c.cancelledBy && (
                            <span className="text-[11px] text-rose-500 font-semibold">
                              ✕ Cancelled / Rejected by {c.cancelledBy.name}
                              {c.cancelReason ? `: ${c.cancelReason}` : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {c.status === "pending" && (
                      <div className="flex flex-wrap items-center gap-2">
                        {isMohit ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setDialog({
                                  kind: "approve",
                                  contribution: c,
                                })
                              }
                              className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-black hover:bg-emerald-700 shadow-sm transition-colors"
                            >
                              Approve Funds
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDialog({ kind: "reject", contribution: c })
                              }
                              className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg text-xs font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                              Pending Mohit&apos;s Approval
                            </span>
                            {isCreator && (
                              <button
                                type="button"
                                onClick={() =>
                                  setDialog({
                                    kind: "cancel",
                                    contribution: c,
                                  })
                                }
                                className="text-xs text-rose-500 hover:underline"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Legacy shares representation if present */}
                  {c.shares && c.shares.length > 0 && (
                    <div className="mt-3 border-t border-foreground/5 pt-3">
                      <p className="text-[10px] uppercase font-bold text-foreground/40 mb-1.5">
                        Historical Share Breakdown:
                      </p>
                      <ul className="grid gap-2 sm:grid-cols-3">
                        {c.shares.map((s) => (
                          <li
                            key={s.staff._id}
                            className="flex items-center justify-between rounded-lg bg-foreground/5 px-2.5 py-1.5 text-[11px]"
                          >
                            <span className="font-medium text-foreground/80">
                              {s.staff.name}
                            </span>
                            <span className="text-foreground/60 font-semibold">
                              {formatINR(s.paise)}
                              {s.status === "confirmed" && " (Confirmed)"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Add Funds Modal */}
      <FinanceFormModal
        open={dialog?.kind === "start"}
        title="Add Funds to Company"
        submitLabel="Submit Fund Request"
        saving={saving}
        error={error}
        disabled={!amount || Number(amount) <= 0 || !note.trim()}
        onClose={close}
        onSubmit={() =>
          send("/api/director/finance/contributions", {
            amount,
            note,
            fundedBy: fundedBy === "other" ? undefined : fundedBy,
            fundedByName:
              fundedBy === "other"
                ? customFunder.trim()
                : directors.find((d) => d.id === fundedBy)?.name,
            attachmentId: proof,
          })
        }
      >
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-xs text-foreground/80 space-y-1">
          <p className="font-bold text-primary">
            ℹ️ Approval & Notification Process
          </p>
          <p>
            When submitted, an email notification will automatically be sent to
            all 3 board directors. The funds will update the company balance
            once approved by <strong>Director Mohit</strong>.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="fund-amount" className={labelClass}>
            Amount to Add (₹) *
          </label>
          <input
            id="fund-amount"
            inputMode="decimal"
            placeholder="e.g. 50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="fund-funder" className={labelClass}>
            Whose Funded the Amount to Company? *
          </label>
          <select
            id="fund-funder"
            value={fundedBy}
            onChange={(e) => setFundedBy(e.target.value)}
            className={fieldClass}
          >
            {directors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.email})
              </option>
            ))}
            <option value="other">Other Contributor / External</option>
          </select>
        </div>

        {fundedBy === "other" && (
          <div className="space-y-1.5">
            <label htmlFor="custom-funder" className={labelClass}>
              Contributor Name *
            </label>
            <input
              id="custom-funder"
              placeholder="Name of person or entity"
              value={customFunder}
              onChange={(e) => setCustomFunder(e.target.value)}
              className={fieldClass}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="fund-note" className={labelClass}>
            Reason / Purpose of Funding (included in email to directors) *
          </label>
          <textarea
            id="fund-note"
            rows={3}
            maxLength={500}
            placeholder="Explain why funds are being added to the company..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${fieldClass} resize-y`}
          />
        </div>

        <ScreenshotInput
          label="Proof of Transfer / Receipt (Optional)"
          onChange={setProof}
        />
      </FinanceFormModal>

      {/* Approve Modal (for Director Mohit) */}
      <FinanceFormModal
        open={dialog?.kind === "approve"}
        title="Approve Fund Request"
        submitLabel="Confirm & Add to Company Finances"
        saving={saving}
        error={error}
        onClose={close}
        onSubmit={() =>
          dialog?.kind === "approve" &&
          send(
            `/api/director/finance/contributions/${dialog.contribution._id}/approve`,
            {},
          )
        }
      >
        {dialog?.kind === "approve" && (
          <div className="space-y-3">
            <p className="text-sm">
              Are you sure you want to approve this fund of{" "}
              <strong className="text-emerald-500 font-black">
                {formatINR(dialog.contribution.totalPaise)}
              </strong>
              ?
            </p>
            <div className="rounded-xl bg-foreground/5 p-3 text-xs space-y-1 border border-foreground/10">
              <p>
                <strong>Funded by:</strong>{" "}
                {dialog.contribution.fundedBy?.name ||
                  dialog.contribution.fundedByName ||
                  dialog.contribution.createdBy?.name}
              </p>
              <p>
                <strong>Requested by:</strong>{" "}
                {dialog.contribution.createdBy?.name}
              </p>
              {dialog.contribution.note && (
                <p>
                  <strong>Reason:</strong> {dialog.contribution.note}
                </p>
              )}
            </div>
            <p className="text-xs text-foreground/60">
              Once approved by you (Director Mohit), this amount will
              immediately be credited into the company balance and finances.
            </p>
          </div>
        )}
      </FinanceFormModal>

      {/* Reject Modal (for Director Mohit) */}
      <FinanceFormModal
        open={dialog?.kind === "reject"}
        title="Reject Fund Request"
        submitLabel="Reject Request"
        saving={saving}
        error={error}
        disabled={!reason.trim()}
        onClose={close}
        onSubmit={() =>
          dialog?.kind === "reject" &&
          send(
            `/api/director/finance/contributions/${dialog.contribution._id}/reject`,
            { reason },
          )
        }
      >
        <div className="space-y-1.5">
          <label htmlFor="fund-reject-reason" className={labelClass}>
            Reason for Rejection *
          </label>
          <textarea
            id="fund-reject-reason"
            rows={3}
            maxLength={500}
            placeholder="Enter reason for rejecting this fund request..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={`${fieldClass} resize-y`}
          />
        </div>
      </FinanceFormModal>

      {/* Cancel Modal (for Creator) */}
      <FinanceFormModal
        open={dialog?.kind === "cancel"}
        title="Cancel Fund Request"
        submitLabel="Cancel Request"
        saving={saving}
        error={error}
        disabled={!reason.trim()}
        onClose={close}
        onSubmit={() =>
          dialog?.kind === "cancel" &&
          send(
            `/api/director/finance/contributions/${dialog.contribution._id}/cancel`,
            { reason },
          )
        }
      >
        <div className="space-y-1.5">
          <label htmlFor="fund-cancel-reason" className={labelClass}>
            Reason for Cancellation *
          </label>
          <textarea
            id="fund-cancel-reason"
            rows={3}
            maxLength={500}
            placeholder="Why is this request being cancelled?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={`${fieldClass} resize-y`}
          />
        </div>
      </FinanceFormModal>
    </section>
  );
};

export default FundsSection;
