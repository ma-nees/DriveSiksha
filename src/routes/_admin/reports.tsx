// ma-nees
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileDown, FileSpreadsheet, Printer, Wallet, TrendingUp, Users, Building2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, LineChart, Line } from "recharts";
import { revenueMonthly, registrationsMonthly, paymentMethodDist, branches } from "@/lib/mock-data";
import { formatNPR, formatBSDate, formatCompactNepali } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { toast } from "sonner";
import { useState } from "react";
import { NepaliDatePicker } from "@/components/NepaliDatePicker";

export const Route = createFileRoute("/_admin/reports")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Reports & analytics — DriveSiksha" }] }),
});

const cfg = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  students: { label: "Students", color: "var(--chart-2)" },
  Baneshwor: { label: "Baneshwor", color: "var(--chart-1)" },
  Lalitpur: { label: "Lalitpur", color: "var(--chart-2)" },
  Bhaktapur: { label: "Bhaktapur", color: "var(--chart-3)" },
};

const branchCompare = revenueMonthly.slice(-6).map((m) => ({
  month: m.month,
  Baneshwor: Math.round(m.revenue * 0.5),
  Lalitpur: Math.round(m.revenue * 0.3),
  Bhaktapur: Math.round(m.revenue * 0.2),
}));

const pieColors = [
  "oklch(0.62 0.15 155)", // Cash - Green
  "oklch(0.65 0.18 135)", // eSewa - eSewa Green
  "oklch(0.38 0.12 250)", // Bank Transfer - Blue
  "oklch(0.75 0.15 75)",  // Other - Amber
];

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

const formatYAxisIncome = (v: number) => formatCompactNepali(v, true);

function ReportsPage() {
  const [fromDate, setFromDate] = useState("2081-01-01");
  const [toDate, setToDate] = useState("2081-04-30");

  const totalRev = revenueMonthly.reduce((a, b) => a + b.revenue, 0);
  const totalReg = registrationsMonthly.reduce((a, b) => a + b.students, 0);
  const avgRev = Math.round(totalRev / (revenueMonthly.length || 1));

  return (
    <>
      <PageHeader title="Reports & analytics" description="Deep-dive into revenue, student growth, and branch performance."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => window.print()}><FileDown className="h-4 w-4 mr-1.5" />PDF</Button>
            {/* <Button variant="outline" size="sm" onClick={() => toast.success("Excel downloaded")}><FileSpreadsheet className="h-4 w-4 mr-1.5" />Excel</Button> */}
            <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1.5" />Print</Button>
          </>
        }
      />

      <div className="print-area">
        {/* Printable Report Header for PDF / Print */}
        <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-black uppercase tracking-wide">DriveSiksha Kathmandu</h1>
              <p className="text-sm text-gray-700">Baneshwor, Kathmandu, Nepal | PAN: 301245678</p>
              <p className="text-sm text-gray-700">Phone: +977 01-4567890 | Email: info@drivesiksha.com.np</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-black">Comprehensive Performance Report</h2>
              <p className="text-xs text-gray-600">Date Range: <span className="font-mono font-semibold">{fromDate} to {toDate} BS</span></p>
              <p className="text-xs text-gray-600">Generated: {formatBSDate(new Date())} BS</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4 text-xs border border-gray-300 p-3 bg-gray-50 rounded">
            <div><span className="text-gray-600">Total Revenue YTD:</span> <strong className="text-black">{formatNPR(totalRev)}</strong></div>
            <div><span className="text-gray-600">Total Student Registrations:</span> <strong className="text-black">{totalReg}</strong></div>
            <div><span className="text-gray-600">Avg. Monthly Revenue:</span> <strong className="text-black">{formatNPR(avgRev)}</strong></div>
            <div><span className="text-gray-600">Top Performing Branch:</span> <strong className="text-black">Baneshwor</strong></div>
          </div>
        </div>

        {/* Top KPI Summary Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mb-4 no-print items-stretch">
          <StatCard label="Total Revenue (YTD)" value={formatNPR(totalRev)} icon={Wallet} tone="success" trend="+22% vs last year" className="h-full" />
          <StatCard label="Total Students" value={totalReg} icon={Users} tone="brand" hint="New registrations" className="h-full" />
          <StatCard label="Avg. Monthly Revenue" value={formatNPR(avgRev)} icon={TrendingUp} tone="sky" className="h-full" />
          <StatCard label="Top Performing Branch" value="Baneshwor" icon={Building2} tone="brand" hint="50% revenue share" className="h-full" />
        </div>

        {/* Date & Filter Toolbar */}
        <Card className="mb-4 no-print border-border/60 shadow-xs">
          <CardContent className="p-3.5 sm:p-4 lg:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
              <div className="lg:col-span-4">
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">From (Nepali Date)</Label>
                <NepaliDatePicker value={fromDate} onChange={setFromDate} />
              </div>
              <div className="lg:col-span-4">
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">To (Nepali Date)</Label>
                <NepaliDatePicker value={toDate} onChange={setToDate} />
              </div>
              <div className="lg:col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Branch</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="All branches" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All branches</SelectItem>
                    {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Course</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="All courses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All courses</SelectItem>
                    <SelectItem value="b">Car (B)</SelectItem>
                    <SelectItem value="a">Motorbike (A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Row 1: Revenue & Payment Methods */}
        <div className="grid gap-4 lg:grid-cols-3 items-stretch no-print">
          <Card className="lg:col-span-2 flex flex-col justify-between min-w-0 overflow-hidden shadow-xs">
            <CardHeader className="pb-2 border-b p-4 sm:p-5">
              <CardTitle className="text-base font-semibold">Revenue Trend (Monthly)</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-3 sm:pt-4 flex-1">
              <ChartContainer config={cfg} className="h-[250px] sm:h-[290px] w-full">
                <AreaChart data={revenueMonthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="r" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} interval={0} tickFormatter={(v) => monthShortMap[v] || v.slice(0, 3)} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} width={76} tickFormatter={formatYAxisIncome} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#r)" strokeWidth={2.5} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between min-w-0 overflow-hidden shadow-xs">
            <CardHeader className="pb-2 border-b p-4 sm:p-5">
              <CardTitle className="text-base font-semibold">Payment Methods Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-3 sm:pt-4 flex-1 flex flex-col justify-between items-center">
              <ChartContainer config={cfg} className="h-[200px] sm:h-[220px] w-full">
                <PieChart>
                  <Pie
                    data={paymentMethodDist}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    label={({ value }) => `${value}%`}
                    labelLine={false}
                  >
                    {paymentMethodDist.map((entry, i) => (
                      <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>

              {/* Representative Color Value Breakdown Grid */}
              <div className="w-full mt-2 pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
                {paymentMethodDist.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/40">
                    <div className="flex items-center gap-2 truncate">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                      <span className="text-muted-foreground font-medium truncate">{item.name}</span>
                    </div>
                    <span className="font-bold text-foreground shrink-0">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Student Growth & Branch Comparison */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2 items-stretch no-print">
          <Card className="flex flex-col justify-between min-w-0 overflow-hidden shadow-xs">
            <CardHeader className="pb-2 border-b p-4 sm:p-5">
              <CardTitle className="text-base font-semibold">Student Growth Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-3 sm:pt-4 flex-1">
              <ChartContainer config={cfg} className="h-[250px] sm:h-[290px] w-full">
                <LineChart data={registrationsMonthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} interval={0} tickFormatter={(v) => monthShortMap[v] || v.slice(0, 3)} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} width={30} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="students" stroke="var(--color-students)" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between min-w-0 overflow-hidden shadow-xs">
            <CardHeader className="pb-2 border-b p-4 sm:p-5">
              <CardTitle className="text-base font-semibold">Branch Revenue Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-3 sm:pt-4 flex-1">
              <ChartContainer config={cfg} className="h-[250px] sm:h-[290px] w-full">
                <BarChart data={branchCompare} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} interval={0} tickFormatter={(v) => monthShortMap[v] || v.slice(0, 3)} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} width={76} tickFormatter={formatYAxisIncome} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="Baneshwor" stackId="a" fill="var(--color-Baneshwor)" />
                  <Bar dataKey="Lalitpur" stackId="a" fill="var(--color-Lalitpur)" />
                  <Bar dataKey="Bhaktapur" stackId="a" fill="var(--color-Bhaktapur)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Printable Detailed Data Table */}
        <div className="hidden print:block mt-6">
          <h3 className="text-base font-bold text-black mb-2 border-b pb-1">Monthly Revenue & Intake Summary (Bikram Sambat)</h3>
          <table className="w-full text-xs text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 font-bold text-gray-800">
                <th className="p-2 border-r border-gray-300">Month (BS)</th>
                <th className="p-2 border-r border-gray-300">Revenue (NPR)</th>
                <th className="p-2 border-r border-gray-300">Student Intake</th>
                <th className="p-2 border-r border-gray-300">Baneshwor Share</th>
                <th className="p-2 border-r border-gray-300">Lalitpur Share</th>
                <th className="p-2 text-right">Bhaktapur Share</th>
              </tr>
            </thead>
            <tbody>
              {revenueMonthly.map((m, idx) => {
                const reg = registrationsMonthly[idx]?.students || 0;
                return (
                  <tr key={m.month} className="border-b border-gray-200">
                    <td className="p-2 border-r border-gray-200 font-medium">{m.month}</td>
                    <td className="p-2 border-r border-gray-200 font-semibold">{formatNPR(m.revenue)}</td>
                    <td className="p-2 border-r border-gray-200">{reg} students</td>
                    <td className="p-2 border-r border-gray-200">{formatNPR(Math.round(m.revenue * 0.5))}</td>
                    <td className="p-2 border-r border-gray-200">{formatNPR(Math.round(m.revenue * 0.3))}</td>
                    <td className="p-2 text-right">{formatNPR(Math.round(m.revenue * 0.2))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

