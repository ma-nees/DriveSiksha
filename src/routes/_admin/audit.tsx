// ma-nees
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Eye } from "lucide-react";
import { auditLogs } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import type { AuditLog } from "@/lib/types";

const moduleBadgeClass =
  "border-transparent bg-brand text-brand-foreground shadow-sm dark:bg-sky dark:text-sky-foreground";

export const Route = createFileRoute("/_admin/audit")({
  component: AuditPage,
  head: () => ({ meta: [{ title: "Audit logs — DriveSiksha" }] }),
});

function AuditPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<AuditLog | null>(null);
  const filtered = auditLogs.filter(
    (l) =>
      !q ||
      l.user.toLowerCase().includes(q.toLowerCase()) ||
      l.action.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Audit logs"
        description="Every action taken by staff, tracked and searchable."
      />
      <Card className="mb-4">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by user or action…"
              className="pl-9 h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Record</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Date & time</TableHead>
                <TableHead>IP</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="text-sm font-medium">{l.user}</div>
                    <div className="text-xs text-muted-foreground">{l.role}</div>
                  </TableCell>
                  <TableCell className="text-sm">{l.action}</TableCell>
                  <TableCell>
                    <StatusBadge tone="info" className={moduleBadgeClass}>
                      {l.module}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-sm">{l.record}</TableCell>
                  <TableCell className="text-sm">{l.branch}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(l.date)}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{l.ip}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelected(l)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {filtered.map((l) => (
          <Card key={l.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{l.action}</div>
                  <div className="text-xs text-muted-foreground">
                    {l.user} · {l.role}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {l.record} · {l.branch}
                  </div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <StatusBadge tone="info" className={moduleBadgeClass}>
                      {l.module}
                    </StatusBadge>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDateTime(l.date)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(l)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audit detail</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <Row label="Actor" value={selected.user + " (" + selected.role + ")"} />
              <Row label="Action" value={selected.action} />
              <Row label="Module" value={selected.module} />
              <Row label="Record" value={selected.record} />
              <Row label="Branch" value={selected.branch} />
              <Row label="Date & time" value={formatDateTime(selected.date)} />
              <Row label="IP address" value={selected.ip} />
              <Row label="Device" value="Chrome 120 · macOS" />
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Previous value</div>
                  <div className="rounded bg-muted p-2 font-mono text-xs">
                    {'{ status: "pending" }'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">New value</div>
                  <div className="rounded bg-muted p-2 font-mono text-xs">
                    {'{ status: "active" }'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

