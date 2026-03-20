"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/components/admin/types";
import { motion } from "framer-motion";

interface ProjectFormProps {
  project?: Project;
  isEditing?: boolean;
}

export default function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    outcome: "",
    desc: "",
    media: [] as { type: "image" | "video"; url: string }[],
    tags: [] as string[],
    content: "",
    githubUrl: "",
    liveUrl: "",
    videoUrl: "",
    status: "active" as "active" | "past",
    featured: false,
    members: [] as string[],
  });

  const [staffList, setStaffList] = useState<any[]>([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/admin/staff");
        if (res.ok) {
          const data = await res.json();
          setStaffList(data.filter((s: any) => s.role !== "superadmin"));
        }
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      }
    };
    fetchStaff();
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        outcome: project.outcome || "",
        desc: project.desc || "",
        media: project.media || [],
        tags: project.tags || [],
        content: project.content || "",
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        videoUrl: project.videoUrl || "",
        status: project.status || "active",
        featured: project.featured || false,
        members: project.members?.map((m: any) => typeof m === 'string' ? m : m._id) || [],
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/projects?id=${project?._id}`
        : `/api/projects`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/dashboard?tab=projects");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save project");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter(m => m !== id)
        : [...prev.members, id]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            {isEditing ? "Edit Project" : "Add New Project"}
          </h1>
          <p className="text-foreground/50 text-sm mt-1">
            {isEditing ? `Updating ${formData.title}` : "Fill in the details to showcase a new achievement."}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-colors border border-white/10"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm p-4 rounded-xl mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Health+ Platform"
                className="w-full bg-background border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary/50 transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">
                Outcome *
              </label>
              <input
                type="text"
                required
                value={formData.outcome}
                onChange={(e) => setFormData(p => ({ ...p, outcome: e.target.value }))}
                placeholder="e.g. 40% Efficiency Boost"
                className="w-full bg-background border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">
              Short Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.desc}
              onChange={(e) => setFormData(p => ({ ...p, desc: e.target.value }))}
              placeholder="A brief overview of the project objectives and results..."
              className="w-full bg-background border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary/50 transition-all shadow-inner resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">
              Full Story / Case Study
            </label>
            <textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
              placeholder="Deep dive into the challenges, solution, and technical stack (Supports Markdown)..."
              className="w-full bg-background border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary/50 transition-all shadow-inner resize-none"
            />
          </div>
        </div>

        {/* Informational UI */}
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">info</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-1">Display Logic Guide</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                <strong>Priority 1:</strong> Custom Media added below will be shown as a carousel.<br />
                <strong>Priority 2:</strong> Default Website Preview will be rendered using the <strong>Live URL</strong> if no media is added.<br />
                <strong>Priority 3:</strong> If both are missing, a system placeholder will be shown.
              </p>
            </div>
          </div>
        </div>

        {/* Member Assignment */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Project Team Members</h3>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em] mt-1">Assign members who worked on this project</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {staffList.map((staff) => (
              <button
                key={staff._id}
                type="button"
                onClick={() => toggleMember(staff._id)}
                className={`flex items-center gap-2 pl-2 pr-4 py-2 rounded-xl border transition-all ${
                  formData.members.includes(staff._id)
                    ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                    : "bg-white/5 border-white/10 text-foreground/50 hover:border-white/20"
                }`}
              >
                <div className="size-6 rounded-lg bg-foreground/10 overflow-hidden relative shrink-0">
                  {staff.image ? (
                    <img src={staff.image} alt={staff.name} className="size-full object-cover" />
                  ) : (
                    <div className="size-full flex items-center justify-center text-[10px] font-black uppercase tracking-tighter">
                      {staff.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold leading-tight">{staff.name}</span>
                  <span className="text-[9px] uppercase tracking-widest opacity-50">{staff.role}</span>
                </div>
                {formData.members.includes(staff._id) && (
                  <span className="material-symbols-outlined text-sm ml-1 animate-in zoom-in duration-300">check_circle</span>
                )}
              </button>
            ))}
            {staffList.length === 0 && (
              <p className="text-xs text-foreground/30 italic">Loading staff members...</p>
            )}
          </div>
        </div>

        {/* Media Manager */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest">Project Media</h3>
              <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em] mt-1">Images or Video demos</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, media: [...p.media, { type: 'image', url: '' }] }))}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                + Add Image
              </button>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, media: [...p.media, { type: 'video', url: '' }] }))}
                className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary/20 transition-all"
              >
                <span className="material-symbols-outlined text-sm">movie</span>
                + Add Video
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {formData.media.map((item, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={idx} 
                className="flex gap-3 items-center group/media"
              >
                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  item.type === 'image' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/10 text-secondary border-secondary/20'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {item.type === 'image' ? 'image' : 'smart_display'}
                  </span>
                </div>
                <input
                  type="url"
                  placeholder={`${item.type} URL (e.g., https://...)`}
                  value={item.url}
                  onChange={(e) => {
                    const newMedia = [...formData.media];
                    newMedia[idx].url = e.target.value;
                    setFormData(p => ({ ...p, media: newMedia }));
                  }}
                  className="flex-1 bg-background border border-white/10 rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-primary/50 transition-all shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    const newMedia = formData.media.filter((_, i) => i !== idx);
                    setFormData(p => ({ ...p, media: newMedia }));
                  }}
                  className="size-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 flex items-center justify-center transition-all opacity-0 group-hover/media:opacity-100"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </motion.div>
            ))}
            {formData.media.length === 0 && (
              <div className="py-12 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-foreground/10 text-4xl mb-2">web_asset</span>
                <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">
                  No custom media added — Fallback active
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Config & Links */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                className="w-full bg-background border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary/50 transition-all appearance-none"
              >
                <option value="active">Active (Ongoing)</option>
                <option value="past">Past (Completed)</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all w-full">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(p => ({ ...p, featured: e.target.checked }))}
                  className="size-6 rounded-lg border-white/10 bg-background text-primary focus:ring-primary/20"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-black leading-tight">Featured Project</span>
                  <span className="text-[10px] text-foreground/40 uppercase tracking-widest mt-1">Show on Landing Page</span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">
                <span className="material-symbols-outlined text-sm">link</span>
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData(p => ({ ...p, liveUrl: e.target.value }))}
                placeholder="https://your-site.com"
                className="w-full bg-background border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary/50 transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">
                <span className="material-symbols-outlined text-sm">code</span>
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData(p => ({ ...p, githubUrl: e.target.value }))}
                placeholder="https://github.com/..."
                className="w-full bg-background border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags.join(", ")}
              onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
              placeholder="NEXT.JS, TAILWIND, MONGO"
              className="w-full bg-background border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-primary/50 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-2 py-4 bg-primary text-background rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined">save</span>
            )}
            {isEditing ? "Update Project" : "Create Project"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
