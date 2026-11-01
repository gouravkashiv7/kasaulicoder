import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { readAttachment } from "@/backend/lib/attachments";
import { requireDirectorOrSuperAdmin } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Attachment from "@/backend/models/Attachment";

// GET — stream a proof to any director or superadmin
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireDirectorOrSuperAdmin();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await connectDB();
    const doc = await Attachment.findById(id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const bytes = await readAttachment(doc);
    if (!bytes)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": doc.mime,
        "Content-Length": String(bytes.length),
        "Cache-Control": "private, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline",
        // A PDF opened from here can't run anything in our origin
        "Content-Security-Policy": "sandbox",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not load the proof" },
      { status: 502 },
    );
  }
}
