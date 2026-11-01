import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Contribution from "@/backend/models/Contribution";

// POST — cancel a contribution that isn't complete yet: { reason }. Stays
// visible; confirmed proofs are kept.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const { reason } = await req.json();
    const text = typeof reason === "string" ? reason.trim().slice(0, 500) : "";
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 },
      );
    }
    if (!text) {
      return NextResponse.json(
        { error: "A reason is required to cancel" },
        { status: 400 },
      );
    }

    await connectDB();
    const res = await Contribution.updateOne(
      { _id: id, status: "pending", ...NOT_DELETED },
      {
        $set: {
          status: "cancelled",
          cancelReason: text,
          cancelledBy: auth.session.id,
        },
      },
    );
    if (res.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Contribution not found or no longer open" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
