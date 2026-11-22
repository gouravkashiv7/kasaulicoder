export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Blog from "@/backend/models/Blog";
import Comment from "@/backend/models/Comment";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Missing blog slug." },
        { status: 400 },
      );
    }

    await connectDB();

    // Superadmins can preview an inactive post before approving it
    const session = await getServerSession();
    const canPreview =
      session?.type === "admin" && session.role === "superadmin";

    // Fetch the blog post
    const blog = await Blog.findOne(
      canPreview ? { slug } : { slug, status: "active" },
    ).populate("authorId", "name image designation roleDescription");

    if (!blog) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    // Fetch approved comments for this blog post
    const comments = await Comment.find({
      blogId: blog._id,
      status: "approved",
    })
      .select("userName content createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({ blog, comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching single public blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
