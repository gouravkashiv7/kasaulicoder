import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Thread from "@/backend/models/Thread";
import ThreadMessage from "@/backend/models/ThreadMessage";

const MAX_BODY = 5000;

// POST — reply in a thread
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const { body } = await req.json();
    const text = typeof body === "string" ? body.trim() : "";
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    if (!text || text.length > MAX_BODY) {
      return NextResponse.json(
        { error: `Message is required (max ${MAX_BODY} characters)` },
        { status: 400 },
      );
    }

    await connectDB();
    const now = new Date();
    const thread = await Thread.findByIdAndUpdate(id, {
      $set: { lastMessageAt: now, [`readBy.${auth.session.id}`]: now },
    });
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const message = await ThreadMessage.create({
      thread: id,
      author: auth.session.id,
      body: text,
    });
    return NextResponse.json({ id: message._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
