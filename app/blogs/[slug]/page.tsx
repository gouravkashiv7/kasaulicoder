import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { staffImageUrl } from "@/backend/lib/staffImage";
import Blog from "@/backend/models/Blog";
import Comment from "@/backend/models/Comment";
import "@/backend/models/Staff";
import BlogContent, {
  type BlogType,
  type CommentType,
} from "@/components/blogs/BlogContent";

// Live posts are public; superadmins can also preview inactive ones.
// cache() lets generateMetadata and the page share one database query.
const findViewableBlog = cache(async (slug: string) => {
  await connectDB();
  const session = await getServerSession();
  const canPreview = session?.type === "admin" && session.role === "superadmin";
  return Blog.findOne(canPreview ? { slug } : { slug, status: "active" })
    .populate("authorId", "name image designation roleDescription isActive")
    .lean();
});

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
  const blog = await findViewableBlog(params.slug);
  if (!blog) notFound();

  const comments = await Comment.find({
    blogId: blog._id,
    status: "approved",
  })
    .select("userName content createdAt")
    .sort({ createdAt: -1 })
    .lean();

  // Plain JSON so ObjectIds and Dates can cross into the client component.
  const plainBlog: BlogType = JSON.parse(JSON.stringify(blog));
  if (plainBlog.authorId) {
    const author = blog.authorId as unknown as {
      _id: unknown;
      image?: string;
      isActive?: boolean;
    };
    // Keep a former member's byline, but their photo is no longer served
    plainBlog.authorId.image =
      author.isActive === false
        ? undefined
        : staffImageUrl(author._id, author.image);
  }

  return (
    <BlogContent
      slug={params.slug}
      blog={plainBlog}
      initialComments={JSON.parse(JSON.stringify(comments)) as CommentType[]}
    />
  );
}
