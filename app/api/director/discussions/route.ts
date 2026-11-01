import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Thread from "@/backend/models/Thread";
import ThreadMessage from "@/backend/models/ThreadMessage";

const MAX_TITLE = 150;
const MAX_BODY = 5000;

// GET — threads, most recently active first, with unread state for the viewer
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();
    const me = auth.session.id;
    const threads = await Thread.find({ ...NOT_DELETED })
      .sort({ lastMessageAt: -1 })
      .populate("createdBy", "name")
      .lean();

    const ids = threads.map((t) => t._id);
    const last = await ThreadMessage.aggregate([
      { $match: { thread: { $in: ids }, ...NOT_DELETED } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$thread",
          body: { $first: "$body" },
          author: { $first: "$author" },
          count: { $sum: 1 },
        },
      },
    ]);
    const lastByThread = new Map(
      last.map((l: { _id: unknown; body: string; count: number }) => [
        String(l._id),
        l,
      ]),
    );

    return NextResponse.json(
      threads.map((t) => {
        const readAt = (t.readBy as Record<string, Date> | undefined)?.[me];
        const l = lastByThread.get(String(t._id));
        return {
          _id: t._id,
          title: t.title,
          createdBy: t.createdBy,
          lastMessageAt: t.lastMessageAt,
          preview: l ? l.body.slice(0, 140) : "",
          messageCount: l?.count ?? 0,
          unread: !readAt || new Date(readAt) < new Date(t.lastMessageAt),
        };
      }),
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST — start a thread with its first message
export async function POST(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const text = typeof body.body === "string" ? body.body.trim() : "";
    if (!title || title.length > MAX_TITLE) {
      return NextResponse.json(
        { error: `Title is required (max ${MAX_TITLE} characters)` },
        { status: 400 },
      );
    }
    if (!text || text.length > MAX_BODY) {
      return NextResponse.json(
        { error: `Message is required (max ${MAX_BODY} characters)` },
        { status: 400 },
      );
    }

    await connectDB();
    const me = auth.session.id;
    const now = new Date();
    const thread = await Thread.create({
      title,
      createdBy: me,
      lastMessageAt: now,
      readBy: { [me]: now },
    });
    await ThreadMessage.create({ thread: thread._id, author: me, body: text });
    return NextResponse.json({ id: thread._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
