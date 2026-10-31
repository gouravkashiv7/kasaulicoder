import mongoose from "mongoose";
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
