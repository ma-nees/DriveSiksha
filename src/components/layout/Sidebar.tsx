// ma-nees
import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarClock,
  Wallet,
  Building2,
  Crown,
  BarChart3,
  ScrollText,
  Palette,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { LogoWithName } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";

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
  const [isVerified, setIsVerified] = useState(false);
  const { user, signOut } = useAuth();
  const activeUser = user ? { name: user.full_name, role: user.role.replace(/_/g, ' ') } : currentUser;

  useEffect(() => {
    setIsVerified(!!localStorage.getItem("drivesiksha_certificate"));
    const handleStorage = () => {
      setIsVerified(!!localStorage.getItem("drivesiksha_certificate"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground select-none">
      {/* Drawer / Sidebar Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
        <LogoWithName size={32} />
      </div>

      {/* Scrollable Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar pb-20 lg:pb-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.to ||
                  (item.to !== "/dashboard" && pathname.startsWith(item.to));
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className={cn(
                        "group flex min-h-[44px] items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all",
                        active
                          ? "bg-accent-red text-accent-red-foreground shadow-sm font-semibold"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      )}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0",
                            active
                              ? "text-accent-red-foreground"
                              : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground",
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {active && <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Drawer / Sidebar Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-2 bg-sidebar/95">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-sidebar-accent/40 border border-sidebar-border/40">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-brand text-brand-foreground text-xs font-bold">
              {activeUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold truncate text-sidebar-foreground flex items-center gap-1">
              {activeUser.name}
              {isVerified && (
                <CheckCircle2 className="h-3 w-3 text-emerald-500 fill-emerald-500/10 shrink-0" />
              )}
            </div>
            <div className="text-[10px] text-sidebar-foreground/60 truncate">
              {activeUser.role}
            </div>
          </div>
        </div>

        <button
          onClick={async () => {
            if (onNavigate) onNavigate();
            await signOut();
          }}
          className="flex min-h-[40px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-accent-red hover:bg-accent-red/10 transition-colors w-full border border-accent-red/20 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out Account
        </button>
      </div>
    </div>
  );
}
