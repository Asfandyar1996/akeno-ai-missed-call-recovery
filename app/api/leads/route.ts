import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getLeads, createLead, createTestLead } from "@/lib/services/lead-service";
import { leadSchema } from "@/lib/schemas";

export const runtime = "nodejs";

function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", issues: error.flatten() }, { status: 400 });
  }
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Unexpected server error" },
    { status: 500 }
  );
}

export async function GET() {
  try {
    return NextResponse.json({ leads: await getLeads() });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = body?.test === true ? await createTestLead() : await createLead(leadSchema.parse(body));
    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
