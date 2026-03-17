import { CheckCircle2, Download, RefreshCcw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Button, buttonStyles } from "@/components/button";
import { Card } from "@/components/card";
import { useUploadFlow } from "@/hooks/use-upload-flow";
import { buildFormattedFileName, downloadMockFormattedFile, formatFileSize } from "@/utils/file";

export function ResultPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedFile, resetFlow } = useUploadFlow();

  if (!selectedFile) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[hsl(var(--accent-soft))] text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold">{t("result.missingTitle")}</h1>
            <p className="text-base leading-7 text-[hsl(var(--muted-foreground))]">
              {t("result.missingDescription")}
            </p>
          </div>
          <Link to="/upload" className={buttonStyles({ className: "rounded-full" })}>
            {t("common.uploadDocument")}
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-6 p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {t("result.successBadge")}
          </span>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
              {t("result.eyebrow")}
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t("result.title")}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
              {t("result.subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="rounded-full"
              onClick={() => downloadMockFormattedFile(selectedFile)}
            >
              {t("common.downloadFile")}
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full"
              onClick={() => {
                resetFlow();
                navigate("/upload");
              }}
            >
              {t("common.uploadAnother")}
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="space-y-5 p-8">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold">{t("result.cardTitle")}</h2>
            <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              {t("result.cardDescription")}
            </p>
          </div>

          <div className="rounded-[24px] border border-[hsl(var(--border))] bg-white/55 p-5 dark:bg-slate-900/55">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
              {t("result.outputLabel")}
            </p>
            <p className="mt-3 break-all text-base font-semibold text-[hsl(var(--foreground))]">
              {buildFormattedFileName(selectedFile.name)}
            </p>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-200">
              {t("result.highlightsTitle")}
            </h3>
            {[t("result.highlightOne"), t("result.highlightTwo"), t("result.highlightThree")].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--border))] bg-white/55 p-4 dark:bg-slate-900/55"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                  <p className="text-sm leading-6 text-[hsl(var(--foreground))]">{item}</p>
                </div>
              ),
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
