import type { Metadata } from "next";
import InsightsArticles from "@/components/marketing/InsightsArticles";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Articles and insights on software development, SaaS, SEO and digital products from the KasauliCoder team.",
};

export default function BlogsPage() {
  return <InsightsArticles />;
}
