import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Project from "@/backend/models/Project";
import "@/backend/models/Staff"; // Ensure schema registration

// Update (PUT)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const body = await req.json();

    if (id) {
      const updatedProject = await Project.findByIdAndUpdate(id, body, {
        new: true,
      });
      return NextResponse.json(updatedProject, { status: 200 });
    }

    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}

// Delete (DELETE)
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
