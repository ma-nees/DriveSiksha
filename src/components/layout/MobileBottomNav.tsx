import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Wallet, BarChart3, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/students", icon: Users, label: "Students" },
  { to: "/payments", icon: Wallet, label: "Payments" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/settings", icon: MoreHorizontal, label: "More" },
];

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur-md lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const active = pathname === it.to || pathname.startsWith(it.to + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[10px] font-medium transition-colors",
                active ? "text-accent-red" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
