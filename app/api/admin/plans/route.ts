import { getServerSession } from "@/backend/lib/auth";
import { NextResponse } from "next/server";
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
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update an existing plan
export async function PUT(req: Request) {
  const admin = await verifySuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 },
      );
    }

    // If switching to one_time, clear billingCycle
    if (updates.billingType === "one_time") {
      updates.billingCycle = null;
    }

    const plan = await Plan.findByIdAndUpdate(id, updates, { new: true });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Plan updated", plan },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
