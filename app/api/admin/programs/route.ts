import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Program from "@/backend/models/Program";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  const { payload } = await jwtVerify(token, JWT_SECRET);

  if (payload.role !== "superadmin") {
    return { error: "Access denied", status: 403 };
  }

  return { payload };
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await checkAuth();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { name, tagline, description, image, features, isActive, sortOrder } =
      await req.json();

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
      sortOrder,
    });

    return NextResponse.json(newProgram, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await checkAuth();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { _id, ...updateData } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 },
      );
    }

    // Validate image size (max 500KB) if it's base64
    if (updateData.image && updateData.image.startsWith("data:image")) {
      const base64Data = updateData.image.split(",")[1];
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
    });

    if (!updatedProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProgram);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
