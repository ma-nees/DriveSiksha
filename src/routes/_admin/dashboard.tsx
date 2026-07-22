// ma-nees
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  GraduationCap,
  CalendarClock,
  Wallet,
  AlertCircle,
  UserCheck,
  Crown,
  TrendingUp,
  Plus,
  FileDown,
  Receipt,
  UserPlus,
  Calendar,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NepaliDatePicker } from "@/components/NepaliDatePicker";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  branches,
  payments,
  revenueMonthly,
  registrationsMonthly,
  lessonCompletion,
  students,
  subscription,
} from "@/lib/mock-data";
import { formatNPR, formatDate, formatBSDate, formatCompactNepali } from "@/lib/format";
import { ALL_BRANCHES, useSelectedBranch } from "@/hooks/use-selected-branch";

export const Route = createFileRoute("/_admin/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — DriveSiksha" },
      {
        name: "description",
        content:
          "Overview of students, revenue, lessons and branch performance across your driving school.",
      },
    ],
  }),
});

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  students: { label: "Students", color: "var(--chart-2)" },
  completed: { label: "Completed", color: "var(--chart-1)" },
  scheduled: { label: "Scheduled", color: "var(--chart-2)" },
};

function Dashboard() {
  const [exportOpen, setExportOpen] = useState(false);
  const [rangeMode, setRangeMode] = useState<"range" | "all">("range");
  const [fromDateBS, setFromDateBS] = useState("2081-01-01");
  const [toDateBS, setToDateBS] = useState("2081-04-30");
  const [dataType, setDataType] = useState<"all" | "revenue" | "students">("all");
  const [fileFormat, setFileFormat] = useState<"csv" | "print">("csv");
  const [selectedBranchId] = useSelectedBranch();

  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId);
  const branchScopeLabel = selectedBranch ? selectedBranch.name : "All branches";
  const scopedBranches =
    selectedBranchId === ALL_BRANCHES
      ? branches
      : branches.filter((branch) => branch.id === selectedBranchId);
  const scopedStudents =
    selectedBranchId === ALL_BRANCHES
      ? students
      : students.filter((student) => student.branchId === selectedBranchId);
  const scopedPayments =
    selectedBranchId === ALL_BRANCHES
      ? payments
      : payments.filter((payment) => payment.branch === selectedBranch?.name);
  const activeStudents = scopedStudents.filter((s) => s.status === "active").length;
  const onLeave = scopedStudents.filter((s) => s.status === "on_leave").length;
  const pendingPayments = scopedStudents.filter((s) => s.paymentStatus !== "paid").length;
  const pendingOutstanding = scopedStudents.reduce(
    (sum, student) => sum + Math.max(student.courseFee - student.amountPaid, 0),
    0,
  );
  const scopedInstructorCount = scopedBranches.reduce(
    (sum, branch) => sum + branch.totalInstructors,
    0,
  );
  const scopedMonthlyRevenue = scopedBranches.reduce(
    (sum, branch) => sum + branch.monthlyRevenue,
    0,
  );
  const allBranchMonthlyRevenue = branches.reduce((sum, branch) => sum + branch.monthlyRevenue, 0);
  const revenueShare = allBranchMonthlyRevenue ? scopedMonthlyRevenue / allBranchMonthlyRevenue : 1;
  const studentShare = students.length ? scopedStudents.length / students.length : 1;
  const dashboardRevenueMonthly = revenueMonthly.map((item) => ({
    ...item,
    revenue: Math.round(item.revenue * revenueShare),
  }));
  const dashboardRegistrationsMonthly = registrationsMonthly.map((item) => ({
    ...item,
    students: Math.max(0, Math.round(item.students * studentShare)),
  }));
  const dashboardLessonCompletion = lessonCompletion.map((item) => ({
    ...item,
    scheduled: Math.max(0, Math.round(item.scheduled * revenueShare)),
    completed: Math.max(0, Math.round(item.completed * revenueShare)),
  }));

  // Filtered rows for export (CSV & Print PDF)
  const filteredExportRows = (() => {
    const list: Array<{
      id: string;
      dateBS: string;
      dateAD: string;
      type: "Payment Receipt" | "Student Intake";
      title: string;
      branch: string;
      detail: string;
      amount: number;
      status: string;
    }> = [];

    if (dataType === "all" || dataType === "revenue") {
      scopedPayments.forEach((p) => {
        const bsDate = formatBSDate(p.date);
        if (rangeMode === "all" || (bsDate >= fromDateBS && bsDate <= toDateBS)) {
          list.push({
            id: `pay-${p.id}`,
            dateBS: bsDate,
            dateAD: formatDate(p.date),
            type: "Payment Receipt",
            title: p.studentName,
            branch: p.branch,
            detail: `${p.receiptNo} (${p.method.replace("_", " ")})`,
            amount: p.amount,
            status: p.status === "completed" ? "Paid" : p.status,
          });
        }
      });
    }

    if (dataType === "all" || dataType === "students") {
      scopedStudents.forEach((s) => {
        const bsDate = formatBSDate(s.registeredAt);
        if (rangeMode === "all" || (bsDate >= fromDateBS && bsDate <= toDateBS)) {
          list.push({
            id: `stu-${s.id}`,
            dateBS: bsDate,
            dateAD: formatDate(s.registeredAt),
            type: "Student Intake",
            title: s.name,
            branch: s.branch,
            detail: `${s.studentId} · ${s.course}`,
            amount: s.courseFee,
            status:
              s.status === "active"
                ? "Active"
                : s.status === "completed"
                  ? "Completed"
                  : "On Leave",
          });
        }
      });
    }

    list.sort((a, b) => a.dateBS.localeCompare(b.dateBS));
    return list;
  })();

  const filteredTotalAmount = filteredExportRows.reduce((sum, r) => sum + r.amount, 0);
  const filteredRevenueCount = filteredExportRows.filter(
    (r) => r.type === "Payment Receipt",
  ).length;
  const filteredStudentCount = filteredExportRows.filter((r) => r.type === "Student Intake").length;

  const handleExecuteExport = () => {
    if (fileFormat === "print") {
      setExportOpen(false);
      setTimeout(() => {
        window.print();
      }, 150);
      return;
    }

    if (filteredExportRows.length === 0) {
      toast.error(
        `No records found for ${branchScopeLabel} in ${rangeMode === "all" ? "all historical data" : `range ${fromDateBS} to ${toDateBS} BS`}`,
      );
      return;
    }

    const headers = [
      "S.N.",
      "Date (Bikram Sambat BS)",
      "Date (AD)",
      "Record Type",
      "Title / Student Name",
      "Branch",
      "Details / Reference",
      "Amount (NPR)",
      "Status",
    ];

    const rows = filteredExportRows.map((r, i) => [
      String(i + 1),
      r.dateBS,
      r.dateAD,
      r.type,
      r.title,
      r.branch,
      r.detail,
      String(r.amount),
      r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename =
      rangeMode === "all"
        ? `DriveSiksha_${branchScopeLabel.replace(/\s+/g, "_")}_FullExport_BikramSambat.csv`
        : `DriveSiksha_${branchScopeLabel.replace(/\s+/g, "_")}_Export_${fromDateBS}_to_${toDateBS}_BS.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${rows.length} records in Bikram Sambat date format!`);
    setExportOpen(false);
  };

  const totalFiscalRevenue = dashboardRevenueMonthly.reduce((sum, r) => sum + r.revenue, 0);
  const latestMonthlyRevenue = dashboardRevenueMonthly.at(-1)?.revenue || 0;
  const peakRevenueMonth = dashboardRevenueMonthly.reduce(
    (peak, item) => (item.revenue > peak.revenue ? item : peak),
    dashboardRevenueMonthly[0],
  );
  const todaysLessonInsight = dashboardLessonCompletion[0] || { scheduled: 0, completed: 0 };
  const monthShortMap: Record<string, string> = {
    Baishakh: "Bai",
    Jestha: "Jes",
    Ashadh: "Ash",
    Shrawan: "Shr",
    Bhadra: "Bhd",
    Ashwin: "Asw",
    Kartik: "Kar",
    Mangsir: "Mng",
  };

  const formatYAxisIncome = (v: number) => formatCompactNepali(v);

  return (
    <>
      <div className="no-print">
        <PageHeader
          title="Dashboard"
          description={`Namaste Suman — showing revenue and insights for ${branchScopeLabel}.`}
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => setExportOpen(true)}
              >
                <FileDown className="h-4 w-4 mr-1.5" />
                Export
              </Button>
              <Link
                to="/students/new"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-9 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground",
                )}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Student
              </Link>
            </>
          }
        />
      </div>

      {/* Export Data Modal */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-[520px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-bold">
              <FileDown className="h-5 w-5 text-brand shrink-0" />
              Export Dashboard Data (Bikram Sambat)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Range Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                1. Select Date Range (Bikram Sambat BS)
              </Label>
              <RadioGroup
                value={rangeMode}
                onValueChange={(v) => setRangeMode(v as "range" | "all")}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
              >
                <div
                  className={cn(
                    "flex items-center gap-2 border p-3 rounded-lg cursor-pointer transition-all",
                    rangeMode === "range" ? "border-brand bg-brand/5" : "border-border",
                  )}
                >
                  <RadioGroupItem value="range" id="r-range" />
                  <Label htmlFor="r-range" className="text-xs font-medium cursor-pointer">
                    Date Range (From - To)
                  </Label>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 border p-3 rounded-lg cursor-pointer transition-all",
                    rangeMode === "all" ? "border-brand bg-brand/5" : "border-border",
                  )}
                >
                  <RadioGroupItem value="all" id="r-all" />
                  <Label htmlFor="r-all" className="text-xs font-medium cursor-pointer">
                    All Historical Data
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {rangeMode === "range" && (
              <div className="p-3 bg-muted/40 rounded-xl border border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    From Date (BS)
                  </Label>
                  <NepaliDatePicker value={fromDateBS} onChange={setFromDateBS} />
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    To Date (BS)
                  </Label>
                  <NepaliDatePicker value={toDateBS} onChange={setToDateBS} />
                </div>
              </div>
            )}

            {/* Scope Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                2. Data Scope
              </Label>
              <Select
                value={dataType}
                onValueChange={(v) => setDataType(v as "all" | "revenue" | "students")}
              >
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Records (Revenue, Payments & Student Intakes)
                  </SelectItem>
                  <SelectItem value="revenue">Revenue & Payment Receipts Only</SelectItem>
                  <SelectItem value="students">Student Registrations & Intakes Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                3. Export Format
              </Label>
              <Select value={fileFormat} onValueChange={(v) => setFileFormat(v as "csv" | "print")}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV Spreadsheet (.csv - Excel compatible)</SelectItem>
                  <SelectItem value="print">Printable Summary (.pdf / Print)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExecuteExport}
              className="bg-brand text-brand-foreground hover:bg-brand/90 font-semibold gap-1.5"
            >
              <FileDown className="h-4 w-4" />
              Download Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print-Ready Area */}
      <div className="print-area">
        {/* Web Interactive Screen View (Hidden during Print/PDF export) */}
        <div className="no-print space-y-4">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            <StatCard
              label="Total Students"
              value={scopedStudents.length}
              icon={Users}
              tone="brand"
              trend="+12% this month"
            />
            <StatCard
              label="Active Students"
              value={activeStudents}
              icon={UserCheck}
              tone="success"
            />
            <StatCard
              label="Instructors"
              value={scopedInstructorCount}
              icon={GraduationCap}
              tone="sky"
            />
            <StatCard
              label="Today's Lessons"
              value={todaysLessonInsight.scheduled}
              icon={CalendarClock}
              tone="brand"
              hint={`${todaysLessonInsight.completed} completed`}
            />
            <StatCard
              label="Monthly Revenue"
              value={formatNPR(latestMonthlyRevenue)}
              icon={Wallet}
              tone="success"
              trend="+18% vs last"
            />
            <StatCard
              label="Pending Payments"
              value={pendingPayments}
              icon={AlertCircle}
              tone="red"
              hint={formatNPR(pendingOutstanding) + " outstanding"}
            />
            <StatCard label="On Leave" value={onLeave} icon={Users} tone="warning" />
            <StatCard
              label="Subscription"
              value={subscription.plan}
              icon={Crown}
              tone="brand"
              hint={"Expires " + subscription.expiryDate}
            />
          </div>

          {/* Charts row */}
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 min-w-0 overflow-hidden flex flex-col justify-between">
              <CardHeader className="flex-col sm:flex-row gap-2 sm:items-center sm:justify-between space-y-0 pb-3 border-b border-border/50">
                <div>
                  <CardTitle className="text-base font-bold">Revenue overview</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span>{branchScopeLabel}</span>
                    <span>·</span>
                    <span className="font-semibold text-foreground">
                      Peak: {peakRevenueMonth.month} (
                      {formatCompactNepali(peakRevenueMonth.revenue, true)})
                    </span>
                    <span>·</span>
                    <span>
                      Avg:{" "}
                      {formatCompactNepali(
                        Math.round(totalFiscalRevenue / dashboardRevenueMonthly.length),
                        true,
                      )}
                      /mo
                    </span>
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-lg sm:text-xl font-extrabold text-foreground font-mono">
                    {formatNPR(totalFiscalRevenue)}
                  </div>
                  <div className="text-[11px] font-semibold text-success flex items-center gap-1 sm:justify-end mt-0.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>+22.4% vs last FY ({formatCompactNepali(totalFiscalRevenue, true)})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-1.5 sm:px-6 pt-4 pb-4 flex-1">
                <ChartContainer config={chartConfig} className="h-[200px] sm:h-[240px] w-full">
                  <AreaChart
                    data={dashboardRevenueMonthly}
                    margin={{ left: -10, right: 8, top: 8, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      fontSize={10}
                      interval={0}
                      tickFormatter={(v) => monthShortMap[v] || v.slice(0, 3)}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={10}
                      width={42}
                      tickFormatter={formatYAxisIncome}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      fill="url(#rev)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Student registrations</CardTitle>
                <p className="text-xs text-muted-foreground">Monthly intake</p>
              </CardHeader>
              <CardContent className="px-1.5 sm:px-6 pb-4">
                <ChartContainer config={chartConfig} className="h-[200px] sm:h-[240px] w-full">
                  <BarChart
                    data={dashboardRegistrationsMonthly}
                    margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      fontSize={10}
                      interval={0}
                      tickFormatter={(v) => monthShortMap[v] || v.slice(0, 3)}
                    />
                    <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="students" fill="var(--color-students)" radius={6} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Lesson completion + Branches */}
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 min-w-0 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Lesson completion (this week)</CardTitle>
              </CardHeader>
              <CardContent className="px-1.5 sm:px-6 pb-4">
                <ChartContainer config={chartConfig} className="h-[190px] sm:h-[220px] w-full">
                  <BarChart
                    data={dashboardLessonCompletion}
                    margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={10} />
                    <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="scheduled" fill="var(--color-scheduled)" radius={4} />
                    <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base truncate">
                  {selectedBranch ? "Selected branch insight" : "Branch performance"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scopedBranches.map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{b.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {b.totalStudents} students · {b.totalInstructors} instructors
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-semibold">
                        {formatNPR(b.monthlyRevenue)}
                      </div>
                      <StatusBadge tone="success">active</StatusBadge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick actions */}
          <Card className="mt-4 min-w-0 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  {
                    to: "/students/new",
                    label: "Add Student",
                    icon: UserPlus,
                    tone: "bg-brand text-brand-foreground",
                  },
                  {
                    to: "/instructors",
                    label: "Add Instructor",
                    icon: GraduationCap,
                    tone: "bg-sky text-sky-foreground",
                  },
                  {
                    to: "/payments/new",
                    label: "Record Payment",
                    icon: Wallet,
                    tone: "bg-accent-red text-accent-red-foreground",
                  },
                  {
                    to: "/lessons",
                    label: "Schedule Lesson",
                    icon: CalendarClock,
                    tone: "bg-success text-success-foreground",
                  },
                  {
                    to: "/receipts/RCP-2081-5000",
                    label: "Generate Receipt",
                    icon: Receipt,
                    tone: "bg-warning text-warning-foreground",
                  },
                  {
                    to: "/reports",
                    label: "Export Report",
                    icon: FileDown,
                    tone: "bg-muted text-foreground",
                  },
                ].map((a) => (
                  <Link
                    key={a.to}
                    to={a.to}
                    className="group rounded-xl border bg-card p-2.5 sm:p-4 hover:shadow-md transition-all min-w-0"
                  >
                    <div
                      className={
                        "h-8 w-8 sm:h-9 sm:w-9 rounded-lg grid place-items-center " + a.tone
                      }
                    >
                      <a.icon className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-xs sm:text-sm font-medium truncate">{a.label}</div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent lists */}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base min-w-0 truncate">
                  Recent student registrations
                </CardTitle>
                <Button variant="ghost" size="sm" asChild className="shrink-0">
                  <Link to="/students">View all</Link>
                </Button>
              </CardHeader>
              <CardContent className="divide-y">
                {scopedStudents.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center gap-2.5 py-2.5 first:pt-0">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-brand/10 text-brand grid place-items-center font-semibold text-xs shrink-0">
                      {s.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium truncate">{s.name}</div>
                      <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                        {s.studentId} · {s.branch}
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground shrink-0 font-mono">
                      {formatBSDate(s.registeredAt)} BS
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base min-w-0 truncate">Recent payments</CardTitle>
                <Button variant="ghost" size="sm" asChild className="shrink-0">
                  <Link to="/payments">View all</Link>
                </Button>
              </CardHeader>
              <CardContent className="divide-y">
                {scopedPayments.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-2.5 py-2.5 first:pt-0">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-success/10 text-success grid place-items-center shrink-0">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium truncate">{p.studentName}</div>
                      <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                        {p.receiptNo} · {p.method} ({formatBSDate(p.date)} BS)
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold shrink-0 font-mono">
                      {formatNPR(p.amount)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <Card className="mt-4 border-warning/40 bg-warning/5">
            <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-warning/20 text-warning-foreground grid place-items-center shrink-0">
                  <Crown className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    Your {subscription.plan} plan renews on {subscription.expiryDate}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {scopedBranches.length} of {subscription.branchLimit} branches shown ·{" "}
                    {scopedStudents.length} of {subscription.studentLimit} students
                  </div>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link to="/subscription">Manage plan</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* PRINT / PDF REPORT TEMPLATE (Clean, Professional, Friendly layout for PDF output) */}
        <div className="print-area hidden print:block text-black bg-white p-4 font-sans text-xs">
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg tracking-wider">
                  DS
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">
                    DriveSiksha Kathmandu
                  </h1>
                  <p className="text-[11px] font-medium text-slate-600">
                    Baneshwor, Kathmandu, Nepal · PAN: 301245678
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Tel: +977 01-4567890 · Email: info@drivesiksha.com.np
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block px-2.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-bold uppercase text-slate-800 tracking-wide mb-1">
                  Financial & Operational Report
                </div>
                <h2 className="text-sm font-bold text-slate-900">Dashboard Export Summary</h2>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Branch Scope:{" "}
                  <span className="font-mono font-bold text-slate-900">{branchScopeLabel}</span>
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Date Range:{" "}
                  <span className="font-mono font-bold text-slate-900">
                    {rangeMode === "all"
                      ? "All Historical Data"
                      : `${fromDateBS} to ${toDateBS} BS`}
                  </span>
                </p>
                <p className="text-[10px] text-slate-500">
                  Generated:{" "}
                  <span className="font-mono font-semibold">
                    {formatBSDate(new Date().toISOString())} BS
                  </span>{" "}
                  ({formatDate(new Date().toISOString())})
                </p>
              </div>
            </div>

            {/* KPI Highlights Tiles */}
            <div className="grid grid-cols-5 gap-2.5 mt-4 pt-3 border-t border-slate-200">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                  Filtered Revenue
                </div>
                <div className="text-xs font-black text-slate-900 font-mono mt-0.5">
                  {formatNPR(filteredTotalAmount)}
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                  Payment Receipts
                </div>
                <div className="text-xs font-black text-slate-900 font-mono mt-0.5">
                  {filteredRevenueCount} Receipts
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                  Student Registrations
                </div>
                <div className="text-xs font-black text-slate-900 font-mono mt-0.5">
                  {filteredStudentCount} Students
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                  Branch Scope
                </div>
                <div className="text-[11px] font-bold text-slate-900 capitalize mt-0.5 truncate">
                  {branchScopeLabel}
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                  Data Scope
                </div>
                <div className="text-[11px] font-bold text-slate-900 capitalize mt-0.5 truncate">
                  {dataType === "all"
                    ? "All Records"
                    : dataType === "revenue"
                      ? "Revenue Only"
                      : "Students Only"}
                </div>
              </div>
            </div>
          </div>

          {/* Printable Records Table */}
          <div className="space-y-2">
            <div className="flex justify-between items-center pb-1">
              <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                Statement Records ({filteredExportRows.length} items)
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Currency: NPR (रू)</span>
            </div>

            <table className="w-full text-[11px] text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-900 font-bold uppercase text-[9px] tracking-wider">
                  <th className="p-2 border-r border-slate-300 w-8 text-center">#</th>
                  <th className="p-2 border-r border-slate-300 w-24">Date (BS)</th>
                  <th className="p-2 border-r border-slate-300 w-28">Category</th>
                  <th className="p-2 border-r border-slate-300">Name / Particulars</th>
                  <th className="p-2 border-r border-slate-300 w-24">Branch</th>
                  <th className="p-2 border-r border-slate-300">Reference / Course</th>
                  <th className="p-2 border-r border-slate-300 text-right w-24">Amount</th>
                  <th className="p-2 text-center w-20">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredExportRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500 italic">
                      No records found for the selected date range and scope.
                    </td>
                  </tr>
                ) : (
                  filteredExportRows.map((r, idx) => (
                    <tr
                      key={r.id}
                      className={cn(
                        "border-b border-slate-200",
                        idx % 2 === 1 ? "bg-slate-50/70" : "bg-white",
                      )}
                    >
                      <td className="p-2 border-r border-slate-200 font-mono text-center text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-mono font-medium text-slate-800">
                        {r.dateBS}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-semibold text-slate-700">
                        {r.type}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                        {r.title}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{r.branch}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600 text-[10px] font-mono">
                        {r.detail}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono font-bold text-slate-900">
                        {formatNPR(r.amount)}
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={cn(
                            "inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                            r.status.toLowerCase().includes("paid") ||
                              r.status.toLowerCase().includes("active") ||
                              r.status.toLowerCase().includes("completed")
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-amber-50 text-amber-800 border-amber-300",
                          )}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredExportRows.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                    <td
                      colSpan={6}
                      className="p-2 text-right border-r border-slate-300 uppercase text-[9px] tracking-wider"
                    >
                      Filtered Total Amount:
                    </td>
                    <td className="p-2 text-right font-mono text-xs border-r border-slate-300 font-black">
                      {formatNPR(filteredTotalAmount)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Official Signatures & Footer Notice */}
          <div className="mt-10 pt-4 border-t border-slate-300 flex justify-between items-end text-slate-600 break-inside-avoid">
            <div>
              <p className="font-bold text-slate-800 text-[11px]">
                DriveSiksha Driving School Management Suite
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Computer-generated official document · Baneshwor, Kathmandu
              </p>
            </div>
            <div className="flex gap-10 text-center">
              <div>
                <div className="w-28 border-b border-slate-400 mb-1"></div>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                  Prepared By
                </span>
              </div>
              <div>
                <div className="w-28 border-b border-slate-400 mb-1"></div>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                  Authorized Stamp
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
