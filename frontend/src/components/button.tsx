import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "sm" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[hsl(var(--accent))] text-white shadow-glow hover:bg-cyan-500 focus-visible:ring-cyan-400/60",
  secondary:
    "border border-[hsl(var(--border))] bg-white/70 text-[hsl(var(--foreground))] hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-900 focus-visible:ring-cyan-400/35",
  ghost:
    "text-[hsl(var(--foreground))] hover:bg-black/5 dark:hover:bg-white/5 focus-visible:ring-cyan-400/35",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-11 px-5 text-sm font-semibold",
  sm: "h-9 px-3.5 text-sm font-semibold",
  lg: "h-12 px-6 text-base font-semibold",
  icon: "h-11 w-11",
};

export function buttonStyles({
  variant = "primary",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "default", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
});
