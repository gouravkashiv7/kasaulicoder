import { isValidObjectId } from "mongoose";
import connectDB from "@/backend/lib/db";
import { decodeImageDataUrl } from "@/backend/lib/staffImage";
import Staff from "@/backend/models/Staff";

// Serves an active staff member's photo as an image file. Links come from
// staffImageUrl(), whose ?v= hash changes with the photo, so responses can be
// cached for a year.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!isValidObjectId(id)) return new Response(null, { status: 404 });

  await connectDB();
  const staff = await Staff.findOne({ _id: id, isActive: true })
    .select("image")
    .lean();
  const decoded = staff?.image ? decodeImageDataUrl(staff.image) : null;
  if (!decoded) return new Response(null, { status: 404 });

  return new Response(new Uint8Array(decoded.bytes), {
    headers: {
      "Content-Type": decoded.type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
