"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { DirectorRef, PolicyRecord } from "../types";
import ProposePolicyModal from "./modals/ProposePolicyModal";

const STATUS_STYLE: Record<PolicyRecord["status"], string> = {
  proposed: "bg-amber-500/10 text-amber-500",
  approved: "bg-emerald-500/10 text-emerald-500",
  rejected: "bg-rose-500/10 text-rose-500",
  superseded: "bg-foreground/10 text-foreground/50",
};

const pct = (bps: number) => `${(bps / 100).toFixed(2).replace(/\.00$/, "")}%`;

const Policies = () => {
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [directors, setDirectors] = useState<DirectorRef[]>([]);
  const [me, setMe] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"open" | "decided">("open");
  const [showPropose, setShowPropose] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/director/policies");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load policies");
        return;
      }
      setPolicies(data.policies);
      setDirectors(data.directors);
      setMe(data.me);
      setError("");
    } catch {
      setError("Failed to load policies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const vote = async (id: string, choice: "yes" | "no") => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/director/policies/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: choice, comment: comments[id] }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to vote");
      }
      await load();
    } catch {
      setError("Failed to vote");
    } finally {
      setBusyId(null);
    }
  };

  const visible = policies.filter((p) =>
    filter === "open" ? p.status === "proposed" : p.status !== "proposed",
  );
  const activeSplit = policies.find(
    (p) => p.kind === "revenue-split" && p.status === "approved",
  );

  return (
    <motion.div
      key="policies"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-2 text-foreground">
            Policies
          </h1>
          <p className="text-foreground/50">
            Proposals need two director approvals to pass.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowPropose(true)}
          className="px-6 py-3 bg-primary text-primary-content font-black rounded-xl hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Propose policy
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-foreground/10 bg-background/40 p-4 text-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">
          Active revenue split
        </p>
        {activeSplit?.split ? (
          <p className="font-bold">
            Company {pct(activeSplit.split.companyBps)}
            {activeSplit.split.directors.map((d) => (
              <span key={d.staff._id}>
                {" · "}
                {d.staff.name} {pct(d.bps)}
              </span>
            ))}
          </p>
        ) : (
          <p className="text-foreground/50">
            None yet. Propose a revenue split policy so client payments can be
            recorded.
          </p>
        )}
      </div>

      <div className="flex gap-2 mb-6" role="tablist">
        {(["open", "decided"] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${
              filter === f
                ? "bg-primary text-primary-content"
                : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm font-bold text-rose-500">
          {error}
        </p>
      )}

      {loading ? (
        <div className="p-20 text-center animate-pulse text-primary font-bold">
          Loading policies...
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-background/40 border border-foreground/10 rounded-2xl p-10 text-center text-foreground/40 font-bold">
          {filter === "open"
            ? "No open proposals."
            : "No decided policies yet."}
        </div>
      ) : (
        <div className="space-y-5">
          {visible.map((p) => {
            const mine = p.votes.find((v) => v.staff._id === me);
            const yes = p.votes.filter((v) => v.vote === "yes").length;
            const no = p.votes.filter((v) => v.vote === "no").length;
            return (
              <article
                key={p._id}
                className="bg-background/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-black text-foreground">
                      {p.title}
                    </h2>
                    <p className="text-xs text-foreground/50">
                      Proposed by {p.proposedBy.name} ·{" "}
                      {new Date(p.createdAt).toLocaleDateString("en-IN")}
                      {p.kind === "revenue-split" && " · Revenue split"}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${STATUS_STYLE[p.status]}`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="prose prose-invert prose-sm max-w-none prose-p:text-foreground/80 prose-headings:text-foreground mb-4">
                  <ReactMarkdown>{p.body}</ReactMarkdown>
                </div>

                {p.split && (
                  <p className="text-sm font-bold mb-4">
                    Company {pct(p.split.companyBps)}
                    {p.split.directors.map((d) => (
                      <span key={d.staff._id}>
                        {" · "}
                        {d.staff.name} {pct(d.bps)}
                      </span>
                    ))}
                  </p>
                )}

                <div className="text-xs text-foreground/60 mb-4 space-y-1">
                  <p className="font-bold">
                    {yes} approve · {no} reject · {directors.length} directors
                  </p>
                  {p.votes.map((v) => (
                    <p key={v.staff._id}>
                      {v.staff.name}:{" "}
                      <span
                        className={
                          v.vote === "yes"
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }
                      >
                        {v.vote === "yes" ? "approved" : "rejected"}
                      </span>
                      {v.comment && ` — “${v.comment}”`}
                    </p>
                  ))}
                </div>

                {p.status === "proposed" && (
                  <div className="space-y-3">
                    <input
                      aria-label="Comment on your vote (optional)"
                      placeholder="Comment (optional)"
                      maxLength={500}
                      value={comments[p._id] ?? ""}
                      onChange={(e) =>
                        setComments({ ...comments, [p._id]: e.target.value })
                      }
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={busyId === p._id}
                        onClick={() => vote(p._id, "yes")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-black disabled:opacity-50 ${
                          mine?.vote === "yes"
                            ? "bg-emerald-500 text-white"
                            : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                        }`}
                      >
                        {mine?.vote === "yes" ? "Approved" : "Approve"}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === p._id}
                        onClick={() => vote(p._id, "no")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-black disabled:opacity-50 ${
                          mine?.vote === "no"
                            ? "bg-rose-500 text-white"
                            : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                        }`}
                      >
                        {mine?.vote === "no" ? "Rejected" : "Reject"}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <ProposePolicyModal
        open={showPropose}
        directors={directors}
        onClose={() => setShowPropose(false)}
        onProposed={() => {
          setShowPropose(false);
          setFilter("open");
          load();
        }}
      />
    </motion.div>
  );
};

export default Policies;
