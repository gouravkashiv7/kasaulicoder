"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ClientRecord, DirectorRef } from "../../types";

interface ProposePolicyModalProps {
  open: boolean;
  directors: DirectorRef[];
  clients: Pick<ClientRecord, "_id" | "name">[];
  onClose: () => void;
  onProposed: () => void;
}

const MAX_TITLE = 120;
const MAX_BODY = 5000;

// Whole-percent amounts kept in hundredths so the total check is exact.
const toHundredths = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : Number.NaN;
};

const defaultSplit = (directors: DirectorRef[]) => {
  const rest = 8000;
  const each = Math.floor(rest / Math.max(directors.length, 1));
  return Object.fromEntries(
    directors.map((d, i) => {
      const value = i === 0 ? rest - each * (directors.length - 1) : each;
      return [d.id, (value / 100).toString()];
    }),
  );
};

const ProposePolicyModal = ({
  open,
  directors,
  clients,
  onClose,
  onProposed,
}: ProposePolicyModalProps) => {
  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [company, setCompany] = useState("20");
  const [shares, setShares] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const shareValue = (id: string) =>
    shares[id] ?? defaultSplit(directors)[id] ?? "0";

  const total =
    toHundredths(company) +
    directors.reduce((s, d) => s + toHundredths(shareValue(d.id)), 0);
  const totalValid = total === 10000;

  const reset = () => {
    setClientId("");
    setTitle("");
    setBody("");
    setCompany("20");
    setShares({});
    setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!totalValid) {
      setError("Company and director percentages must total 100%");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/director/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          title,
          body,
          split: {
            companyPercent: company,
            directors: directors.map((d) => ({
              staff: d.id,
              percent: shareValue(d.id),
            })),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to propose policy");
        return;
      }
      reset();
      onProposed();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.form
            onSubmit={submit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="propose-policy-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background border border-foreground/10 w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5"
          >
            <h3
              id="propose-policy-title"
              className="text-xl font-black text-foreground"
            >
              Propose a policy
            </h3>

            <div className="space-y-1.5">
              <label
                htmlFor="policy-client"
                className="text-[10px] font-black uppercase text-foreground/40 ml-1"
              >
                Client
              </label>
              <select
                id="policy-client"
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40"
              >
                <option value="">Select a client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {clientId && (
              <>
                <p className="text-xs font-bold text-foreground/50">
                  Policy type: Finance. Sets how every payment from this client
                  is divided between the company and each director once
                  approved.
                </p>

                <div className="space-y-1.5">
                  <label
                    htmlFor="policy-title"
                    className="text-[10px] font-black uppercase text-foreground/40 ml-1"
                  >
                    Title
                  </label>
                  <input
                    id="policy-title"
                    required
                    maxLength={MAX_TITLE}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="policy-body"
                    className="text-[10px] font-black uppercase text-foreground/40 ml-1"
                  >
                    Policy text (Markdown supported)
                  </label>
                  <textarea
                    id="policy-body"
                    required
                    rows={6}
                    maxLength={MAX_BODY}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 resize-y"
                  />
                </div>

                <div className="rounded-xl border border-foreground/10 p-4 space-y-3">
                  <SplitRow
                    id="split-company"
                    label="Company"
                    value={company}
                    onChange={setCompany}
                  />
                  {directors.map((d) => (
                    <SplitRow
                      key={d.id}
                      id={`split-${d.id}`}
                      label={d.name}
                      value={shareValue(d.id)}
                      onChange={(v) =>
                        setShares((prev) => ({
                          ...defaultSplit(directors),
                          ...prev,
                          [d.id]: v,
                        }))
                      }
                    />
                  ))}
                  <p
                    className={`text-xs font-bold text-right ${totalValid ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    Total:{" "}
                    {Number.isNaN(total) ? "—" : (total / 100).toFixed(2)}%
                  </p>
                </div>
              </>
            )}

            <p className="text-xs text-foreground/50">
              Your vote counts as the first approval. One more director must
              approve for it to pass.
            </p>

            {error && (
              <p role="alert" className="text-sm font-bold text-rose-500">
                {error}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="px-5 py-3 rounded-xl font-bold text-foreground/60 hover:bg-foreground/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !clientId || !totalValid}
                className="px-6 py-3 bg-primary text-primary-content font-black rounded-xl hover:brightness-110 disabled:opacity-50"
              >
                {saving ? "Proposing…" : "Propose"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
};

const SplitRow = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-3">
    <label htmlFor={id} className="flex-1 text-sm font-bold truncate">
      {label}
    </label>
    <input
      id={id}
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-24 bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:border-primary/40"
    />
    <span className="text-sm text-foreground/50">%</span>
  </div>
);

export default ProposePolicyModal;
