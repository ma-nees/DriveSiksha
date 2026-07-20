import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
import { Search, Filter, FileDown, FileSpreadsheet, LayoutGrid, List, MoreVertical, Plus, Eye, Edit, Wallet, Archive, Trash2, Phone, MapPin, User, GraduationCap } from "lucide-react";
import { currentSchool, students, branches } from "@/lib/mock-data";
import { formatNPR } from "@/lib/format";
import type { Student } from "@/lib/types";
import { toast } from "sonner";
import { LogoWithName } from "@/components/Logo";

export const Route = createFileRoute("/_admin/students/")({
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

  const exportToCSV = () => {
    const headers = ["Student ID", "Name", "Phone", "Branch", "Instructor", "Course", "Lessons Progress", "Fee (NPR)", "Amount Paid", "Payment Status", "Status"];
    const rows = filtered.map(s => [
      s.studentId,
      s.name,
      s.phone,
      s.branch,
      s.instructor,
      s.course,
      `${s.completedLessons}/${s.totalLessons}`,
      s.courseFee,
      s.amountPaid,
      s.paymentStatus,
      s.status
    ]);
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `students_report_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel CSV report exported successfully!");
  };

  return (
    <>
      <div className="no-print">
        <PageHeader
          title="Students"
          description={filtered.length + " students found across your school"}
          actions={
            <>
              <Button variant="outline" size="sm" className="h-9" onClick={() => window.print()}><FileDown className="h-4 w-4 mr-1.5" />PDF</Button>
              <Button variant="outline" size="sm" className="h-9" onClick={exportToCSV}><FileSpreadsheet className="h-4 w-4 mr-1.5" />Excel</Button>
              <Link to="/students/new" className={cn(buttonVariants({ size: "sm" }), "h-9 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground")}>
                <Plus className="h-4 w-4 mr-1.5" />Add Student
              </Link>
            </>
          }
        />
      </div>

      {/* Printable Area for PDF Export */}
      <div className="print-area hidden print:block text-black bg-white p-4">
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <LogoWithName size={36} />
            <div className="text-xs text-gray-600 mt-1">{currentSchool.name} · {currentSchool.address}</div>
            <div className="text-xs text-gray-600">Contact: {currentSchool.phone} · {currentSchool.email}</div>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold uppercase tracking-wide text-gray-900">Students Report</h1>
            <div className="text-xs text-gray-500 mt-1">Date Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
            <div className="text-xs text-gray-500">Total Records: {filtered.length}</div>
          </div>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-50">
              <th className="p-2 font-semibold">ID</th>
              <th className="p-2 font-semibold">Student Name</th>
              <th className="p-2 font-semibold">Phone</th>
              <th className="p-2 font-semibold">Branch</th>
              <th className="p-2 font-semibold">Instructor</th>
              <th className="p-2 font-semibold">Course</th>
              <th className="p-2 font-semibold">Progress</th>
              <th className="p-2 font-semibold text-right">Fee (NPR)</th>
              <th className="p-2 font-semibold text-right">Paid</th>
              <th className="p-2 font-semibold">Payment</th>
              <th className="p-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 font-medium">{s.studentId}</td>
                <td className="p-2 font-semibold">{s.name}</td>
                <td className="p-2">{s.phone}</td>
                <td className="p-2">{s.branch}</td>
                <td className="p-2">{s.instructor}</td>
                <td className="p-2">{s.course}</td>
                <td className="p-2">{s.completedLessons}/{s.totalLessons}</td>
                <td className="p-2 text-right">{formatNPR(s.courseFee)}</td>
                <td className="p-2 text-right">{formatNPR(s.amountPaid)}</td>
                <td className="p-2 capitalize">{s.paymentStatus}</td>
                <td className="p-2 capitalize">{s.status.replace("_", " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toolbar */}
      <Card className="mb-4 no-print">
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
        <Card className="hidden md:block no-print">
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
                  <TableHead className="text-right no-print">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((s) => <StudentRow key={s.id} s={s} />)}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Cards & Mobile view container */}
      <div className={"no-print " + (view === "table" ? "space-y-3 md:hidden" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4")}>
        {paged.map((s) => <StudentCard key={s.id} s={s} />)}
      </div>

      {paged.length === 0 && (
        <Card className="no-print"><CardContent className="p-10 text-center text-muted-foreground text-sm">No students match your filters.</CardContent></Card>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm no-print">
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
      <TableCell className="text-right no-print"><RowActions studentId={s.id} /></TableCell>
    </TableRow>
  );
}

function StudentCard({ s }: { s: Student }) {
  const progressPct = Math.round((s.completedLessons / s.totalLessons) * 100);

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-brand/40 flex flex-col justify-between">
      <CardContent className="p-4 sm:p-5 flex flex-col h-full justify-between gap-4">
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 rounded-full bg-brand/10 text-brand grid place-items-center font-bold text-sm shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <Link to="/students/$id" params={{ id: s.id }} className="font-semibold text-base truncate block hover:underline group-hover:text-brand transition-colors">
                  {s.name}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                  <span className="font-mono bg-muted/70 px-1.5 py-0.5 rounded text-[11px] font-medium">{s.studentId}</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/40"></span>
                  <span className="truncate">{s.course}</span>
                </div>
              </div>
            </div>
            <RowActions studentId={s.id} />
          </div>

          {/* Details list */}
          <div className="mt-3.5 space-y-1.5 text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 truncate">
              <Phone className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
              <span>{s.phone}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
              <span>{s.branch}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <User className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
              <span>Instructor: <strong className="font-medium text-foreground">{s.instructor}</strong></span>
            </div>
          </div>
        </div>

        {/* Progress & Payment */}
        <div className="space-y-3 pt-1 border-t border-border/40">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-brand" />
                Lesson Progress
              </span>
              <span className="font-semibold text-foreground">{s.completedLessons}/{s.totalLessons} ({progressPct}%)</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
            <div className="flex items-center gap-1.5">
              <StatusBadge tone={statusTone[s.status]}>{s.status.replace("_", " ")}</StatusBadge>
              <StatusBadge tone={payTone[s.paymentStatus]}>{s.paymentStatus}</StatusBadge>
            </div>
            <div className="text-xs font-semibold text-foreground ml-auto">
              {formatNPR(s.amountPaid)} <span className="text-muted-foreground font-normal">/ {formatNPR(s.courseFee)}</span>
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
