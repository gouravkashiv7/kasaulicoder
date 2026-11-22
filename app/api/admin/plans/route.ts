import { NextResponse } from "next/server";
import { getServerSession } from "@/backend/lib/auth";
import connectDB from "@/backend/lib/db";
import Plan from "@/backend/models/Plan";

// Middleware: verify superadmin
async function verifySuperAdmin() {
  const session = await getServerSession();
  if (session?.role !== "superadmin") return null;
  return session;
}

// GET: List all plans (including inactive for admin)
export async function GET() {
  const admin = await verifySuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const plans = await Plan.find().sort({ sortOrder: 1 });
    return NextResponse.json({ plans }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST: Create a new plan
export async function POST(req: Request) {
  const admin = await verifySuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      description,
      price,
      currency,
      billingType,
      billingCycle,
      features,
      targetAudience,
      isFeatured,
      isActive,
      sortOrder,
    } = body;

    if (!name || price === undefined || !billingType) {
      return NextResponse.json(
        { error: "Name, price, and billingType are required" },
        { status: 400 },
      );
    }

    if (billingType === "recurring" && !billingCycle) {
      return NextResponse.json(
        { error: "billingCycle is required for recurring plans" },
        { status: 400 },
      );
    }

    const plan = await Plan.create({
      name,
      description,
      price,
      currency: currency || "INR",
      billingType,
      billingCycle: billingType === "recurring" ? billingCycle : null,
      features: features || [],
      targetAudience: targetAudience || "both",
      isFeatured: isFeatured || false,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
    });

    return NextResponse.json(
      { message: "Plan created", plan },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Fields an admin may change on an existing plan
const UPDATABLE_PLAN_FIELDS = [
  "name",
  "description",
  "price",
  "currency",
  "billingType",
  "billingCycle",
  "features",
  "targetAudience",
  "isFeatured",
  "isActive",
  "sortOrder",
] as const;

// PUT: Update an existing plan
export async function PUT(req: Request) {
  const admin = await verifySuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 },
      );
    }

    const updates: Record<string, unknown> = {};
    for (const key of UPDATABLE_PLAN_FIELDS) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const existing = await Plan.findById(id).select("billingType billingCycle");
    if (!existing) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const billingType = updates.billingType ?? existing.billingType;
    if (billingType === "one_time") {
      // One-time plans have no billing cycle
      updates.billingCycle = null;
    } else if (
      billingType === "recurring" &&
      !(updates.billingCycle ?? existing.billingCycle)
    ) {
      return NextResponse.json(
        { error: "billingCycle is required for recurring plans" },
        { status: 400 },
      );
    }

    const plan = await Plan.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Plan updated", plan },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE: Delete a plan
export async function DELETE(req: Request) {
  const admin = await verifySuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 },
      );
    }

    const plan = await Plan.findByIdAndDelete(id);

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Plan deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
