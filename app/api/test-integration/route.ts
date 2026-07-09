import { NextResponse } from "next/server";
import { z } from "zod";
import { testIntegration } from "@/lib/services/dashboard-service";

export const runtime = "nodejs";

const schema = z.object({ provider: z.string().min(2) });

export async function POST(request: Request) {
  try {
    const { provider } = schema.parse(await request.json());
    return NextResponse.json(await testIntegration(provider));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error" },
      { status: 400 }
    );
  }
}
