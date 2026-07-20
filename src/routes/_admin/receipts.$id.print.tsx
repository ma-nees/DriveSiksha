import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Printer } from "lucide-react";
import { currentSchool, payments, students } from "@/lib/mock-data";
import { formatNPR, formatDate, numberToWords } from "@/lib/format";

export const Route = createFileRoute("/_admin/receipts/$id/print")({
  component: PrintPage,
  head: () => ({ meta: [{ title: "4-up receipt print — DriveSiksha" }] }),
});

function PrintPage() {
  const { id } = Route.useParams();
  const p = payments.find((x) => x.receiptNo === id) || payments[0];
  const s = students.find((st) => st.id === p.studentId) || students[0];
  const remaining = s.courseFee - s.amountPaid;
  const copies = ["Original", "School copy", "Instructor copy", "File copy"];

  return (
    <>
      <div className="flex justify-between items-center mb-4 no-print">
        <Button variant="ghost" size="sm" asChild><Link to="/receipts/$id" params={{ id: p.receiptNo }}><ArrowLeft className="h-4 w-4 mr-1" />Back</Link></Button>
        <Button size="sm" onClick={() => window.print()} className="bg-brand hover:bg-brand/90 text-brand-foreground"><Printer className="h-4 w-4 mr-1.5" />Print A4</Button>
      </div>
      <div className="print-area receipt-print-wrapper mx-auto bg-white text-black p-4 md:p-[8mm] shadow-lg md:shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-xl border md:border-none">
        <div className="receipt-print-grid">
          {copies.map((label) => (
            <div key={label} className="border border-dashed border-gray-400 p-3 flex flex-col" style={{ fontSize: "10px" }}>
              <div className="flex justify-between items-start pb-2 border-b border-gray-300">
                <div className="flex items-center gap-1.5"><Logo size={26} />
                  <div>
                    <div className="font-bold text-xs" style={{ color: "#1a2a5c" }}>{currentSchool.name}</div>
                    <div style={{ fontSize: "8px" }} className="text-gray-600">{currentSchool.address}</div>
                    <div style={{ fontSize: "8px" }} className="text-gray-600">{currentSchool.phone}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ fontSize: "8px" }} className="uppercase text-gray-500">{label}</div>
                  <div className="font-bold">{p.receiptNo}</div>
                  <div style={{ fontSize: "8px" }} className="text-gray-500">{formatDate(p.date)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 my-2">
                <div><div style={{ fontSize: "8px" }} className="text-gray-500 uppercase">Student</div><div className="font-semibold">{s.name}</div><div style={{ fontSize: "8px" }} className="text-gray-500">{s.studentId}</div></div>
                <div><div style={{ fontSize: "8px" }} className="text-gray-500 uppercase">Course</div><div className="font-semibold">{s.course}</div><div style={{ fontSize: "8px" }} className="text-gray-500">{s.branch}</div></div>
              </div>
              <div className="border rounded p-2 my-1" style={{ borderColor: "#1a2a5c", background: "#f4f6fb" }}>
                <div className="flex justify-between items-baseline"><div style={{ fontSize: "9px" }}>Amount paid</div><div className="font-bold text-base" style={{ color: "#1a2a5c" }}>{formatNPR(p.amount)}</div></div>
                <div style={{ fontSize: "8px" }} className="italic text-gray-600 mt-0.5">{numberToWords(p.amount)}</div>
              </div>
              <div className="grid grid-cols-2 gap-1" style={{ fontSize: "9px" }}>
                <div><span className="text-gray-500">Method:</span> <span className="capitalize font-medium">{p.method}</span></div>
                <div><span className="text-gray-500">Remaining:</span> <span className="font-medium" style={{ color: "#c1272d" }}>{formatNPR(remaining)}</span></div>
                <div><span className="text-gray-500">Received:</span> {p.receivedBy}</div>
                <div><span className="text-gray-500">Branch:</span> {s.branch}</div>
              </div>
              <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
                <div className="text-center" style={{ fontSize: "8px" }}><div className="border-t border-dashed pt-0.5 text-gray-500">Student sign.</div></div>
                <div className="text-center" style={{ fontSize: "8px" }}><div className="border-t border-dashed pt-0.5 text-gray-500">Authorized sign.</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
