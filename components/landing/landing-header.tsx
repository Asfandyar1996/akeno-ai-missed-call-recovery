"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageSquareText, X } from "lucide-react";
import { useState } from "react";
import { AkenoLogo } from "@/components/brand/akeno-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#workflow", label: "Product" },
  { href: "/demo", label: "Demo" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" }
];

const compactNavItems = [
  { href: "/", label: "Home" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" }
];

type LandingHeaderProps = {
  variant?: "dark" | "light";
};

export function LandingHeader({ variant = "dark" }: LandingHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dark = variant === "dark";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 border-b backdrop-blur-xl",
          dark ? "border-white/10 bg-slate-950/72 text-white" : "border-slate-200 bg-white/92 text-slate-950"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "border lg:hidden",
                dark ? "border-white/12 bg-white/8 text-white hover:bg-white/12" : "border-slate-200 bg-white text-slate-950 hover:bg-slate-100"
              )}
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <AkenoLogo textClassName={dark ? "text-white" : "text-slate-950"} />
            </Link>
          </div>

          <nav
            className={cn(
              "hidden items-center gap-1 rounded-full border px-2 py-1 text-sm md:flex lg:hidden",
              dark ? "border-white/10 bg-white/7 text-white/74" : "border-slate-200 bg-slate-50 text-slate-600"
            )}
            aria-label="Compact navigation"
          >
            {compactNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 font-medium transition",
                    active
                      ? dark ? "bg-white/12 text-white" : "bg-white text-slate-950 shadow-sm"
                      : dark ? "hover:bg-white/10 hover:text-white" : "hover:bg-white hover:text-slate-950 hover:shadow-sm"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <nav
            className={cn(
              "hidden items-center gap-1 rounded-full border px-2 py-1 text-sm lg:flex",
              dark ? "border-white/10 bg-white/7 text-white/74" : "border-slate-200 bg-slate-50 text-slate-600"
            )}
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 font-medium transition",
                  pathname === item.href
                    ? dark ? "bg-white/12 text-white" : "bg-white text-slate-950 shadow-sm"
                    : dark ? "hover:bg-white/10 hover:text-white" : "hover:bg-white hover:text-slate-950 hover:shadow-sm"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/dashboard"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold transition",
                dark ? "border-white/14 bg-white/7 text-white hover:bg-white/12" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              )}
            >
              Client console
            </Link>
            <Link
              href="/onboarding?start=1"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition",
                dark ? "bg-white text-slate-950 hover:bg-cyan-100" : "bg-slate-950 text-white hover:bg-slate-800"
              )}
            >
              Start setup
            </Link>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/55 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 max-w-[86vw] border-r border-white/10 bg-[#101927] text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile homepage navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <AkenoLogo textClassName="text-white" markClassName="h-9 w-9 rounded-lg shadow-none" />
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
              <MessageSquareText className="h-4 w-4" />
              Akeno recovery demo
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Navigate the product, demo, pricing, privacy policy, and client dashboard.
            </p>
          </div>
        </div>

        <nav className="space-y-1 px-3">
          {[...navItems, { href: "/dashboard", label: "Client console" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex rounded-md px-3 py-3 text-sm font-medium text-white/78 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <Link
            href="/onboarding?start=1"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-cyan-400 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Start setup
          </Link>
        </div>
      </aside>
    </>
  );
}
