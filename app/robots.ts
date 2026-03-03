import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/user/", "/member/", "/api/"],
    },
    sitemap: "https://kasaulicoder.com/sitemap.xml",
  };
}
