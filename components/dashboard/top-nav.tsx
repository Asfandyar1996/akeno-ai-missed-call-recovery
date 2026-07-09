"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Menu, Search, X } from "lucide-react";
import { AkenoLogo } from "@/components/brand/akeno-logo";
import { dashboardNav } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function TopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>

          <Link href="/" className="flex items-center gap-2 font-semibold text-secondary">
            <AkenoLogo markClassName="h-9 w-9 rounded-lg shadow-none" textClassName="text-secondary" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Public navigation">
            {[
              ["/", "Home"],
              ["/privacy", "Privacy"],
              ["/contact", "Contact"]
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex h-9 items-center rounded-md px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-slate-950"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden w-full max-w-sm items-center gap-2 rounded-md border bg-white px-3 md:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input className="border-0 px-0 shadow-none focus-visible:ring-0" placeholder="Search leads, calls, settings" />
          </div>

          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/45 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 max-w-[86vw] border-r bg-secondary text-secondary-foreground shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile dashboard navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <AkenoLogo textClassName="text-white" markClassName="h-9 w-9 rounded-lg shadow-none" />
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" aria-label="Close navigation" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="rounded-lg bg-white/8 p-4">
            <p className="text-sm font-semibold">Client dashboard</p>
            <p className="mt-1 text-xs leading-5 text-white/70">
              Review recovered leads, setup status, integrations, and notification settings.
            </p>
          </div>
        </div>

        <nav className="space-y-1 px-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-white/78 transition hover:bg-white/10 hover:text-white"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <div className="my-2 border-t border-white/10" />
          {dashboardNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition",
                  active ? "bg-primary text-white" : "text-white/78 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="my-2 border-t border-white/10" />
          {[
            ["/privacy", "Privacy"],
            ["/contact", "Contact"]
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex rounded-md px-3 py-3 text-sm font-medium text-white/78 transition hover:bg-white/10 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
