import InsightsArticles from "@/components/marketing/InsightsArticles";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Read the latest tech insights, tutorials, and success stories from the Kasauli Coder blog.",
};

export default function BlogsPage() {
  return <InsightsArticles />;
}
