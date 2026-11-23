import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { rateLimit } from "@/backend/lib/rateLimit";
import Blog from "@/backend/models/Blog";
import Comment from "@/backend/models/Comment";

const MAX_COMMENT_LENGTH = 1000;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    if (!rateLimit(req, "blog-comment", 10, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many comments. Please try again later." },
        { status: 429 },
      );
    }

    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to comment." },
        { status: 401 },
      );
    }

    if (!session.id || !session.name) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid token structure." },
        { status: 401 },
      );
    }

    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { error: "Missing blog slug." },
        { status: 400 },
      );
    }

    const body = await req.json().catch(() => null);
    const content =
      typeof body?.content === "string" ? body.content.trim() : "";

    if (!content) {
      return NextResponse.json(
        { error: "Comment content cannot be empty." },
        { status: 400 },
      );
    }
    if (content.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json(
        {
          error: `Comment must be at most ${MAX_COMMENT_LENGTH} characters.`,
        },
        { status: 400 },
      );
    }

    await connectDB();

    const blog = await Blog.findOne({ slug, status: "active" });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found or inactive." },
        { status: 404 },
      );
    }

    const newComment = await Comment.create({
      blogId: blog._id,
      userId: session.id,
      userName: session.name,
      content,
      status: "approved", // Automatically approved for now
    });

    return NextResponse.json(
      {
        message: "Comment posted successfully.",
        comment: {
          _id: newComment._id,
          userName: newComment.userName,
          content: newComment.content,
          createdAt: newComment.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
