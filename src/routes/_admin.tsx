import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarContent } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-dvh bg-muted/30 overflow-x-hidden">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent />
      </aside>
      <div className="lg:pl-64 min-w-0">
        <Header />
        <main className="mx-auto max-w-[1600px] px-3 py-4 pb-24 sm:px-6 sm:py-6 lg:pb-8 min-w-0">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
      <Toaster position="top-right" richColors />
    </div>
  );
}
