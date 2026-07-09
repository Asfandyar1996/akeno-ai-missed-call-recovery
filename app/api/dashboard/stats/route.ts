import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services/dashboard-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json(await getDashboardStats());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error" },
      { status: 500 }
    );
  }
}
