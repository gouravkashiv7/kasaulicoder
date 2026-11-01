import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Client from "@/backend/models/Client";
import Expense from "@/backend/models/Expense";
import Payment from "@/backend/models/Payment";
import Policy from "@/backend/models/Policy";
import Thread from "@/backend/models/Thread";
import ThreadMessage from "@/backend/models/ThreadMessage";

// GET ?tab=finance|policies|discussions — every record of that tab, deleted
// ones included, for the superadmin's delete view
export async function GET(req: Request) {
  try {
    const auth = await requireSuperAdmin();
    if ("error" in auth) return auth.error;

    const tab = new URL(req.url).searchParams.get("tab");
    await connectDB();

    if (tab === "finance") {
      const [clients, payments, expenses] = await Promise.all([
        Client.find({}).sort({ name: 1 }).select("name email deletedAt").lean(),
        Payment.find({})
          .sort({ receivedOn: -1, createdAt: -1 })
          .select("client amountPaise receivedOn status deletedAt")
          .populate("client", "name")
          .lean(),
        Expense.find({})
          .sort({ createdAt: -1 })
          .select("purpose amountPaise status requestedBy deletedAt")
          .populate("requestedBy", "name")
          .lean(),
      ]);
      return NextResponse.json({ clients, payments, expenses });
    }

    if (tab === "policies") {
      const policies = await Policy.find({})
        .sort({ createdAt: -1 })
        .select("title status client proposedBy createdAt deletedAt")
        .populate("client", "name")
        .populate("proposedBy", "name")
        .lean();
      return NextResponse.json({ policies });
    }

    if (tab === "discussions") {
      const [threads, messages] = await Promise.all([
        Thread.find({})
          .sort({ lastMessageAt: -1 })
          .select("title createdBy lastMessageAt deletedAt")
          .populate("createdBy", "name")
          .lean(),
        ThreadMessage.find({})
          .sort({ createdAt: 1 })
          .select("thread author body createdAt deletedAt")
          .populate("author", "name")
          .lean(),
      ]);
      const byThread = new Map<string, typeof messages>();
      for (const m of messages) {
        const key = String(m.thread);
        byThread.set(key, [...(byThread.get(key) ?? []), m]);
      }
      return NextResponse.json({
        threads: threads.map((t) => ({
          ...t,
          messages: byThread.get(String(t._id)) ?? [],
        })),
      });
    }

    return NextResponse.json({ error: "Unknown tab" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
