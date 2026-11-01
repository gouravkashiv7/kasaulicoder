import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Client from "@/backend/models/Client";
import CompanyAsset from "@/backend/models/CompanyAsset";
import Contribution from "@/backend/models/Contribution";
import Expense from "@/backend/models/Expense";
import Payment from "@/backend/models/Payment";
import Policy from "@/backend/models/Policy";
import Thread from "@/backend/models/Thread";
import ThreadMessage from "@/backend/models/ThreadMessage";

const MODELS = {
  client: Client,
  asset: CompanyAsset,
  contribution: Contribution,
  payment: Payment,
  expense: Expense,
  policy: Policy,
  thread: Thread,
  message: ThreadMessage,
} as const;

// DELETE — soft-delete a directors-area record. It is hidden from directors
// and admins but stays in the database.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  try {
    const auth = await requireSuperAdmin();
    if ("error" in auth) return auth.error;

    const { type, id } = await params;
    if (!Object.hasOwn(MODELS, type) || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    await connectDB();
    const res = await MODELS[type as keyof typeof MODELS].updateOne(
      { _id: id, ...NOT_DELETED },
      { $set: { deletedAt: new Date(), deletedBy: auth.session.id } },
    );
    if (res.matchedCount === 0) {
      return NextResponse.json(
        { error: "Record not found or already deleted" },
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
