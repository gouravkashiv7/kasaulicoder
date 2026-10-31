"use client";

import { useState } from "react";
import { formatINR } from "@/backend/lib/money";
import type { ClientRecord, PaymentRecord } from "../types";
import FinanceFormModal, {
  fieldClass,
  labelClass,
} from "./modals/FinanceFormModal";
import ScreenshotInput from "./ScreenshotInput";

interface PaymentsSectionProps {
  payments: PaymentRecord[];
  clients: ClientRecord[];
  hasActiveSplit: boolean;
  onChanged: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = {
  clientId: "",
  amount: "",
  receivedOn: today(),
  reference: "",
  note: "",
};

const PaymentsSection = ({
  payments,
  clients,
  hasActiveSplit,
  onChanged,
}: PaymentsSectionProps) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [attachmentId, setAttachmentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [voiding, setVoiding] = useState<PaymentRecord | null>(null);
  const [reason, setReason] = useState("");

  const activeClients = clients.filter((c) => c.isActive);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/director/finance/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, attachmentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record payment");
      setAdding(false);
      setForm({ ...EMPTY, receivedOn: today() });
      setAttachmentId(null);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to record payment");
    } finally {
      setSaving(false);
    }
  };

  const voidPayment = async () => {
    if (!voiding) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        `/api/director/finance/payments/${voiding._id}/void`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to void payment");
      setVoiding(null);
      setReason("");
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to void payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {!hasActiveSplit && (
          <p className="text-sm font-bold text-amber-500">
            No revenue split is approved yet. Propose one under Policies first.
          </p>
        )}
        <button
          type="button"
          disabled={!hasActiveSplit}
          onClick={() => {
            setError("");
            setAdding(true);
          }}
          className="ml-auto px-5 py-2.5 bg-primary text-primary-content font-black rounded-xl hover:brightness-110 disabled:opacity-40"
        >
          Record payment
        </button>
      </div>

      {payments.length === 0 ? (
        <p className="rounded-2xl border border-foreground/10 p-10 text-center font-bold text-foreground/40">
          No payments recorded yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {payments.map((p) => (
            <li
              key={p._id}
              className={`rounded-2xl border border-foreground/10 bg-background/40 p-4 ${p.status === "void" ? "opacity-60" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black">
                    {p.client?.name ?? "Unknown client"} ·{" "}
                    <span className={p.status === "void" ? "line-through" : ""}>
                      {formatINR(p.amountPaise)}
                    </span>
                  </p>
                  <p className="text-xs text-foreground/50">
                    {new Date(p.receivedOn).toLocaleDateString("en-IN", {
                      timeZone: "UTC",
                    })}
                    {p.reference && ` · Ref ${p.reference}`} · recorded by{" "}
                    {p.recordedBy.name}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  {p.attachment && (
                    <a
                      href={`/api/director/finance/attachments/${p.attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Screenshot
                    </a>
                  )}
                  {p.status === "recorded" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setVoiding(p);
                        setReason("");
                        setError("");
                      }}
                      className="text-rose-500 hover:underline"
                    >
                      Void
                    </button>
                  ) : (
                    <span className="text-rose-500 uppercase">Void</span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-foreground/60">
                Company {formatINR(p.allocation.companyPaise)}
                {p.allocation.shares.map((s) => (
                  <span key={s.staff._id}>
                    {" · "}
                    {s.staff.name} {formatINR(s.paise)}
                  </span>
                ))}
              </p>
              {p.note && (
                <p className="mt-1 text-xs text-foreground/60">{p.note}</p>
              )}
              {p.voidReason && (
                <p className="mt-1 text-xs text-rose-500">
                  Voided: {p.voidReason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <FinanceFormModal
        open={adding}
        title="Record client payment"
        submitLabel="Record"
        saving={saving}
        error={error}
        disabled={!form.clientId || !form.amount}
        onClose={() => setAdding(false)}
        onSubmit={save}
      >
        <div className="space-y-1.5">
          <label htmlFor="pay-client" className={labelClass}>
            Client
          </label>
          <select
            id="pay-client"
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className={fieldClass}
          >
            <option value="">Select a client</option>
            {activeClients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="pay-amount" className={labelClass}>
              Amount (₹)
            </label>
            <input
              id="pay-amount"
              inputMode="decimal"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pay-date" className={labelClass}>
              Received on
            </label>
            <input
              id="pay-date"
              type="date"
              max={today()}
              value={form.receivedOn}
              onChange={(e) => setForm({ ...form, receivedOn: e.target.value })}
              className={fieldClass}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="pay-ref" className={labelClass}>
            Transaction reference
          </label>
          <input
            id="pay-ref"
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="pay-note" className={labelClass}>
            Note
          </label>
          <input
            id="pay-note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className={fieldClass}
          />
        </div>
        <ScreenshotInput
          label="Payment screenshot"
          onChange={setAttachmentId}
        />
      </FinanceFormModal>

      <FinanceFormModal
        open={voiding !== null}
        title="Void payment"
        submitLabel="Void payment"
        saving={saving}
        error={error}
        disabled={!reason.trim()}
        onClose={() => setVoiding(null)}
        onSubmit={voidPayment}
      >
        <p className="text-sm text-foreground/60">
          Voided payments stay visible to everyone but no longer count in the
          totals or shares.
        </p>
        <div className="space-y-1.5">
          <label htmlFor="void-reason" className={labelClass}>
            Reason
          </label>
          <textarea
            id="void-reason"
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

export default PaymentsSection;
