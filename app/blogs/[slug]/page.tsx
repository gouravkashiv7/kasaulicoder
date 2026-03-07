import React from "react";
import connectDB from "@/backend/lib/db";
import Blog from "@/backend/models/Blog";
import BlogContent from "@/components/blogs/BlogContent";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  await connectDB();

  const blog = await Blog.findOne({
    slug: params.slug,
    status: "active",
  });

  if (!blog) {
    return {
      title: "Blog Not Found | Kasauli Coder",
    };
  }

  return {
    title: `${blog.title} | Kasauli Coder Blog`,
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
  return <BlogContent slug={params.slug} />;
}
