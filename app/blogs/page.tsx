import type { Metadata } from "next";
import InsightsArticles from "@/components/marketing/InsightsArticles";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Read the latest tech insights, tutorials, and success stories from the Kasauli Coder blog.",
};

export default function BlogsPage() {
  return <InsightsArticles />;
}
