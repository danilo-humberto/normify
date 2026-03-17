import {
  ArrowRight,
  CheckCheck,
  FileCheck2,
  Globe2,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { buttonStyles } from "@/components/button";
import { Card } from "@/components/card";

const featureIcons = [WandSparkles, CheckCheck, Globe2, Sparkles];
const stepIcons = [FileCheck2, Sparkles, CheckCheck];

export function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      title: t("landing.featureOneTitle"),
      description: t("landing.featureOneDescription"),
    },
    {
      title: t("landing.featureTwoTitle"),
      description: t("landing.featureTwoDescription"),
    },
    {
      title: t("landing.featureThreeTitle"),
      description: t("landing.featureThreeDescription"),
    },
    {
      title: t("landing.featureFourTitle"),
      description: t("landing.featureFourDescription"),
    },
  ];

  const steps = [
    {
      title: t("landing.stepOneTitle"),
      description: t("landing.stepOneDescription"),
    },
    {
      title: t("landing.stepTwoTitle"),
      description: t("landing.stepTwoDescription"),
    },
    {
      title: t("landing.stepThreeTitle"),
      description: t("landing.stepThreeDescription"),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <section className="grid items-center gap-10 px-1 pt-8 sm:px-0 lg:grid-cols-[1.1fr_0.9fr] lg:pt-12">
        <div className="space-y-8 animate-fade-up">
          <div className="inline-flex items-center rounded-full border border-cyan-500/15 bg-white/70 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-soft dark:bg-slate-950/70 dark:text-cyan-200">
            {t("landing.badge")}
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              {t("landing.title")}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[hsl(var(--muted-foreground))] sm:text-xl">
              {t("landing.subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/upload"
              className={buttonStyles({
                size: "lg",
                className: "rounded-full",
              })}
            >
              {t("landing.primaryCta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "rounded-full",
              })}
            >
              {t("landing.secondaryCta")}
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              t("landing.statsOne"),
              t("landing.statsTwo"),
              t("landing.statsThree"),
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[hsl(var(--border))] bg-white/60 px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))] shadow-soft dark:bg-slate-950/50"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:140ms]">
          <Card className="relative overflow-hidden p-7">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="font-display text-2xl font-bold">
                  {t("landing.previewTitle")}
                </p>
                <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {t("landing.previewLineThree")}
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  t("landing.previewLineOne"),
                  t("landing.previewLineTwo"),
                  t("landing.previewLineThree"),
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[linear-gradient(135deg,rgba(6,182,212,0.12),rgba(255,255,255,0.03))] p-4 dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(15,23,42,0.35))]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-sm font-bold shadow-soft dark:bg-slate-900/80">
                      0{index + 1}
                    </div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-[26px] border border-[hsl(var(--border))] bg-slate-950 p-5 text-slate-100 shadow-glow">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-display text-lg font-bold">
                    {t("landing.previewCardTitle")}
                  </p>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                    {t("landing.previewCardReady")}
                  </span>
                </div>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>{t("landing.previewCardItemOne")}</span>
                    <span className="text-emerald-300">OK</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>{t("landing.previewCardItemTwo")}</span>
                    <span className="text-emerald-300">OK</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>{t("landing.previewCardItemThree")}</span>
                    <span className="text-cyan-200">
                      {t("landing.previewCardProcessing")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="features" className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
            {t("nav.features")}
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {t("landing.featuresTitle")}
          </h2>
          <p className="text-base leading-7 text-[hsl(var(--muted-foreground))]">
            {t("landing.featuresSubtitle")}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = featureIcons[index];

            return (
              <Card
                key={feature.title}
                className="animate-fade-up space-y-5"
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[hsl(var(--accent-soft))] text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
            {t("nav.howItWorks")}
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {t("landing.howTitle")}
          </h2>
          <p className="text-base leading-7 text-[hsl(var(--muted-foreground))]">
            {t("landing.howSubtitle")}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];

            return (
              <Card
                key={step.title}
                className="animate-fade-up relative overflow-hidden"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="absolute right-5 top-5 text-5xl font-black text-black/5 dark:text-white/5">
                  {index + 1}
                </div>
                <div className="relative space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[hsl(var(--accent-soft))] text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                    {step.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
