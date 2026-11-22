import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Program from "@/backend/models/Program";

async function checkAuth() {
  const session = await getServerSession();

  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }

  if (session.role !== "superadmin") {
    return { error: "Access denied", status: 403 };
  }

  return { session };
}

export async function GET() {
  try {
    const auth = await checkAuth();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await connectDB();
    const programs = await Program.find({}).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await checkAuth();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const {
      name,
      tagline,
      description,
      image,
      features,
      isActive,
      isVisible,
      sortOrder,
    } = await req.json();

    if (!name || !tagline || !description || !image) {
      return NextResponse.json(
        { error: "Name, tagline, description, and image are required" },
        { status: 400 },
      );
    }

    // Validate image size (max 500KB) if it's base64
    if (image.startsWith("data:image")) {
      const base64Data = image.split(",")[1];
      if (base64Data) {
        const buffer = Buffer.from(base64Data, "base64");
        if (buffer.length > 500 * 1024) {
          return NextResponse.json(
            { error: "Image size exceeds the 500KB limit." },
            { status: 400 },
          );
        }
      }
    }

    await connectDB();
    const newProgram = await Program.create({
      name,
      tagline,
      description,
      image,
      features,
      isActive,
      isVisible,
      sortOrder,
    });

    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Fields an admin may change on an existing program
const UPDATABLE_PROGRAM_FIELDS = [
  "name",
  "tagline",
  "description",
  "image",
  "features",
  "isActive",
  "isVisible",
  "sortOrder",
] as const;

export async function PUT(req: Request) {
  try {
    const auth = await checkAuth();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { _id } = body;
    const updateData: Record<string, unknown> = {};
    for (const key of UPDATABLE_PROGRAM_FIELDS) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    if (!_id) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 },
      );
    }

    // Validate image size (max 500KB) if it's base64
    const image = updateData.image;
    if (typeof image === "string" && image.startsWith("data:image")) {
      const base64Data = image.split(",")[1];
      if (base64Data) {
        const buffer = Buffer.from(base64Data, "base64");
        if (buffer.length > 500 * 1024) {
          return NextResponse.json(
            { error: "Image size exceeds the 500KB limit." },
            { status: 400 },
          );
        }
      }
    }

    await connectDB();
    const updatedProgram = await Program.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProgram);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await checkAuth();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 },
      );
    }

    await connectDB();
    const deletedProgram = await Program.findByIdAndDelete(id);

    if (!deletedProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
