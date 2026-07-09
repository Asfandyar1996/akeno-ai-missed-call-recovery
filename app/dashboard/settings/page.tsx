import { SettingsForm } from "@/components/dashboard/settings-form";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="soft-enter space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Edit company, roofing, service area, agent and notification settings.</p>
      </div>
      <SettingsForm />
    </div>
  );
}
