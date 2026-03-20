export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Blog from "@/backend/models/Blog";
import Staff from "@/backend/models/Staff";


export async function GET() {
  try {
    await connectDB();

    // Only fetch active blogs for the public, sorted by newest
    const blogs = await Blog.find({ status: "active" })
      .sort({ createdAt: -1 })
      .select("-content")
      .populate("authorId", "name image");

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching public blogs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
