// ma-nees
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Eye, Edit, CalendarClock } from "lucide-react";
import { instructors, branches } from "@/lib/mock-data";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_admin/instructors")({
  component: InstructorsPage,
  head: () => ({ meta: [{ title: "Instructors — DriveSiksha" }, { name: "description", content: "Manage all driving instructors, schedules and licences." }] }),
});

function InstructorsPage() {
  const [q, setQ] = useState("");
  const [branch, setBranch] = useState("all");
  const filtered = useMemo(() =>
    instructors.filter((i) => (branch === "all" || i.branchId === branch) && (!q || i.name.toLowerCase().includes(q.toLowerCase())))
  , [q, branch]);

  // Add Instructor Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newBranchId, setNewBranchId] = useState("b1");
  const [newLicense, setNewLicense] = useState("B");

  const handleAddInstructor = () => {
    if (!newName || !newPhone) {
      toast.error("Please fill in Name and Phone number");
      return;
    }

    const selectedBranch = branches.find((b) => b.id === newBranchId) || branches[0];

    instructors.unshift({
      id: `i${instructors.length + 1}`,
      name: newName,
      phone: newPhone,
      branchId: newBranchId,
      branch: selectedBranch.name,
      assignedStudents: 0,
      todayLessons: 0,
      licenseCategory: newLicense,
      leaveStatus: "available",
      accountStatus: "active"
    });

    toast.success("Instructor registered successfully!");
    setIsAddOpen(false);

    // Reset Form
    setNewName("");
    setNewPhone("");
    setNewBranchId("b1");
    setNewLicense("B");
  };

  return (
    <>
      <PageHeader title="Instructors" description={filtered.length + " instructors"} actions={
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground">
              <Plus className="h-4 w-4 mr-1.5" />Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Instructor</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs font-semibold">Full Name *</Label>
                <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Ram Bahadur Gurung" className="h-10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-xs font-semibold">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                  placeholder="+977 98..."
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch" className="text-xs font-semibold">Branch *</Label>
                <Select value={newBranchId} onValueChange={setNewBranchId}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="license" className="text-xs font-semibold">License Category *</Label>
                <Select value={newLicense} onValueChange={setNewLicense}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B">Car (B)</SelectItem>
                    <SelectItem value="A">Motorbike (A)</SelectItem>
                    <SelectItem value="B, A">Car & Motorbike (B, A)</SelectItem>
                    <SelectItem value="B, C">Car & Heavy (B, C)</SelectItem>
                    <SelectItem value="A, B, C">All (A, B, C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="h-10">Cancel</Button>
              <Button onClick={handleAddInstructor} className="h-10 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground">Save Instructor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      } />

      <Card className="mb-4">
        <CardContent className="p-3 sm:p-4 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search instructors…" className="pl-9 h-10" />
          </div>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="h-10 sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Desktop */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Instructor</TableHead><TableHead>Branch</TableHead><TableHead>Assigned</TableHead>
              <TableHead>Today</TableHead><TableHead>Licence</TableHead><TableHead>Availability</TableHead>
              <TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-sky/15 text-sky grid place-items-center font-semibold text-xs">{i.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</div>
                      <div><div className="font-medium text-sm">{i.name}</div><div className="text-xs text-muted-foreground">{i.phone}</div></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{i.branch}</TableCell>
                  <TableCell className="text-sm">{i.assignedStudents} students</TableCell>
                  <TableCell className="text-sm">{i.todayLessons} lessons</TableCell>
                  <TableCell><StatusBadge tone="info">{i.licenseCategory}</StatusBadge></TableCell>
                  <TableCell><StatusBadge tone={i.leaveStatus === "available" ? "success" : "warning"}>{i.leaveStatus.replace("_", " ")}</StatusBadge></TableCell>
                  <TableCell><StatusBadge tone={i.accountStatus === "active" ? "success" : "neutral"}>{i.accountStatus}</StatusBadge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View profile</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem><CalendarClock className="h-4 w-4 mr-2" />Schedule</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3 sm:grid-cols-2">
        {filtered.map((i) => (
          <Card key={i.id}><CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-full bg-sky/15 text-sky grid place-items-center font-semibold shrink-0">{i.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{i.name}</div>
                <div className="text-xs text-muted-foreground">{i.phone} · {i.branch}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <StatusBadge tone="info">{i.licenseCategory}</StatusBadge>
                  <StatusBadge tone={i.leaveStatus === "available" ? "success" : "warning"}>{i.leaveStatus.replace("_", " ")}</StatusBadge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{i.assignedStudents} students · {i.todayLessons} lessons today</div>
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </>
  );
}

