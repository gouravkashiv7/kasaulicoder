import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { getActiveDirectors } from "@/backend/lib/directors";
import { equalShares, toPaise } from "@/backend/lib/money";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Contribution from "@/backend/models/Contribution";

// GET — all contributions, newest first
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();
    const contributions = await Contribution.find({ ...NOT_DELETED })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name")
      .populate("shares.staff", "name")
      .populate("cancelledBy", "name")
      .lean();
    return NextResponse.json({ contributions, me: auth.session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST — start a contribution: { amount, note? }. The amount is split equally
// between every active director; each confirms their part with a proof.
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

    await connectDB();
    const directors = await getActiveDirectors();
    const { sharePaise, creditedPaise } = equalShares(
      amountPaise,
      directors.length,
    );
    if (sharePaise === 0) {
      return NextResponse.json(
        { error: "That amount is too small to split between the directors" },
        { status: 400 },
      );
    }

    const contribution = await Contribution.create({
      totalPaise: creditedPaise,
      note:
        typeof body.note === "string"
          ? body.note.trim().slice(0, 500) || undefined
          : undefined,
      createdBy: auth.session.id,
      shares: directors.map((d) => ({ staff: d.id, paise: sharePaise })),
    });
    return NextResponse.json({ id: contribution._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
