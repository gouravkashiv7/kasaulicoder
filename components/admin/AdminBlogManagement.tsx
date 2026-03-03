"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Blog } from "./types";

const AdminBlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const toggleStatus = async (blogId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setUpdatingId(blogId);

    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBlogs(
          blogs.map((blog) =>
            blog._id === blogId ? { ...blog, status: newStatus } : blog,
          ),
        );
      } else {
        console.error("Failed to update blog status");
      }
    } catch (err) {
      console.error("Error updating blog status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">Blog Management ({blogs.length})</h2>
      </div>

      <div className="bg-background/40 border border-foreground/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 font-black">
                <th className="px-6 py-4 font-black">Image & Title</th>
                <th className="px-6 py-4 font-black">Author</th>
                <th className="px-6 py-4 font-black">Submitted</th>
                <th className="px-6 py-4 font-black text-center">Status</th>
                <th className="px-6 py-4 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 text-sm font-medium">
              {blogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-foreground/50"
                  >
                    No blogs found. Wait for staff members to draft them.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-foreground/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-lg overflow-hidden shrink-0 border border-foreground/10">
                          {blog.mainImageUrl ? (
                            <Image
                              src={blog.mainImageUrl}
                              alt={blog.title}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-foreground/5 flex items-center justify-center">
                              <span className="material-symbols-outlined text-foreground/30 text-base">
                                image
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground line-clamp-1">
                            {blog.title}
                          </p>
                          <p className="text-xs text-foreground/50 mt-0.5 font-mono">
                            /{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {blog.writtenBy}
                    </td>
                    <td className="px-6 py-4 text-foreground/50 text-xs font-mono">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                          blog.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleStatus(blog._id, blog.status)}
                        disabled={updatingId === blog._id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                          blog.status === "active"
                            ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                        }`}
                      >
                        {updatingId === blog._id
                          ? "Saving..."
                          : blog.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogManagement;
