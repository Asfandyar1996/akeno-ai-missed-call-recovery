import { NextResponse } from "next/server";
import { runSandboxWorkflowSetup } from "@/lib/services/onboarding-service";

export const runtime = "nodejs";

export async function POST() {
  try {
    return NextResponse.json(await runSandboxWorkflowSetup());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error" },
      { status: 400 }
    );
  }
}
