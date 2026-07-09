"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const labels = ["Company", "Services", "Area", "Phone", "AI agent", "Destination", "Alerts", "Review"];

export function OnboardingProgress({ step, setStep }: { step: number; setStep: (step: number) => void }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Setup progress</p>
          <p className="text-xs text-muted-foreground">Step {step} of 8</p>
        </div>
        <span className="text-sm font-semibold text-primary">{Math.round((step / 8) * 100)}%</span>
      </div>
      <Progress value={(step / 8) * 100} className="mt-3" />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {labels.map((label, index) => {
          const itemStep = index + 1;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setStep(itemStep)}
              className={cn(
                "rounded-md px-2 py-2 text-xs font-medium",
                itemStep === step ? "bg-primary text-white" : itemStep < step ? "bg-cyan-100 text-cyan-950" : "bg-muted text-muted-foreground"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
