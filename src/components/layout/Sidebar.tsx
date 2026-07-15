import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, GraduationCap, CalendarClock, Wallet, Building2,
  Crown, BarChart3, ScrollText, Palette, Settings, LifeBuoy, LogOut,
} from "lucide-react";
import { LogoWithName } from "@/components/Logo";
import { cn } from "@/lib/utils";

export const navGroups = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    label: "Management",
    items: [
      { to: "/students", icon: Users, label: "Students" },
      { to: "/instructors", icon: GraduationCap, label: "Instructors" },
      { to: "/lessons", icon: CalendarClock, label: "Lessons" },
      { to: "/payments", icon: Wallet, label: "Payments" },
      { to: "/branches", icon: Building2, label: "Branches" },
    ],
  },
  {
    label: "Business",
    items: [
      { to: "/subscription", icon: Crown, label: "Subscription" },
      { to: "/reports", icon: BarChart3, label: "Reports & Analytics" },
      { to: "/audit", icon: ScrollText, label: "Audit Logs" },
    ],
  },
  {
    label: "Customization",
    items: [
      { to: "/branding", icon: Palette, label: "Branding" },
      { to: "/settings", icon: Settings, label: "Settings" },
    ],
  },
  {
    label: "Help",
    items: [{ to: "/support", icon: LifeBuoy, label: "Contact Support" }],
  },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
        <div className="text-sidebar-foreground">
          <LogoWithName size={34} />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.to || pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className={cn(
                        "group flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/login"
          className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </Link>
      </div>
    </div>
  );
}
