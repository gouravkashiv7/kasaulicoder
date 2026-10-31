import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Client from "@/backend/models/Client";

const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

// GET — all clients
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();
    const clients = await Client.find({}).sort({ name: 1 }).lean();
    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST — add a client
export async function POST(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const name = clip(body.name, 120);
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await connectDB();
    const client = await Client.create({
      name,
      email: clip(body.email, 200) || undefined,
      phone: clip(body.phone, 40) || undefined,
      notes: clip(body.notes, 1000) || undefined,
      createdBy: auth.session.id,
    });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT — edit a client or archive/restore it
export async function PUT(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const body = await req.json();
    if (!mongoose.isValidObjectId(body.id)) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const update: Record<string, unknown> = {};
    if (body.name !== undefined) {
      const name = clip(body.name, 120);
      if (!name) {
        return NextResponse.json(
          { error: "Name is required" },
          { status: 400 },
        );
      }
      update.name = name;
    }
    if (body.email !== undefined) update.email = clip(body.email, 200);
    if (body.phone !== undefined) update.phone = clip(body.phone, 40);
    if (body.notes !== undefined) update.notes = clip(body.notes, 1000);
    if (typeof body.isActive === "boolean") update.isActive = body.isActive;

    await connectDB();
    const client = await Client.findByIdAndUpdate(body.id, update, {
      new: true,
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
