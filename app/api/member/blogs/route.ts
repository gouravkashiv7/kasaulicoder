import { NextResponse } from "next/server";
import Blog from "@/backend/models/Blog";
import connectDB from "@/backend/lib/db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove all non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove trailing hyphens
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Missing token." },
        { status: 401 },
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.id || !payload.role) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid token." },
        { status: 401 },
      );
    }

    await connectDB();

    // Fetch blogs authored by this specific member by their Staff ID
    const blogs = await Blog.find({ authorId: payload.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching member blogs:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

function sanitizeMdx(content: string) {
  return content
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n")
    .replace(/(<motion\.div|<Image|<Link|#{1,6}\s|>\n)/g, "\n$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Missing token." },
        { status: 401 },
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.id || !payload.role) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid token." },
        { status: 401 },
      );
    }

    await connectDB();

    const body = await req.json();
    const {
      title,
      mainImageUrl,
      tagline,
      description,
      content,
      slug: userSlug,
    } = body;

    // All fields are mandatory except slug
    if (!title || !mainImageUrl || !tagline || !description || !content) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. Title, Image, Tagline, Description, and Content are all mandatory.",
        },
        { status: 400 },
      );
    }

    // Sanitize MDX content
    const sanitizedContent = sanitizeMdx(content);

    // Fetch the staff member to get their official name
    const Staff = (await import("@/backend/models/Staff")).default;
    const staff = await Staff.findById(payload.id);
    if (!staff) {
      return NextResponse.json({ error: "Staff not found." }, { status: 404 });
    }

    // Auto-generate slug if not provided
    let slug = userSlug?.trim() ? createSlug(userSlug) : createSlug(title);

    // Check if slug already exists to prevent duplicate key errors
    let existingBlog = await Blog.findOne({ slug });
    let counter = 1;
    const originalSlug = slug;
    while (existingBlog) {
      slug = `${originalSlug}-${counter}`;
      existingBlog = await Blog.findOne({ slug });
      counter++;
    }

    console.log("Creating blog with Author ID:", payload.id);
    const newBlog = await Blog.create({
      title,
      slug,
      mainImageUrl,
      tagline,
      description,
      content: sanitizedContent,
      authorId: payload.id, // Save the Staff ID
      writtenBy: staff.name, // Save the official name from DB
      status: "inactive", // Always inactive by default for moderation
    });
    console.log("New blog created. authorId in object:", newBlog.authorId);

    return NextResponse.json(
      {
        message: "Blog drafted successfully. Awaiting admin approval.",
        blog: newBlog,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
