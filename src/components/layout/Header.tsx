import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Moon, Plus, Search, Sun, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarContent } from "./Sidebar";
import { branches, currentUser } from "@/lib/mock-data";

export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [branch, setBranch] = useState(branches[0].name);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search students, receipts, instructors..." className="pl-9 h-10" />
      </div>
      <div className="flex-1 md:hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-1.5 h-10">
            <span className="hidden md:inline text-muted-foreground text-xs">Branch:</span>
            <span className="font-medium truncate max-w-[120px]">{branch}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {branches.map((b) => (
            <DropdownMenuItem key={b.id} onClick={() => setBranch(b.name)}>
              {b.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="h-10 gap-1.5 bg-accent-red text-accent-red-foreground hover:bg-accent-red/90">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Add</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild><Link to="/students/new">Add Student</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/instructors">Add Instructor</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/payments/new">Record Payment</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/branches">Add Branch</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Notifications">
        <Bell className="h-5 w-5" />
        <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 p-0 flex items-center justify-center text-[10px] bg-accent-red">3</Badge>
      </Button>

      <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
        {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors" aria-label="Profile">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand text-brand-foreground text-xs font-semibold">
                {currentUser.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
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
          <DropdownMenuItem asChild><Link to="/settings">Profile & Settings</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/branding">Branding</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to="/login">Sign out</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
