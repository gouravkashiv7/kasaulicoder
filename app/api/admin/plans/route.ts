import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Plan from "@/backend/models/Plan";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

// Middleware: verify superadmin
async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "superadmin") return null;
    return payload;
  } catch {
    return null;
  }
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
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
