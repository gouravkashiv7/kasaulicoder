import { NextResponse } from "next/server";
import { parseImageDataUrl } from "@/backend/lib/attachments";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { rateLimit } from "@/backend/lib/rateLimit";
import Attachment from "@/backend/models/Attachment";

// POST — upload a screenshot (data URL); returns the id to attach to a record
export async function POST(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    if (!rateLimit(req, "director-upload", 30, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many uploads. Try again shortly." },
        { status: 429 },
      );
    }

    const { dataUrl } = await req.json();
    const parsed = parseImageDataUrl(dataUrl);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    await connectDB();
    const doc = await Attachment.create({
      data: parsed.data,
      mime: parsed.mime,
      size: parsed.data.length,
      uploadedBy: auth.session.id,
    });
    return NextResponse.json({ id: doc._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
