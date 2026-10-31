import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { getActiveDirectors } from "@/backend/lib/directors";
import { evaluatePolicy } from "@/backend/lib/governance";
import { applyOutcome } from "@/backend/lib/policies";
import Policy from "@/backend/models/Policy";

const MAX_TITLE = 120;
const MAX_BODY = 5000;

// Converts "26.67" style percentages to basis points; null when malformed.
function toBps(value: unknown): number | null {
  const n = typeof value === "string" ? value.trim() : value;
  if (typeof n === "string" && !/^\d+(\.\d{1,2})?$/.test(n)) return null;
  const num = Number(n);
  if (!Number.isFinite(num) || num < 0 || num > 100) return null;
  return Math.round(num * 100);
}

// GET — every policy plus the directors, so the UI can label votes
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();

    const [policies, directors] = await Promise.all([
      Policy.find({})
        .sort({ createdAt: -1 })
        .populate("proposedBy", "name")
        .populate("votes.staff", "name")
        .populate("split.directors.staff", "name")
        .lean(),
      getActiveDirectors(),
    ]);

    return NextResponse.json({
      policies,
      directors,
      me: auth.session.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST — propose a policy; the proposer's yes vote is recorded automatically
export async function POST(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const text = typeof body.body === "string" ? body.body.trim() : "";
    const kind = body.kind === "revenue-split" ? "revenue-split" : "general";

    if (!title || title.length > MAX_TITLE) {
      return NextResponse.json(
        { error: `Title is required (max ${MAX_TITLE} characters)` },
        { status: 400 },
      );
    }
    if (!text || text.length > MAX_BODY) {
      return NextResponse.json(
        { error: `Description is required (max ${MAX_BODY} characters)` },
        { status: 400 },
      );
    }

    await connectDB();
    const directors = await getActiveDirectors();

    let split:
      | { companyBps: number; directors: Array<{ staff: string; bps: number }> }
      | undefined;
    if (kind === "revenue-split") {
      const companyBps = toBps(body.split?.companyPercent);
      const entries: unknown = body.split?.directors;
      if (companyBps === null || !Array.isArray(entries)) {
        return NextResponse.json(
          { error: "Split percentages are invalid" },
          { status: 400 },
        );
      }
      const parsed = entries.map(
        (e: { staff?: unknown; percent?: unknown }) => ({
          staff: String(e?.staff),
          bps: toBps(e?.percent),
        }),
      );
      const ids = directors.map((d) => d.id).sort();
      const sameDirectors =
        parsed.length === ids.length &&
        [...parsed.map((p) => p.staff)].sort().join() === ids.join();
      if (!sameDirectors || parsed.some((p) => p.bps === null)) {
        return NextResponse.json(
          { error: "Give every active director a valid percentage" },
          { status: 400 },
        );
      }
      const total =
        companyBps + parsed.reduce((s, p) => s + (p.bps as number), 0);
      if (total !== 10000) {
        return NextResponse.json(
          { error: "Company and director percentages must total 100%" },
          { status: 400 },
        );
      }
      split = {
        companyBps,
        directors: parsed.map((p) => ({
          staff: p.staff,
          bps: p.bps as number,
        })),
      };
    }

    const policy = await Policy.create({
      title,
      body: text,
      kind,
      split,
      proposedBy: auth.session.id,
      votes: [{ staff: auth.session.id, vote: "yes", at: new Date() }],
    });

    // With a single director the proposer's vote alone can decide it
    const outcome = evaluatePolicy([{ vote: "yes" }], directors.length);
    if (outcome === "approved") {
      await applyOutcome(String(policy._id), kind, "approved");
    }

    return NextResponse.json({ id: policy._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
