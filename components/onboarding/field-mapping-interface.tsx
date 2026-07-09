"use client";

import { standardLeadFields } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldMappingInterfaceProps = {
  value: Partial<Record<(typeof standardLeadFields)[number], string>>;
  onChange: (value: Partial<Record<(typeof standardLeadFields)[number], string>>) => void;
};

export function FieldMappingInterface({ value, onChange }: FieldMappingInterfaceProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {standardLeadFields.map((field) => (
        <div key={field} className="space-y-1">
          <Label>{field}</Label>
          <Input
            value={value[field] ?? ""}
            onChange={(event) => onChange({ ...value, [field]: event.target.value })}
            placeholder={`Existing column for ${field}`}
          />
        </div>
      ))}
    </div>
  );
}
