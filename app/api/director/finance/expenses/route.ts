import { NextResponse } from "next/server";
import { ownsAttachment } from "@/backend/lib/attachments";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { toPaise } from "@/backend/lib/money";
import Expense from "@/backend/models/Expense";

// GET — all expenses, newest first
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();
    const expenses = await Expense.find({})
      .sort({ createdAt: -1 })
      .populate("requestedBy", "name")
      .populate("approvals.staff", "name")
      .populate("release.by", "name")
      .lean();
    return NextResponse.json({ expenses, me: auth.session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST — request reimbursement for a company expense
export async function POST(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const purpose =
      typeof body.purpose === "string" ? body.purpose.trim().slice(0, 300) : "";
    const amountPaise = toPaise(
      typeof body.amount === "number" || typeof body.amount === "string"
        ? body.amount
        : "",
    );
    if (!purpose) {
      return NextResponse.json(
        { error: "Purpose is required" },
        { status: 400 },
      );
    }
    if (amountPaise === null) {
      return NextResponse.json(
        { error: "Enter a valid amount in rupees (up to 2 decimals)" },
        { status: 400 },
      );
    }

    await connectDB();
    if (!(await ownsAttachment(body.attachmentId, auth.session.id))) {
      return NextResponse.json(
        { error: "A payment screenshot is required" },
        { status: 400 },
      );
    }

    const expense = await Expense.create({
      purpose,
      amountPaise,
      attachment: body.attachmentId,
      requestedBy: auth.session.id,
    });
    return NextResponse.json({ id: expense._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
