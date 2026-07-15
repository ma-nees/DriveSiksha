import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Filter, FileDown, FileSpreadsheet, LayoutGrid, List, MoreVertical, Plus, Eye, Edit, Wallet, Archive, Trash2 } from "lucide-react";
import { students, branches } from "@/lib/mock-data";
import { formatNPR } from "@/lib/format";
import type { Student } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/students")({
  component: StudentsPage,
  head: () => ({
    meta: [
      { title: "Students — DriveSiksha" },
      { name: "description", content: "Search, filter and manage all driving school students, their instructor, lesson progress and payment status." },
    ],
  }),
});

const statusTone = { active: "success", completed: "info", on_leave: "warning", archived: "neutral" } as const;
const payTone = { paid: "success", partial: "warning", unpaid: "danger" } as const;

function StudentsPage() {
  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [view, setView] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => students.filter((s) => {
    if (branch !== "all" && s.branchId !== branch) return false;
    if (status !== "all" && s.status !== status) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.studentId.toLowerCase().includes(q) && !s.phone.includes(q)) return false;
    }
    return true;
  }), [query, branch, status]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  return (
    <>
      <PageHeader
        title="Students"
        description={filtered.length + " students found across your school"}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9"><FileDown className="h-4 w-4 mr-1.5" />PDF</Button>
            <Button variant="outline" size="sm" className="h-9"><FileSpreadsheet className="h-4 w-4 mr-1.5" />Excel</Button>
            <Button size="sm" className="h-9 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground" asChild>
              <Link to="/students/new"><Plus className="h-4 w-4 mr-1.5" />Add Student</Link>
            </Button>
          </>
        }
      />

      {/* Toolbar */}
      <Card className="mb-4">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, phone, student ID, or receipt no…" className="pl-9 h-10" />
            </div>
            <div className="hidden lg:flex gap-2">
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="h-10 w-[160px]"><SelectValue placeholder="Branch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All branches</SelectItem>
                  {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10 w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-md border p-0.5">
                <Button variant={view === "table" ? "secondary" : "ghost"} size="sm" className="h-9 px-2.5" onClick={() => setView("table")}><List className="h-4 w-4" /></Button>
                <Button variant={view === "cards" ? "secondary" : "ghost"} size="sm" className="h-9 px-2.5" onClick={() => setView("cards")}><LayoutGrid className="h-4 w-4" /></Button>
              </div>
            </div>
            {/* mobile filter drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 lg:hidden"><Filter className="h-4 w-4 mr-1.5" />Filters</Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80dvh]">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Branch</label>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All branches</SelectItem>
                        {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* Desktop table */}
      {view === "table" && (
        <Card className="hidden md:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((s) => <StudentRow key={s.id} s={s} />)}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Mobile cards */}
      <div className={"space-y-3 " + (view === "table" ? "md:hidden" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-3")}>
        {paged.map((s) => <StudentCard key={s.id} s={s} />)}
      </div>

      {paged.length === 0 && (
        <Card><CardContent className="p-10 text-center text-muted-foreground text-sm">No students match your filters.</CardContent></Card>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-muted-foreground">Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      </div>
    </>
  );
}

function StudentRow({ s }: { s: Student }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-brand/10 text-brand grid place-items-center font-semibold text-xs shrink-0">
            {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <Link to="/students/$id" params={{ id: s.id }} className="text-sm font-medium hover:underline truncate block">{s.name}</Link>
            <div className="text-xs text-muted-foreground">{s.studentId} · {s.phone}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm">{s.branch}</TableCell>
      <TableCell className="text-sm">{s.instructor}</TableCell>
      <TableCell>
        <div className="w-32">
          <div className="flex justify-between text-[11px] mb-1"><span>{s.completedLessons}/{s.totalLessons}</span><span className="text-muted-foreground">{Math.round(s.completedLessons / s.totalLessons * 100)}%</span></div>
          <Progress value={s.completedLessons / s.totalLessons * 100} className="h-1.5" />
        </div>
      </TableCell>
      <TableCell><StatusBadge tone={payTone[s.paymentStatus]}>{s.paymentStatus}</StatusBadge></TableCell>
      <TableCell><StatusBadge tone={statusTone[s.status]}>{s.status.replace("_", " ")}</StatusBadge></TableCell>
      <TableCell className="text-right"><RowActions studentId={s.id} /></TableCell>
    </TableRow>
  );
}

function StudentCard({ s }: { s: Student }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-full bg-brand/10 text-brand grid place-items-center font-semibold shrink-0">
            {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link to="/students/$id" params={{ id: s.id }} className="font-semibold truncate block hover:underline">{s.name}</Link>
                <div className="text-xs text-muted-foreground">{s.studentId}</div>
              </div>
              <RowActions studentId={s.id} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{s.phone} · {s.branch}</div>
            <div className="mt-1 text-xs text-muted-foreground truncate">Instructor: {s.instructor}</div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] mb-1"><span>{s.completedLessons} of {s.totalLessons} lessons</span><span className="text-muted-foreground">{Math.round(s.completedLessons / s.totalLessons * 100)}%</span></div>
              <Progress value={s.completedLessons / s.totalLessons * 100} className="h-1.5" />
            </div>
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <StatusBadge tone={statusTone[s.status]}>{s.status.replace("_", " ")}</StatusBadge>
              <StatusBadge tone={payTone[s.paymentStatus]}>{s.paymentStatus}</StatusBadge>
              <span className="text-xs text-muted-foreground ml-auto">{formatNPR(s.amountPaid)} / {formatNPR(s.courseFee)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RowActions({ studentId }: { studentId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild><Link to="/students/$id" params={{ id: studentId }}><Eye className="h-4 w-4 mr-2" />View profile</Link></DropdownMenuItem>
        <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/payments/new"><Wallet className="h-4 w-4 mr-2" />Record payment</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast.success("Student archived")}><Archive className="h-4 w-4 mr-2" />Archive</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => toast.error("Cannot delete active student")}><Trash2 className="h-4 w-4 mr-2" />Delete record</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
