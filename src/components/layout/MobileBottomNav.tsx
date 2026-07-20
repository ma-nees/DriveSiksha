import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Wallet, BarChart3, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/students", icon: Users, label: "Students" },
  { to: "/payments", icon: Wallet, label: "Payments" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
];

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur-md lg:hidden pb-[env(safe-area-inset-bottom)] shadow-lg">
      <div className="grid grid-cols-5 items-center h-14">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-medium transition-all",
                active ? "text-accent-red font-bold" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className={cn("p-1 rounded-xl transition-all", active && "bg-accent-red/10 text-accent-red scale-105")}>
                <Icon className="h-4 sm:h-5 w-4 sm:w-5" />
              </div>
              <span className="truncate max-w-[56px]">{it.label}</span>
            </Link>
          );
        })}

        {/* 5th Tab: Direct Navigation Menu Drawer */}
        <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-medium transition-all text-muted-foreground hover:text-foreground",
                openDrawer && "text-accent-red font-bold"
              )}
            >
              <div className={cn("p-1 rounded-xl transition-all", openDrawer && "bg-accent-red/10 text-accent-red scale-105")}>
                <Menu className="h-4 sm:h-5 w-4 sm:w-5" />
              </div>
              <span>Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border">
            <SidebarContent onNavigate={() => setOpenDrawer(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

