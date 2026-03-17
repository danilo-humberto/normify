import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logoNormify from "@/assets/logo-normify.png";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/60 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-xl space-y-3">
          <Link to="/" className="inline-flex">
            <img
              src={logoNormify}
              alt={t("common.brand")}
              className="h-16 w-auto object-contain sm:h-20"
            />
          </Link>
          <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            {t("landing.footerTagline")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[hsl(var(--muted-foreground))]">
          <Link to="/upload" className="transition-colors hover:text-[hsl(var(--foreground))]">
            {t("footer.upload")}
          </Link>
          <a href="/#how-it-works" className="transition-colors hover:text-[hsl(var(--foreground))]">
            {t("footer.workflow")}
          </a>
          <a href="/#features" className="transition-colors hover:text-[hsl(var(--foreground))]">
            {t("footer.experience")}
          </a>
          <span>
            &copy; {new Date().getFullYear()} {t("common.brand")}. {t("footer.rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
