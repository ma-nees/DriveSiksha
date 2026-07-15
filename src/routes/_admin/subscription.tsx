import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Check, Crown, Zap } from "lucide-react";
import { subscription, plans } from "@/lib/mock-data";
import { formatNPR } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_admin/subscription")({
  component: SubscriptionPage,
  head: () => ({ meta: [{ title: "Subscription — DriveSiksha" }] }),
});

function SubscriptionPage() {
  return (
    <>
      <PageHeader title="Subscription" description="Your plan, usage and billing." />

      <Card className="mb-4 overflow-hidden">
        <div className="bg-gradient-to-r from-brand to-sky p-5 sm:p-6 text-brand-foreground">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-widest opacity-80">Current plan</div>
              <div className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mt-1"><Crown className="h-6 w-6" />{subscription.plan}</div>
              <div className="text-sm opacity-80 mt-1">{subscription.billing} billing · Renews {subscription.expiryDate}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => toast.success("Renewal initiated")}>Renew now</Button>
              <Button size="sm" className="bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground">Upgrade plan</Button>
            </div>
          </div>
        </div>
        <CardContent className="p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UsageBar label="Branches" used={subscription.branchesUsed} limit={subscription.branchLimit} unit="" />
          <UsageBar label="Students" used={subscription.studentsUsed} limit={subscription.studentLimit} unit="" />
          <UsageBar label="Instructors" used={subscription.instructorsUsed} limit={subscription.instructorLimit} unit="" />
          <UsageBar label="Storage" used={subscription.storageUsed} limit={subscription.storageLimit} unit=" GB" />
        </CardContent>
      </Card>

      <PageHeader title="Available plans" description="Upgrade or downgrade anytime." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((p) => (
          <Card key={p.name} className={cn("relative flex flex-col", p.popular && "border-brand ring-2 ring-brand/20")}>
            {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><StatusBadge tone="brand">Most popular</StatusBadge></div>}
            <CardHeader>
              <CardTitle className="text-lg">{p.name}</CardTitle>
              <div className="mt-2"><span className="text-3xl font-bold">{formatNPR(p.price)}</span> <span className="text-sm text-muted-foreground">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 text-sm flex-1">
                {p.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 text-success shrink-0 mt-0.5" />{f}</li>)}
              </ul>
              <Button className={cn("w-full mt-5", p.name === subscription.plan ? "" : "bg-brand hover:bg-brand/90 text-brand-foreground")} variant={p.name === subscription.plan ? "outline" : "default"} disabled={p.name === subscription.plan}>
                {p.name === subscription.plan ? "Current plan" : "Choose " + p.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Zap className="h-5 w-5 text-warning" />Pay with eSewa</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">Complete your renewal instantly using eSewa. Secure and instant confirmation.</div>
          <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => toast.success("Redirecting to eSewa…")}>Pay {formatNPR(plans[1].price * 12)} via eSewa</Button>
        </CardContent>
      </Card>
    </>
  );
}

function UsageBar({ label, used, limit, unit }: { label: string; used: number; limit: number; unit: string }) {
  const pct = (used / limit) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span className="font-medium">{label}</span><span className="text-muted-foreground">{used}{unit} / {limit}{unit}</span></div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
