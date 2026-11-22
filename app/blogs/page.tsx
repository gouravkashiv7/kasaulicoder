import type { Metadata } from "next";
import connectDB from "@/backend/lib/db";
import Blog from "@/backend/models/Blog";
import "@/backend/models/Staff";
import InsightsArticles, {
  type Article,
} from "@/components/marketing/InsightsArticles";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Articles and insights on software development, SaaS, SEO and digital products from the KasauliCoder team.",
};

// Rendered on the server so articles are in the first HTML response;
// re-read from the database at most once a minute.
export const revalidate = 60;

async function getPublicBlogs(): Promise<Article[]> {
  try {
    await connectDB();
    const blogs = await Blog.find({ status: "active" })
      .sort({ createdAt: -1 })
      .select("-content")
      .populate("authorId", "name image")
      .lean();
    // Plain JSON so ObjectIds and Dates can cross into the client component.
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("Error fetching public blogs:", error);
    return [];
  }
}

export default async function BlogsPage() {
  return <InsightsArticles articles={await getPublicBlogs()} />;
}
