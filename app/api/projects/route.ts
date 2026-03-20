import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import "@/backend/models/Staff";
import { getServerSession } from "@/backend/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession();

    let query = {};
    if (session && session.type === "admin" && session.role !== "superadmin") {
      query = { members: session.id };
    }

    const projects = await Project.find(query)
      .populate("members", "name image designation email")
      .sort({ createdAt: -1 });

    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error("API GET Projects error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, desc } = body;

    // Optional slug generation block for custom creations
    const baseSlug = `${title}-${desc?.substring(0, 20) || ""}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

    const newProject = await Project.create({
      ...body,
      slug: body.slug || slug,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error("API POST Project error:", error);
    return NextResponse.json(
      { error: "Failed to create project", details: error.message },
      { status: 500 },
    );
  }
}
