// ma-nees
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Moon, Plus, Search, Sun, ChevronDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarContent } from "./Sidebar";
import { branches, currentUser } from "@/lib/mock-data";
import { LogoWithName } from "@/components/Logo";
import { ALL_BRANCHES, useSelectedBranch } from "@/hooks/use-selected-branch";

export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [branchId, setBranchId] = useSelectedBranch();
  const selectedBranchLabel =
    branchId === ALL_BRANCHES
      ? "All branches"
      : branches.find((branch) => branch.id === branchId)?.name || "All branches";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-1.5 sm:gap-2 border-b bg-background/80 px-2.5 sm:px-6 backdrop-blur-md">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 shrink-0"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border"
        >
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:hidden flex items-center shrink-0 text-foreground">
        <LogoWithName size={24} />
      </div>

      <div className="hidden md:flex flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search students, receipts, instructors..." className="pl-9 h-10" />
      </div>
      <div className="flex-1 md:hidden" />

      {/* Branch Selector (Mobile & Desktop) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-2 sm:px-3 gap-1 sm:gap-1.5 text-xs">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="hidden md:inline text-muted-foreground text-xs">Branch:</span>
            <span className="font-semibold truncate max-w-[70px] xs:max-w-[100px] sm:max-w-[130px]">
              {selectedBranchLabel}
            </span>
            <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-[10px] uppercase font-semibold text-muted-foreground">
            Select Branch
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setBranchId(ALL_BRANCHES)}
            className="font-medium text-xs"
          >
            All branches
          </DropdownMenuItem>
          {branches.map((b) => (
            <DropdownMenuItem
              key={b.id}
              onClick={() => setBranchId(b.id)}
              className="font-medium text-xs"
            >
              {b.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick Add */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            className="h-9 px-2.5 sm:px-3 gap-1.5 bg-accent-red text-accent-red-foreground hover:bg-accent-red/90 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline font-semibold text-xs">Quick Add</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/students/new">Add Student</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/instructors">Add Instructor</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/payments/new">Record Payment</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/branches">Add Branch</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 shrink-0"
        aria-label="Notifications"
      >
        <Bell className="h-4 sm:h-5 w-4 sm:w-5" />
        <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 p-0 flex items-center justify-center text-[10px] bg-accent-red">
          3
        </Badge>
      </Button>

      {/* Dark Theme Toggle (Desktop & Tablet) */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:flex h-9 w-9 shrink-0"
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {/* User Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-1.5 rounded-full p-0.5 hover:bg-accent transition-colors shrink-0"
            aria-label="Profile"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand text-brand-foreground text-xs font-semibold">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="text-sm font-semibold">{currentUser.name}</div>
            <div className="text-xs text-muted-foreground font-normal">{currentUser.role}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDark((d) => !d)}
            className="flex items-center justify-between sm:hidden"
          >
            <span>Theme Mode</span>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">Profile & Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/branding">Branding</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/login">Sign out</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

