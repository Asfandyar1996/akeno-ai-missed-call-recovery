"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type ZipTagInputProps = {
  value: string[];
  onChange: (zips: string[]) => void;
};

export function ZipTagInput({ value, onChange }: ZipTagInputProps) {
  const [draft, setDraft] = useState("");
  const addZip = () => {
    const zip = draft.trim();
    if (!/^\d{5}(-\d{4})?$/.test(zip) || value.includes(zip)) return;
    onChange([...value, zip]);
    setDraft("");
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addZip();
            }
          }}
          placeholder="75219"
          inputMode="numeric"
        />
        <Button type="button" variant="outline" onClick={addZip}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((zip) => (
          <Badge key={zip} variant="muted" className="gap-1">
            {zip}
            <button type="button" aria-label={`Remove ${zip}`} onClick={() => onChange(value.filter((item) => item !== zip))}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
