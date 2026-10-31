import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { getActiveDirectors } from "@/backend/lib/directors";
import { sendDirectorEmail } from "@/backend/lib/email";
import { rateLimit } from "@/backend/lib/rateLimit";
import Thread from "@/backend/models/Thread";
import ThreadMessage from "@/backend/models/ThreadMessage";

const MAX_SUBJECT = 150;
const MAX_NOTE = 2000;

// POST — email one discussion message to other directors. A subject is
// mandatory, and recipients can only be active directors.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    if (!rateLimit(req, "director-email", 10, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many emails. Try again shortly." },
        { status: 429 },
      );
    }

    const { id } = await params;
    const body = await req.json();
    // Subject must be a single line
    const subject =
      typeof body.subject === "string"
        ? body.subject.replace(/[\r\n]+/g, " ").trim()
        : "";
    const note =
      typeof body.note === "string" ? body.note.trim().slice(0, MAX_NOTE) : "";

    if (!subject || subject.length > MAX_SUBJECT) {
      return NextResponse.json(
        { error: `A subject is required (max ${MAX_SUBJECT} characters)` },
        { status: 400 },
      );
    }
    if (
      !mongoose.isValidObjectId(id) ||
      !mongoose.isValidObjectId(body.messageId)
    ) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await connectDB();
    const me = auth.session.id;
    const directors = await getActiveDirectors();
    const wanted: unknown[] = Array.isArray(body.recipientIds)
      ? body.recipientIds
      : [];
    const recipients = directors.filter(
      (d) => d.id !== me && wanted.includes(d.id),
    );
    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "Choose at least one other director" },
        { status: 400 },
      );
    }

    const [thread, message] = await Promise.all([
      Thread.findById(id).select("title"),
      ThreadMessage.findOne({ _id: body.messageId, thread: id }).populate(
        "author",
        "name",
      ),
    ]);
    if (!thread || !message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const toEmails = recipients.map((r) => r.email);
    await sendDirectorEmail({
      toEmails,
      senderName: auth.session.name,
      senderEmail: auth.session.email,
      subject,
      note,
      threadTitle: thread.title,
      quotedAuthor: message.author?.name ?? "A director",
      quotedBody: message.body,
    });

    await ThreadMessage.updateOne(
      { _id: message._id },
      {
        $push: {
          emails: { to: toEmails, subject, sentBy: me, at: new Date() },
        },
      },
    );
    return NextResponse.json({ sentTo: recipients.map((r) => r.name) });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not send the email. Check the mail settings." },
      { status: 500 },
    );
  }
}
