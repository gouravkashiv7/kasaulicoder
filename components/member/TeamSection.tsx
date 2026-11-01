"use client";

import { useCallback, useEffect, useState } from "react";
import type { DirectoryRecord } from "@/components/admin/types";
import ProfileEditModal, { type ProfileValues } from "./ProfileEditModal";

interface TeamSectionProps {
  viewerRole: string;
}

// Team members the viewer may edit: admins look after editors and support
// staff, a superadmin after everyone below them.
const TeamSection = ({ viewerRole }: TeamSectionProps) => {
  const [members, setMembers] = useState<DirectoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<DirectoryRecord | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load the team");
      const editable =
        viewerRole === "superadmin"
          ? ["admin", "editor", "support"]
          : ["editor", "support"];
      setMembers(
        (data as DirectoryRecord[])
          .filter((m) => editable.includes(m.role ?? ""))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load the team");
    } finally {
      setLoading(false);
    }
  }, [viewerRole]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (values: ProfileValues, imageChanged: boolean) => {
    if (!editing) return "No member selected";
    const { image, ...text } = values;
    const res = await fetch("/api/admin/staff", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing._id,
        ...text,
        ...(imageChanged ? { image } : {}),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return data.error || "Could not save changes";
    await load();
    return null;
  };

  return (
    <section className="mt-10">
      <h2 className="text-xl font-black mb-1">Team members</h2>
      <p className="text-sm text-foreground/50 mb-4">
        Update a member's photo, name, email, designation and role description.
      </p>

      {error && (
        <p role="alert" className="mb-3 text-sm font-bold text-rose-500">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-foreground/50 animate-pulse">
          Loading team…
        </p>
      ) : members.length === 0 ? (
        <p className="text-sm text-foreground/50">No members to edit yet.</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {members.map((m) => (
            <li
              key={m._id}
              className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/3 p-4"
            >
              <div className="size-12 rounded-xl border border-foreground/10 bg-foreground/5 overflow-hidden flex items-center justify-center shrink-0">
                {m.image ? (
                  // biome-ignore lint/performance/noImgElement: data URL photo
                  <img
                    src={m.image}
                    alt={m.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-foreground/30">
                    person
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black truncate">{m.name}</p>
                <p className="text-xs text-foreground/50 truncate">{m.email}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                  {m.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(m)}
                className="text-xs font-bold text-primary hover:underline shrink-0"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <ProfileEditModal
          key={editing._id}
          title={`Edit ${editing.name}`}
          initial={{
            name: editing.name,
            email: editing.email,
            designation: editing.designation ?? "",
            roleDescription: editing.roleDescription ?? "",
            image: editing.image ?? "",
          }}
          showProfileText
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </section>
  );
};

export default TeamSection;
