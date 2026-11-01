import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { linkAttachment, ownsAttachment } from "@/backend/lib/attachments";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Expense from "@/backend/models/Expense";

// POST — record that an approved expense was paid out to the requester.
// The requester can't release their own reimbursement.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const body = await req.json();
    const reference =
      typeof body.reference === "string"
        ? body.reference.trim().slice(0, 120)
        : "";

    await connectDB();
    if (
      body.attachmentId &&
      !(await ownsAttachment(body.attachmentId, auth.session.id))
    ) {
      return NextResponse.json(
        { error: "Screenshot not found" },
        { status: 400 },
      );
    }

    if (body.attachmentId) {
      const linked = await linkAttachment(
        body.attachmentId,
        auth.session.id,
        "expense-release",
        id,
      );
      if ("error" in linked) {
        return NextResponse.json(
          { error: linked.error },
          { status: linked.status },
        );
      }
    }

    const res = await Expense.updateOne(
      {
        _id: id,
        status: "approved",
        requestedBy: { $ne: auth.session.id },
        ...NOT_DELETED,
      },
      {
        $set: {
          status: "released",
          release: {
            by: auth.session.id,
            at: new Date(),
            reference: reference || undefined,
            attachment: body.attachmentId || undefined,
          },
        },
      },
    );
    if (res.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Expense isn't approved, is already released, or is yours" },
        { status: 409 },
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
