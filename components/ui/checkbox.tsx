import * as React from "react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      type="checkbox"
      className={cn("h-4 w-4 rounded border-input text-primary focus:ring-ring", className)}
    />
  )
);
Checkbox.displayName = "Checkbox";
