import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[hsl(var(--border))] bg-white/80 p-6 shadow-soft backdrop-blur-xl dark:bg-slate-950/70",
        className,
      )}
      {...props}
    />
  );
}
