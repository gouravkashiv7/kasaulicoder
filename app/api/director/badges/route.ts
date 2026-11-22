import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { isDirectorMohit } from "@/backend/lib/directors";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import CompanyAsset from "@/backend/models/CompanyAsset";
import Contribution from "@/backend/models/Contribution";
import Expense from "@/backend/models/Expense";
import Policy from "@/backend/models/Policy";
import Thread from "@/backend/models/Thread";

// GET — sidebar counters: things waiting on this director
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();
    const me = auth.session.id;
    const soon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const isMohit = isDirectorMohit(auth.session);
    const [policies, expensesAwaiting, threads, assets, fundRequests] =
      await Promise.all([
        Policy.countDocuments({
          status: "proposed",
          "votes.staff": { $ne: me },
          ...NOT_DELETED,
        }),
        Expense.countDocuments({
          status: "pending",
          requestedBy: { $ne: me },
          "approvals.staff": { $ne: me },
          ...NOT_DELETED,
        }),
        Thread.find({ ...NOT_DELETED })
          .select("lastMessageAt readBy")
          .lean(),
        // Domains that expire within 30 days, or already have
        CompanyAsset.countDocuments({
          kind: "domain",
          expiresOn: { $lte: soon },
          ...NOT_DELETED,
        }),
        // Fund requests waiting on a decision, which only Director Mohit makes
        isMohit
          ? Contribution.countDocuments({ status: "pending", ...NOT_DELETED })
          : 0,
      ]);
    const discussions = threads.filter((t) => {
      const readAt = (t.readBy as Record<string, Date> | undefined)?.[me];
      return !readAt || new Date(readAt) < new Date(t.lastMessageAt);
    }).length;

    return NextResponse.json({
      policies,
      finance: expensesAwaiting + fundRequests,
      discussions,
      assets,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
