import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Eye, Edit, CalendarClock } from "lucide-react";
import { instructors, branches } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/instructors")({
  component: InstructorsPage,
  head: () => ({ meta: [{ title: "Instructors — DriveSiksha" }, { name: "description", content: "Manage all driving instructors, schedules and licences." }] }),
});

function InstructorsPage() {
  const [q, setQ] = useState("");
  const [branch, setBranch] = useState("all");
  const filtered = useMemo(() =>
    instructors.filter((i) => (branch === "all" || i.branchId === branch) && (!q || i.name.toLowerCase().includes(q.toLowerCase())))
  , [q, branch]);

  return (
    <>
      <PageHeader title="Instructors" description={filtered.length + " instructors"} actions={
        <Button size="sm" className="h-9 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground" onClick={() => toast.success("Add instructor form opened")}>
          <Plus className="h-4 w-4 mr-1.5" />Add Instructor
        </Button>
      } />

      <Card className="mb-4">
        <CardContent className="p-3 sm:p-4 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search instructors…" className="pl-9 h-10" />
          </div>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="h-10 sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Desktop */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Instructor</TableHead><TableHead>Branch</TableHead><TableHead>Assigned</TableHead>
              <TableHead>Today</TableHead><TableHead>Licence</TableHead><TableHead>Availability</TableHead>
              <TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-sky/15 text-sky grid place-items-center font-semibold text-xs">{i.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</div>
                      <div><div className="font-medium text-sm">{i.name}</div><div className="text-xs text-muted-foreground">{i.phone}</div></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{i.branch}</TableCell>
                  <TableCell className="text-sm">{i.assignedStudents} students</TableCell>
                  <TableCell className="text-sm">{i.todayLessons} lessons</TableCell>
                  <TableCell><StatusBadge tone="info">{i.licenseCategory}</StatusBadge></TableCell>
                  <TableCell><StatusBadge tone={i.leaveStatus === "available" ? "success" : "warning"}>{i.leaveStatus.replace("_", " ")}</StatusBadge></TableCell>
                  <TableCell><StatusBadge tone={i.accountStatus === "active" ? "success" : "neutral"}>{i.accountStatus}</StatusBadge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View profile</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem><CalendarClock className="h-4 w-4 mr-2" />Schedule</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3 sm:grid-cols-2">
        {filtered.map((i) => (
          <Card key={i.id}><CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-full bg-sky/15 text-sky grid place-items-center font-semibold shrink-0">{i.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{i.name}</div>
                <div className="text-xs text-muted-foreground">{i.phone} · {i.branch}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <StatusBadge tone="info">{i.licenseCategory}</StatusBadge>
                  <StatusBadge tone={i.leaveStatus === "available" ? "success" : "warning"}>{i.leaveStatus.replace("_", " ")}</StatusBadge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{i.assignedStudents} students · {i.todayLessons} lessons today</div>
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </>
  );
}
