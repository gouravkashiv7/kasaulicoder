import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Thread from "@/backend/models/Thread";
import ThreadMessage from "@/backend/models/ThreadMessage";

// GET — a thread with all its messages; opening it marks it read
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    await connectDB();
    const thread = await Thread.findOneAndUpdate(
      { _id: id, ...NOT_DELETED },
      { $set: { [`readBy.${auth.session.id}`]: new Date() } },
      { new: true },
    )
      .select("title createdBy lastMessageAt")
      .populate("createdBy", "name")
      .lean();
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const messages = await ThreadMessage.find({ thread: id, ...NOT_DELETED })
      .sort({ createdAt: 1 })
      .populate("author", "name")
      .populate("emails.sentBy", "name")
      .lean();
    return NextResponse.json({ thread, messages, me: auth.session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
