import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
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
    const [policies, finance, threads] = await Promise.all([
      Policy.countDocuments({ status: "proposed", "votes.staff": { $ne: me } }),
      Expense.countDocuments({
        status: "pending",
        requestedBy: { $ne: me },
        "approvals.staff": { $ne: me },
      }),
      Thread.find({}).select("lastMessageAt readBy").lean(),
    ]);
    const discussions = threads.filter((t) => {
      const readAt = (t.readBy as Record<string, Date> | undefined)?.[me];
      return !readAt || new Date(readAt) < new Date(t.lastMessageAt);
    }).length;

    return NextResponse.json({ policies, finance, discussions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
