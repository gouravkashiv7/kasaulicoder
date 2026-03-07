"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/components/admin/types";

export default function AdminProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    outcome: "",
    desc: "",
    images: [] as string[],
    tags: [] as string[],
    content: "",
    githubUrl: "",
    liveUrl: "",
    videoUrl: "",
    status: "active" as "active" | "past",
    featured: false,
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      outcome: project.outcome,
      desc: project.desc,
      images: project.images || [],
      tags: project.tags || [],
      content: project.content || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      videoUrl: project.videoUrl || "",
      status: project.status,
      featured: project.featured || false,
    });
    setShowModal(true);
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      outcome: "",
      desc: "",
      images: [],
      tags: [],
      content: "",
      githubUrl: "",
      liveUrl: "",
      videoUrl: "",
      status: "active",
      featured: false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProject
        ? `/api/admin/projects?id=${editingProject._id}`
        : `/api/projects`;

      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchProjects();
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to save project");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (project: Project) => {
    try {
      const newStatus = project.status === "active" ? "past" : "active";
      await fetch(`/api/admin/projects?id=${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const newFeatured = !project.featured;
      await fetch(`/api/admin/projects?id=${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newFeatured }),
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              rocket_launch
            </span>
            Projects
          </h2>
          <p className="text-foreground/60 text-sm mt-1">
            Manage your featured active and past projects.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Project
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm p-3 rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-foreground/5 border-b border-white/10">
              <tr>
                <th className="p-4 text-xs font-black text-foreground/40 uppercase tracking-widest whitespace-nowrap">
                  Project
                </th>
                <th className="p-4 text-xs font-black text-foreground/40 uppercase tracking-widest">
                  Featured
                </th>
                <th className="p-4 text-xs font-black text-foreground/40 uppercase tracking-widest">
                  Status
                </th>
                <th className="p-4 text-xs font-black text-foreground/40 uppercase tracking-widest">
                  Tags
                </th>
                <th className="p-4 text-xs font-black text-foreground/40 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-foreground/40"
                  >
                    <span className="material-symbols-outlined animate-spin text-primary">
                      refresh
                    </span>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-foreground/40 text-sm"
                  >
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3 w-max">
                        <div className="size-10 rounded-lg overflow-hidden relative bg-foreground/10 shrink-0 border border-white/10">
                          {project.images?.[0] ? (
                            <Image
                              src={project.images[0]}
                              fill
                              alt=""
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-foreground/30">
                              <span className="material-symbols-outlined text-sm">
                                image
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm tracking-tight">
                            {project.title}
                          </div>
                          <div className="text-primary text-[10px] font-black tracking-widest uppercase">
                            /{project.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`size-8 rounded-lg flex items-center justify-center transition-all ${
                          project.featured
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-foreground/5 text-foreground/20 hover:text-foreground/40"
                        }`}
                        title={
                          project.featured
                            ? "Featured (Show on Home)"
                            : "Set as Featured"
                        }
                      >
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            project.featured ? "fill-1" : ""
                          }`}
                        >
                          star
                        </span>
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(project)}
                        className={`px-3 py-1 rounded-full text-xs font-bold leading-none inline-flex items-center gap-1.5 transition-colors ${
                          project.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            : "bg-foreground/10 text-foreground/60 hover:bg-foreground/20"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            project.status === "active"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-foreground/40"
                          }`}
                        />
                        {project.status === "active" ? "Active" : "Past"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 w-max">
                        {project.tags?.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-foreground/60"
                          >
                            {tag}
                          </span>
                        ))}
                        {(project.tags?.length || 0) > 2 && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-foreground/60">
                            +{(project.tags?.length || 0) - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 w-max ml-auto">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-foreground/60 hover:text-foreground"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="size-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 flex items-center justify-center transition-colors text-rose-500"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">
                {editingProject ? "Edit Project" : "Add Project"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2">
                    Outcome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.outcome}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, outcome: e.target.value }))
                    }
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, desc: e.target.value }))
                  }
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2">
                  Full Content / Case Study
                </label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, content: e.target.value }))
                  }
                  placeholder="Supports Markdown... (Optional)"
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2">
                    Primary Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.images[0] || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        images: [e.target.value, ...p.images.slice(1)],
                      }))
                    }
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        status: e.target.value as "active" | "past",
                      }))
                    }
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option value="active">Active (In Progress)</option>
                    <option value="past">Past (Completed)</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      smart_display
                    </span>
                    Video Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, videoUrl: e.target.value }))
                    }
                    placeholder="https://youtube.com/..."
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors w-full">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          featured: e.target.checked,
                        }))
                      }
                      className="size-5 rounded border-white/10 bg-background text-primary focus:ring-primary/20"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold leading-none">
                        Featured Project
                      </span>
                      <span className="text-[10px] text-foreground/40 uppercase tracking-widest mt-1">
                        Show on Homepage
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      link
                    </span>
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, liveUrl: e.target.value }))
                    }
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      code
                    </span>
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, githubUrl: e.target.value }))
                    }
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="NEXT.JS, TAILWIND, STRIPE"
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-primary text-background hover:bg-primary/90 transition-colors flex-1"
                >
                  Save Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
