// ma-nees
import logoUrl from "@/assets/Logo.png";

export function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="DriveSiksha"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

export function LogoWithName({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Logo size={size} />
      <div className="min-w-0">
        <div className="font-bold tracking-tight leading-tight truncate">
          Drive<span className="text-accent-red">Siksha</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground leading-none">
          Driving School OS
        </div>
      </div>
    </div>
  );
}


