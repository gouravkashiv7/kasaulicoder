import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kasaulicoder.com";
  const lastModified = new Date();

  const routes = [
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
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
