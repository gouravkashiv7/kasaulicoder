import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Blog from "@/backend/models/Blog";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      mainImageUrl,
      tagline,
      description,
      content,
      slug: userSlug,
    } = body;

    await connectDB();

    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Security check: Only the author can edit their own blog
    // Use String() for comparison as blog.authorId is an ObjectId
    if (String(blog.authorId) !== payload.id) {
      return NextResponse.json(
        { error: "Forbidden. You can only edit your own blogs." },
        { status: 403 },
      );
    }

    // Fetch the staff member to get their official name
    const Staff = (await import("@/backend/models/Staff")).default;
    const staff = await Staff.findById(payload.id);
    if (!staff) {
      return NextResponse.json({ error: "Staff not found." }, { status: 404 });
    }

    // Function to create slug
    const createSlug = (title: string) => {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove all non-word chars
        .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ""); // Remove trailing hyphens
    };

    // Update fields
    if (title) blog.title = title;
    if (mainImageUrl) blog.mainImageUrl = mainImageUrl;
    if (tagline) blog.tagline = tagline;
    if (description) blog.description = description;
    if (content) blog.content = content;

    // Slug update logic
    if (userSlug) {
      let finalSlug = createSlug(userSlug);
      // Only check for duplicates if the slug has actually changed
      if (finalSlug !== blog.slug) {
        let existingBlog = await Blog.findOne({ slug: finalSlug });
        let counter = 1;
        const originalSlug = finalSlug;
        while (existingBlog) {
          finalSlug = `${originalSlug}-${counter}`;
          existingBlog = await Blog.findOne({ slug: finalSlug });
          counter++;
        }
        blog.slug = finalSlug;
      }
    }

    // Always use the official name from DB
    blog.writtenBy = staff.name;

    // Ensure authorId is set (for older blogs being edited)
    blog.authorId = payload.id;

    // Reset status to inactive if content changed, or keep it for moderation
    blog.status = "inactive";

    await blog.save();

    return NextResponse.json({
      message: "Blog updated successfully. Awaiting re-approval.",
      blog,
    });
  } catch (error: any) {
    console.error("Error updating member blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
