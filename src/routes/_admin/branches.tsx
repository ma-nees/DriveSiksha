import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Building2, Users, GraduationCap, MapPin, Phone, MoreVertical, Edit, Power } from "lucide-react";
import { branches, subscription } from "@/lib/mock-data";
import { formatNPR } from "@/lib/format";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_admin/branches")({
  component: BranchesPage,
  head: () => ({ meta: [{ title: "Branches — DriveSiksha" }, { name: "description", content: "Manage all your driving school branches, staff and revenue." }] }),
});

function BranchesPage() {
  const atLimit = subscription.branchesUsed >= subscription.branchLimit;
  return (
    <>
      <PageHeader title="Branch management" description={`${subscription.branchesUsed} of ${subscription.branchLimit} branches used on your ${subscription.plan} plan`}
        actions={
          <Button size="sm" disabled={atLimit} className="h-9 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground disabled:opacity-50"
            onClick={() => atLimit ? toast.error("Plan limit reached. Upgrade to add more branches.") : toast.success("Add branch modal opened")}>
            <Plus className="h-4 w-4 mr-1.5" />Add Branch
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-medium">Branch usage</div>
              <div className="text-xs text-muted-foreground">{subscription.branchesUsed} of {subscription.branchLimit} branches on {subscription.plan} plan</div>
            </div>
            <Button variant="outline" size="sm">Upgrade plan</Button>
          </div>
          <Progress value={(subscription.branchesUsed / subscription.branchLimit) * 100} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {branches.map((b) => (
          <Card key={b.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-2 bg-gradient-to-r from-brand to-sky" />
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-brand/10 text-brand grid place-items-center shrink-0"><Building2 className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{b.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{b.address}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem><Power className="h-4 w-4 mr-2" />Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{b.phone}</div>
                <div className="mt-1">Manager: <span className="text-foreground font-medium">{b.manager}</span></div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t">
                <Stat icon={Users} label="Students" value={b.totalStudents} />
                <Stat icon={GraduationCap} label="Instructors" value={b.totalInstructors} />
                <Stat label="Revenue" value={formatNPR(b.monthlyRevenue)} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <StatusBadge tone="success">{b.status}</StatusBadge>
                <Button variant="ghost" size="sm">View details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="text-center">
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground mx-auto" />}
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      <div className="text-xs font-semibold truncate">{value}</div>
    </div>
  );
}
