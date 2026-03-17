import { useEffect } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { buttonStyles } from "@/components/button";
import { Card } from "@/components/card";
import { Loader } from "@/components/loader";
import { useUploadFlow } from "@/hooks/use-upload-flow";

export function ProcessingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    selectedFile,
    processingProgress,
    setProcessingProgress,
    setStatus,
    status,
  } = useUploadFlow();

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    if (status !== "processing" && status !== "done") {
      setStatus("processing");
    }

    if (status === "done") {
      return;
    }

    const interval = window.setInterval(() => {
      setProcessingProgress((currentValue) => {
        if (currentValue >= 100) {
          window.clearInterval(interval);
          setStatus("done");
          window.setTimeout(() => navigate("/result"), 650);
          return 100;
        }

        return Math.min(currentValue + Math.random() * 12 + 7, 100);
      });
    }, 220);

    return () => window.clearInterval(interval);
  }, [navigate, selectedFile, setProcessingProgress, setStatus, status]);

  const stages = [t("processing.stageOne"), t("processing.stageTwo"), t("processing.stageThree")];
  const activeStageIndex = processingProgress < 34 ? 0 : processingProgress < 74 ? 1 : 2;

  if (!selectedFile) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[hsl(var(--accent-soft))] text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold">{t("processing.missingTitle")}</h1>
            <p className="text-base leading-7 text-[hsl(var(--muted-foreground))]">
              {t("processing.missingDescription")}
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
    <div className="mx-auto flex min-h-[72vh] w-full max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="flex flex-col items-center justify-center gap-6 p-8 text-center">
          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
            {t("processing.eyebrow")}
          </span>
          <Loader progress={processingProgress} label={selectedFile.name} />
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold">{t("processing.title")}</h1>
            <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              {t("processing.subtitle")}
            </p>
          </div>
        </Card>

        <Card className="space-y-5 p-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
              {Math.round(processingProgress)}% {t("processing.progressSuffix")}
            </p>
            <h2 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">
              {t("processing.workflowTitle")}
            </h2>
          </div>

          <div className="space-y-4">
            {stages.map((stage, index) => {
              const isComplete = processingProgress >= 100 || index < activeStageIndex;
              const isCurrent = index === activeStageIndex;

              return (
                <div
                  key={stage}
                  className="flex items-center gap-4 rounded-[24px] border border-[hsl(var(--border))] bg-white/55 p-4 dark:bg-slate-900/55"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      isComplete || isCurrent
                        ? "bg-[hsl(var(--accent-soft))] text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200"
                        : "bg-black/5 text-[hsl(var(--muted-foreground))] dark:bg-white/5"
                    }`}
                  >
                    {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-bold">0{index + 1}</span>}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{stage}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {isComplete
                        ? t("processing.stageComplete")
                        : isCurrent
                          ? t("processing.stageProgress")
                          : t("processing.stagePending")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
