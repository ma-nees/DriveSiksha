// ma-nees
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Check, Crown, Zap, ShieldCheck, ArrowRight } from "lucide-react";
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
      <PageHeader title="Subscription" description="Your active plan, resource usage, and billing management." />

      {/* Current Subscription Card */}
      <Card className="mb-6 overflow-hidden border-border/60 shadow-xs">
        <div className="bg-gradient-to-r from-brand via-brand/90 to-sky p-5 sm:p-7 text-brand-foreground relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Crown className="h-64 w-64 text-white" />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest font-semibold opacity-80 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Current Plan Status
              </div>
              <div className="text-2xl sm:text-4xl font-bold flex items-center gap-2.5 mt-1">
                {subscription.plan} Plan
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/20 uppercase tracking-wider">
                  Active
                </span>
              </div>
              <div className="text-xs sm:text-sm opacity-90 mt-1.5">
                {subscription.billing} billing · Renews on <strong className="font-semibold text-white">{subscription.expiryDate}</strong>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Button variant="secondary" size="sm" className="h-10 px-4 font-semibold shadow-xs" onClick={() => toast.success("Renewal process started")}>
                Renew Plan
              </Button>
              <Button size="sm" className="h-10 px-4 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground font-semibold shadow-xs">
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-5 sm:p-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 bg-card">
          <UsageBar label="Branches" used={subscription.branchesUsed} limit={subscription.branchLimit} unit="" />
          <UsageBar label="Students" used={subscription.studentsUsed} limit={subscription.studentLimit} unit="" />
          <UsageBar label="Instructors" used={subscription.instructorsUsed} limit={subscription.instructorLimit} unit="" />
          <UsageBar label="Storage Space" used={subscription.storageUsed} limit={subscription.storageLimit} unit=" GB" />
        </CardContent>
      </Card>

      {/* Plans Section */}
      <div className="mb-4">
        <PageHeader title="Available Plans" description="Choose the plan that fits your driving school growth." />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
        {plans.map((p) => {
          const isCurrent = p.name === subscription.plan;
          return (
            <Card
              key={p.name}
              className={cn(
                "relative flex flex-col justify-between h-full min-h-[420px] transition-all duration-200 hover:shadow-md hover:border-brand/40 group overflow-visible",
                p.popular ? "border-2 border-brand shadow-sm ring-2 ring-brand/15" : "border-border"
              )}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <StatusBadge tone="brand" className="shadow-xs font-semibold px-3 py-1 text-[11px] uppercase tracking-wider">
                    Most Popular
                  </StatusBadge>
                </div>
              )}

              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  <span>{p.name}</span>
                  {isCurrent && <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">Current</span>}
                </CardTitle>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">{formatNPR(p.price)}</span>
                  <span className="text-xs text-muted-foreground font-medium">/ month</span>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between gap-5">
                <div className="border-t border-border/50 pt-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Included Features</div>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-foreground/90">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span className="leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={cn(
                    "w-full h-10 font-semibold transition-all shadow-xs",
                    isCurrent
                      ? "bg-muted text-muted-foreground hover:bg-muted cursor-default border"
                      : "bg-brand hover:bg-brand/90 text-brand-foreground group-hover:shadow-sm"
                  )}
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent}
                  onClick={() => !isCurrent && toast.success(`Selected ${p.name} plan`)}
                >
                  {isCurrent ? "Current Plan" : `Choose ${p.name}`}
                  {!isCurrent && <ArrowRight className="h-4 w-4 ml-1.5" />}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instant eSewa Payment Banner Card */}
      <Card className="mt-6 border-success/30 bg-success/5 overflow-hidden">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-success/20 text-success grid place-items-center shrink-0">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-base text-foreground flex items-center gap-2">
                Instant eSewa Digital Payment
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Renew or upgrade instantly with eSewa digital wallet. Zero waiting time and automated instant receipt.
              </div>
            </div>
          </div>
          <Button
            size="lg"
            className="bg-success hover:bg-success/90 text-success-foreground font-semibold shadow-xs shrink-0 h-11"
            onClick={() => toast.success("Redirecting to eSewa payment gateway…")}
          >
            Pay {formatNPR(plans[1].price * 12)} via eSewa
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function UsageBar({ label, used, limit, unit }: { label: string; used: number; limit: number; unit: string }) {
  const pct = Math.round((used / limit) * 100);
  return (
    <div className="space-y-1.5 bg-muted/20 p-3 rounded-xl border border-border/50">
      <div className="flex justify-between items-center text-xs font-medium">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground font-mono text-[11px]">{used}{unit} / {limit}{unit} ({pct}%)</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}

