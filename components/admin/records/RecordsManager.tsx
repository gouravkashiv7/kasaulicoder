"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { formatINR } from "@/backend/lib/money";

export type RecordsTabId = "finance" | "policies" | "discussions";

type RecordType =
  | "client"
  | "payment"
  | "expense"
  | "policy"
  | "thread"
  | "message";

interface Row {
  type: RecordType;
  id: string;
  title: string;
  detail?: string;
  deletedAt?: string | null;
  children?: Row[];
}

interface Group {
  heading: string;
  rows: Row[];
}

interface Named {
  name?: string;
}

const COPY: Record<RecordsTabId, { title: string; blurb: string }> = {
  finance: {
    title: "Finance",
    blurb: "Delete clients, payments and expenses.",
  },
  policies: { title: "Policies", blurb: "Delete policies." },
  discussions: {
    title: "Discussions",
    blurb: "Delete whole threads or single messages.",
  },
};

const day = (value: string) => new Date(value).toLocaleDateString("en-IN");

// Turns the API response for a tab into the groups of rows shown on screen.
// biome-ignore lint/suspicious/noExplicitAny: shapes differ per tab
function toGroups(tab: RecordsTabId, data: any): Group[] {
  if (tab === "finance") {
    return [
      {
        heading: "Payments",
        rows: data.payments.map(
          (p: {
            _id: string;
            client?: Named | null;
            amountPaise: number;
            receivedOn: string;
            status: string;
            deletedAt?: string;
          }): Row => ({
            type: "payment",
            id: p._id,
            title: `${formatINR(p.amountPaise)} from ${p.client?.name ?? "Unknown client"}`,
            detail: `Received ${day(p.receivedOn)}${p.status === "void" ? " · Void" : ""}`,
            deletedAt: p.deletedAt,
          }),
        ),
      },
      {
        heading: "Expenses",
        rows: data.expenses.map(
          (x: {
            _id: string;
            purpose: string;
            amountPaise: number;
            status: string;
            requestedBy?: Named | null;
            deletedAt?: string;
          }): Row => ({
            type: "expense",
            id: x._id,
            title: `${formatINR(x.amountPaise)} · ${x.purpose}`,
            detail: `${x.requestedBy?.name ?? "Unknown"} · ${x.status}`,
            deletedAt: x.deletedAt,
          }),
        ),
      },
      {
        heading: "Clients",
        rows: data.clients.map(
          (c: {
            _id: string;
            name: string;
            email?: string;
            deletedAt?: string;
          }): Row => ({
            type: "client",
            id: c._id,
            title: c.name,
            detail: c.email,
            deletedAt: c.deletedAt,
          }),
        ),
      },
    ];
  }

  if (tab === "policies") {
    return [
      {
        heading: "Policies",
        rows: data.policies.map(
          (p: {
            _id: string;
            title: string;
            status: string;
            client?: Named | null;
            proposedBy?: Named | null;
            createdAt: string;
            deletedAt?: string;
          }): Row => ({
            type: "policy",
            id: p._id,
            title: p.title,
            detail: `${p.client?.name ?? "No client"} · ${p.status} · proposed by ${p.proposedBy?.name ?? "Unknown"} on ${day(p.createdAt)}`,
            deletedAt: p.deletedAt,
          }),
        ),
      },
    ];
  }

  return [
    {
      heading: "Threads",
      rows: data.threads.map(
        (t: {
          _id: string;
          title: string;
          createdBy?: Named | null;
          lastMessageAt: string;
          deletedAt?: string;
          messages: Array<{
            _id: string;
            body: string;
            author?: Named | null;
            createdAt: string;
            deletedAt?: string;
          }>;
        }): Row => ({
          type: "thread",
          id: t._id,
          title: t.title,
          detail: `Started by ${t.createdBy?.name ?? "Unknown"} · last activity ${day(t.lastMessageAt)}`,
          deletedAt: t.deletedAt,
          children: t.messages.map(
            (m): Row => ({
              type: "message",
              id: m._id,
              title: m.body.length > 140 ? `${m.body.slice(0, 140)}…` : m.body,
              detail: `${m.author?.name ?? "Unknown"} · ${day(m.createdAt)}`,
              deletedAt: m.deletedAt,
            }),
          ),
        }),
      ),
    },
  ];
}

interface RecordsManagerProps {
  tab: RecordsTabId;
}

const RecordsManager = ({ tab }: RecordsManagerProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/records?tab=${tab}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load records");
      setGroups(toGroups(tab, data));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load records");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const remove = async (row: Row) => {
    if (
      !window.confirm(
        `Delete "${row.title}"? Directors and admins will no longer see it.`,
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/records/${row.type}/${row.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const renderRow = (row: Row, nested = false) => (
    <li key={`${row.type}-${row.id}`}>
      <div
        className={`flex items-start justify-between gap-3 rounded-2xl border border-foreground/10 bg-background/40 p-4 ${row.deletedAt ? "opacity-50" : ""}`}
      >
        <div className="min-w-0">
          <p
            className={`font-bold break-words ${row.deletedAt ? "line-through" : ""}`}
          >
            {row.title}
          </p>
          {row.detail && (
            <p className="text-xs text-foreground/50 break-words">
              {row.detail}
            </p>
          )}
        </div>
        {row.deletedAt ? (
          <span className="shrink-0 rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-foreground/60">
            Deleted
          </span>
        ) : (
          <button
            type="button"
            onClick={() => remove(row)}
            className="shrink-0 text-xs font-bold text-rose-500 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
      {row.children && row.children.length > 0 && (
        <ul
          className={`mt-2 space-y-2 ${nested ? "" : "ml-4 border-l border-foreground/10 pl-4"}`}
        >
          {row.children.map((c) => renderRow(c, true))}
        </ul>
      )}
    </li>
  );

  return (
    <motion.div
      key={`records-${tab}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black mb-2 text-foreground">
          {COPY[tab].title}
        </h1>
        <p className="text-foreground/50">
          {COPY[tab].blurb} Deleted records are hidden from directors and
          admins.
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm font-bold text-rose-500">
          {error}
        </p>
      )}

      {loading ? (
        <div className="p-20 text-center animate-pulse text-primary font-bold">
          Loading records...
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g.heading}>
              <h2 className="mb-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                {g.heading}
              </h2>
              {g.rows.length === 0 ? (
                <p className="text-sm text-foreground/50">Nothing here yet.</p>
              ) : (
                <ul className="space-y-2">{g.rows.map((r) => renderRow(r))}</ul>
              )}
            </section>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecordsManager;
