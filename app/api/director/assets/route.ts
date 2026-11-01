import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireDirector } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import { toPaise } from "@/backend/lib/money";
import { domainName } from "@/backend/lib/proofFormat";
import { NOT_DELETED } from "@/backend/lib/softDelete";
import CompanyAsset, {
  ASSET_KINDS,
  COST_PERIODS,
} from "@/backend/models/CompanyAsset";

const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

// "" clears a date; otherwise it must be a real YYYY-MM-DD day.
function parseDay(value: unknown): Date | null | false {
  if (value === "" || value === null || value === undefined) return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const day = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(day.getTime()) ? false : day;
}

type Fields = {
  kind: string;
  name: string;
  registrar: string;
  expiresOn: Date | null;
  autoRenew: boolean;
  costPaise: number | null;
  costPeriod: string;
  purchasedOn: Date | null;
  notes: string;
};

function parseFields(
  body: Record<string, unknown>,
): Fields | { error: string } {
  const kind = String(body.kind);
  if (!(ASSET_KINDS as readonly string[]).includes(kind)) {
    return { error: "Choose what kind of asset this is" };
  }
  const name =
    kind === "domain"
      ? domainName(String(body.name ?? ""))
      : clip(body.name, 120);
  if (!name) {
    return {
      error:
        kind === "domain"
          ? "Enter a valid domain, like example.com"
          : "Name is required",
    };
  }
  const expiresOn = parseDay(body.expiresOn);
  const purchasedOn = parseDay(body.purchasedOn);
  if (expiresOn === false || purchasedOn === false) {
    return { error: "Enter dates as YYYY-MM-DD" };
  }
  let costPaise: number | null = null;
  if (body.cost !== "" && body.cost !== undefined && body.cost !== null) {
    costPaise = toPaise(
      typeof body.cost === "number" || typeof body.cost === "string"
        ? body.cost
        : "",
    );
    if (costPaise === null) {
      return { error: "Enter a valid cost in rupees (up to 2 decimals)" };
    }
  }
  const costPeriod = String(body.costPeriod ?? "yearly");
  if (!(COST_PERIODS as readonly string[]).includes(costPeriod)) {
    return { error: "Choose how often the cost is paid" };
  }
  return {
    kind,
    name,
    registrar: clip(body.registrar, 120),
    expiresOn,
    autoRenew: body.autoRenew === true,
    costPaise,
    costPeriod,
    purchasedOn,
    notes: clip(body.notes, 1000),
  };
}

// GET — all assets, domains first by soonest expiry
export async function GET() {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    await connectDB();
    const assets = await CompanyAsset.find({ ...NOT_DELETED })
      .sort({ name: 1 })
      .lean();
    return NextResponse.json(assets);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// A domain can only be listed once
async function domainTaken(name: string, exceptId?: string) {
  return CompanyAsset.exists({
    kind: "domain",
    name,
    ...(exceptId ? { _id: { $ne: exceptId } } : {}),
    ...NOT_DELETED,
  });
}

// POST — add an asset
export async function POST(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const fields = parseFields(await req.json());
    if ("error" in fields) {
      return NextResponse.json({ error: fields.error }, { status: 400 });
    }

    await connectDB();
    if (fields.kind === "domain" && (await domainTaken(fields.name))) {
      return NextResponse.json(
        { error: "That domain is already listed" },
        { status: 409 },
      );
    }
    const asset = await CompanyAsset.create({
      ...fields,
      expiresOn: fields.expiresOn ?? undefined,
      purchasedOn: fields.purchasedOn ?? undefined,
      costPaise: fields.costPaise ?? undefined,
      createdBy: auth.session.id,
    });
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT — edit an asset: { id, ...fields }
export async function PUT(req: Request) {
  try {
    const auth = await requireDirector();
    if ("error" in auth) return auth.error;

    const body = await req.json();
    if (!mongoose.isValidObjectId(body.id)) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }
    const fields = parseFields(body);
    if ("error" in fields) {
      return NextResponse.json({ error: fields.error }, { status: 400 });
    }

    await connectDB();
    if (
      fields.kind === "domain" &&
      (await domainTaken(fields.name, String(body.id)))
    ) {
      return NextResponse.json(
        { error: "That domain is already listed" },
        { status: 409 },
      );
    }
    // A blank date or cost clears what was there
    const set: Record<string, unknown> = {
      kind: fields.kind,
      name: fields.name,
      registrar: fields.registrar,
      autoRenew: fields.autoRenew,
      costPeriod: fields.costPeriod,
      notes: fields.notes,
    };
    const unset: Record<string, 1> = {};
    for (const [key, value] of [
      ["expiresOn", fields.expiresOn],
      ["purchasedOn", fields.purchasedOn],
      ["costPaise", fields.costPaise],
    ] as const) {
      if (value === null) unset[key] = 1;
      else set[key] = value;
    }
    const asset = await CompanyAsset.findOneAndUpdate(
      { _id: body.id, ...NOT_DELETED },
      Object.keys(unset).length ? { $set: set, $unset: unset } : { $set: set },
      { new: true },
    );
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }
    return NextResponse.json(asset);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
