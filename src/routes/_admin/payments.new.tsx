// ma-nees
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Receipt } from "lucide-react";
import { students, currentUser, payments } from "@/lib/mock-data";
import { formatNPR } from "@/lib/format";
import { toast } from "sonner";
import { NepaliDatePicker } from "@/components/NepaliDatePicker";
import type { PaymentMethod } from "@/lib/types";

export const Route = createFileRoute("/_admin/payments/new")({
  component: RecordPayment,
  head: () => ({ meta: [{ title: "Record payment — DriveSiksha" }] }),
});

function RecordPayment() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(students[0]);
  const [amount, setAmount] = useState(5000);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [discount, setDiscount] = useState(0);
  const [charge, setCharge] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentDate, setPaymentDate] = useState("2081-04-15");
  const navigate = useNavigate();

  const matches = useMemo(
    () =>
      q
        ? students
            .filter(
              (s) =>
                s.name.toLowerCase().includes(q.toLowerCase()) ||
                s.studentId.toLowerCase().includes(q.toLowerCase()),
            )
            .slice(0, 5)
        : [],
    [q],
  );
  const remaining = selected.courseFee - selected.amountPaid;
  const net = amount - discount + charge;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (net <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }
    if (net > remaining) {
      toast.error("Amount exceeds remaining balance");
      return;
    }

    const receiptNo = `RCP-2081-${(5000 + payments.length + 1).toString()}`;

    payments.unshift({
      id: `p${payments.length + 1}`,
      receiptNo: receiptNo,
      studentId: selected.id,
      studentName: selected.name,
      amount: net,
      method: method,
      date: paymentDate,
      branch: selected.branch,
      receivedBy: currentUser.name,
      status: "completed",
    });

    // Update student's amount paid
    selected.amountPaid += net;
    if (selected.amountPaid >= selected.courseFee) {
      selected.paymentStatus = "paid";
    } else if (selected.amountPaid > 0) {
      selected.paymentStatus = "partial";
    }

    toast.success("Payment recorded. Receipt generated.");
    navigate({ to: "/receipts/$id", params: { id: receiptNo } });
  }

  return (
    <>
      <PageHeader
        title="Record payment"
        description="Collect a fee, apply adjustments and generate a receipt instantly."
      />
      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select student</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name or student ID…"
                  className="pl-9 h-11"
                />
              </div>
              {matches.length > 0 && (
                <div className="rounded-lg border divide-y">
                  {matches.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => {
                        setSelected(s);
                        setQ("");
                      }}
                      className="w-full text-left p-3 hover:bg-accent flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-sm">{s.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.studentId} · {s.branch}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Remaining {formatNPR(s.courseFee - s.amountPaid)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="rounded-xl border-2 border-brand/20 bg-brand/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-brand text-brand-foreground grid place-items-center font-bold">
                    {selected.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold">{selected.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {selected.studentId} · {selected.course}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[11px] text-muted-foreground">Course fee</div>
                    <div className="font-semibold text-sm">{formatNPR(selected.courseFee)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground">Total paid</div>
                    <div className="font-semibold text-sm text-success">
                      {formatNPR(selected.amountPaid)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground">Remaining</div>
                    <div className="font-semibold text-sm text-accent-red">
                      {formatNPR(remaining)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Payment amount (NPR)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={amount === 0 ? "" : amount}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, "");
                      setAmount(clean === "" ? 0 : Number(clean));
                    }}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Payment date</Label>
                  <NepaliDatePicker value={paymentDate} onChange={setPaymentDate} />
                </div>
                <div className="space-y-1.5">
                  <Label>Discount (NPR)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={discount === 0 ? "" : discount}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, "");
                      setDiscount(clean === "" ? 0 : Number(clean));
                    }}
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Additional charge (NPR)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={charge === 0 ? "" : charge}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, "");
                      setCharge(clean === "" ? 0 : Number(clean));
                    }}
                    className="h-11"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Payment method</Label>
                <RadioGroup
                  value={method}
                  onValueChange={setMethod}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  {[
                    { v: "cash", l: "Cash" },
                    { v: "esewa", l: "eSewa" },
                    { v: "bank_transfer", l: "Bank" },
                    { v: "other", l: "Other" },
                  ].map((m) => (
                    <label
                      key={m.v}
                      className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-brand/5"
                    >
                      <RadioGroupItem value={m.v} />{" "}
                      <span className="text-sm font-medium">{m.l}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-1.5">
                <Label>Received by</Label>
                <Select defaultValue={currentUser.name}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={currentUser.name}>{currentUser.name}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Optional notes for this receipt"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Amount" value={formatNPR(amount)} />
              {discount > 0 && (
                <Row label="Discount" value={"− " + formatNPR(discount)} tone="text-success" />
              )}
              {charge > 0 && <Row label="Additional charge" value={"+ " + formatNPR(charge)} />}
              <div className="border-t pt-2 mt-2">
                <Row label="Net receivable" value={formatNPR(net)} bold />
              </div>
              <Row label="Method" value={method} />
              <Row
                label="After this payment"
                value={formatNPR(remaining - net) + " remaining"}
                tone="text-muted-foreground"
              />
            </CardContent>
          </Card>
          <Button
            type="submit"
            className="w-full h-12 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground text-base"
          >
            <Receipt className="h-4 w-4 mr-2" />
            Generate receipt
          </Button>
        </div>
      </form>
    </>
  );
}

function Row({
  label,
  value,
  bold,
  tone,
}: {
  label: string;
  value: string;
  bold?: boolean;
  tone?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={(bold ? "font-bold text-base " : "font-medium ") + (tone || "")}>
        {value}
      </span>
    </div>
  );
}
