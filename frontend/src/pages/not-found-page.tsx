import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { buttonStyles } from "@/components/button";
import { Card } from "@/components/card";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
            404
          </p>
          <h1 className="font-display text-4xl font-bold">{t("notFound.title")}</h1>
          <p className="text-base leading-7 text-[hsl(var(--muted-foreground))]">
            {t("empty.description")}
          </p>
        </div>
        <Link to="/" className={buttonStyles({ className: "rounded-full" })}>
          {t("common.returnHome")}
        </Link>
      </Card>
    </div>
  );
}
