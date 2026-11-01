"use client";

import { useState } from "react";
import type { ClientRecord } from "../types";
import FinanceFormModal, {
  fieldClass,
  labelClass,
} from "./modals/FinanceFormModal";

interface ClientsSectionProps {
  clients: ClientRecord[];
  directors: Array<{ id: string; name: string }>;
  onChanged: () => void;
}

const EMPTY = { name: "", email: "", phone: "", notes: "", managedBy: "" };

const ClientsSection = ({
  clients,
  directors,
  onChanged,
}: ClientsSectionProps) => {
  const [editing, setEditing] = useState<ClientRecord | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const open = (client: ClientRecord | "new") => {
    setEditing(client);
    setError("");
    setForm(
      client === "new"
        ? EMPTY
        : {
            name: client.name,
            email: client.email ?? "",
            phone: client.phone ?? "",
            notes: client.notes ?? "",
            managedBy: client.managedBy?._id ?? "",
          },
    );
  };

  const call = async (method: "POST" | "PUT", body: object) => {
    const res = await fetch("/api/director/finance/clients", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to save");
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      // An unchanged manager is left out so a deactivated one doesn't block
      // editing the rest of the client.
      const { managedBy, ...rest } = form;
      const managerChanged =
        editing === "new" || managedBy !== (editing?.managedBy?._id ?? "");
      const fields = managerChanged ? form : rest;
      await call(
        editing === "new" ? "POST" : "PUT",
        editing === "new" || !editing ? fields : { id: editing._id, ...fields },
      );
      setEditing(null);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (client: ClientRecord) => {
    try {
      await call("PUT", { id: client._id, isActive: !client.isActive });
      onChanged();
    } catch {
      /* the list simply stays as it was */
    }
  };

  return (
    <section>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => open("new")}
          className="px-5 py-2.5 bg-primary text-primary-content font-black rounded-xl hover:brightness-110"
        >
          Add client
        </button>
      </div>

      {clients.length === 0 ? (
        <p className="rounded-2xl border border-foreground/10 p-10 text-center font-bold text-foreground/40">
          No clients yet.
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {clients.map((c) => (
            <li
              key={c._id}
              className={`rounded-2xl border border-foreground/10 bg-background/40 p-4 ${c.isActive ? "" : "opacity-50"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-black truncate">{c.name}</p>
                  <p className="text-xs text-foreground/50 truncate">
                    {[c.email, c.phone].filter(Boolean).join(" · ") ||
                      "No contact"}
                  </p>
                </div>
                <div className="flex gap-3 text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => open(c)}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(c)}
                    className="text-foreground/50 hover:underline"
                  >
                    {c.isActive ? "Archive" : "Restore"}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-foreground/60">
                Payments managed by: {c.managedBy?.name ?? "Not assigned"}
              </p>
              {c.notes && (
                <p className="mt-2 text-xs text-foreground/60">{c.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <FinanceFormModal
        open={editing !== null}
        title={editing === "new" ? "Add client" : "Edit client"}
        submitLabel="Save"
        saving={saving}
        error={error}
        disabled={!form.name.trim()}
        onClose={() => setEditing(null)}
        onSubmit={save}
      >
        {(["name", "email", "phone"] as const).map((key) => (
          <div key={key} className="space-y-1.5">
            <label htmlFor={`client-${key}`} className={labelClass}>
              {key}
            </label>
            <input
              id={`client-${key}`}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className={fieldClass}
            />
          </div>
        ))}
        <div className="space-y-1.5">
          <label htmlFor="client-managed-by" className={labelClass}>
            Payments managed by
          </label>
          <select
            id="client-managed-by"
            value={form.managedBy}
            onChange={(e) => setForm({ ...form, managedBy: e.target.value })}
            className={fieldClass}
          >
            <option value="">Not assigned</option>
            {directors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="client-notes" className={labelClass}>
            Notes
          </label>
          <textarea
            id="client-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className={`${fieldClass} resize-y`}
          />
        </div>
      </FinanceFormModal>
    </section>
  );
};

export default ClientsSection;
