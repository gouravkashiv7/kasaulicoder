import mongoose from "mongoose";
import { getProof, putProof } from "@/backend/lib/cloudinary";
import Attachment from "@/backend/models/Attachment";

const MAX_BYTES = 1024 * 1024;
const DATA_URL = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+=*)$/;

// Checks the file's leading bytes so a spoofed mime type can't slip through.
function matchesMime(buf: Buffer, mime: string): boolean {
  if (mime === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8;
  if (mime === "image/png") {
    return buf.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  }
  return (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

export function parseImageDataUrl(
  dataUrl: unknown,
): { data: Buffer; mime: string } | { error: string } {
  if (typeof dataUrl !== "string") return { error: "Screenshot is required" };
  const match = DATA_URL.exec(dataUrl);
  if (!match) return { error: "Only JPEG, PNG or WebP images are allowed" };
  const data = Buffer.from(match[2], "base64");
  if (data.length > MAX_BYTES) {
    return { error: "Screenshot is larger than 1 MB" };
  }
  if (!matchesMime(data, match[1])) {
    return { error: "File content does not match its image type" };
  }
  return { data, mime: match[1] };
}

// An attachment id from the client is only accepted if this director uploaded it.
export async function ownsAttachment(
  id: unknown,
  staffId: string,
): Promise<boolean> {
  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) return false;
  return Boolean(await Attachment.exists({ _id: id, uploadedBy: staffId }));
}

export type LinkResult = { ok: true } | { error: string; status: number };

// Publishes a staged proof to Cloudinary for the record that uses it. Call it
// before saving the record, with the id the record will have; the record is
// only saved when this succeeds. A proof can be used once.
export async function linkAttachment(
  id: unknown,
  staffId: string,
  kind: string,
  recordId: string,
): Promise<LinkResult> {
  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
    return { error: "Proof not found", status: 400 };
  }
  const doc = await Attachment.findOne({
    _id: id,
    uploadedBy: staffId,
    linked: false,
  });
  // A proof put back by unlinkAttachment is already in Cloudinary
  const uploaded =
    doc?.storage === "cloudinary" && doc.publicId && doc.format
      ? { publicId: doc.publicId, version: doc.version, format: doc.format }
      : null;
  if (!doc || (!doc.data && !uploaded)) {
    return { error: "Proof not found or already used", status: 400 };
  }

  let stored: { publicId: string; version: number; format: string };
  try {
    stored = uploaded ?? (await putProof(doc.data, String(doc._id)));
  } catch (error) {
    console.error("Could not store proof in Cloudinary:", error);
    return { error: "Could not store the proof, try again", status: 502 };
  }

  const res = await Attachment.updateOne(
    { _id: doc._id, linked: false },
    {
      $set: {
        storage: "cloudinary",
        publicId: stored.publicId,
        version: stored.version,
        format: stored.format,
        linked: true,
        linkedTo: { kind, id: recordId },
      },
      $unset: { data: 1 },
    },
  );
  if (res.modifiedCount === 0) {
    return { error: "Proof already used", status: 409 };
  }
  return { ok: true };
}

// Puts a proof back to staged when the record it was linked for could not be
// saved, so the director can use it again. The file stays in Cloudinary.
export async function unlinkAttachment(id: unknown, recordId: string) {
  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) return;
  await Attachment.updateOne(
    { _id: id, linked: true, "linkedTo.id": recordId },
    { $set: { linked: false }, $unset: { linkedTo: 1 } },
  );
}

// The bytes of a proof, wherever they are stored.
export async function readAttachment(doc: {
  storage?: string;
  publicId?: string;
  format?: string;
  data?: Buffer;
}): Promise<Buffer | null> {
  if (doc.storage === "cloudinary" && doc.publicId && doc.format) {
    return getProof(doc.publicId, doc.format);
  }
  return doc.data ? Buffer.from(doc.data) : null;
}
