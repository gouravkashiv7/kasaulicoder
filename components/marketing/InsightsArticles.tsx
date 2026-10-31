"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import GlobalFooter from "@/components/layout/GlobalFooter";
import GlobalHeader from "@/components/layout/GlobalHeader";
import PageLoading from "@/components/ui/page-loading";

type ViewType = "grid" | "list";

const InsightsArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<ViewType>("grid");

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

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [articles, searchQuery]);

  const featuredArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text ? text.split(/\s+/).length : 0;
    return Math.ceil(words / wordsPerMinute) + 2;
  };

  if (loading) {
    return (
      <PageLoading
        title="Loading Blogs"
        subtitle="Fetching latest insights..."
      />
    );
  }

  return (
    <div className="font-display text-foreground min-h-screen selection:bg-primary selection:text-background">
      <GlobalHeader />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter">
                INSIGHTS
                <br />
                <span className="text-primary italic">FROM THE EDGE</span>
              </h1>
              <p className="text-foreground/60 text-xl max-w-2xl mx-auto mb-10">
                Deep dives into engineering, AI integration, and the future of
                web architecture.
              </p>

              {/* Search and Layout Toggle */}
              <div className="flex flex-col items-center gap-8">
                <div className="flex items-center w-full max-w-2xl gap-4">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all rounded-full px-1" />
                    <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-glass-border p-1 rounded-2xl">
                      <span className="material-symbols-outlined ml-4 text-foreground/40">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-lg outline-none placeholder:text-foreground/30"
                      />
                    </div>
                  </div>

                  <div className="flex bg-card/50 backdrop-blur-xl border border-glass-border p-1 rounded-2xl shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewType("grid")}
                      className={`size-12 flex items-center justify-center rounded-xl transition-all ${
                        viewType === "grid"
                          ? "bg-primary text-primary-content shadow-[0_0_15px_var(--primary)]"
                          : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        grid_view
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewType("list")}
                      className={`size-12 flex items-center justify-center rounded-xl transition-all ${
                        viewType === "list"
                          ? "bg-primary text-primary-content shadow-[0_0_15px_var(--primary)]"
                          : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        view_list
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          {filteredArticles.length > 0 ? (
            <>
              {/* Featured Hero (Visible when not searching and in grid mode) */}
              {viewType === "grid" && featuredArticle && searchQuery === "" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-16 rounded-3xl overflow-hidden glass-panel group relative"
                >
                  <Link
                    href={`/blogs/${featuredArticle.slug}`}
                    className="grid md:grid-cols-2 gap-0 overflow-hidden"
                  >
                    <div className="relative aspect-auto md:aspect-auto overflow-hidden">
                      <Image
                        src={featuredArticle.mainImageUrl}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent md:hidden" />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/30">
                          Featured
                        </span>
                        <span className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                          {calculateReadingTime(featuredArticle.content || "")}{" "}
                          Min Read
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black mb-6 group-hover:text-primary transition-colors leading-[1.1]">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-foreground/60 text-lg mb-8 line-clamp-3">
                        {featuredArticle.tagline}
                      </p>
                      <div className="mt-auto flex items-center gap-4">
                        <div className="size-10 rounded-full bg-primary/20 border border-primary/30 overflow-hidden relative">
                          {featuredArticle.authorId?.image ? (
                            <Image
                              src={featuredArticle.authorId.image}
                              alt={featuredArticle.authorId.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                              {featuredArticle.authorId?.name?.charAt(0) || "K"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {featuredArticle.authorId?.name ||
                              featuredArticle.writtenBy}
                          </p>
                          <p className="text-[10px] text-foreground/40 uppercase font-black tracking-widest">
                            {new Date(
                              featuredArticle.createdAt,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid or List View */}
              <div
                className={
                  viewType === "grid"
                    ? "grid md:grid-cols-3 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {(viewType === "list" || searchQuery !== ""
                    ? filteredArticles
                    : remainingArticles
                  ).map((article, i) => (
                    <motion.div
                      key={article._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={`/blogs/${article.slug}`}>
                        <div
                          className={`group glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all flex ${
                            viewType === "grid"
                              ? "flex-col h-full"
                              : "flex-col md:flex-row h-full min-h-50"
                          }`}
                        >
                          <div
                            className={`relative overflow-hidden shrink-0 ${
                              viewType === "grid"
                                ? "aspect-video w-full"
                                : "aspect-video md:aspect-16/10 md:w-80"
                            }`}
                          >
                            <Image
                              src={article.mainImageUrl}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div
                            className={`p-6 flex-1 flex flex-col ${
                              viewType === "list" ? "justify-center" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-black uppercase text-primary tracking-widest px-2 py-0.5 bg-primary/10 rounded-full">
                                {article.tagline.split(" ")[0] || "Tech"}
                              </span>
                              <span className="text-[10px] font-bold text-foreground/40 uppercase">
                                {calculateReadingTime(article.content || "")}{" "}
                                MIN READ
                              </span>
                            </div>
                            <h3
                              className={`${
                                viewType === "grid"
                                  ? "text-xl"
                                  : "text-xl md:text-2xl"
                              } font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight`}
                            >
                              {article.title}
                            </h3>
                            <p className="text-foreground/50 text-sm line-clamp-3 mb-6 flex-1">
                              {article.tagline}
                            </p>
                            <div className="pt-4 border-t border-glass-border flex items-center gap-3">
                              <div className="size-8 rounded-full bg-primary/10 border border-primary/20 overflow-hidden relative">
                                {article.authorId?.image ? (
                                  <Image
                                    src={article.authorId.image}
                                    alt={article.authorId.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-primary text-[10px] font-bold">
                                    {article.authorId?.name?.charAt(0) || "K"}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">
                                  {article.authorId?.name || article.writtenBy}
                                </p>
                                <p className="text-[9px] text-foreground/40 uppercase font-black">
                                  {new Date(
                                    article.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              {viewType === "list" && (
                                <span className="material-symbols-outlined text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                  arrow_forward
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredArticles.length === 0 && (
                <div className="py-32 text-center">
                  <div className="material-symbols-outlined text-6xl text-foreground/10 mb-6">
                    search_off
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No articles found</h3>
                  <p className="text-foreground/50">
                    Try adjusting your search to find what you're looking for.
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>

      <div className="mt-24">
        <GlobalFooter />
      </div>
    </div>
  );
};

export default InsightsArticles;
