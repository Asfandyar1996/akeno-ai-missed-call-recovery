import { Textarea } from "@/components/ui/textarea";

type BusinessHoursEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function BusinessHoursEditor({ value, onChange }: BusinessHoursEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Monday-Friday 7:30 AM-5:30 PM, Saturday 8:00 AM-12:00 PM"
    />
  );
}
