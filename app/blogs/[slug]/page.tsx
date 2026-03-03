"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import ReactMarkdown from "react-markdown";

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
        const res = await fetch(`/api/public/blogs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data.blog);
          setComments(data.comments);
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

  if (loading) {
    return (
      <div className="font-display bg-background text-foreground min-h-screen flex items-center justify-center">
        <GlobalHeader />
        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
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
    <div className="font-display bg-background text-foreground min-h-screen selection:bg-primary selection:text-primary-content">
      <GlobalHeader />

      <main className="pt-32 pb-24 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />

        <article className="max-w-4xl mx-auto relative z-10">
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
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              {blog.title}
            </h1>
            <p className="text-xl text-foreground/60 mb-8">{blog.tagline}</p>

            <div className="flex items-center gap-4 text-sm font-bold text-foreground/40 uppercase tracking-widest mb-12">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  person
                </span>
                {blog.authorId?.name || blog.writtenBy}
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  calendar_today
                </span>
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
            </div>

            {blog.mainImageUrl && (
              <div className="w-full aspect-video rounded-3xl overflow-hidden mb-16 border border-foreground/10 shadow-2xl relative">
                <Image
                  src={blog.mainImageUrl}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-headings:font-black prose-p:text-foreground/80 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-strong:text-foreground prose-code:text-primary">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
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
