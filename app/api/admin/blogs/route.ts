import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Blog from "@/backend/models/Blog";

export async function GET(_req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Missing token." },
        { status: 401 },
      );
    }

    if (!session.id || session.role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden. Superadmin access required." },
        { status: 403 },
      );
    }

    await connectDB();

    // Fetch all blogs, sorting by newest first
    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin blogs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
