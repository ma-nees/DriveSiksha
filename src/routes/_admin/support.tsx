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
  return (
    <>
      <PageHeader title="Contact support" description="Get help from the DriveSiksha team."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground"><Plus className="h-4 w-4 mr-1.5" />New ticket</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Open a support ticket</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label className="text-xs mb-1 block">Subject</Label><Input className="h-11" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs mb-1 block">Category</Label>
                    <Select><SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="bug">Bug</SelectItem><SelectItem value="q">Question</SelectItem><SelectItem value="p">Payment</SelectItem><SelectItem value="f">Feature request</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs mb-1 block">Priority</Label>
                    <Select defaultValue="medium"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label className="text-xs mb-1 block">Description</Label><Textarea rows={4} /></div>
                <div><Label className="text-xs mb-1 block">Attachment</Label><Input type="file" className="h-11 cursor-pointer" /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => { toast.success("Ticket submitted. We'll get back to you soon."); setOpen(false); }} className="bg-brand text-brand-foreground">Submit ticket</Button>
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
          {supportTickets.map((t) => (
            <div key={t.id} className="py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{t.subject}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{t.description}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">#{t.id} · {t.category} · {formatDate(t.createdAt)}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge tone={priorityTone[t.priority]}>{t.priority}</StatusBadge>
                <StatusBadge tone={statusTone[t.status]}>{t.status.replace("_", " ")}</StatusBadge>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
