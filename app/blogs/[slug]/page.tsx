"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { BackgroundPaths } from "@/components/ui/background-paths";
import UniqueLoading from "@/components/ui/morph-loading";

type CommentType = {
  _id: string;
  userName: string;
  content: string;
  createdAt: string;
};

type BlogType = {
  _id: string;
  title: string;
  slug: string;
  mainImageUrl: string;
  tagline: string;
  description: string;
  content: string;
  writtenBy: string;
  authorId?: {
    name: string;
    image?: string;
    designation?: string;
  };
  createdAt: string;
};

const BlogPostPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<BlogType | null>(null);
  const [jsxSource, setJsxSource] = useState<any>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        const res = await fetch(`/api/public/blogs/${slug}?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data.blog);
          setComments(data.comments);

          // If there's content, serialize it for MDXRemote
          if (data.blog?.content) {
            const mdxSource = await serialize(data.blog.content);
            setJsxSource(mdxSource);
          }
        } else {
          setError("Blog not found.");
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("An error occurred while loading the blog.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingComment(true);
    setCommentError("");

    try {
      const res = await fetch(`/api/public/blogs/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await res.json();

      if (res.ok) {
        setComments([data.comment, ...comments]);
        setNewComment("");
      } else {
        setCommentError(data.error || "Failed to post comment");
      }
    } catch (err) {
      setCommentError("An error occurred");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Safe Image wrapper for MDX to prevent missing width/height crashes
  const SafeImage = (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    if (!props.src) return null;
    if (!props.width || !props.height) {
      return (
        <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-foreground/10 my-8 bg-foreground/5">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
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

  if (loading) {
    return (
      <div className="font-display text-foreground min-h-screen">
        <GlobalHeader />
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
          <UniqueLoading variant="morph" size="lg" />
          <p className="text-primary font-black text-sm tracking-[0.3em] uppercase animate-pulse">
            Loading Article
          </p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="font-display bg-background text-foreground min-h-screen flex flex-col items-center justify-center">
        <GlobalHeader />
        <h1 className="text-4xl font-black mb-4">Oops!</h1>
        <p className="text-foreground/60 mb-8">{error || "Blog not found"}</p>
        <Link
          href="/blogs"
          className="bg-primary/10 text-primary border border-primary/20 px-6 py-2 rounded-xl font-bold hover:bg-primary/20 transition-colors"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="font-display text-foreground min-h-screen selection:bg-primary selection:text-primary-content relative">
      <GlobalHeader />

      <BackgroundPaths />
      <main className="pt-32 pb-24 px-6 relative">
        <article className="max-w-7xl mx-auto relative z-10 px-4 md:px-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition-opacity uppercase tracking-widest text-xs"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Blogs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-5xl">
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                {blog.title}
              </h1>
              <p className="text-xl text-foreground/60 mb-10 leading-relaxed font-medium">
                {blog.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-12">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black border border-primary/20 overflow-hidden shadow-sm">
                  {blog.authorId?.image ? (
                    <Image
                      src={blog.authorId.image}
                      alt={blog.authorId.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    (blog.authorId?.name || blog.writtenBy)
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
                    Written By
                  </span>
                  <span className="font-bold text-foreground/80">
                    {blog.authorId?.name || blog.writtenBy}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-6 border-l border-foreground/10">
                <div className="size-12 bg-foreground/5 rounded-full flex items-center justify-center text-foreground/40 border border-foreground/5">
                  <span className="material-symbols-outlined text-xl">
                    calendar_today
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
                    Published On
                  </span>
                  <span className="font-bold text-foreground/80 font-mono">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-headings:font-black prose-p:text-foreground/80 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-strong:text-foreground prose-code:text-primary">
              {jsxSource ? (
                <MDXRemote
                  {...jsxSource}
                  components={{
                    motion,
                    Link,
                    Image: SafeImage,
                    AnimatePresence,
                    p: (props: any) => (
                      <div
                        className="leading-relaxed text-foreground/80 mb-4"
                        {...props}
                      />
                    ),
                  }}
                />
              ) : (
                <p className="text-foreground/40 italic">
                  Parsing interactive content...
                </p>
              )}
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 pt-16 border-t border-foreground/10"
          >
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">
                forum
              </span>
              Discuss
            </h2>

            <form
              onSubmit={handleCommentSubmit}
              className="mb-12 glass-panel p-6 rounded-2xl"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-4">
                Leave a comment
              </h3>
              {commentError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-xl mb-4 text-sm font-bold">
                  {commentError}
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts... (Must be logged in)"
                className="w-full bg-background/50 border border-foreground/10 rounded-xl p-4 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors min-h-30 mb-4"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="bg-primary text-primary-content font-black px-6 py-2 rounded-xl hover:shadow-[0_0_15px_var(--primary)] transition-all disabled:opacity-50"
                >
                  {submittingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-foreground/30 italic text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black border border-primary/20">
                          {comment.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground/80">
                          {comment.userName}
                        </span>
                      </div>
                      <span className="text-xs text-foreground/30 font-mono">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-foreground/60 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        </article>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default BlogPostPage;
