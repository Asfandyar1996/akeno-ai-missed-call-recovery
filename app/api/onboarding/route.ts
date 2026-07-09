import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getLatestOnboarding, upsertOnboarding } from "@/lib/services/onboarding-service";
import { companySchema, onboardingSchema, type OnboardingInput } from "@/lib/schemas";

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
    return NextResponse.json(await getLatestOnboarding());
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = onboardingSchema.parse(await request.json());
    const result = await upsertOnboarding(body, "submitted");
    return NextResponse.json({ ok: true, clientId: result.client.id, profileId: result.profile.id });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as OnboardingInput;
    companySchema.parse(body.company);
    const result = await upsertOnboarding(body, body.currentStep >= 8 ? "review_ready" : "draft");
    return NextResponse.json({ ok: true, clientId: result.client.id, profileId: result.profile.id });
  } catch (error) {
    return apiError(error);
  }
}
