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
    if (!payload.id || payload.role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden. Superadmin access required." },
        { status: 403 },
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing blog ID." }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (status !== "active" && status !== "inactive") {
      return NextResponse.json(
        { error: "Invalid status. Must be 'active' or 'inactive'." },
        { status: 400 },
      );
    }

    await connectDB();

    const blog = await Blog.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: `Blog status updated to ${status}`,
        blog,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating blog status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
