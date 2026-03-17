import { cn } from "@/utils/cn";

type LoaderProps = {
  progress?: number;
  label?: string;
  className?: string;
};

export function Loader({ progress = 0, label, className }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 bg-cyan-500/5" />
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-r-cyan-300 border-t-cyan-400 animate-spin"
          aria-hidden="true"
        />
        <div className="rounded-full bg-white/80 px-3 py-2 text-lg font-bold text-[hsl(var(--foreground))] shadow-soft dark:bg-slate-950/80">
          {Math.round(progress)}%
        </div>
      </div>
      {label ? <p className="text-sm text-[hsl(var(--muted-foreground))]">{label}</p> : null}
    </div>
  );
}
