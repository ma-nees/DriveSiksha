// ma-nees
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Wallet, Clock, AlertCircle, Receipt, Plus, MoreVertical, Eye, Printer, FileDown, Bell } from "lucide-react";
import { payments } from "@/lib/mock-data";
import { formatNPR, formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/payments/")({
  component: PaymentsPage,
  head: () => ({ meta: [{ title: "Payments — DriveSiksha" }, { name: "description", content: "Track cash, eSewa and bank payments, generate receipts and export reports." }] }),
});

function PaymentsPage() {
  const today = payments.slice(0, 5).reduce((a, p) => a + p.amount, 0);
  const month = payments.reduce((a, p) => a + p.amount, 0);
  return (
    <>
      <PageHeader title="Payment management" description="All fees, receipts and outstanding amounts."
        actions={<Button size="sm" className="h-9 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground" asChild>
          <Link to="/payments/new"><Plus className="h-4 w-4 mr-1.5" />Record Payment</Link>
        </Button>}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 mb-4">
        <StatCard label="Today's collection" value={formatNPR(today)} icon={Wallet} tone="success" />
        <StatCard label="Monthly collection" value={formatNPR(month)} icon={Wallet} tone="brand" />
        <StatCard label="Outstanding" value={formatNPR(285000)} icon={AlertCircle} tone="red" />
        <StatCard label="Total receipts" value={payments.length} icon={Receipt} tone="sky" />
      </div>

      <Card>
        <div className="overflow-x-auto hidden md:block">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Receipt</TableHead><TableHead>Student</TableHead><TableHead>Amount</TableHead>
              <TableHead>Method</TableHead><TableHead>Date</TableHead><TableHead>Branch</TableHead>
              <TableHead>Received by</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell><Link to="/receipts/$id" params={{ id: p.receiptNo }} className="font-medium text-sm hover:underline">{p.receiptNo}</Link></TableCell>
                  <TableCell className="text-sm">{p.studentName}</TableCell>
                  <TableCell className="font-semibold text-sm">{formatNPR(p.amount)}</TableCell>
                  <TableCell><StatusBadge tone="info">{p.method}</StatusBadge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(p.date)}</TableCell>
                  <TableCell className="text-sm">{p.branch}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.receivedBy}</TableCell>
                  <TableCell><StatusBadge tone="success">{p.status}</StatusBadge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link to="/receipts/$id" params={{ id: p.receiptNo }}><Eye className="h-4 w-4 mr-2" />View</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Printing receipt…")}><Printer className="h-4 w-4 mr-2" />Print</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("PDF downloaded")}><FileDown className="h-4 w-4 mr-2" />Download PDF</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Reminder sent")}><Bell className="h-4 w-4 mr-2" />Send reminder</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden divide-y">
          {payments.map((p) => (
            <div key={p.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link to="/receipts/$id" params={{ id: p.receiptNo }} className="font-semibold hover:underline">{p.receiptNo}</Link>
                  <div className="text-sm truncate">{p.studentName}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{formatDate(p.date)} · {p.method} · {p.branch}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold">{formatNPR(p.amount)}</div>
                  <StatusBadge tone="success">{p.status}</StatusBadge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

