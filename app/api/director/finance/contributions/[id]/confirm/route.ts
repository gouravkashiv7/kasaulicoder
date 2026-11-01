import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { linkAttachment } from "@/backend/lib/attachments";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { getActiveDirectors } from "@/backend/lib/directors";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Contribution from "@/backend/models/Contribution";

// POST — a director confirms their own share with a proof: { attachmentId }.
// When the last share is confirmed the contribution completes and counts.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 },
      );
    }
    const { attachmentId } = await req.json();
    if (typeof attachmentId !== "string" || !attachmentId) {
      return NextResponse.json(
        { error: "A proof of your payment is required" },
        { status: 400 },
      );
    }

    await connectDB();
    const me = auth.session.id;
    const contribution = await Contribution.findOne({
      _id: id,
      ...NOT_DELETED,
    });
    if (!contribution) {
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 },
      );
    }
    if (contribution.status !== "pending") {
      return NextResponse.json(
        { error: "This contribution is no longer open" },
        { status: 409 },
      );
    }
    const share = contribution.shares.find(
      (s: { staff: { toString(): string } }) => s.staff.toString() === me,
    );
    if (!share) {
      return NextResponse.json(
        { error: "You have no share in this contribution" },
        { status: 403 },
      );
    }
    if (share.status === "confirmed") {
      return NextResponse.json(
        { error: "You already confirmed your share" },
        { status: 409 },
      );
    }

    // It can only complete if everyone in the split is still a director
    const active = new Set((await getActiveDirectors()).map((d) => d.id));
    if (
      contribution.shares.some(
        (s: { staff: { toString(): string } }) =>
          !active.has(s.staff.toString()),
      )
    ) {
      return NextResponse.json(
        {
          error:
            "A director in this split is no longer active. Cancel it and start a new one.",
        },
        { status: 409 },
      );
    }

    const linked = await linkAttachment(attachmentId, me, "contribution", id);
    if ("error" in linked) {
      return NextResponse.json(
        { error: linked.error },
        { status: linked.status },
      );
    }

    const now = new Date();
    const changed = await Contribution.updateOne(
      {
        _id: id,
        status: "pending",
        ...NOT_DELETED,
        shares: { $elemMatch: { staff: me, status: "pending" } },
      },
      {
        $set: {
          "shares.$.status": "confirmed",
          "shares.$.proof": attachmentId,
          "shares.$.confirmedAt": now,
        },
      },
    );
    if (changed.modifiedCount === 0) {
      return NextResponse.json(
        { error: "This contribution is no longer open" },
        { status: 409 },
      );
    }

    // Completes exactly once: only a still-pending contribution with no
    // pending share left matches, however many confirmations race here.
    await Contribution.updateOne(
      {
        _id: id,
        status: "pending",
        shares: { $not: { $elemMatch: { status: "pending" } } },
      },
      { $set: { status: "completed", completedAt: now } },
    );

    const final = await Contribution.findById(id).select("status");
    return NextResponse.json({ status: final?.status ?? "pending" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
