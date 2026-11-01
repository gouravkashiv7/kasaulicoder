"use client";

import { useState } from "react";
import { equalShares, formatINR } from "@/backend/lib/money";
import type { ContributionRecord } from "../types";
import MonthFilter, { useMonthFilter } from "./MonthFilter";
import FinanceFormModal, {
  fieldClass,
  labelClass,
} from "./modals/FinanceFormModal";
import ScreenshotInput from "./ScreenshotInput";

interface FundsSectionProps {
  contributions: ContributionRecord[];
  me: string;
  directorCount: number;
  onChanged: () => void;
}

const STATUS_TONE: Record<ContributionRecord["status"], string> = {
  pending: "bg-amber-500/15 text-amber-500",
  completed: "bg-emerald-500/15 text-emerald-500",
  cancelled: "bg-foreground/10 text-foreground/50",
};

const FundsSection = ({
  contributions,
  me,
  directorCount,
  onChanged,
}: FundsSectionProps) => {
  const monthly = useMonthFilter(contributions, (c) => c.createdAt);
  const [dialog, setDialog] = useState<
    | { kind: "start" }
    | { kind: "confirm"; contribution: ContributionRecord }
    | { kind: "cancel"; contribution: ContributionRecord }
    | null
  >(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setDialog(null);
    setAmount("");
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

  // What the typed amount comes to once split between today's directors
  const typed = Math.round(Number(amount) * 100);
  const preview =
    Number.isFinite(typed) && typed > 0 && directorCount > 0
      ? equalShares(typed, directorCount)
      : null;

  return (
    <section>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setDialog({ kind: "start" })}
          className="px-5 py-2.5 bg-primary text-primary-content font-black rounded-xl hover:brightness-110"
        >
          Fund the company
        </button>
      </div>

      <MonthFilter
        months={monthly.months}
        value={monthly.month}
        onChange={monthly.setMonth}
        summary={`${monthly.filtered.length} contributions · ${formatINR(
          monthly.filtered
            .filter((c) => c.status === "completed")
            .reduce((s, c) => s + c.totalPaise, 0),
        )} added`}
      />

      {contributions.length === 0 ? (
        <p className="rounded-2xl border border-foreground/10 p-10 text-center font-bold text-foreground/40">
          No contributions yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {monthly.filtered.map((c) => {
            const mine = c.shares.find((s) => s.staff._id === me);
            return (
              <li
                key={c._id}
                className="rounded-2xl border border-foreground/10 bg-background/40 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black">
                      {formatINR(c.totalPaise)}{" "}
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${STATUS_TONE[c.status]}`}
                      >
                        {c.status === "pending"
                          ? "Awaiting confirmation"
                          : c.status}
                      </span>
                    </p>
                    <p className="text-xs text-foreground/50">
                      Started by {c.createdBy?.name ?? "Unknown"} on{" "}
                      {new Date(c.createdAt).toLocaleDateString("en-IN")}
                      {c.note ? ` · ${c.note}` : ""}
                    </p>
                  </div>
                  {c.status === "pending" && (
                    <div className="flex gap-3 text-xs font-bold">
                      {mine?.status === "pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            setDialog({ kind: "confirm", contribution: c })
                          }
                          className="text-primary hover:underline"
                        >
                          Confirm with proof
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setDialog({ kind: "cancel", contribution: c })
                        }
                        className="text-rose-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {c.shares.map((s) => (
                    <li
                      key={s.staff._id}
                      className="flex items-center justify-between rounded-xl bg-foreground/5 px-3 py-2 text-xs"
                    >
                      <span className="font-bold">{s.staff.name}</span>
                      <span className="text-foreground/60">
                        {formatINR(s.paise)} ·{" "}
                        {s.status === "confirmed" ? (
                          <>
                            confirmed
                            {s.proof && (
                              <>
                                {" "}
                                <a
                                  href={`/api/director/finance/attachments/${s.proof}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  View proof
                                </a>
                              </>
                            )}
                          </>
                        ) : (
                          "waiting"
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                {c.status === "cancelled" && c.cancelReason && (
                  <p className="mt-2 text-xs text-foreground/50">
                    Cancelled by {c.cancelledBy?.name ?? "a director"}:{" "}
                    {c.cancelReason}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <FinanceFormModal
        open={dialog?.kind === "start"}
        title="Fund the company"
        submitLabel="Start"
        saving={saving}
        error={error}
        disabled={!preview || preview.sharePaise === 0}
        onClose={close}
        onSubmit={() =>
          send("/api/director/finance/contributions", { amount, note })
        }
      >
        <p className="text-xs text-foreground/60">
          The amount is split equally between all {directorCount} directors. It
          counts toward the company balance only after every director confirms
          their share with a proof.
        </p>
        <div className="space-y-1.5">
          <label htmlFor="fund-amount" className={labelClass}>
            Total amount (₹)
          </label>
          <input
            id="fund-amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={fieldClass}
          />
        </div>
        {preview && preview.sharePaise > 0 && (
          <p className="rounded-xl bg-foreground/5 p-3 text-sm font-bold">
            {formatINR(preview.sharePaise)} each ·{" "}
            {formatINR(preview.creditedPaise)} in total
            {preview.creditedPaise !== typed && (
              <span className="block text-xs font-normal text-foreground/50">
                Rounded down so every director pays the same amount.
              </span>
            )}
          </p>
        )}
        <div className="space-y-1.5">
          <label htmlFor="fund-note" className={labelClass}>
            Note (optional)
          </label>
          <input
            id="fund-note"
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={fieldClass}
          />
        </div>
      </FinanceFormModal>

      <FinanceFormModal
        open={dialog?.kind === "confirm"}
        title="Confirm your share"
        submitLabel="Confirm"
        saving={saving}
        error={error}
        disabled={!proof}
        onClose={close}
        onSubmit={() =>
          dialog?.kind === "confirm" &&
          send(
            `/api/director/finance/contributions/${dialog.contribution._id}/confirm`,
            { attachmentId: proof },
          )
        }
      >
        {dialog?.kind === "confirm" && (
          <p className="text-sm">
            You are confirming{" "}
            <strong>
              {formatINR(
                dialog.contribution.shares.find((s) => s.staff._id === me)
                  ?.paise ?? 0,
              )}
            </strong>
            . Attach the proof of your payment (PNG, JPG or PDF).
          </p>
        )}
        <ScreenshotInput
          label="Proof of payment"
          required
          onChange={setProof}
        />
      </FinanceFormModal>

      <FinanceFormModal
        open={dialog?.kind === "cancel"}
        title="Cancel this contribution"
        submitLabel="Cancel contribution"
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
          <label htmlFor="fund-cancel" className={labelClass}>
            Reason
          </label>
          <textarea
            id="fund-cancel"
            rows={3}
            maxLength={500}
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
