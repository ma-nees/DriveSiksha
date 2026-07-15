import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown, FileSpreadsheet, Printer } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, LineChart, Line } from "recharts";
import { revenueMonthly, registrationsMonthly, paymentMethodDist, branches } from "@/lib/mock-data";
import { toast } from "sonner";

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

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports & analytics" description="Deep-dive into revenue, students and branch performance."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("PDF generated")}><FileDown className="h-4 w-4 mr-1.5" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Excel downloaded")}><FileSpreadsheet className="h-4 w-4 mr-1.5" />Excel</Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1.5" />Print</Button>
          </>
        }
      />

      <Card className="mb-4">
        <CardContent className="p-3 sm:p-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div><Label className="text-xs mb-1 block">From</Label><Input type="date" className="h-10" /></div>
          <div><Label className="text-xs mb-1 block">To</Label><Input type="date" className="h-10" /></div>
          <div><Label className="text-xs mb-1 block">Branch</Label>
            <Select defaultValue="all"><SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All branches</SelectItem>{branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs mb-1 block">Course</Label>
            <Select defaultValue="all"><SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All courses</SelectItem><SelectItem value="b">Car (B)</SelectItem><SelectItem value="a">Motorbike (A)</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Revenue trend</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={cfg} className="h-[260px] w-full">
              <AreaChart data={revenueMonthly}>
                <defs><linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} /><YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => (v / 1000) + "k"} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#r)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Payment methods</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={cfg} className="h-[260px] w-full">
              <PieChart>
                <Pie data={paymentMethodDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {paymentMethodDist.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Student growth</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={cfg} className="h-[240px] w-full">
              <LineChart data={registrationsMonthly}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} /><YAxis fontSize={11} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="students" stroke="var(--color-students)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Branch comparison</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={cfg} className="h-[240px] w-full">
              <BarChart data={branchCompare}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} /><YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => (v / 1000) + "k"} />
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
    </>
  );
}
