import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import Program from "@/backend/models/Program";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_kasaulicoder_secret_key",
);

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const existingCount = await Program.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        message: "Database already has programs. Seeding skipped.",
      });
    }

    const seedPrograms = [
      {
        name: "Impact Hackathons",
        tagline: "24 Hours of Pure Innovation",
        description:
          "Solve real-world problems for local industries and win mentorship grants, hardware, or project funding.",
        features: [
          "Real Industry Challenges",
          "Live Mentorship",
          "Peer-to-Peer Learning",
        ],
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBUjIZwuLqWl6dh4eOlGFo0ycE-j-7Skh1aS9OeZFXr-W0GtoUD5Bi9RdAfpUeqGwyTFhhKNOHk1mTyTUeVvQYPyUT4cFClDQJAzzjppbduoa6b7Sk1OB5lGuNM7-Td33UMuriw6PR83vvmXhl-BsZFohNPTGXTDu_a0Sazv0PiGzVo85ljuxki-fF8Fl9-jJhcsq09WgOAeArUw8M3i9tuSg4ctWNYBJNn_h--ln5NoixTpJ3GBRovIpfGbLI76H9tFjopuiWdhEM",
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Live Industry Projects",
        tagline: "Build for the Real World",
        description:
          "Collaborate on production-grade applications for our partners in Hospitality, Education, and Retail.",
        features: [
          "Agile Workflow",
          "Production Deployment",
          "Stack Versatility",
        ],
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD3tqacELC7IOG5O5GCGl4b1Pvu9Tcuvukohvh1-dCo-7cbB_23Y0k_b8Z6n6VODn_Qza4M1Sw1DKmIDcoCZY_XjsdQV_gjaEsJ9Rn9qby8jd5NkJAvtDisbTCN3EMfqD4fZq2NstWFQpiO_arauxtl3i6V4ATdpsaA7HzqwxbjpO4rEGf_w0b-dd9p9tM55Ar1D1ydB2EZG0r20ymuIxBQsLk7i0hXf7EMSOUcSyxi76YmGt6TWxjsZ_BoHecN0WXvuMAFs518bK0",
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Placement Accelerator",
        tagline: "From the Hills to the Hub",
        description:
          "Our elite cohort designed for final-year students and professionals looking to transition to top-tier tech roles.",
        features: [
          "Mock Interviews",
          "Resume Optimization",
          "100% Placement Support",
        ],
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBNnjilOXJ2vNg1jhZIkl3rk7kWphobcBmiIDBuiHotGtlU3DsWvUK6HMkjU088hyStkEA2ODgHUM64dREkN5DPhc9vJNSB58Afe9Qc7kUl29l3FB5kS9yEsd4RZFLAueeC9P6vvt2hc0h0Ab1Ry9JFQI5FbFy6dIDd63jDfOuxsrutcyTNE77V8GQ-L_at8DN7wj_CPy5Ay0yG2SVtsNKZtmSMtyBSL48qcu_Hu3WXwS-deVMbgs-qFJ-SXcSbelHDLiQFc_B-BVA",
        isActive: true,
        sortOrder: 3,
      },
    ];

    await Program.insertMany(seedPrograms);

    return NextResponse.json({ message: "Successfully seeded 3 programs." });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed programs" },
      { status: 500 },
    );
  }
}
