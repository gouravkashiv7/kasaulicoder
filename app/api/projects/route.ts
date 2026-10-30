import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import "@/backend/models/Staff";
import { getServerSession } from "@/backend/lib/auth";
import { pickProjectFields } from "@/backend/lib/projectFields";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession();

    let query = {};
    if (session && session.type === "admin" && session.role !== "superadmin") {
      query = { members: session.id };
    }

    const projects = await Project.find(query)
      .populate("members", "name image designation")
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
    const session = await getServerSession();
    if (!session || session.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectDB();

    const body = pickProjectFields(await req.json());
    const { title, desc } = body as { title?: string; desc?: string };

    // Optional slug generation block for custom creations
    const baseSlug = `${title}-${desc?.substring(0, 20) || ""}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

    const newProject = await Project.create({
      ...body,
      slug: (body as any).slug || slug,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error("API POST Project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
