"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

type SidebarView = "dashboard" | "blogs" | "submitted_blogs" | "settings";

const MemberDashboard = () => {
  const [sidebarView, setSidebarView] = useState<SidebarView>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [updateStatus, setUpdateStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [updating, setUpdating] = useState(false);

  // Blog Form State
  const [blogData, setBlogData] = useState({
    title: "",
    mainImageUrl: "",
    tagline: "",
    description: "",
    content: "",
    writtenBy: "",
    slug: "",
  });
  const [blogStatus, setBlogStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [submittingBlog, setSubmittingBlog] = useState(false);

  // Submitted Blogs State
  const [blogs, setBlogs] = useState<any[]>([]);
  const [fetchingBlogs, setFetchingBlogs] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync state with URL
  useEffect(() => {
    const view = searchParams.get("view") as SidebarView;
    if (
      view &&
      ["dashboard", "blogs", "submitted_blogs", "settings"].includes(view)
    ) {
      setSidebarView(view);
    }
  }, [searchParams]);

  const updateView = (view: SidebarView) => {
    setSidebarView(view);
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  };

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/member/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setProfileData({
          name: data.name,
          email: data.email,
          password: "",
        });
      } else {
        router.push("/login?type=admin");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.warn("Logout request failed:", e);
    }
    localStorage.removeItem("user");
    router.push("/login?type=admin");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateStatus(null);

    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok) {
        setUpdateStatus({ type: "success", message: data.message });
        setUser({ ...user, name: profileData.name, email: profileData.email });
        setProfileData({ ...profileData, password: "" });

        // Update local storage too
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...parsed,
              name: profileData.name,
              email: profileData.email,
            }),
          );
        }
      } else {
        setUpdateStatus({
          type: "error",
          message: data.error || "Update failed",
        });
      }
    } catch (err) {
      setUpdateStatus({ type: "error", message: "An error occurred" });
    } finally {
      setUpdating(false);
    }
  };

  const fetchBlogs = useCallback(async () => {
    setFetchingBlogs(true);
    try {
      const res = await fetch("/api/member/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setFetchingBlogs(false);
    }
  }, []);

  useEffect(() => {
    if (sidebarView === "submitted_blogs") {
      fetchBlogs();
    }
  }, [sidebarView, fetchBlogs]);

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogData({
      title: blog.title,
      mainImageUrl: blog.mainImageUrl,
      tagline: blog.tagline,
      description: blog.description,
      content: blog.content,
      writtenBy: blog.writtenBy,
      slug: blog.slug,
    });
    setSidebarView("blogs");
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "blogs");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBlog(true);
    setBlogStatus(null);

    try {
      const payload = {
        ...blogData,
        writtenBy: blogData.writtenBy || user?.name || "Anonymous",
      };

      const url = editingBlog
        ? `/api/member/blogs/${editingBlog._id}`
        : "/api/member/blogs";
      const method = editingBlog ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setBlogStatus({
          type: "success",
          message: editingBlog
            ? "Blog updated successfully!"
            : "Blog drafted! Waiting for admin approval.",
        });

        if (!editingBlog) {
          setBlogData({
            title: "",
            mainImageUrl: "",
            tagline: "",
            description: "",
            content: "",
            writtenBy: user?.name || "",
            slug: "",
          });
        }

        // Wait a bit to show success message then switch view
        setTimeout(() => {
          updateView("submitted_blogs");
          setEditingBlog(null);
          setBlogStatus(null);
        }, 2000);
      } else {
        setBlogStatus({
          type: "error",
          message: data.error || "Failed to process blog",
        });
      }
    } catch (err) {
      setBlogStatus({ type: "error", message: "An error occurred" });
    } finally {
      setSubmittingBlog(false);
    }
  };

  const sidebarItems = [
    { id: "dashboard" as SidebarView, label: "Dashboard", icon: "dashboard" },
    { id: "blogs" as SidebarView, label: "Write Blog", icon: "edit_document" },
    {
      id: "submitted_blogs" as SidebarView,
      label: "My Blogs",
      icon: "library_books",
    },
    { id: "settings" as SidebarView, label: "Settings", icon: "settings" },
  ];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex font-display">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        className={`fixed left-0 top-0 h-full bg-background border-r border-foreground/10 z-40 flex flex-col overflow-hidden transition-transform duration-300 md:transition-none ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
        style={{ width: sidebarCollapsed ? 72 : 260 }}
      >
        {/* Logo area */}
        <div className="p-5 border-b border-foreground/10 flex items-center gap-3 min-h-18">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden relative">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain theme-logo"
              />
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-black tracking-tighter text-foreground">
                Member<span className="text-primary">Hub</span>
              </span>
            )}
          </Link>
          <button
            className="ml-auto md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                updateView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${
                sidebarView === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <span className="material-symbols-outlined text-xl shrink-0">
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <span className="text-sm font-bold whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User profile footer in sidebar */}
        <div className="p-4 border-t border-foreground/10 bg-foreground/2">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-primary text-xl">
                  person
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest truncate">
                  {user?.role}
                </p>
              </div>
            )}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-2 mt-4 overflow-hidden"
              >
                <div className="flex justify-center">
                  <ThemeSwitcher />
                </div>
                <Link
                  href="/"
                  className="w-full flex items-center gap-3 px-3 py-2 text-foreground/50 hover:bg-foreground/5 hover:text-foreground rounded-lg transition-all text-xs font-bold mb-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    home
                  </span>
                  {!sidebarCollapsed && <span>Return to Site</span>}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-sm">
                    logout
                  </span>
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        animate={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? 72 : 260 }}
        className="flex-1 min-h-screen w-full"
      >
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 bg-background/80 backdrop-blur-lg border-b border-foreground/10 sticky top-0 z-20">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="size-9 flex items-center justify-center rounded-xl bg-foreground/5 shrink-0"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <div className="size-7 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden relative">
              <Image
                src="/logo.png"
                alt="Logo"
                width={28}
                height={28}
                className="object-contain theme-logo"
              />
            </div>
            <span className="text-base font-black tracking-tight truncate">
              Member<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <AnimatePresence mode="wait">
            {sidebarView === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-black mb-2">
                    Welcome Back, {user?.name.split(" ")[0]}
                  </h1>
                  <p className="text-foreground/50 font-medium">
                    Workspace:{" "}
                    {user?.roleDescription || "KasauliCoder Team Member"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-foreground/3 border border-foreground/10 p-6 rounded-2xl">
                    <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                      <span className="material-symbols-outlined">badge</span>
                    </div>
                    <h3 className="text-lg font-black mb-1">Your Role</h3>
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">
                      {user?.role}
                    </p>
                    <p className="text-xs text-foreground/60 mt-3 leading-relaxed">
                      {user?.roleDescription || "No role description provided."}
                    </p>
                  </div>

                  <div className="bg-foreground/3 border border-foreground/10 p-6 rounded-2xl">
                    <div className="size-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 text-secondary">
                      <span className="material-symbols-outlined">hub</span>
                    </div>
                    <h3 className="text-lg font-black mb-1">Designation</h3>
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">
                      {user?.designation || "Staff Member"}
                    </p>
                    <p className="text-xs text-foreground/60 mt-3 leading-relaxed">
                      Member since{" "}
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {sidebarView === "blogs" && (
              <motion.div
                key="blogs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-black mb-2">
                      {editingBlog ? "Edit Blog" : "Write a New Blog"}
                    </h1>
                    <p className="text-foreground/50">
                      {editingBlog
                        ? "Update your existing blog post."
                        : "Draft a new post for KasauliCoder. Superadmins will review before it goes live."}
                    </p>
                  </div>
                  {editingBlog && (
                    <button
                      onClick={() => {
                        setEditingBlog(null);
                        setBlogData({
                          title: "",
                          mainImageUrl: "",
                          tagline: "",
                          description: "",
                          content: "",
                          writtenBy: user?.name || "",
                          slug: "",
                        });
                        setBlogStatus(null);
                      }}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">
                        add
                      </span>
                      Create New Instead
                    </button>
                  )}
                </div>

                <div className="bg-background/40 border border-foreground/10 rounded-2xl overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-foreground/5">
                    <h2 className="text-xl font-black flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        edit_square
                      </span>
                      Blog Details
                    </h2>
                  </div>

                  <form
                    className="p-6 md:p-8 space-y-6"
                    onSubmit={handleCreateBlog}
                  >
                    {blogStatus && (
                      <div
                        className={`p-4 rounded-xl text-sm font-bold border ${
                          blogStatus.type === "success"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}
                      >
                        {blogStatus.message}
                      </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
                          Blog Title
                        </label>
                        <input
                          type="text"
                          value={blogData.title}
                          onChange={(e) =>
                            setBlogData({ ...blogData, title: e.target.value })
                          }
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-sm font-semibold"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
                          Custom Slug (URL Path)
                        </label>
                        <input
                          type="text"
                          value={blogData.slug}
                          onChange={(e) =>
                            setBlogData({ ...blogData, slug: e.target.value })
                          }
                          placeholder="leave-blank-for-auto-generate"
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
                        Main Image URL
                      </label>
                      <input
                        type="url"
                        value={blogData.mainImageUrl}
                        onChange={(e) =>
                          setBlogData({
                            ...blogData,
                            mainImageUrl: e.target.value,
                          })
                        }
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-sm font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
                        Tagline (Short Summary)
                      </label>
                      <input
                        type="text"
                        value={blogData.tagline}
                        onChange={(e) =>
                          setBlogData({ ...blogData, tagline: e.target.value })
                        }
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-sm font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
                        Meta Description (SEO)
                      </label>
                      <textarea
                        value={blogData.description}
                        onChange={(e) =>
                          setBlogData({
                            ...blogData,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-sm font-semibold min-h-20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
                        Written By (Display Name)
                      </label>
                      <input
                        type="text"
                        value={blogData.writtenBy || user?.name || ""}
                        onChange={(e) =>
                          setBlogData({
                            ...blogData,
                            writtenBy: e.target.value,
                          })
                        }
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-sm font-semibold opacity-80"
                        placeholder="Author Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
                        Blog Content (Markdown / HTML Supported)
                      </label>
                      <textarea
                        value={blogData.content}
                        onChange={(e) =>
                          setBlogData({ ...blogData, content: e.target.value })
                        }
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-sm font-semibold min-h-62.5 font-mono"
                        required
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={submittingBlog}
                        className="bg-primary text-primary-content font-black px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                      >
                        {submittingBlog
                          ? "Submitting..."
                          : editingBlog
                            ? "Update Blog"
                            : "Submit for Approval"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {sidebarView === "submitted_blogs" && (
              <motion.div
                key="submitted_blogs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-black mb-2">My Blogs</h1>
                  <p className="text-foreground/50">
                    Manage your submitted blog posts and track their status.
                  </p>
                </div>

                <div className="space-y-4">
                  {fetchingBlogs ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-foreground/3 rounded-2xl border border-dashed border-foreground/10">
                      <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                      <p className="text-sm font-bold text-foreground/40">
                        Loading your blogs...
                      </p>
                    </div>
                  ) : blogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-foreground/3 rounded-2xl border border-dashed border-foreground/10">
                      <span className="material-symbols-outlined text-5xl text-foreground/10 mb-4">
                        article
                      </span>
                      <p className="text-sm font-bold text-foreground/40 mb-6">
                        You hasn't published any blogs yet.
                      </p>
                      <button
                        onClick={() => setSidebarView("blogs")}
                        className="text-xs font-black bg-primary/10 text-primary px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        Write Your First Blog
                      </button>
                    </div>
                  ) : (
                    blogs.map((blog) => (
                      <div
                        key={blog._id}
                        className="bg-background/40 border border-foreground/10 rounded-2xl p-5 flex flex-col md:flex-row gap-5 hover:border-primary/30 transition-all group"
                      >
                        <div className="w-full md:w-40 h-24 rounded-xl overflow-hidden shrink-0 border border-foreground/5 bg-foreground/3 relative">
                          <Image
                            src={blog.mainImageUrl}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                blog.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              }`}
                            >
                              {blog.status}
                            </span>
                            <span className="text-[10px] font-medium text-foreground/30">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-black truncate mb-1">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-foreground/50 line-clamp-1 font-medium italic">
                            {blog.tagline}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="size-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                            title="Edit Blog"
                          >
                            <span className="material-symbols-outlined text-lg font-bold">
                              edit
                            </span>
                          </button>
                          {blog.status === "active" ? (
                            <Link
                              href={`/blogs/${blog.slug}`}
                              target="_blank"
                              className="size-10 flex items-center justify-center rounded-xl bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-all"
                              title="View Blog"
                            >
                              <span className="material-symbols-outlined text-lg">
                                visibility
                              </span>
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="size-10 flex items-center justify-center rounded-xl bg-foreground/5 text-foreground/20 cursor-not-allowed"
                              title="Wait for Approval to View"
                            >
                              <span className="material-symbols-outlined text-lg">
                                visibility_off
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {sidebarView === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-black mb-2">Account Settings</h1>
                  <p className="text-foreground/50">
                    Manage your profile information and security keys.
                  </p>
                </div>

                <div className="bg-background/40 border border-foreground/10 rounded-2xl overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-foreground/5">
                    <h2 className="text-xl font-black flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        person_edit
                      </span>
                      Profile Information
                    </h2>
                  </div>

                  <form
                    className="p-6 md:p-8 space-y-6"
                    onSubmit={handleUpdateProfile}
                  >
                    {updateStatus && (
                      <div
                        className={`p-4 rounded-xl text-sm font-bold border ${
                          updateStatus.type === "success"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}
                      >
                        {updateStatus.message}
                      </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-sm font-semibold"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-sm font-semibold"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
                        New Password (leave blank to keep current)
                      </label>
                      <input
                        type="password"
                        value={profileData.password}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            password: e.target.value,
                          })
                        }
                        placeholder="••••••••••••"
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all text-sm font-semibold"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={updating}
                        className="bg-primary text-primary-content font-black px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                      >
                        {updating ? "Saving Changes..." : "Update Profile"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default MemberDashboard;
