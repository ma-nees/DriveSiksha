import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, GraduationCap, CalendarClock, Wallet, AlertCircle, UserCheck, Crown, TrendingUp, Plus, FileDown, Receipt, UserPlus } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { branches, payments, revenueMonthly, registrationsMonthly, lessonCompletion, students, subscription } from "@/lib/mock-data";
import { formatNPR, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_admin/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — DriveSiksha" },
      { name: "description", content: "Overview of students, revenue, lessons and branch performance across your driving school." },
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
  const activeStudents = students.filter((s) => s.status === "active").length;
  const onLeave = students.filter((s) => s.status === "on_leave").length;
  const pendingPayments = students.filter((s) => s.paymentStatus !== "paid").length;
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Namaste Suman — here's what's happening across your school today."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9"><FileDown className="h-4 w-4 mr-1.5" />Export</Button>
            <Button size="sm" className="h-9 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground" asChild>
              <Link to="/students/new"><Plus className="h-4 w-4 mr-1.5" />Add Student</Link>
            </Button>
          </>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total Students" value={students.length} icon={Users} tone="brand" trend="+12% this month" />
        <StatCard label="Active Students" value={activeStudents} icon={UserCheck} tone="success" />
        <StatCard label="Instructors" value={17} icon={GraduationCap} tone="sky" />
        <StatCard label="Today's Lessons" value={30} icon={CalendarClock} tone="brand" hint="24 completed" />
        <StatCard label="Monthly Revenue" value={formatNPR(1420000)} icon={Wallet} tone="success" trend="+18% vs last" />
        <StatCard label="Pending Payments" value={pendingPayments} icon={AlertCircle} tone="red" hint={formatNPR(285000) + " outstanding"} />
        <StatCard label="On Leave" value={onLeave} icon={Users} tone="warning" />
        <StatCard label="Subscription" value={subscription.plan} icon={Crown} tone="brand" hint={"Expires " + subscription.expiryDate} />
      </div>

      {/* Charts row */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Revenue overview</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Last 8 months</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{formatNPR(8770000)}</div>
              <div className="text-[11px] text-success flex items-center gap-1 justify-end"><TrendingUp className="h-3 w-3" />+22.4%</div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <AreaChart data={revenueMonthly} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v) => (v / 1000) + "k"} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Student registrations</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly intake</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <BarChart data={registrationsMonthly} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={10} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="students" fill="var(--color-students)" radius={6} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lesson completion + Branches */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lesson completion (this week)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <BarChart data={lessonCompletion} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="scheduled" fill="var(--color-scheduled)" radius={4} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Branch performance</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {branches.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.totalStudents} students · {b.totalInstructors} instructors</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold">{formatNPR(b.monthlyRevenue)}</div>
                  <StatusBadge tone="success">active</StatusBadge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="mt-4">
        <CardHeader className="pb-2"><CardTitle className="text-base">Quick actions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { to: "/students/new", label: "Add Student", icon: UserPlus, tone: "bg-brand text-brand-foreground" },
              { to: "/instructors", label: "Add Instructor", icon: GraduationCap, tone: "bg-sky text-sky-foreground" },
              { to: "/payments/new", label: "Record Payment", icon: Wallet, tone: "bg-accent-red text-accent-red-foreground" },
              { to: "/lessons", label: "Schedule Lesson", icon: CalendarClock, tone: "bg-success text-success-foreground" },
              { to: "/receipts/RCP-2081-5000", label: "Generate Receipt", icon: Receipt, tone: "bg-warning text-warning-foreground" },
              { to: "/reports", label: "Export Report", icon: FileDown, tone: "bg-muted text-foreground" },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="group rounded-xl border bg-card p-3 sm:p-4 hover:shadow-md transition-all">
                <div className={"h-9 w-9 rounded-lg grid place-items-center " + a.tone}><a.icon className="h-4 w-4" /></div>
                <div className="mt-2 text-sm font-medium truncate">{a.label}</div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent lists */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Recent student registrations</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/students">View all</Link></Button>
          </CardHeader>
          <CardContent className="divide-y">
            {students.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                <div className="h-9 w-9 rounded-full bg-brand/10 text-brand grid place-items-center font-semibold text-xs shrink-0">
                  {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.studentId} · {s.branch}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{formatDate(s.registeredAt)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Recent payments</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/payments">View all</Link></Button>
          </CardHeader>
          <CardContent className="divide-y">
            {payments.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                <div className="h-9 w-9 rounded-lg bg-success/10 text-success grid place-items-center shrink-0"><Receipt className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{p.studentName}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.receiptNo} · {p.method}</div>
                </div>
                <div className="text-sm font-semibold shrink-0">{formatNPR(p.amount)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="mt-4 border-warning/40 bg-warning/5">
        <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-warning/20 text-warning-foreground grid place-items-center shrink-0"><Crown className="h-4 w-4" /></div>
            <div>
              <div className="font-semibold text-sm">Your {subscription.plan} plan renews on {subscription.expiryDate}</div>
              <div className="text-xs text-muted-foreground">3 of 4 branches used · 274 of 500 students</div>
            </div>
          </div>
          <Button size="sm" asChild><Link to="/subscription">Manage plan</Link></Button>
        </CardContent>
      </Card>
    </>
  );
}
