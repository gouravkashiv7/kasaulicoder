import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Blog from "@/backend/models/Blog";
import Comment from "@/backend/models/Comment";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to comment." },
        { status: 401 },
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.id || !payload.name) {
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
      userId: payload.id,
      userName: payload.name,
      content: content.trim(),
      status: "approved", // Automatically approved for now
    });

    return NextResponse.json(
      { message: "Comment posted successfully.", comment: newComment },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error posting comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
