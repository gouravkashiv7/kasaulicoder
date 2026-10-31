"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DirectorRef,
  DiscussionMessage,
  DiscussionThread,
} from "../types";
import FinanceFormModal, {
  fieldClass,
  labelClass,
} from "./modals/FinanceFormModal";

const POLL_MS = 15_000;

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

const Discussions = () => {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [title, setTitle] = useState("");
  const [me, setMe] = useState("");
  const [directors, setDirectors] = useState<DirectorRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const [newOpen, setNewOpen] = useState(false);
  const [newForm, setNewForm] = useState({ title: "", body: "" });
  const [emailing, setEmailing] = useState<DiscussionMessage | null>(null);
  const [emailForm, setEmailForm] = useState({ subject: "", note: "" });
  const [recipients, setRecipients] = useState<string[]>([]);
  const [modalBusy, setModalBusy] = useState(false);
  const [modalError, setModalError] = useState("");
  const [notice, setNotice] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThreads = useCallback(async () => {
    try {
      const res = await fetch("/api/director/discussions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load discussions");
      setThreads(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load discussions");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadThread = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/director/discussions/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load thread");
      setMessages(data.messages);
      setTitle(data.thread.title);
      setMe(data.me);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load thread");
    }
  }, []);

  // Directors list is only needed for the email recipient picker
  useEffect(() => {
    fetch("/api/director/policies")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setDirectors(d.directors))
      .catch(() => {});
  }, []);

  // Poll while the tab is visible; skip while a modal is mid-edit is unnecessary
  // because polling only replaces list/message data, never form state.
  useEffect(() => {
    loadThreads();
    if (selectedId) loadThread(selectedId);
    const timer = setInterval(() => {
      if (document.hidden) return;
      loadThreads();
      if (selectedId) loadThread(selectedId);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [loadThreads, loadThread, selectedId]);

  const messageCount = messages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when a message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messageCount, selectedId]);

  const open = (id: string) => {
    setSelectedId(id);
    setMessages([]);
    setThreads((prev) =>
      prev.map((t) => (t._id === id ? { ...t, unread: false } : t)),
    );
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(
        `/api/director/discussions/${selectedId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: reply }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setReply("");
      await Promise.all([loadThread(selectedId), loadThreads()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const createThread = async () => {
    setModalBusy(true);
    setModalError("");
    try {
      const res = await fetch("/api/director/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start discussion");
      setNewOpen(false);
      setNewForm({ title: "", body: "" });
      await loadThreads();
      open(data.id);
    } catch (e) {
      setModalError(
        e instanceof Error ? e.message : "Failed to start discussion",
      );
    } finally {
      setModalBusy(false);
    }
  };

  const startEmail = (m: DiscussionMessage) => {
    setEmailing(m);
    setEmailForm({ subject: "", note: "" });
    setRecipients(directors.filter((d) => d.id !== me).map((d) => d.id));
    setModalError("");
  };

  const sendEmail = async () => {
    if (!emailing || !selectedId) return;
    setModalBusy(true);
    setModalError("");
    try {
      const res = await fetch(`/api/director/discussions/${selectedId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: emailing._id,
          recipientIds: recipients,
          ...emailForm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email");
      setEmailing(null);
      setNotice(`Email sent to ${data.sentTo.join(", ")}`);
      await loadThread(selectedId);
    } catch (e) {
      setModalError(e instanceof Error ? e.message : "Failed to send email");
    } finally {
      setModalBusy(false);
    }
  };

  const others = directors.filter((d) => d.id !== me);

  return (
    <motion.div
      key="discussions"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-2 text-foreground">
            Discussions
          </h1>
          <p className="text-foreground/50">
            Private to the directors. Email any message to the others.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNewOpen(true);
            setModalError("");
          }}
          className="px-6 py-3 bg-primary text-primary-content font-black rounded-xl hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add_circle</span>
          New discussion
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm font-bold text-rose-500">
          {error}
        </p>
      )}
      {notice && (
        <output className="mb-4 block text-sm font-bold text-emerald-500">
          {notice}
        </output>
      )}

      {loading ? (
        <div className="p-20 text-center animate-pulse text-primary font-bold">
          Loading discussions...
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <ul
            className={`space-y-2 ${selectedId ? "hidden lg:block" : ""}`}
            aria-label="Discussion threads"
          >
            {threads.length === 0 && (
              <li className="rounded-2xl border border-foreground/10 p-8 text-center font-bold text-foreground/40">
                No discussions yet.
              </li>
            )}
            {threads.map((t) => (
              <li key={t._id}>
                <button
                  type="button"
                  onClick={() => open(t._id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                    selectedId === t._id
                      ? "border-primary/40 bg-primary/5"
                      : "border-foreground/10 bg-background/40 hover:bg-foreground/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className="font-black truncate flex-1">{t.title}</p>
                    {t.unread && (
                      <span
                        role="img"
                        aria-label="Unread"
                        className="size-2.5 rounded-full bg-rose-500 shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-xs text-foreground/50 truncate">
                    {t.preview}
                  </p>
                  <p className="text-[10px] text-foreground/40 mt-1">
                    {t.messageCount} messages · {when(t.lastMessageAt)}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          <section
            className={`rounded-2xl border border-foreground/10 bg-background/40 flex flex-col min-h-[50dvh] ${selectedId ? "" : "hidden lg:flex"}`}
          >
            {selectedId ? (
              <>
                <header className="flex items-center gap-3 border-b border-foreground/10 p-4">
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="Back to threads"
                    className="lg:hidden material-symbols-outlined text-foreground/60"
                  >
                    arrow_back
                  </button>
                  <h2 className="font-black truncate">{title}</h2>
                </header>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60dvh]">
                  {messages.map((m) => {
                    const mine = m.author._id === me;
                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${mine ? "bg-primary/10" : "bg-foreground/5"}`}
                        >
                          <p className="text-[10px] font-black uppercase text-foreground/40 mb-1">
                            {m.author.name} · {when(m.createdAt)}
                          </p>
                          <p className="whitespace-pre-wrap wrap-break-word">
                            {m.body}
                          </p>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-foreground/40">
                          <button
                            type="button"
                            onClick={() => startEmail(m)}
                            disabled={others.length === 0}
                            className="font-bold text-primary hover:underline disabled:opacity-40"
                          >
                            Email this
                          </button>
                          {m.emails.map((em) => (
                            <span key={`${em.at}-${em.subject}`}>
                              Emailed “{em.subject}” ({em.to.length})
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
                <form
                  onSubmit={sendReply}
                  className="flex gap-2 border-t border-foreground/10 p-3"
                >
                  <label htmlFor="discussion-reply" className="sr-only">
                    Reply
                  </label>
                  <textarea
                    id="discussion-reply"
                    rows={2}
                    maxLength={5000}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write a message…"
                    className={`${fieldClass} resize-none`}
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="px-5 rounded-xl bg-primary text-primary-content font-black disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <p className="m-auto p-10 font-bold text-foreground/30">
                Select a discussion
              </p>
            )}
          </section>
        </div>
      )}

      <FinanceFormModal
        open={newOpen}
        title="New discussion"
        submitLabel="Start"
        saving={modalBusy}
        error={modalError}
        disabled={!newForm.title.trim() || !newForm.body.trim()}
        onClose={() => setNewOpen(false)}
        onSubmit={createThread}
      >
        <div className="space-y-1.5">
          <label htmlFor="thread-title" className={labelClass}>
            Title
          </label>
          <input
            id="thread-title"
            maxLength={150}
            value={newForm.title}
            onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="thread-body" className={labelClass}>
            Message
          </label>
          <textarea
            id="thread-body"
            rows={5}
            maxLength={5000}
            value={newForm.body}
            onChange={(e) => setNewForm({ ...newForm, body: e.target.value })}
            className={`${fieldClass} resize-y`}
          />
        </div>
      </FinanceFormModal>

      <FinanceFormModal
        open={emailing !== null}
        title="Email this message"
        submitLabel="Send email"
        saving={modalBusy}
        error={modalError}
        disabled={!emailForm.subject.trim() || recipients.length === 0}
        onClose={() => setEmailing(null)}
        onSubmit={sendEmail}
      >
        <fieldset className="space-y-2">
          <legend className={labelClass}>To</legend>
          {others.map((d) => (
            <label key={d.id} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={recipients.includes(d.id)}
                onChange={(e) =>
                  setRecipients(
                    e.target.checked
                      ? [...recipients, d.id]
                      : recipients.filter((r) => r !== d.id),
                  )
                }
                className="size-4 accent-primary"
              />
              <span className="font-bold">{d.name}</span>
              <span className="text-xs text-foreground/50 truncate">
                {d.email}
              </span>
            </label>
          ))}
        </fieldset>
        <div className="space-y-1.5">
          <label htmlFor="email-subject" className={labelClass}>
            Subject *
          </label>
          <input
            id="email-subject"
            required
            maxLength={150}
            value={emailForm.subject}
            onChange={(e) =>
              setEmailForm({ ...emailForm, subject: e.target.value })
            }
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email-note" className={labelClass}>
            Note (optional)
          </label>
          <textarea
            id="email-note"
            rows={3}
            maxLength={2000}
            value={emailForm.note}
            onChange={(e) =>
              setEmailForm({ ...emailForm, note: e.target.value })
            }
            className={`${fieldClass} resize-y`}
          />
        </div>
        <p className="text-xs text-foreground/50">
          Sent from admin@kasaulicoder.com with the message quoted. Replies go
          to you.
        </p>
      </FinanceFormModal>
    </motion.div>
  );
};

export default Discussions;
