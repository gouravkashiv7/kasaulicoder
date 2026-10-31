import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { getActiveDirectors } from "@/backend/lib/directors";
import Expense from "@/backend/models/Expense";
import Payment from "@/backend/models/Payment";

// GET — totals shown at the top of Finance (voided payments excluded)
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();
    const [totals, shareRows, expenseRows, directors, awaitingMe] =
      await Promise.all([
        Payment.aggregate([
          { $match: { status: "recorded" } },
          {
            $group: {
              _id: null,
              received: { $sum: "$amountPaise" },
              company: { $sum: "$allocation.companyPaise" },
            },
          },
        ]),
        Payment.aggregate([
          { $match: { status: "recorded" } },
          { $unwind: "$allocation.shares" },
          {
            $group: {
              _id: "$allocation.shares.staff",
              paise: { $sum: "$allocation.shares.paise" },
            },
          },
        ]),
        Expense.aggregate([
          { $match: { status: { $in: ["approved", "released"] } } },
          { $group: { _id: "$status", paise: { $sum: "$amountPaise" } } },
        ]),
        getActiveDirectors(),
        Expense.countDocuments({
          status: "pending",
          requestedBy: { $ne: auth.session.id },
          "approvals.staff": { $ne: auth.session.id },
        }),
      ]);

    const byStatus = Object.fromEntries(
      expenseRows.map((r: { _id: string; paise: number }) => [r._id, r.paise]),
    );
    const shareByStaff = new Map(
      shareRows.map((r: { _id: unknown; paise: number }) => [
        String(r._id),
        r.paise,
      ]),
    );
    const companyEarned = totals[0]?.company ?? 0;
    const released = byStatus.released ?? 0;

    return NextResponse.json({
      receivedPaise: totals[0]?.received ?? 0,
      companyEarnedPaise: companyEarned,
      companyBalancePaise: companyEarned - released,
      // Approved but not yet released, so not yet deducted from the balance
      awaitingReleasePaise: byStatus.approved ?? 0,
      releasedPaise: released,
      directorShares: directors.map((d) => ({
        id: d.id,
        name: d.name,
        paise: shareByStaff.get(d.id) ?? 0,
      })),
      awaitingMyApproval: awaitingMe,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
