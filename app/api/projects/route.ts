import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import "@/backend/models/Staff";
import { getServerSession } from "@/backend/lib/auth";
import { pickProjectFields, slugifyProject } from "@/backend/lib/projectFields";
import { getShowcaseProjects } from "@/backend/lib/showcase";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession();

    // Visitors and customers only get what the public showcase shows
    if (!session || session.type !== "admin") {
      return NextResponse.json(await getShowcaseProjects(), { status: 200 });
    }

    let query = {};
    if (session.role !== "superadmin") {
      query = { members: session.id };
    }

    const projects = await Project.find(query)
      .populate("members", "name image designation")
      .sort({ createdAt: -1 });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
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

    const requested =
      typeof body.slug === "string" ? slugifyProject(body.slug) : "";
    const baseSlug =
      requested ||
      slugifyProject(`${title}-${desc?.substring(0, 20) || ""}`) ||
      `project-${Date.now()}`;

    // Append a counter until the slug is free, as blogs do
    let slug = baseSlug;
    let counter = 1;
    while (await Project.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProject = await Project.create({ ...body, slug });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("API POST Project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
