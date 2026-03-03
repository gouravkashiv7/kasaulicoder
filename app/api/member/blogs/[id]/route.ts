export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Blog from "@/backend/models/Blog";
import connectDB from "@/backend/lib/db";
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

    // Strip <p> tags from content to prevent nested <p> hydration errors in MDX
    const stripParagraphTags = (text: string) => {
      return text
        .replace(/<p[^>]*>/gi, "")
        .replace(/<\/p>/gi, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    };

    // Update fields
    if (title !== undefined) {
      blog.title = title;
      blog.markModified("title");
    }
    if (mainImageUrl !== undefined) {
      blog.mainImageUrl = mainImageUrl;
      blog.markModified("mainImageUrl");
    }
    if (tagline !== undefined) {
      blog.tagline = tagline;
      blog.markModified("tagline");
    }
    if (description !== undefined) {
      blog.description = description;
      blog.markModified("description");
    }
    if (content !== undefined) {
      const cleaned = stripParagraphTags(content);
      console.log("Setting content. Length:", cleaned.length);
      blog.content = cleaned;
      blog.markModified("content");
    }

    // Slug update logic
    let finalSlug = blog.slug;
    if (userSlug?.trim()) {
      finalSlug = createSlug(userSlug);
    } else if (userSlug === "" || !blog.slug) {
      // Auto-generate if slug is empty or missing
      finalSlug = createSlug(blog.title);
    }

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

    // Always use the official name from DB
    blog.writtenBy = staff.name;

    // Ensure authorId is set (for older blogs being edited)
    blog.authorId = payload.id;

    console.log("Saving blog updates for:", blog.title);
    console.log(
      "Updated content length:",
      content?.length || blog.content.length,
    );

    await blog.save();

    const response = NextResponse.json({
      message:
        blog.status === "active"
          ? "Blog updated successfully. Changes are live!"
          : "Blog updated successfully. Awaiting approval.",
      blog,
    });

    // Disable caching for these responses
    response.headers.set(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate",
    );
    return response;
  } catch (error: any) {
    console.error("Error updating member blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
