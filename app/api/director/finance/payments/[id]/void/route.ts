import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Payment from "@/backend/models/Payment";

// POST — void a payment (entries are never deleted)
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
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    if (!text) {
      return NextResponse.json(
        { error: "A reason is required to void a payment" },
        { status: 400 },
      );
    }

    await connectDB();
    const res = await Payment.updateOne(
      { _id: id, status: "recorded" },
      {
        $set: {
          status: "void",
          voidReason: text,
          voidedBy: auth.session.id,
          voidedAt: new Date(),
        },
      },
    );
    if (res.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Payment not found or already void" },
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
