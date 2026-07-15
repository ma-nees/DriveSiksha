import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Printer, FileDown, ArrowLeft, Copy } from "lucide-react";
import { currentSchool, payments, students } from "@/lib/mock-data";
import { formatNPR, formatDate, numberToWords } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/receipts/$id")({
  component: ReceiptPage,
  head: ({ params }) => ({ meta: [{ title: "Receipt " + params.id + " — DriveSiksha" }] }),
});

function ReceiptPage() {
  const { id } = Route.useParams();
  const p = payments.find((x) => x.receiptNo === id) || payments[0];
  const s = students.find((st) => st.id === p.studentId) || students[0];
  const remaining = s.courseFee - s.amountPaid;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 no-print">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-1"><Link to="/payments"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link></Button>
          <h1 className="text-xl sm:text-2xl font-bold">Receipt {p.receiptNo}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("PDF downloaded")}><FileDown className="h-4 w-4 mr-1.5" />PDF</Button>
          <Button variant="outline" size="sm" asChild><Link to="/receipts/$id/print" params={{ id: p.receiptNo }}><Copy className="h-4 w-4 mr-1.5" />4-up print</Link></Button>
          <Button size="sm" onClick={() => window.print()} className="bg-brand hover:bg-brand/90 text-brand-foreground"><Printer className="h-4 w-4 mr-1.5" />Print</Button>
        </div>
      </div>

      <div className="print-area mx-auto max-w-3xl">
        <ReceiptTemplate school={currentSchool} p={p} s={s} remaining={remaining} />
      </div>
    </>
  );
}

export function ReceiptTemplate({ school, p, s, remaining }: any) {
  return (
    <Card className="overflow-hidden bg-card">
      <CardContent className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b pb-4">
          <div className="flex items-start gap-3">
            <Logo size={56} />
            <div>
              <div className="text-lg sm:text-xl font-bold text-brand">{school.name}</div>
              <div className="text-xs text-muted-foreground">{school.address}</div>
              <div className="text-xs text-muted-foreground">{school.phone} · {school.email}</div>
              <div className="text-xs text-muted-foreground">PAN: {school.pan} · Reg: {school.registration}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Receipt</div>
            <div className="text-lg font-bold">{p.receiptNo}</div>
            <div className="text-xs text-muted-foreground">Date: {formatDate(p.date)}</div>
          </div>
        </div>

        {/* Student */}
        <div className="grid grid-cols-2 gap-4 my-5 text-sm">
          <div>
            <div className="text-[11px] uppercase text-muted-foreground">Received from</div>
            <div className="font-semibold">{s.name}</div>
            <div className="text-xs text-muted-foreground">{s.studentId} · {s.phone}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase text-muted-foreground">Course</div>
            <div className="font-semibold">{s.course}</div>
            <div className="text-xs text-muted-foreground">Branch: {s.branch}</div>
          </div>
        </div>

        {/* Amount */}
        <div className="rounded-lg border-2 border-dashed border-brand/30 bg-brand/5 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Amount paid</div>
            <div className="text-2xl sm:text-3xl font-bold text-brand">{formatNPR(p.amount)}</div>
          </div>
          <div className="text-xs italic text-muted-foreground mt-2">In words: {numberToWords(p.amount)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <Row label="Payment method" value={p.method} />
          <Row label="Payment date" value={formatDate(p.date)} />
          <Row label="Received by" value={p.receivedBy} />
          <Row label="Remaining balance" value={formatNPR(remaining)} tone="text-accent-red" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="border-t border-dashed pt-2 text-xs text-muted-foreground">Student signature</div>
          </div>
          <div className="text-center">
            <div className="border-t border-dashed pt-2 text-xs text-muted-foreground">Authorized signature</div>
          </div>
        </div>

        <div className="mt-6 border-t pt-3 text-[10px] text-muted-foreground text-center">
          This is a computer-generated receipt. Fees once paid are non-refundable unless approved by management.
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase text-muted-foreground">{label}</div>
      <div className={"font-medium capitalize " + (tone || "")}>{value}</div>
    </div>
  );
}
