import type { Metadata } from "next";
import { Bot, CheckCircle2, PhoneMissed, ShieldCheck } from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";
import { AkenoLogo } from "@/components/brand/akeno-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Styleguide | Akeno",
  description: "Akeno frontend design system and reusable interface patterns."
};

const colors = [
  ["Primary teal", "bg-primary", "Actions, links, active navigation"],
  ["Deep slate", "bg-slate-950", "Product shell, hero surfaces"],
  ["Warm paper", "bg-[#f7f5f0]", "Marketing background"],
  ["Urgent orange", "bg-orange-500", "Urgent lead states"],
  ["Success green", "bg-emerald-500", "Ready and verified states"]
];

export default function StyleguidePage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f7f5f0] text-slate-950">
      <LandingHeader variant="light" />

      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AkenoLogo />
          <h1 className="mt-6 text-4xl font-bold tracking-normal">Akeno styleguide</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Core visual language, UI components, and interaction patterns used across the missed-call recovery product.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Foundations</CardTitle>
              <CardDescription>Designed for clear operational scanning, not decorative clutter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {colors.map(([name, swatch, usage]) => (
                <div key={name} className="flex items-center gap-3">
                  <span className={`h-9 w-9 rounded-md ${swatch}`} />
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">{usage}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buttons and status</CardTitle>
              <CardDescription>Clear actions, compact badges, and restrained states.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-3">
                <Button>Primary action</Button>
                <Button variant="outline">Secondary action</Button>
                <Button variant="ghost">Quiet action</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="success">Verified</Badge>
                <Badge variant="warning">Urgent</Badge>
                <Badge variant="danger">Lost</Badge>
                <Badge variant="muted">Pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational cards</CardTitle>
              <CardDescription>Repeated cards use compact radius, stable spacing, and useful metadata.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {[
                [PhoneMissed, "Missed call", "Caller reached voicemail after hours."],
                [Bot, "AI intake", "Urgency and property details collected."],
                [ShieldCheck, "Human review", "Team confirms schedule and service decisions."]
              ].map(([Icon, title, text]) => (
                <div key={String(title)} className="rounded-lg border bg-muted/35 p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 font-semibold">{title as string}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forms</CardTitle>
              <CardDescription>Inputs are designed for onboarding and repeated operational edits.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company name</Label>
                <Input placeholder="RidgeLine Roofing" />
              </div>
              <div className="space-y-2">
                <Label>Notification email</Label>
                <Input placeholder="dispatch@example.com" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Lead summary</Label>
                <Textarea placeholder="Homeowner has active water intrusion after storm..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Accessibility notes
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-3">
              <p>Visible focus states and skip-to-content are available globally.</p>
              <p>Navigation exposes active page state where routes are known.</p>
              <p>Motion respects reduced-motion preferences.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
