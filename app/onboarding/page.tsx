import { Suspense } from "react";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { LoadingSkeleton } from "@/components/ui/states";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-5xl px-4 py-8"><LoadingSkeleton label="Loading onboarding setup..." /></main>}>
      <OnboardingWizard />
    </Suspense>
  );
}
