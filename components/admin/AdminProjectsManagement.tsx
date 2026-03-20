"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/components/admin/types";

export default function AdminProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "past">("all");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete project");
      }
    } catch (err) {
      alert("An error occurred while deleting the project");
    }
  };

  const handleToggleStatus = async (project: Project) => {
    const newStatus = project.status === "active" ? "past" : "active";
    try {
      const res = await fetch(`/api/admin/projects?id=${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p._id === project._id ? { ...p, status: newStatus } : p,
          ),
        );
      }
    } catch (err) {
      console.error("Toggle status failed:", err);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p._id === project._id ? { ...p, featured: !project.featured } : p,
          ),
        );
      }
    } catch (err) {
      console.error("Toggle featured failed:", err);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === "active").length,
      featured: projects.filter((p) => p.featured).length,
    };
  }, [projects]);

  // Filtering calculation
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = filter === "all" || p.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, filter]);

  // Helper to get first image from media array
  const getThumbnail = (project: Project) => {
    return project.media?.find((m) => m.type === "image")?.url;
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Stats */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <span className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary text-2xl">rocket_launch</span>
              </span>
              Projects Console
            </h2>
            <p className="text-foreground/50 text-sm mt-2 font-medium">
              Manage and showcase your engineering milestones.
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform">add</span>
            New Project
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Total Projects", value: stats.total, icon: "inventory_2", color: "text-foreground" },
            { label: "Active Engineering", value: stats.active, icon: "engineering", color: "text-emerald-500" },
            { label: "Featured Highlights", value: stats.featured, icon: "star", color: "text-amber-500" },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
                <span className={`material-symbols-outlined ${s.color}/20 text-2xl`}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
        <div className="relative w-full md:max-w-md group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-foreground/30 group-focus-within:text-primary transition-colors">search</span>
          <input
            type="text"
            placeholder="Search by title, slug, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-all shadow-inner"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {(["all", "active", "past"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                filter === s
                  ? "bg-primary text-background border-primary"
                  : "bg-white/5 text-foreground/40 border-white/10 hover:border-white/20 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm p-4 rounded-2xl flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-foreground/20">
            <span className="material-symbols-outlined animate-spin text-5xl">refresh</span>
            <p className="text-xs font-black uppercase tracking-widest">Compiling entries...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-foreground/5 text-6xl mb-4">search_off</span>
            <p className="text-sm font-black text-foreground/20 uppercase tracking-[0.3em]">No matching projects found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const thumbnail = getThumbnail(project);
                return (
                  <motion.div
                    layout
                    key={project._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group relative bg-white/5 border border-white/10 hover:border-primary/30 p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      {/* Thumbnail Block */}
                      <div className="relative size-16 sm:size-24 rounded-xl overflow-hidden bg-foreground/5 border border-white/10 shrink-0 shadow-lg">
                        {thumbnail ? (
                          <Image src={thumbnail} fill alt="" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/10 bg-linear-to-br from-white/5 to-transparent">
                            <span className="material-symbols-outlined text-3xl">image</span>
                          </div>
                        )}
                        <div className={`absolute top-1.5 left-1.5 size-2 rounded-full ring-2 ring-background ${
                          project.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-foreground/20"
                        }`} />
                      </div>

                      {/* Content Block */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                            {project.title}
                          </h3>
                          <div className="flex gap-2">
                            {project.featured && (
                              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px] fill-1">star</span>
                                Featured
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                              project.status === "active" 
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                : "bg-foreground/5 text-foreground/40 border-white/10"
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-foreground/50 italic truncate max-w-lg">
                          {project.outcome}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {project.tags?.map((tag, i) => (
                            <span key={i} className="text-[10px] font-bold text-foreground/30 px-2 py-0.5 bg-white/5 rounded-lg border border-white/10 uppercase tracking-tighter">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Block */}
                      <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                        <div className="flex gap-2 flex-1 sm:flex-none">
                          <button
                            onClick={() => handleToggleFeatured(project)}
                            className={`flex-1 sm:size-10 rounded-xl flex items-center justify-center transition-all border ${
                              project.featured
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-white/5 text-foreground/20 border-white/10 hover:text-foreground/40"
                            }`}
                            title="Toggle Featured"
                          >
                            <span className="material-symbols-outlined text-[20px]">star</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(project)}
                            className={`flex-1 sm:size-10 rounded-xl flex items-center justify-center transition-all border ${
                              project.status === "active"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-white/5 text-foreground/20 border-white/10 hover:text-foreground/40"
                            }`}
                            title="Toggle Status"
                          >
                            <span className="material-symbols-outlined text-[20px]">sync</span>
                          </button>
                        </div>
                        <div className="h-8 w-px bg-white/10 hidden lg:block mx-1" />
                        <div className="flex gap-2 flex-1 sm:flex-none">
                          <Link
                            href={`/admin/projects/edit/${project._id}`}
                            className="flex-1 sm:size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 flex items-center justify-center transition-all"
                            title="Edit Details"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </Link>
                          {currentUser?.role === "superadmin" && (
                            <button
                              onClick={() =>
                                handleDelete(project._id as string, project.title)
                              }
                              className="flex-1 sm:size-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 flex items-center justify-center transition-all"
                              title="Delete Permanently"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                delete
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
