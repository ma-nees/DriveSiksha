// ma-nees
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
  className?: string;
}

const toneMap = {
  brand: "bg-brand/10 text-brand",
  sky: "bg-sky/15 text-sky",
  red: "bg-accent-red/10 text-accent-red",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "brand",
  trend,
  className,
}: Props) {
  const valStr = String(value);
  const isLong = valStr.length > 11;
  const isMedium = valStr.length > 7;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-xs min-w-0",
        className,
      )}
    >
      <CardContent className="p-3 sm:p-4 lg:p-5 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-muted-foreground truncate" title={label}>
              {label}
            </div>
            <div
              className={cn(
                "mt-1 font-bold tracking-tight text-foreground whitespace-nowrap overflow-hidden text-ellipsis",
                isLong
                  ? "text-xs sm:text-base lg:text-lg"
                  : isMedium
                    ? "text-sm sm:text-lg lg:text-xl"
                    : "text-lg sm:text-2xl lg:text-3xl",
              )}
              title={valStr}
            >
              {value}
            </div>
            {hint && (
              <div
                className="mt-1 text-[10px] sm:text-xs text-muted-foreground truncate"
                title={hint}
              >
                {hint}
              </div>
            )}
          </div>
          <div
            className={cn(
              "shrink-0 grid h-7 w-7 sm:h-10 sm:w-10 place-items-center rounded-lg sm:rounded-xl",
              toneMap[tone],
            )}
          >
            <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
          </div>
        </div>
        {trend && <div className="mt-2 text-[11px] font-medium text-success truncate">{trend}</div>}
      </CardContent>
    </Card>
  );
}
