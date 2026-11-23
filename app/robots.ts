import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Staff photos appear on public pages
      allow: ["/", "/api/public/staff/"],
      disallow: ["/admin/", "/user/", "/member/", "/api/"],
    },
    sitemap: "https://kasaulicoder.com/sitemap.xml",
  };
}
