"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

const InsightsArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/public/blogs");
        if (res.ok) {
          const data = await res.json();
          setArticles(data.blogs);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="font-display bg-background text-foreground min-h-screen selection:bg-primary selection:text-background">
      <GlobalHeader />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Blogs from the <span className="text-primary italic">Edge</span>
            </h1>
            <p className="text-foreground/60 text-xl max-w-2xl mx-auto">
              Deep dives into engineering, AI integration, and the future of web
              architecture.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-12">
              {articles.map((article, i) => (
                <Link href={`/blogs/${article.slug}`} key={article._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group cursor-pointer h-full glass-card hover:border-primary/30 transition-all rounded-2xl p-4 flex flex-col"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-6 border border-foreground/10 shadow-lg">
                      {article.mainImageUrl ? (
                        <Image
                          src={article.mainImageUrl}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-foreground/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-foreground/20">
                            image
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase border border-primary/30 tracking-widest">
                        Article
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-foreground/50 text-sm leading-relaxed mb-6 line-clamp-3">
                        {article.tagline}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-foreground/40 font-bold uppercase tracking-widest pt-4 border-t border-foreground/5">
                      <span className="truncate max-w-30">
                        {article.authorId?.name || article.writtenBy}
                      </span>
                      <span>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
              {articles.length === 0 && !loading && (
                <div className="col-span-full text-center py-20 text-foreground/30 font-medium">
                  No blogs have been published yet. Check back soon!
                </div>
              )}
            </div>
          )}

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-32 p-12 rounded-3xl glass-panel text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-glow-radial opacity-20 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4 underline decoration-primary/30 underline-offset-8">
                Stay Ahead of the Curve
              </h2>
              <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
                Get monthly deep dives on AI workflows and production-level
                engineering strategies delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background/50 border border-foreground/10 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-foreground/30"
                />
                <button className="bg-primary text-primary-content font-black px-8 py-4 rounded-xl hover:shadow-[0_0_20px_var(--primary)] transition-all">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <div className="mt-24">
        <GlobalFooter />
      </div>
    </div>
  );
};

export default InsightsArticles;
