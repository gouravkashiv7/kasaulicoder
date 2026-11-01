import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ownsAttachment } from "@/backend/lib/attachments";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { getActiveDirectors } from "@/backend/lib/directors";
import { splitPaise, toPaise } from "@/backend/lib/money";
import { getActiveSplit } from "@/backend/lib/policies";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Client from "@/backend/models/Client";
import Payment from "@/backend/models/Payment";
import Policy from "@/backend/models/Policy";

// GET — payments, newest first, with the split that applied to each, plus the
// clients that have an approved finance policy
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();
    const [payments, covered] = await Promise.all([
      Payment.find({ ...NOT_DELETED })
        .sort({ receivedOn: -1, createdAt: -1 })
        .populate("client", "name")
        .populate("recordedBy", "name")
        .populate("allocation.shares.staff", "name")
        .lean(),
      Policy.distinct("client", {
        type: "finance",
        status: "approved",
        ...NOT_DELETED,
      }),
    ]);
    return NextResponse.json({
      payments,
      clientsWithPolicy: covered.map(String),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST — record a client payment and snapshot its split
export async function POST(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const amountPaise = toPaise(
      typeof body.amount === "number" || typeof body.amount === "string"
        ? body.amount
        : "",
    );
    if (amountPaise === null) {
      return NextResponse.json(
        { error: "Enter a valid amount in rupees (up to 2 decimals)" },
        { status: 400 },
      );
    }
    if (!mongoose.isValidObjectId(body.clientId)) {
      return NextResponse.json({ error: "Choose a client" }, { status: 400 });
    }

    const receivedOn = new Date(`${body.receivedOn}T00:00:00.000Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(String(body.receivedOn)) ||
      Number.isNaN(receivedOn.getTime()) ||
      receivedOn.getTime() > Date.now() + 24 * 60 * 60 * 1000
    ) {
      return NextResponse.json(
        { error: "Enter a valid received date (not in the future)" },
        { status: 400 },
      );
    }

    await connectDB();
    const [client, split, directors] = await Promise.all([
      Client.findOne({ _id: body.clientId, ...NOT_DELETED }),
      getActiveSplit(body.clientId),
      getActiveDirectors(),
    ]);
    if (!client || client.isActive === false) {
      return NextResponse.json(
        { error: "Client not found or archived" },
        { status: 400 },
      );
    }
    if (!split?.split) {
      return NextResponse.json(
        { error: "This client has no approved finance policy yet" },
        { status: 409 },
      );
    }

    // The split must still cover exactly the current directors
    const splitIds = split.split.directors
      .map((d: { staff: unknown }) => String(d.staff))
      .sort();
    const directorIds = directors.map((d) => d.id).sort();
    if (splitIds.join() !== directorIds.join()) {
      return NextResponse.json(
        {
          error:
            "The approved split no longer matches the active directors. Propose a new finance policy for this client.",
        },
        { status: 409 },
      );
    }

    if (
      body.attachmentId &&
      !(await ownsAttachment(body.attachmentId, auth.session.id))
    ) {
      return NextResponse.json(
        { error: "Screenshot not found" },
        { status: 400 },
      );
    }

    const result = splitPaise(
      amountPaise,
      split.split.companyBps,
      split.split.directors.map((d: { staff: unknown; bps: number }) => ({
        id: String(d.staff),
        bps: d.bps,
      })),
      split.split.outsourced?.bps ?? 0,
    );

    const payment = await Payment.create({
      client: client._id,
      amountPaise,
      receivedOn,
      reference:
        typeof body.reference === "string"
          ? body.reference.trim().slice(0, 120)
          : undefined,
      note:
        typeof body.note === "string"
          ? body.note.trim().slice(0, 1000)
          : undefined,
      attachment: body.attachmentId || undefined,
      recordedBy: auth.session.id,
      allocation: {
        policy: split._id,
        companyPaise: result.companyPaise,
        shares: result.shares.map((s) => ({ staff: s.id, paise: s.paise })),
        outsourced: split.split.outsourced?.bps
          ? { name: split.split.outsourced.name, paise: result.outsourcedPaise }
          : undefined,
      },
    });
    return NextResponse.json({ id: payment._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
