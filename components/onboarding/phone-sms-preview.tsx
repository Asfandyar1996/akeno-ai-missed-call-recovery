import { MessageCircle } from "lucide-react";

type PhoneSmsPreviewProps = {
  companyName: string;
  greeting: string;
};

export function PhoneSmsPreview({ companyName, greeting }: PhoneSmsPreviewProps) {
  const message = greeting.replace("[Company Name]", companyName || "Your Roofing Company");
  return (
    <div className="rounded-[2rem] border bg-slate-950 p-3 shadow-soft">
      <div className="rounded-[1.5rem] bg-slate-100 p-4">
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-slate-300" />
        <div className="mb-4 flex items-center gap-2 border-b pb-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">{companyName || "Roofing Company"}</p>
            <p className="text-xs text-slate-500">SMS preview</p>
          </div>
        </div>
        <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm leading-relaxed text-white">
          {message}
        </div>
        <p className="mt-4 text-xs text-slate-500">The production agent will stay limited to roofing intake and qualification.</p>
      </div>
    </div>
  );
}
