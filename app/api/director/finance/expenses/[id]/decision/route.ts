import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirectorOrSuperAdmin } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { getActiveDirectors } from "@/backend/lib/directors";
import { evaluateExpense } from "@/backend/lib/governance";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Expense from "@/backend/models/Expense";

// POST — approve or reject someone else's expense (superadmins can directly approve any expense)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireDirectorOrSuperAdmin();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const { decision, comment } = await req.json();
    if (decision !== "approve" && decision !== "reject") {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }
    const note =
      typeof comment === "string" ? comment.trim().slice(0, 500) : "";
    if (decision === "reject" && !note) {
      return NextResponse.json(
        { error: "A reason is required to reject an expense" },
        { status: 400 },
      );
    }

    await connectDB();
    const me = auth.session.id;
    const isSuperAdmin = auth.session.role === "superadmin";

    const existing = await Expense.findOne({ _id: id, ...NOT_DELETED }).select(
      "requestedBy status",
    );
    if (!existing) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    if (String(existing.requestedBy) === me && !isSuperAdmin) {
      return NextResponse.json(
        { error: "You can't decide on your own expense" },
        { status: 403 },
      );
    }
    if (existing.status !== "pending") {
      return NextResponse.json({ status: existing.status });
    }

    const entry = {
      staff: me,
      decision,
      comment: note || undefined,
      at: new Date(),
    };
    const changed = await Expense.updateOne(
      {
        _id: id,
        status: "pending",
        "approvals.staff": me,
        ...NOT_DELETED,
      },
      {
        $set: {
          "approvals.$.decision": decision,
          "approvals.$.comment": entry.comment,
          "approvals.$.at": entry.at,
        },
      },
    );
    if (changed.matchedCount === 0) {
      await Expense.updateOne(
        {
          _id: id,
          status: "pending",
          "approvals.staff": { $ne: me },
          ...NOT_DELETED,
        },
        { $push: { approvals: entry } },
      );
    }

    const expense = await Expense.findById(id);
    if (expense && expense.status === "pending") {
      if (isSuperAdmin) {
        // Superadmin has direct authority to approve or reject expenses
        if (decision === "approve") {
          await Expense.updateOne(
            { _id: id, status: "pending" },
            { $set: { status: "approved" } },
          );
        } else if (decision === "reject") {
          await Expense.updateOne(
            { _id: id, status: "pending" },
            { $set: { status: "rejected" } },
          );
        }
      } else {
        const directors = await getActiveDirectors();
        const outcome = evaluateExpense(
          expense.approvals.map(
            (a: {
              staff: { toString(): string };
              decision: "approve" | "reject";
            }) => ({
              staff: a.staff.toString(),
              decision: a.decision,
            }),
          ),
          String(expense.requestedBy),
          directors.map((d) => d.id),
        );
        if (outcome !== "pending") {
          await Expense.updateOne(
            { _id: id, status: "pending" },
            { $set: { status: outcome } },
          );
        }
      }
    }

    const final = await Expense.findById(id).select("status");
    return NextResponse.json({ status: final?.status ?? "pending" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
