// ma-nees
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarContent } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";

import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
