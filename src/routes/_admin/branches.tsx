// ma-nees
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Building2, Users, GraduationCap, MapPin, Phone, MoreVertical, Edit, Power, Wallet, UserCheck } from "lucide-react";
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
            <Button variant="outline" size="sm" asChild>
              <Link to="/subscription">Upgrade plan</Link>
            </Button>
          </div>
          <Progress value={(subscription.branchesUsed / subscription.branchLimit) * 100} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((b) => (
          <Card key={b.id} className="group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-brand/40 flex flex-col justify-between">
            <div className="h-1.5 bg-gradient-to-r from-brand via-sky to-brand" />
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-brand/10 text-brand grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-base truncate group-hover:text-brand transition-colors">{b.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span className="truncate">{b.address}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast.success(`Editing ${b.name}`)}><Edit className="h-4 w-4 mr-2" />Edit branch</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.error(`Deactivated ${b.name}`)}><Power className="h-4 w-4 mr-2" />Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                    <span>{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <UserCheck className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                    <span>Manager: <strong className="font-medium text-foreground">{b.manager}</strong></span>
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-3 gap-1.5 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="text-center min-w-0">
                    <Users className="h-3.5 w-3.5 text-brand mx-auto mb-1" />
                    <div className="text-[11px] text-muted-foreground">Students</div>
                    <div className="text-xs font-bold text-foreground mt-0.5">{b.totalStudents}</div>
                  </div>
                  <div className="text-center min-w-0 border-x border-border/50 px-1">
                    <GraduationCap className="h-3.5 w-3.5 text-sky mx-auto mb-1" />
                    <div className="text-[11px] text-muted-foreground">Instructors</div>
                    <div className="text-xs font-bold text-foreground mt-0.5">{b.totalInstructors}</div>
                  </div>
                  <div className="text-center min-w-0">
                    <Wallet className="h-3.5 w-3.5 text-success mx-auto mb-1" />
                    <div className="text-[11px] text-muted-foreground">Revenue</div>
                    <div className="text-[11px] sm:text-xs font-bold text-foreground mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis" title={formatNPR(b.monthlyRevenue)}>
                      {formatNPR(b.monthlyRevenue)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border/40">
                <StatusBadge tone="success">{b.status}</StatusBadge>
                <Button variant="ghost" size="sm" className="h-8 text-xs hover:text-brand" onClick={() => toast.info(`Viewing details for ${b.name}`)}>
                  View details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

