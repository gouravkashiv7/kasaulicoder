import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Blog from "@/backend/models/Blog";
import BlogContent from "@/components/blogs/BlogContent";

// Live posts are public; superadmins can also preview inactive ones.
async function findViewableBlog(slug: string) {
  await connectDB();
  const session = await getServerSession();
  const canPreview = session?.type === "admin" && session.role === "superadmin";
  return Blog.findOne(canPreview ? { slug } : { slug, status: "active" });
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const blog = await findViewableBlog(params.slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.tagline || blog.description?.substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.tagline || blog.description?.substring(0, 160),
      images: blog.mainImageUrl ? [blog.mainImageUrl] : [],
    },
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  if (!(await findViewableBlog(params.slug))) notFound();
  return <BlogContent slug={params.slug} />;
}
