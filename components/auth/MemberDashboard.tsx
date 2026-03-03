"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import UniqueLoading from "@/components/ui/morph-loading";

type SidebarView = "dashboard" | "blogs" | "submitted_blogs" | "settings";

interface BlogEditorSectionProps {
  user: any;
  editingBlog: any;
  setEditingBlog: (blog: any) => void;
  updateView: (view: SidebarView) => void;
  fetchBlogs: () => void;
}

// Safe Image wrapper for MDX to prevent missing width/height crashes
const SafeImage = (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  if (!props.src) return null;
  if (!props.width || !props.height) {
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-foreground/10 my-8 bg-foreground/5">
        <Image
          fill
          className="object-cover"
          alt={props.alt || "Blog image"}
          {...props}
          width={undefined}
          height={undefined}
        />
      </div>
    );
  }
  return (
    <Image
      className="rounded-2xl border border-foreground/10 my-8"
      alt={props.alt || "Blog image"}
      {...props}
    />
  );
};

const BlogEditorSection = ({
  user,
  editingBlog,
  setEditingBlog,
  updateView,
  fetchBlogs,
}: BlogEditorSectionProps) => {
  // Blog Form State
  const [blogData, setBlogData] = useState({
    title: editingBlog?.title || "",
    mainImageUrl: editingBlog?.mainImageUrl || "",
    tagline: editingBlog?.tagline || "",
    description: editingBlog?.description || "",
    content: editingBlog?.content || "",
    writtenBy: editingBlog?.writtenBy || user?.name || "",
    slug: editingBlog?.slug || "",
  });
  const [blogStatus, setBlogStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [submittingBlog, setSubmittingBlog] = useState(false);
  const [showAiPrompter, setShowAiPrompter] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Live MDX Preview Serialization
  useEffect(() => {
    if (!previewMode || !blogData.content) {
      setMdxSource(null);
      return;
    }

    const preparePreview = async () => {
      setPreviewLoading(true);
      try {
        const source = await serialize(blogData.content);
        setMdxSource(source);
      } catch (err) {
        console.error("MDX Preview Error:", err);
        setMdxSource(null);
      } finally {
        setPreviewLoading(false);
      }
    };

    const timeout = setTimeout(preparePreview, 500); // Debounce serialize
    return () => clearTimeout(timeout);
  }, [blogData.content, previewMode]);

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation
    if (
      !blogData.title ||
      !blogData.tagline ||
      !blogData.mainImageUrl ||
      !blogData.description ||
      !blogData.content
    ) {
      setBlogStatus({
        type: "error",
        message:
          "All fields are mandatory (Title, Tagline, Image, Description, and Content). Only the URL Slug can be left blank for auto-generation.",
      });
      return;
    }

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

        // Wait a bit to show success message then switch view
        // Keep loading screen active until transition is ready
        setTimeout(() => {
          fetchBlogs();
          updateView("submitted_blogs");
          setEditingBlog(null);
          setBlogStatus(null);
          setSubmittingBlog(false);
        }, 2000);
      } else {
        setBlogStatus({
          type: "error",
          message: data.error || "Failed to process blog",
        });
        setSubmittingBlog(false);
      }
    } catch (err) {
      setBlogStatus({ type: "error", message: "An error occurred" });
      setSubmittingBlog(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() =>
          setBlogStatus({ type: "success", message: "Prompt copied!" }),
        )
        .catch(() => fallbackCopyTextToClipboard(text));
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Ensure the textarea is off-screen
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setBlogStatus({ type: "success", message: "Prompt copied!" });
    } catch (err) {
      console.error("Fallback Copy failed", err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black mb-2 tracking-tight">
            {editingBlog ? "Refine Your Story" : "Compose New Story"}
          </h1>
          <p className="text-foreground/50 font-medium leading-relaxed max-w-lg">
            {editingBlog
              ? `Fine-tuning "${editingBlog.title}" for perfection.`
              : "Turn your insights into an interactive digital experience."}
          </p>
        </div>
        {editingBlog && (
          <button
            onClick={() => {
              setEditingBlog(null);
              updateView("blogs"); // This logic will trigger a refresh due to the key change in parent
            }}
            className="bg-foreground/5 text-foreground/40 hover:text-foreground hover:bg-foreground/10 px-5 py-2.5 rounded-xl font-black text-xs transition-all border border-foreground/5 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">cancel</span>
            Cancel Edit
          </button>
        )}
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {submittingBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-6">
              <UniqueLoading variant="morph" size="lg" />
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-foreground">
                  {editingBlog ? "Pushing Updates..." : "Publishing Story..."}
                </h3>
                <p className="text-sm font-medium text-foreground/40 italic">
                  Synchronizing with the creative neural engine...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-background/40 border border-foreground/10 rounded-3xl overflow-hidden shadow-2xl">
        <form className="p-1 gap-1 flex flex-col" onSubmit={handleCreateBlog}>
          {/* Top Bar / Actions */}
          <div className="p-4 md:p-6 border-b border-foreground/5 bg-primary/2 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">
                  {editingBlog ? "edit_square" : "add_circle"}
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight">
                Core Details
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submittingBlog}
                className="bg-primary text-primary-content font-black px-6 py-2 rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2 text-xs"
              >
                {submittingBlog
                  ? "Saving..."
                  : editingBlog
                    ? "Update Story"
                    : "Publish to Queue"}
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {blogStatus && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-2xl text-sm font-bold border flex items-center gap-3 ${
                  blogStatus.type === "success"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/10"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/10"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {blogStatus.type === "success" ? "check_circle" : "error"}
                </span>
                {blogStatus.message}
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Title & Slug */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 flex items-center gap-2 ml-1">
                    <span className="material-symbols-outlined text-xs">
                      title
                    </span>
                    Story Title <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={blogData.title}
                    onChange={(e) =>
                      setBlogData({
                        ...blogData,
                        title: e.target.value,
                      })
                    }
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-3.5 focus:border-primary outline-none transition-all text-sm font-bold placeholder:text-foreground/10"
                    required
                    placeholder="e.g. The Future of Creative Architecture"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 flex items-center gap-2 ml-1">
                    <span className="material-symbols-outlined text-xs">
                      link
                    </span>
                    URL Slug
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={blogData.slug}
                      onChange={(e) =>
                        setBlogData({
                          ...blogData,
                          slug: e.target.value,
                        })
                      }
                      placeholder="Auto-generated if left blank..."
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl pl-5 pr-12 py-3.5 focus:border-primary outline-none transition-all text-sm font-mono text-primary/80"
                    />
                  </div>
                </div>
              </div>

              {/* Image & Display Name */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 flex items-center gap-2 ml-1">
                    <span className="material-symbols-outlined text-xs">
                      image
                    </span>
                    Cover Image URL <span className="text-primary">*</span>
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
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-3.5 focus:border-primary outline-none transition-all text-sm font-semibold"
                    required
                    placeholder="Unsplash URL, etc."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 flex items-center gap-2 ml-1">
                    <span className="material-symbols-outlined text-xs">
                      edit
                    </span>
                    Display Author
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
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-3.5 focus:border-primary outline-none transition-all text-sm font-bold opacity-80"
                    placeholder="Display Name"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-xs">
                    short_text
                  </span>
                  Tagline & Meta Summary <span className="text-primary">*</span>
                </label>
                <textarea
                  value={blogData.tagline}
                  onChange={(e) =>
                    setBlogData({
                      ...blogData,
                      tagline: e.target.value,
                    })
                  }
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:border-primary outline-none transition-all text-sm font-medium leading-relaxed min-h-24"
                  required
                  placeholder="A brief hook that summarizes the story..."
                />
              </div>
            </div>

            {/* Content Section / Editor */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between ml-1">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-lg">
                      code
                    </span>
                  </div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                    {previewMode
                      ? "Visual Canvas"
                      : "Story Blueprint (MDX/JSX)"}
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAiPrompter(!showAiPrompter)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      showAiPrompter
                        ? "bg-secondary/10 text-secondary border-secondary/20"
                        : "bg-foreground/5 text-foreground/40 border-foreground/5 hover:text-foreground"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      bolt
                    </span>
                    AI Prompt
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      previewMode
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-foreground/5 text-foreground/40 border-foreground/5 hover:text-foreground"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {previewMode ? "edit" : "remove_red_eye"}
                    </span>
                    {previewMode ? "Go Back to Editor" : "Live Visual Preview"}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showAiPrompter && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-lg">
                              bolt
                            </span>
                          </div>
                          <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                            AI Genesis Prompt
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAiPrompter(false)}
                          className="text-foreground/30 hover:text-foreground transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">
                            close
                          </span>
                        </button>
                      </div>

                      <div className="bg-background/50 backdrop-blur-md rounded-2xl p-5 border border-primary/10 relative">
                        <pre className="text-[11px] font-mono text-foreground/70 leading-relaxed whitespace-pre-wrap select-all max-h-64 overflow-y-auto custom-scrollbar">
                          {`You are a senior React 19, Next.js 16, TailwindCSS v4, Framer Motion, and MDX expert.

Generate a premium SaaS blog post in PURE MDX format.

BRAND:
Kasauli Coder

TONE:
Professional, futuristic, expert, high-aesthetic, modern SaaS company.

AUDIENCE:
• Business owners
• Startup founders
• Tech decision-makers
• College students learning development, SEO, automation, and modern tech

STRICT OUTPUT RULES:

1. Output MUST be valid MDX.
2. NO imports.
3. NO exports.
4. NO frontmatter.
5. No author section.
6. No commentary.
7. No explanations outside the blog.
8. DO NOT wrap any block element inside <p>.
9. NEVER place:
   - <motion.div> inside <p>
   - <ul> inside <p>
   - <h2>/<h3> inside <p>
10. Use standard Markdown paragraph breaks (double newlines).
11. NEVER use manual <p> tags or wrap block elements in them.
12. Avoid dynamic JS expressions that may cause hydration mismatch.
13. Do not use Date, Math.random, window, or conditional rendering.
14. No client-only logic.
15. No forms.
16. No buttons.
17. No inline styles.
18. Do NOT use <div>. Only <motion.div> for containers.
19. Must not cause hydration errors in Next.js App Router.

ALLOWED ELEMENTS (BLOCK ONLY):

- <h2>
- <h3>
- <p>
- <ul>
- <li>
- <blockquote>
- <Image />
- <Link />
- <motion.div>

NO INLINE ELEMENTS:
• No <span>
• No nested inline wrappers

THEME SYSTEM (MANDATORY):

This project uses CSS variables mapped in Tailwind:

- bg-background
- text-foreground
- text-primary
- text-secondary
- bg-card
- bg-glass
- border-glass-border

You MUST:
• Use ONLY these theme-based classes.
• DO NOT hardcode any color (no hex codes, no text-cyan-500, etc.).
• Use text-primary instead of #06d6e0.
• Use text-secondary instead of #351ff4.
• Use bg-card or bg-glass instead of fixed backgrounds.
• Ensure compatibility with all themes (light, brand, dark-violet).

DESIGN SYSTEM:

• Main wrapper: max-w-4xl mx-auto space-y-12 px-6 py-16
• Headings: tracking-tight
• Paragraphs: leading-relaxed text-foreground/80
• Cards: bg-card border border-glass-border rounded-xl p-8
• Glass panels: bg-glass border border-glass-border rounded-xl p-8
• Maintain strong visual hierarchy.
• Avoid excessive nesting.

FRAMER MOTION RULES:

• Every major section must be wrapped in <motion.div>.
• Use this animation pattern only:

initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
viewport={{ once: true }}

• Use subtle hover animation for cards only.
• No complex animation logic.
• No AnimatePresence unless strictly necessary.

IMAGE RULES:

When using <Image />:
• Must include width and height.
• Use className="rounded-xl border border-glass-border"
• Use meaningful SaaS-related alt text.
• Do not dynamically generate image paths.

CONTENT STRUCTURE (REQUIRED):

1. Hero Section
2. The Problem (for businesses + students)
3. The Modern SaaS Solution
4. Technical Edge (Next.js, SEO, Automation, Infrastructure)
5. Why This Matters for Students
6. Future of Scalable Digital Businesses
7. Closing Insight (Vision-driven ending)

WRITING STYLE:
• Clear
• Confident
• Educational
• Inspiring
• Minimal fluff
• Premium tone

Make it feel like a modern SaaS blog from a company that builds:

• Scalable web systems
• SEO-driven platforms
• Automation pipelines
• Secure cloud infrastructure
• Futuristic UI experiences

Ensure:
• No hydration mismatch
• No invalid HTML nesting
• Fully MDX compatible
• Consistent design across all blogs

Output ONLY the MDX content.`}
                        </pre>
                        <button
                          type="button"
                          onClick={() => {
                            const text = `You are a senior React 19, Next.js 16, TailwindCSS v4, Framer Motion, and MDX expert.

Generate a premium SaaS blog post in PURE MDX format.

BRAND:
Kasauli Coder

TONE:
Professional, futuristic, expert, high-aesthetic, modern SaaS company.

AUDIENCE:
• Business owners
• Startup founders
• Tech decision-makers
• College students learning development, SEO, automation, and modern tech

STRICT OUTPUT RULES:

1. Output MUST be valid MDX.
2. NO imports.
3. NO exports.
4. NO frontmatter.
5. No author section.
6. No commentary.
7. No explanations outside the blog.
8. DO NOT wrap any block element inside <p>.
9. NEVER place:
   - <motion.div> inside <p>
   - <ul> inside <p>
   - <h2>/<h3> inside <p>
10. Use standard Markdown paragraph breaks (double newlines).
11. NEVER use manual <p> tags or wrap block elements in them.
12. Avoid dynamic JS expressions that may cause hydration mismatch.
13. Do not use Date, Math.random, window, or conditional rendering.
14. No client-only logic.
15. No forms.
16. No buttons.
17. No inline styles.
18. Do NOT use <div>. Only <motion.div> for containers.
19. Must not cause hydration errors in Next.js App Router.

ALLOWED ELEMENTS (BLOCK ONLY):

- <h2>
- <h3>
- <p>
- <ul>
- <li>
- <blockquote>
- <Image />
- <Link />
- <motion.div>

NO INLINE ELEMENTS:
• No <span>
• No nested inline wrappers

THEME SYSTEM (MANDATORY):

This project uses CSS variables mapped in Tailwind:

- bg-background
- text-foreground
- text-primary
- text-secondary
- bg-card
- bg-glass
- border-glass-border

You MUST:
• Use ONLY these theme-based classes.
• DO NOT hardcode any color (no hex codes, no text-cyan-500, etc.).
• Use text-primary instead of #06d6e0.
• Use text-secondary instead of #351ff4.
• Use bg-card or bg-glass instead of fixed backgrounds.
• Ensure compatibility with all themes (light, brand, dark-violet).

DESIGN SYSTEM:

• Main wrapper: max-w-4xl mx-auto space-y-12 px-6 py-16
• Headings: tracking-tight
• Paragraphs: leading-relaxed text-foreground/80
• Cards: bg-card border border-glass-border rounded-xl p-8
• Glass panels: bg-glass border border-glass-border rounded-xl p-8
• Maintain strong visual hierarchy.
• Avoid excessive nesting.

FRAMER MOTION RULES:

• Every major section must be wrapped in <motion.div>.
• Use this animation pattern only:

initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
viewport={{ once: true }}

• Use subtle hover animation for cards only.
• No complex animation logic.
• No AnimatePresence unless strictly necessary.

IMAGE RULES:

When using <Image />:
• Must include width and height.
• Use className="rounded-xl border border-glass-border"
• Use meaningful SaaS-related alt text.
• Do not dynamically generate image paths.

CONTENT STRUCTURE (REQUIRED):

1. Hero Section
2. The Problem (for businesses + students)
3. The Modern SaaS Solution
4. Technical Edge (Next.js, SEO, Automation, Infrastructure)
5. Why This Matters for Students
6. Future of Scalable Digital Businesses
7. Closing Insight (Vision-driven ending)

WRITING STYLE:
• Clear
• Confident
• Educational
• Inspiring
• Minimal fluff
• Premium tone

Make it feel like a modern SaaS blog from a company that builds:

• Scalable web systems
• SEO-driven platforms
• Automation pipelines
• Secure cloud infrastructure
• Futuristic UI experiences

Ensure:
• No hydration mismatch
• No invalid HTML nesting
• Fully MDX compatible
• Consistent design across all blogs

Output ONLY the MDX content.`;
                            copyToClipboard(text);
                          }}
                          className="absolute top-3 right-8 bg-primary/10 hover:bg-primary text-primary hover:text-primary-content p-2 rounded-xl transition-all"
                          title="Copy Prompt"
                        >
                          <span className="material-symbols-outlined text-sm">
                            content_copy
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {previewMode ? (
                <div className="glass-panel rounded-3xl min-h-125 p-8 relative border border-foreground/5 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[80px] pointer-events-none" />

                  {previewLoading && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}

                  <div className="prose prose-invert prose-lg max-w-none prose-headings:tracking-tighter prose-headings:font-black prose-p:leading-relaxed relative z-10">
                    {mdxSource ? (
                      <MDXRemote
                        {...mdxSource}
                        components={{
                          motion,
                          Link,
                          Image: SafeImage,
                          AnimatePresence,
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="size-20 bg-foreground/3 rounded-full flex items-center justify-center mb-6">
                          <span className="material-symbols-outlined text-4xl text-foreground/10">
                            design_services
                          </span>
                        </div>
                        <h4 className="text-xl font-black mb-2">
                          Visualizing Your Story
                        </h4>
                        <p className="text-sm text-foreground/30 max-w-xs mx-auto italic">
                          {blogData.content
                            ? "Resolving complex interactive blocks..."
                            : "Enter your story's blueprint to see it come to life."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-secondary/20 rounded-[26px] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                  <textarea
                    value={blogData.content}
                    onChange={(e) =>
                      setBlogData({
                        ...blogData,
                        content: e.target.value,
                      })
                    }
                    className="relative w-full bg-foreground/5 border border-foreground/10 rounded-3xl px-6 py-6 focus:border-primary outline-none transition-all text-sm font-mono leading-relaxed min-h-125"
                    required
                    placeholder="Start building with AI JSX code or standard Markdown..."
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-3 py-1 bg-background/50 rounded-lg border border-foreground/5 backdrop-blur-md">
                      JSX Editor
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 flex items-center justify-between border-t border-foreground/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 italic">
                Kasauli Coder Creative Studio v2.0
              </p>
              <button
                type="submit"
                disabled={submittingBlog}
                className="bg-primary text-primary-content font-black px-10 py-4 rounded-2xl hover:scale-105 transition-all shadow-2xl active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-3 shadow-primary/20"
              >
                <span className="material-symbols-outlined">
                  {editingBlog ? "update" : "send"}
                </span>
                {submittingBlog
                  ? "Synchronizing..."
                  : editingBlog
                    ? "Push Updates Live"
                    : "Initiate Story Publication"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

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
    updateView("blogs");
  };

  // Submitted Blogs State
  const [blogs, setBlogs] = useState<any[]>([]);
  const [fetchingBlogs, setFetchingBlogs] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

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
              <BlogEditorSection
                key={sidebarView + (editingBlog?._id || "new")}
                user={user}
                editingBlog={editingBlog}
                setEditingBlog={setEditingBlog}
                updateView={updateView}
                fetchBlogs={fetchBlogs}
              />
            )}

            {sidebarView === "submitted_blogs" && (
              <motion.div
                key="submitted_blogs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight">
                      Content Management
                    </h1>
                    <p className="text-foreground/50 font-medium">
                      Oversee your storytelling journey and track performance.
                    </p>
                  </div>
                  <button
                    onClick={() => updateView("blogs")}
                    className="bg-primary text-primary-content font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95 text-xs inline-flex items-center gap-2 w-fit"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add_circle
                    </span>
                    Create New Story
                  </button>
                </div>

                {/* Stats Overview */}
                {!fetchingBlogs && blogs.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      {
                        label: "Total Stories",
                        value: blogs.length,
                        icon: "analytics",
                        color: "primary",
                      },
                      {
                        label: "Published",
                        value: blogs.filter((b) => b.status === "active")
                          .length,
                        icon: "check_circle",
                        color: "emerald-500",
                      },
                      {
                        label: "Pending",
                        value: blogs.filter((b) => b.status === "pending")
                          .length,
                        icon: "pending",
                        color: "amber-500",
                      },
                      {
                        label: "Engagement",
                        value: "0.0k",
                        icon: "trending_up",
                        color: "secondary",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="glass-panel p-4 rounded-2xl border border-foreground/5"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`size-8 rounded-lg bg-${stat.color}/10 flex items-center justify-center text-${stat.color}`}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {stat.icon}
                            </span>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
                            {stat.label}
                          </span>
                        </div>
                        <p className="text-2xl font-black tracking-tight">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  {fetchingBlogs ? (
                    <div className="flex flex-col items-center justify-center py-24 glass-panel rounded-3xl border border-foreground/5">
                      <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest text-foreground/20">
                        Synchronizing Vault...
                      </p>
                    </div>
                  ) : blogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 glass-panel rounded-3xl border border-dashed border-foreground/10 text-center px-6">
                      <div className="size-20 bg-foreground/3 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-5xl text-foreground/10">
                          auto_stories
                        </span>
                      </div>
                      <h3 className="text-xl font-black mb-2">
                        Start Your Creative Journey
                      </h3>
                      <p className="text-sm text-foreground/40 mb-8 max-w-sm">
                        You haven't crafted any stories yet. The world is
                        waiting for your unique insights.
                      </p>
                      <button
                        onClick={() => updateView("blogs")}
                        className="bg-primary/10 text-primary border border-primary/20 px-8 py-3 rounded-2xl font-black hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5"
                      >
                        Publish First Blog
                      </button>
                    </div>
                  ) : (
                    blogs.map((blog) => (
                      <div
                        key={blog._id}
                        className="glass-card p-4 rounded-3xl flex flex-col md:flex-row gap-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-foreground/5 group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] pointer-events-none group-hover:bg-primary/10 transition-all" />

                        <div className="w-full md:w-48 aspect-[16/10] rounded-2xl overflow-hidden shrink-0 border border-foreground/5 relative">
                          <Image
                            src={blog.mainImageUrl}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                              Created{" "}
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center min-w-0 py-2">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full ${
                                blog.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
                                  : "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                              }`}
                            >
                              {blog.status}
                            </span>
                            <span className="size-1 bg-foreground/10 rounded-full" />
                            <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                              {blog.writtenBy || "Staff"}
                            </span>
                          </div>

                          <h3 className="text-xl font-black truncate group-hover:text-primary transition-colors mb-2 tracking-tight">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-foreground/40 line-clamp-2 font-medium leading-relaxed">
                            {blog.tagline}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center pr-2">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="size-12 flex items-center justify-center rounded-2xl bg-foreground/5 text-foreground/60 hover:bg-primary hover:text-white transition-all shadow-sm border border-foreground/5 group-hover:border-primary/20"
                            title="Refine Story"
                          >
                            <span className="material-symbols-outlined text-xl">
                              edit_note
                            </span>
                          </button>

                          {blog.status === "active" ? (
                            <Link
                              href={`/blogs/${blog.slug}`}
                              target="_blank"
                              className="size-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5 border border-primary/20"
                              title="Live Preview"
                            >
                              <span className="material-symbols-outlined text-xl">
                                open_in_new
                              </span>
                            </Link>
                          ) : (
                            <div
                              className="size-12 flex items-center justify-center rounded-2xl bg-foreground/5 text-foreground/20 cursor-not-allowed border border-foreground/2"
                              title="Approval Pending"
                            >
                              <span className="material-symbols-outlined text-xl">
                                hourglass_empty
                              </span>
                            </div>
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
