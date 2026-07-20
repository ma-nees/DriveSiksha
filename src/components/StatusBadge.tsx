// ma-nees
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "brand";

const toneStyles: Record<Tone, string> = {
  success: "bg-success/12 text-success border-success/30",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  danger: "bg-accent-red/12 text-accent-red border-accent-red/30",
  info: "bg-sky/15 text-sky-foreground/90 border-sky/30",
  neutral: "bg-muted text-muted-foreground border-border",
  brand: "bg-brand/10 text-brand border-brand/20",
};

export function StatusBadge({ tone = "neutral", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        toneStyles[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}

