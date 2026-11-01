"use client";

import { useState } from "react";
import { formatINR } from "@/backend/lib/money";
import type { ExpenseRecord } from "../types";
import MonthFilter, { useMonthFilter } from "./MonthFilter";
import FinanceFormModal, {
  fieldClass,
  labelClass,
} from "./modals/FinanceFormModal";
import ScreenshotInput from "./ScreenshotInput";

interface ExpensesSectionProps {
  expenses: ExpenseRecord[];
  me: string;
  onChanged: () => void;
}

const STATUS_STYLE: Record<ExpenseRecord["status"], string> = {
  pending: "bg-amber-500/10 text-amber-500",
  approved: "bg-sky-500/10 text-sky-500",
  rejected: "bg-rose-500/10 text-rose-500",
  released: "bg-emerald-500/10 text-emerald-500",
};

type Action =
  | { kind: "reject"; expense: ExpenseRecord }
  | { kind: "release"; expense: ExpenseRecord };

const ExpensesSection = ({ expenses, me, onChanged }: ExpensesSectionProps) => {
  const monthly = useMonthFilter(expenses, (x) => x.createdAt);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ purpose: "", amount: "" });
  const [attachmentId, setAttachmentId] = useState<string | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [text, setText] = useState("");
  const [releaseShot, setReleaseShot] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const post = async (url: string, body: object) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
  };

  const run = async (fn: () => Promise<void>, done: () => void) => {
    setSaving(true);
    setError("");
    try {
      await fn();
      done();
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSaving(false);
    }
  };

  const create = () =>
    run(
      () => post("/api/director/finance/expenses", { ...form, attachmentId }),
      () => {
        setAdding(false);
        setForm({ purpose: "", amount: "" });
        setAttachmentId(null);
      },
    );

  const approve = (e: ExpenseRecord) =>
    run(
      () =>
        post(`/api/director/finance/expenses/${e._id}/decision`, {
          decision: "approve",
        }),
      () => {},
    );

  const submitAction = () => {
    if (!action) return;
    const { kind, expense } = action;
    return run(
      () =>
        kind === "reject"
          ? post(`/api/director/finance/expenses/${expense._id}/decision`, {
              decision: "reject",
              comment: text,
            })
          : post(`/api/director/finance/expenses/${expense._id}/release`, {
              reference: text,
              attachmentId: releaseShot,
            }),
      () => {
        setAction(null);
        setText("");
        setReleaseShot(null);
      },
    );
  };

  const resubmit = (e: ExpenseRecord) => {
    setForm({ purpose: e.purpose, amount: (e.amountPaise / 100).toFixed(2) });
    setAttachmentId(null);
    setError("");
    setAdding(true);
  };

  return (
    <section>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => {
            setForm({ purpose: "", amount: "" });
            setAttachmentId(null);
            setError("");
            setAdding(true);
          }}
          className="px-5 py-2.5 bg-primary text-primary-content font-black rounded-xl hover:brightness-110"
        >
          Add expense
        </button>
      </div>

      {error && !adding && !action && (
        <p role="alert" className="mb-3 text-sm font-bold text-rose-500">
          {error}
        </p>
      )}

      <MonthFilter
        months={monthly.months}
        value={monthly.month}
        onChange={monthly.setMonth}
        summary={`${monthly.filtered.length} expenses · ${formatINR(
          monthly.filtered
            .filter((x) => x.status !== "rejected")
            .reduce((s, x) => s + x.amountPaise, 0),
        )} requested`}
      />

      {expenses.length === 0 ? (
        <p className="rounded-2xl border border-foreground/10 p-10 text-center font-bold text-foreground/40">
          No expenses yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {monthly.filtered.map((x) => {
            const mine = x.requestedBy._id === me;
            const myDecision = x.approvals.find((a) => a.staff._id === me);
            return (
              <li
                key={x._id}
                className="rounded-2xl border border-foreground/10 bg-background/40 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black">
                      {x.purpose} · {formatINR(x.amountPaise)}
                    </p>
                    <p className="text-xs text-foreground/50">
                      Requested by {x.requestedBy.name} ·{" "}
                      {new Date(x.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${STATUS_STYLE[x.status]}`}
                  >
                    {x.status}
                  </span>
                </div>

                <div className="mt-2 text-xs text-foreground/60 space-y-0.5">
                  {x.approvals.map((a) => (
                    <p key={a.staff._id}>
                      {a.staff.name}:{" "}
                      <span
                        className={
                          a.decision === "approve"
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }
                      >
                        {a.decision === "approve" ? "approved" : "rejected"}
                      </span>
                      {a.comment && ` — “${a.comment}”`}
                    </p>
                  ))}
                  {x.release?.by && (
                    <p>
                      Released by {x.release.by.name}
                      {x.release.reference && ` · Ref ${x.release.reference}`}
                      {x.release.attachment && (
                        <>
                          {" · "}
                          <a
                            href={`/api/director/finance/attachments/${x.release.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            transfer screenshot
                          </a>
                        </>
                      )}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
                  <a
                    href={`/api/director/finance/attachments/${x.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View screenshot
                  </a>
                  {x.status === "pending" && !mine && (
                    <>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => approve(x)}
                        className={`px-4 py-1.5 rounded-lg ${myDecision?.decision === "approve" ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-500"}`}
                      >
                        {myDecision?.decision === "approve"
                          ? "Approved"
                          : "Approve"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAction({ kind: "reject", expense: x });
                          setText("");
                          setError("");
                        }}
                        className="px-4 py-1.5 rounded-lg bg-rose-500/10 text-rose-500"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {x.status === "approved" && !mine && (
                    <button
                      type="button"
                      onClick={() => {
                        setAction({ kind: "release", expense: x });
                        setText("");
                        setError("");
                      }}
                      className="px-4 py-1.5 rounded-lg bg-sky-500/10 text-sky-500"
                    >
                      Mark released
                    </button>
                  )}
                  {x.status === "rejected" && mine && (
                    <button
                      type="button"
                      onClick={() => resubmit(x)}
                      className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary"
                    >
                      Resubmit
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <FinanceFormModal
        open={adding}
        title="Add company expense"
        submitLabel="Submit for approval"
        saving={saving}
        error={error}
        disabled={!form.purpose.trim() || !form.amount || !attachmentId}
        onClose={() => setAdding(false)}
        onSubmit={create}
      >
        <div className="space-y-1.5">
          <label htmlFor="exp-purpose" className={labelClass}>
            Purpose
          </label>
          <input
            id="exp-purpose"
            maxLength={300}
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="exp-amount" className={labelClass}>
            Amount (₹)
          </label>
          <input
            id="exp-amount"
            inputMode="decimal"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className={fieldClass}
          />
        </div>
        <ScreenshotInput
          label="Payment screenshot"
          required
          onChange={setAttachmentId}
        />
        <p className="text-xs text-foreground/50">
          The other directors must approve before the company reimburses you.
        </p>
      </FinanceFormModal>

      <FinanceFormModal
        open={action !== null}
        title={
          action?.kind === "reject" ? "Reject expense" : "Mark expense released"
        }
        submitLabel={action?.kind === "reject" ? "Reject" : "Mark released"}
        saving={saving}
        error={error}
        disabled={action?.kind === "reject" && !text.trim()}
        onClose={() => setAction(null)}
        onSubmit={submitAction}
      >
        <div className="space-y-1.5">
          <label htmlFor="action-text" className={labelClass}>
            {action?.kind === "reject"
              ? "Reason"
              : "Transfer reference (optional)"}
          </label>
          <input
            id="action-text"
            maxLength={action?.kind === "reject" ? 500 : 120}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={fieldClass}
          />
        </div>
        {action?.kind === "release" && (
          <ScreenshotInput
            label="Transfer screenshot (optional)"
            onChange={setReleaseShot}
          />
        )}
      </FinanceFormModal>
    </section>
  );
};

export default ExpensesSection;
