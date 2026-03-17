import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import iconeNormify from "@/assets/icone-normify.png";
import logoNormify from "@/assets/logo-normify.png";
import { buttonStyles } from "@/components/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/utils/cn";

const navigationItems = [
  { key: "nav.features", href: "#features" },
  { key: "nav.howItWorks", href: "#how-it-works" },
];

export function Header() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-5 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label={t("common.brand")}
          className="inline-flex flex-shrink-0 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <div className="w-14 overflow-hidden md:hidden">
            <img
              src={iconeNormify}
              alt={t("common.brand")}
              className="h-10 w-auto max-w-none object-contain"
            />
          </div>
          <div className="hidden md:block md:w-[220px]">
            <img
              src={logoNormify}
              alt={t("common.brand")}
              className="h-16 w-auto object-contain"
            />
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white/70 px-2 py-1 shadow-soft backdrop-blur dark:bg-slate-950/70 md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.key}
              href={pathname === "/" ? item.href : `/${item.href}`}
              className="rounded-full px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              {t(item.key)}
            </a>
          ))}
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[hsl(var(--accent-soft))] text-[hsl(var(--foreground))] dark:bg-cyan-500/15 dark:text-cyan-200"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
              )
            }
          >
            {t("nav.upload")}
          </NavLink>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            to="/upload"
            className={buttonStyles({
              size: "sm",
              className: "hidden rounded-full sm:inline-flex",
            })}
          >
            {t("common.uploadDocument")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
