import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Blog from "@/backend/models/Blog";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

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
    if (!payload.id || payload.role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden. Superadmin access required." },
        { status: 403 },
      );
    }

    await connectDB();

    // Fetch all blogs, sorting by newest first
    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching admin blogs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
