import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "brand" | "sky" | "red" | "success" | "warning";
  trend?: string;
}

const toneMap = {
  brand: "bg-brand/10 text-brand",
  sky: "bg-sky/15 text-sky",
  red: "bg-accent-red/10 text-accent-red",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "brand", trend }: Props) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{label}</div>
            <div className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight truncate">{value}</div>
            {hint && <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">{hint}</div>}
          </div>
          <div className={cn("shrink-0 grid h-10 w-10 place-items-center rounded-xl", toneMap[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="mt-3 text-[11px] font-medium text-success">{trend}</div>
        )}
      </CardContent>
    </Card>
  );
}
