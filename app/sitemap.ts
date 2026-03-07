import { MetadataRoute } from "next";
import connectDB from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import Blog from "@/backend/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kasaulicoder.com";
  const lastModified = new Date();

  await connectDB();

  // Static routes
  const staticRoutes = [
    "",
    "/programs",
    "/projects",
    "/blogs",
    "/pricing",
    "/about",
    "/contact",
    "/careers",
    "/privacy",
    "/terms",
    "/register",
    "/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic Project Routes (Active)
  const activeProjects = await Project.find(
    { status: "active" },
    "slug updatedAt",
  );
  const activeProjectRoutes = activeProjects.map((p) => ({
    url: `${baseUrl}/projects/active-projects/${p.slug}`,
    lastModified: p.updatedAt || lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Project Routes (Recent/Past)
  const recentProjects = await Project.find(
    { status: "past" },
    "slug updatedAt",
  );
  const recentProjectRoutes = recentProjects.map((p) => ({
    url: `${baseUrl}/projects/recent-projects/${p.slug}`,
    lastModified: p.updatedAt || lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic Blog Routes
  const blogs = await Blog.find({ status: "active" }, "slug updatedAt");
  const blogRoutes = blogs.map((b) => ({
    url: `${baseUrl}/blogs/${b.slug}`,
    lastModified: b.updatedAt || lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...activeProjectRoutes,
    ...recentProjectRoutes,
    ...blogRoutes,
  ];
}
