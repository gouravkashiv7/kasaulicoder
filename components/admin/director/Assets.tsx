"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { formatINR } from "@/backend/lib/money";
import type { CompanyAssetRecord } from "../types";
import FinanceFormModal, {
  fieldClass,
  labelClass,
} from "./modals/FinanceFormModal";

const KINDS: Array<{ id: CompanyAssetRecord["kind"]; label: string }> = [
  { id: "domain", label: "Domain" },
  { id: "software", label: "Software" },
  { id: "hardware", label: "Hardware" },
  { id: "account", label: "Account" },
  { id: "other", label: "Other" },
];

const PERIODS: Array<{ id: CompanyAssetRecord["costPeriod"]; label: string }> =
  [
    { id: "yearly", label: "per year" },
    { id: "monthly", label: "per month" },
    { id: "one-time", label: "one-time" },
  ];

const EMPTY = {
  kind: "domain" as CompanyAssetRecord["kind"],
  name: "",
  registrar: "",
  expiresOn: "",
  autoRenew: false,
  cost: "",
  costPeriod: "yearly" as CompanyAssetRecord["costPeriod"],
  purchasedOn: "",
  notes: "",
};

const DAY_MS = 24 * 60 * 60 * 1000;
const day = (iso?: string) => (iso ? iso.slice(0, 10) : "");
const show = (iso: string) => new Date(iso).toLocaleDateString("en-IN");

// How soon a dated asset runs out, for the colour and wording on its row
function expiry(iso?: string) {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / DAY_MS);
  if (days < 0) return { text: `Expired ${show(iso)}`, tone: "text-rose-500" };
  if (days <= 30) {
    return { text: `Expires in ${days}d`, tone: "text-amber-500" };
  }
  return { text: `Expires ${show(iso)}`, tone: "text-foreground/50" };
}

const Assets = () => {
  const [assets, setAssets] = useState<CompanyAssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState<CompanyAssetRecord | "new" | null>(
    null,
  );
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/director/assets");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load assets");
      setAssets(data);
      setLoadError("");
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const open = (asset: CompanyAssetRecord | "new") => {
    setEditing(asset);
    setError("");
    setForm(
      asset === "new"
        ? EMPTY
        : {
            kind: asset.kind,
            name: asset.name,
            registrar: asset.registrar ?? "",
            expiresOn: day(asset.expiresOn),
            autoRenew: asset.autoRenew,
            cost:
              asset.costPaise === undefined
                ? ""
                : (asset.costPaise / 100).toFixed(2),
            costPeriod: asset.costPeriod,
            purchasedOn: day(asset.purchasedOn),
            notes: asset.notes ?? "",
          },
    );
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/director/assets", {
        method: editing === "new" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editing && editing !== "new" ? { id: editing._id, ...form } : form,
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const domains = assets
    .filter((a) => a.kind === "domain")
    .sort((a, b) =>
      (a.expiresOn ?? "9999").localeCompare(b.expiresOn ?? "9999"),
    );
  const others = assets.filter((a) => a.kind !== "domain");
  const isDomain = form.kind === "domain";

  const row = (a: CompanyAssetRecord) => {
    const status = expiry(a.expiresOn);
    return (
      <li
        key={a._id}
        className="rounded-2xl border border-foreground/10 bg-background/40 p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-black truncate">{a.name}</p>
            <p className="text-xs text-foreground/50">
              {[
                KINDS.find((k) => k.id === a.kind)?.label,
                a.registrar,
                a.costPaise !== undefined &&
                  `${formatINR(a.costPaise)} ${PERIODS.find((p) => p.id === a.costPeriod)?.label}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => open(a)}
            className="shrink-0 text-xs font-bold text-primary hover:underline"
          >
            Edit
          </button>
        </div>
        {(status || a.autoRenew) && (
          <p className="mt-2 text-xs font-bold">
            {status && <span className={status.tone}>{status.text}</span>}
            {a.autoRenew && (
              <span className="ml-2 text-foreground/40">Auto-renews</span>
            )}
          </p>
        )}
        {a.notes && (
          <p className="mt-2 text-xs text-foreground/60 break-words">
            {a.notes}
          </p>
        )}
      </li>
    );
  };

  return (
    <motion.div
      key="assets"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-2 text-foreground">
            Assets
          </h1>
          <p className="text-foreground/50">
            Domain names and everything else the company owns. Never store
            passwords here.
          </p>
        </div>
        <button
          type="button"
          onClick={() => open("new")}
          className="px-5 py-2.5 bg-primary text-primary-content font-black rounded-xl hover:brightness-110"
        >
          Add asset
        </button>
      </div>

      {loadError && (
        <p role="alert" className="mb-4 text-sm font-bold text-rose-500">
          {loadError}
        </p>
      )}

      {loading ? (
        <div className="p-20 text-center animate-pulse text-primary font-bold">
          Loading assets...
        </div>
      ) : assets.length === 0 ? (
        <p className="rounded-2xl border border-foreground/10 p-10 text-center font-bold text-foreground/40">
          No assets yet.
        </p>
      ) : (
        <div className="space-y-8">
          {[
            { heading: "Domains", items: domains },
            { heading: "Other assets", items: others },
          ]
            .filter((g) => g.items.length > 0)
            .map((g) => (
              <section key={g.heading}>
                <h2 className="mb-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                  {g.heading}
                </h2>
                <ul className="grid gap-3 md:grid-cols-2">
                  {g.items.map(row)}
                </ul>
              </section>
            ))}
        </div>
      )}

      <FinanceFormModal
        open={editing !== null}
        title={editing === "new" ? "Add asset" : "Edit asset"}
        submitLabel="Save"
        saving={saving}
        error={error}
        disabled={!form.name.trim()}
        onClose={() => setEditing(null)}
        onSubmit={save}
      >
        <div className="space-y-1.5">
          <label htmlFor="asset-kind" className={labelClass}>
            Kind
          </label>
          <select
            id="asset-kind"
            value={form.kind}
            onChange={(e) =>
              setForm({
                ...form,
                kind: e.target.value as CompanyAssetRecord["kind"],
              })
            }
            className={fieldClass}
          >
            {KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="asset-name" className={labelClass}>
            {isDomain ? "Domain name" : "Name"}
          </label>
          <input
            id="asset-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={isDomain ? "example.com" : ""}
            className={fieldClass}
          />
        </div>
        {isDomain && (
          <div className="space-y-1.5">
            <label htmlFor="asset-registrar" className={labelClass}>
              Registrar
            </label>
            <input
              id="asset-registrar"
              value={form.registrar}
              onChange={(e) => setForm({ ...form, registrar: e.target.value })}
              placeholder="e.g. GoDaddy"
              className={fieldClass}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="asset-expires" className={labelClass}>
              Expires / renews on
            </label>
            <input
              id="asset-expires"
              type="date"
              value={form.expiresOn}
              onChange={(e) => setForm({ ...form, expiresOn: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="asset-purchased" className={labelClass}>
              Purchased on
            </label>
            <input
              id="asset-purchased"
              type="date"
              value={form.purchasedOn}
              onChange={(e) =>
                setForm({ ...form, purchasedOn: e.target.value })
              }
              className={fieldClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="asset-cost" className={labelClass}>
              Cost (₹)
            </label>
            <input
              id="asset-cost"
              inputMode="decimal"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="asset-period" className={labelClass}>
              Paid
            </label>
            <select
              id="asset-period"
              value={form.costPeriod}
              onChange={(e) =>
                setForm({
                  ...form,
                  costPeriod: e.target
                    .value as CompanyAssetRecord["costPeriod"],
                })
              }
              className={fieldClass}
            >
              {PERIODS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={form.autoRenew}
            onChange={(e) => setForm({ ...form, autoRenew: e.target.checked })}
          />
          Renews automatically
        </label>
        <div className="space-y-1.5">
          <label htmlFor="asset-notes" className={labelClass}>
            Notes
          </label>
          <textarea
            id="asset-notes"
            rows={3}
            maxLength={1000}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Where the login is kept, who to call… never the password itself"
            className={`${fieldClass} resize-y`}
          />
        </div>
      </FinanceFormModal>
    </motion.div>
  );
};

export default Assets;
