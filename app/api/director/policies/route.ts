import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { getActiveDirectors } from "@/backend/lib/directors";
import { evaluatePolicy } from "@/backend/lib/governance";
import { applyOutcome } from "@/backend/lib/policies";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import Client from "@/backend/models/Client";
import Policy from "@/backend/models/Policy";

const MAX_TITLE = 120;
const MAX_BODY = 5000;
const MAX_NAME = 80;

// Converts "26.67" style percentages to basis points; null when malformed.
function toBps(value: unknown): number | null {
  const n = typeof value === "string" ? value.trim() : value;
  if (typeof n === "string" && !/^\d+(\.\d{1,2})?$/.test(n)) return null;
  const num = Number(n);
  if (!Number.isFinite(num) || num < 0 || num > 100) return null;
  return Math.round(num * 100);
}

// GET — every policy plus the directors and active clients, so the UI can
// label votes and offer a client when proposing
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();

    const [policies, directors, clients] = await Promise.all([
      Policy.find({ ...NOT_DELETED })
        .sort({ createdAt: -1 })
        .populate("client", "name")
        .populate("proposedBy", "name")
        .populate("votes.staff", "name")
        .populate("split.directors.staff", "name")
        .lean(),
      getActiveDirectors(),
      Client.find({ isActive: true, ...NOT_DELETED })
        .sort({ name: 1 })
        .select("name")
        .lean(),
    ]);

    return NextResponse.json({
      policies,
      directors,
      clients,
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

// POST — propose a finance policy for a client; the proposer's yes vote is
// recorded automatically
export async function POST(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const text = typeof body.body === "string" ? body.body.trim() : "";

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

    if (!mongoose.isValidObjectId(body.clientId)) {
      return NextResponse.json({ error: "Choose a client" }, { status: 400 });
    }

    await connectDB();
    const [client, directors] = await Promise.all([
      Client.findOne({ _id: body.clientId, ...NOT_DELETED }),
      getActiveDirectors(),
    ]);
    if (!client || client.isActive === false) {
      return NextResponse.json(
        { error: "Client not found or archived" },
        { status: 400 },
      );
    }

    const companyBps = toBps(body.split?.companyPercent);
    const entries: unknown = body.split?.directors;
    if (companyBps === null || !Array.isArray(entries)) {
      return NextResponse.json(
        { error: "Split percentages are invalid" },
        { status: 400 },
      );
    }
    const parsed = entries.map((e: { staff?: unknown; percent?: unknown }) => ({
      staff: String(e?.staff),
      bps: toBps(e?.percent),
    }));
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

    // Optional share for someone who isn't a director, such as an employee
    let outsourced: { name: string; bps: number } | undefined;
    if (body.split?.outsourced) {
      const name =
        typeof body.split.outsourced.name === "string"
          ? body.split.outsourced.name.trim()
          : "";
      const bps = toBps(body.split.outsourced.percent);
      if (!name || name.length > MAX_NAME || !bps) {
        return NextResponse.json(
          { error: "Give the outsourced person a name and a percentage" },
          { status: 400 },
        );
      }
      outsourced = { name, bps };
    }

    const total =
      companyBps +
      (outsourced?.bps ?? 0) +
      parsed.reduce((s, p) => s + (p.bps as number), 0);
    if (total !== 10000) {
      return NextResponse.json(
        { error: "All percentages must total 100%" },
        { status: 400 },
      );
    }
    const split = {
      companyBps,
      directors: parsed.map((p) => ({ staff: p.staff, bps: p.bps as number })),
      outsourced,
    };

    const policy = await Policy.create({
      title,
      body: text,
      type: "finance",
      client: client._id,
      split,
      proposedBy: auth.session.id,
      votes: [{ staff: auth.session.id, vote: "yes", at: new Date() }],
    });

    // With a single director the proposer's vote alone can decide it
    const outcome = evaluatePolicy([{ vote: "yes" }], directors.length);
    if (outcome === "approved") {
      await applyOutcome(String(policy._id), String(client._id), "approved");
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
