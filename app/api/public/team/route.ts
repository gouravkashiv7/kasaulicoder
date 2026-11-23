import { NextResponse } from "next/server";
import { getPublicTeam } from "@/backend/lib/team";

export async function GET() {
  try {
    return NextResponse.json(await getPublicTeam(), { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
