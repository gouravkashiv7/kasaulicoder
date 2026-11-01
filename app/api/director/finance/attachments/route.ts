import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { parseProofDataUrl } from "@/backend/lib/proofFormat";
import { rateLimit } from "@/backend/lib/rateLimit";
import Attachment from "@/backend/models/Attachment";

// POST — upload a proof (PNG, JPG or PDF data URL); returns the id to attach to
// a record. It stays staged here until a record uses it.
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
    const parsed = parseProofDataUrl(dataUrl);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    await connectDB();
    const sha256 = createHash("sha256").update(parsed.data).digest("hex");
    const used = { error: "This proof was already used" };

    // The same file can't be used twice. A staged copy of the same director's
    // own upload is simply reused.
    const existing = await Attachment.findOne({ sha256 }).select(
      "uploadedBy linked",
    );
    if (existing) {
      if (!existing.linked && String(existing.uploadedBy) === auth.session.id) {
        return NextResponse.json({ id: existing._id }, { status: 200 });
      }
      return NextResponse.json(used, { status: 409 });
    }

    try {
      const doc = await Attachment.create({
        data: parsed.data,
        mime: parsed.mime,
        size: parsed.data.length,
        sha256,
        uploadedBy: auth.session.id,
      });
      return NextResponse.json({ id: doc._id }, { status: 201 });
    } catch (e) {
      // A simultaneous upload of the same file lost the race on the unique hash
      if ((e as { code?: number }).code === 11000) {
        return NextResponse.json(used, { status: 409 });
      }
      throw e;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
