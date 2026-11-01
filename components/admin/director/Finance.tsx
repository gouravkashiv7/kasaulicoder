"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { formatINR } from "@/backend/lib/money";
import type {
  ClientRecord,
  ExpenseRecord,
  FinanceSummary,
  PaymentRecord,
} from "../types";
import ClientsSection from "./ClientsSection";
import ExpensesSection from "./ExpensesSection";
import PaymentsSection from "./PaymentsSection";

type Section = "payments" | "expenses" | "clients";

const SECTIONS: Array<{ id: Section; label: string }> = [
  { id: "payments", label: "Payments" },
  { id: "expenses", label: "Expenses" },
  { id: "clients", label: "Clients" },
];

const Finance = () => {
  const [section, setSection] = useState<Section>("payments");
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [clientsWithPolicy, setClientsWithPolicy] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [me, setMe] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [s, c, p, x] = await Promise.all(
        ["summary", "clients", "payments", "expenses"].map((name) =>
          fetch(`/api/director/finance/${name}`).then(async (r) => {
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || "Failed to load finance");
            return data;
          }),
        ),
      );
      setSummary(s);
      setClients(c);
      setPayments(p.payments);
      setClientsWithPolicy(p.clientsWithPolicy);
      setExpenses(x.expenses);
      setMe(x.me);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load finance");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cards: Array<{ label: string; value: string; hint?: string }> = summary
    ? [
        { label: "Total received", value: formatINR(summary.receivedPaise) },
        {
          label: "Company balance",
          value: formatINR(summary.companyBalancePaise),
          hint: `${formatINR(summary.companyEarnedPaise)} earned − ${formatINR(summary.releasedPaise)} reimbursed`,
        },
        ...(summary.awaitingReleasePaise > 0
          ? [
              {
                label: "Approved, to release",
                value: formatINR(summary.awaitingReleasePaise),
              },
            ]
          : []),
        ...summary.directorShares.map((d) => ({
          label: `${d.name}'s share`,
          value: formatINR(d.paise),
        })),
      ]
    : [];

  return (
    <motion.div
      key="finance"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black mb-2 text-foreground">
          Finance
        </h1>
        <p className="text-foreground/50">
          Client payments, director shares and company expenses, all in INR.
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm font-bold text-rose-500">
          {error}
        </p>
      )}

      {loading ? (
        <div className="p-20 text-center animate-pulse text-primary font-bold">
          Loading finance...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {cards.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-foreground/10 bg-background/40 p-4"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">
                  {c.label}
                </p>
                <p className="text-lg sm:text-xl font-black">{c.value}</p>
                {c.hint && (
                  <p className="text-[10px] text-foreground/40 mt-1">
                    {c.hint}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6" role="tablist">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={section === s.id}
                onClick={() => setSection(s.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${
                  section === s.id
                    ? "bg-primary text-primary-content"
                    : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                }`}
              >
                {s.label}
                {s.id === "expenses" &&
                  (summary?.awaitingMyApproval ?? 0) > 0 && (
                    <span className="ml-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] text-white">
                      {summary?.awaitingMyApproval}
                    </span>
                  )}
              </button>
            ))}
          </div>

          {section === "payments" && (
            <PaymentsSection
              payments={payments}
              clients={clients}
              clientsWithPolicy={clientsWithPolicy}
              onChanged={load}
            />
          )}
          {section === "expenses" && (
            <ExpensesSection expenses={expenses} me={me} onChanged={load} />
          )}
          {section === "clients" && (
            <ClientsSection clients={clients} onChanged={load} />
          )}
        </>
      )}
    </motion.div>
  );
};

export default Finance;
