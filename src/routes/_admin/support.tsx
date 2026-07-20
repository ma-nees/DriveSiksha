import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, LifeBuoy } from "lucide-react";
import { supportTickets } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/support")({
  component: SupportPage,
  head: () => ({ meta: [{ title: "Contact support — DriveSiksha" }] }),
});

const priorityTone = { low: "neutral", medium: "info", high: "danger" } as const;
const statusTone = { open: "warning", in_progress: "info", resolved: "success", closed: "neutral" } as const;

function SupportPage() {
  const [open, setOpen] = useState(false);
  const [ticketsList, setTicketsList] = useState(supportTickets);

  // Form state
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("technical-bug");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = useState("");

  const handleSubmitTicket = () => {
    if (!subject.trim()) {
      toast.error("Please enter a ticket subject.");
      return;
    }

    const newTicket = {
      id: `t${Date.now()}`,
      subject,
      category,
      priority,
      status: "open" as const,
      createdAt: new Date().toISOString(),
      description,
    };

    setTicketsList([newTicket, ...ticketsList]);
    toast.success("Ticket submitted successfully. We'll get back to you soon!");
    setOpen(false);

    // Reset
    setSubject("");
    setDescription("");
  };

  return (
    <>
      <PageHeader title="Contact support" description="Get help from the DriveSiksha team."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground"><Plus className="h-4 w-4 mr-1.5" />New ticket</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader><DialogTitle>Open a support ticket</DialogTitle></DialogHeader>
              <div className="space-y-3.5 py-2">
                <div>
                  <Label className="text-xs font-medium mb-1 block">Subject *</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Cannot update student record" className="h-10" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium mb-1 block">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-10"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student Management">Student Management</SelectItem>
                        <SelectItem value="Instructor Management">Instructor Management</SelectItem>
                        <SelectItem value="Lesson Booking">Lesson Booking</SelectItem>
                        <SelectItem value="Vehicle Management">Vehicle Management</SelectItem>
                        <SelectItem value="Payments & Billing">Payments & Billing</SelectItem>
                        <SelectItem value="Reports & Analytics">Reports & Analytics</SelectItem>
                        <SelectItem value="Technical Bug">Technical Bug</SelectItem>
                        <SelectItem value="Feature Request">Feature Request</SelectItem>
                        <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">Priority *</Label>
                    <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                      <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium mb-1 block">Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the issue or request in detail…" />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">Attachment (Optional)</Label>
                  <Input type="file" className="h-10 cursor-pointer" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitTicket} className="bg-brand text-brand-foreground hover:bg-brand/90">Submit ticket</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="mb-4 bg-brand text-brand-foreground overflow-hidden">
        <CardContent className="p-5 sm:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-brand-foreground/15 grid place-items-center shrink-0"><LifeBuoy className="h-5 w-5" /></div>
            <div><div className="font-semibold">Need urgent help?</div><div className="text-sm opacity-80">Call our support hotline 10:00 – 19:00 (NPT)</div></div>
          </div>
          <div className="text-lg sm:text-2xl font-bold">+977 01-4778899</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Your tickets</CardTitle></CardHeader>
        <CardContent className="divide-y">
          {ticketsList.map((t) => (
            <div key={t.id} className="py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{t.subject}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{t.description}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">#{t.id} · {t.category} · {formatDate(t.createdAt)}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge tone={priorityTone[t.priority]}>{t.priority}</StatusBadge>
                <StatusBadge tone={statusTone[t.status]}>{t.status.replace("_", " ")}</StatusBadge>
                <Button variant="outline" size="sm" onClick={() => toast.info(`Ticket details: ${t.subject}`)}>View</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
