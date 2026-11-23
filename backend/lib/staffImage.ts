import { createHash } from "node:crypto";

// Staff photos are stored in the database as base64 data URLs. Embedding
// them in pages or JSON sends every photo, full size, on every visit. This
// swaps a data URL for a small, cacheable image URL served by
// app/api/public/staff/[id]/image. The `v` hash changes when the photo does,
// so browsers can cache each URL forever. Other URLs are returned unchanged.
export function staffImageUrl(
  id: unknown,
  image: string | undefined | null,
): string | undefined {
  if (!image) return undefined;
  if (!image.startsWith("data:")) return image;
  const version = createHash("sha1").update(image).digest("hex").slice(0, 10);
  return `/api/public/staff/${String(id)}/image?v=${version}`;
}

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

// Decode a base64 image data URL. Returns null for anything that isn't a
// plain raster image, so the image route can never serve SVG or HTML.
export function decodeImageDataUrl(
  dataUrl: string,
): { type: string; bytes: Buffer } | null {
  const match = /^data:([a-z/+.-]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) return null;
  const type = match[1].toLowerCase();
  if (!ALLOWED_TYPES.has(type)) return null;
  return { type, bytes: Buffer.from(match[2], "base64") };
}
