import { startTransition } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";

const languageOptions = [
  { value: "pt", label: "PT" },
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
] as const;

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-white/75 p-1 text-xs shadow-soft backdrop-blur dark:bg-slate-950/70"
      aria-label={t("nav.language")}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full text-[hsl(var(--muted-foreground))]">
        <Languages className="h-4 w-4" />
      </span>
      {languageOptions.map((language) => (
        <button
          key={language.value}
          type="button"
          onClick={() => {
            startTransition(() => {
              void i18n.changeLanguage(language.value);
            });
          }}
          className={cn(
            "rounded-full px-3 py-2 font-semibold tracking-wide text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]",
            i18n.language === language.value &&
              "bg-[hsl(var(--accent-soft))] text-[hsl(var(--foreground))] dark:bg-cyan-500/15 dark:text-cyan-200",
          )}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
