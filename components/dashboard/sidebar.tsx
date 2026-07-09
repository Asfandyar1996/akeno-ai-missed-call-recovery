"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Cable, LayoutDashboard, Settings, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

export const dashboardNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: UsersRound },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/integrations", label: "Integrations", icon: Cable }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 border-r bg-secondary text-secondary-foreground lg:block">
      <div className="p-5">
        <div className="rounded-lg bg-white/8 p-4">
          <BarChart3 className="h-6 w-6 text-cyan-300" />
          <p className="mt-3 text-sm font-semibold">Sandbox review mode</p>
          <p className="mt-1 text-xs text-white/70">Routes can be verified before production credentials are connected.</p>
        </div>
      </div>
      <nav className="space-y-1 px-3">
        {dashboardNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                active ? "bg-primary text-white" : "text-white/78 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
