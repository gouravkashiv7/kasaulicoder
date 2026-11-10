import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { isDirectorMohit } from "@/backend/lib/directors";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Contribution from "@/backend/models/Contribution";

// POST — Director Mohit approves a fund request.
// Once approved, the funds are added to the company finances / balance.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    if (!isDirectorMohit(auth.session)) {
      return NextResponse.json(
        { error: "Only Director Mohit can approve fund requests" },
        { status: 403 },
      );
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Fund request not found" },
        { status: 404 },
      );
    }

    await connectDB();
    const now = new Date();
    const res = await Contribution.updateOne(
      { _id: id, status: "pending", ...NOT_DELETED },
      {
        $set: {
          status: "completed",
          approvedBy: auth.session.id,
          approvedAt: now,
          completedAt: now,
        },
      },
    );

    if (res.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Fund request not found or is no longer pending" },
        { status: 409 },
      );
    }

    return NextResponse.json({ ok: true, status: "completed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

