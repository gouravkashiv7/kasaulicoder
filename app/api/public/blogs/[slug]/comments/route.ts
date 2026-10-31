import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Blog from "@/backend/models/Blog";
import Comment from "@/backend/models/Comment";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
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

    const body = await req.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content cannot be empty." },
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
      content: content.trim(),
      status: "approved", // Automatically approved for now
    });

    return NextResponse.json(
      { message: "Comment posted successfully.", comment: newComment },
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
