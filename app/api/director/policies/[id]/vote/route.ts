import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { getActiveDirectors } from "@/backend/lib/directors";
import { evaluatePolicy } from "@/backend/lib/governance";
import { applyOutcome } from "@/backend/lib/policies";
import Policy from "@/backend/models/Policy";

const MAX_COMMENT = 500;

// POST — cast or change a vote while the policy is still open
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    const { vote, comment } = await req.json();
    if (vote !== "yes" && vote !== "no") {
      return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
    }
    const note =
      typeof comment === "string" ? comment.trim().slice(0, MAX_COMMENT) : "";

    await connectDB();
    const me = auth.session.id;
    const entry = {
      staff: me,
      vote,
      comment: note || undefined,
      at: new Date(),
    };

    // Change an existing vote, or add one if this director hasn't voted. Both
    // updates only match while the policy is open, so a decided policy is final.
    const changed = await Policy.updateOne(
      { _id: id, status: "proposed", "votes.staff": me },
      {
        $set: {
          "votes.$.vote": vote,
          "votes.$.comment": entry.comment,
          "votes.$.at": entry.at,
        },
      },
    );
    if (changed.matchedCount === 0) {
      await Policy.updateOne(
        { _id: id, status: "proposed", "votes.staff": { $ne: me } },
        { $push: { votes: entry } },
      );
    }

    const policy = await Policy.findById(id);
    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }
    if (policy.status !== "proposed") {
      // Either decided just now by someone else, or was already final
      return NextResponse.json({ status: policy.status });
    }

    const directors = await getActiveDirectors();
    const directorIds = new Set(directors.map((d) => d.id));
    const countable = policy.votes.filter(
      (v: { staff: { toString(): string } }) =>
        directorIds.has(v.staff.toString()),
    );
    const outcome = evaluatePolicy(countable, directors.length);
    if (outcome !== "proposed") {
      await applyOutcome(id, String(policy.client ?? ""), outcome);
    }

    const final = await Policy.findById(id).select("status");
    return NextResponse.json({ status: final?.status ?? "proposed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
