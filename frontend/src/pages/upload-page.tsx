import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { FileUpload } from "@/components/file-upload";
import { useUploadFlow } from "@/hooks/use-upload-flow";

const acceptedExtensions = [".doc", ".docx"];

function isValidDocument(file: File) {
  const lowerCaseName = file.name.toLowerCase();
  return acceptedExtensions.some((extension) => lowerCaseName.endsWith(extension));
}

export function UploadPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    selectedFile,
    uploadProgress,
    setSelectedFile,
    setUploadProgress,
    setProcessingProgress,
    setStatus,
    status,
  } = useUploadFlow();
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "uploading" || !selectedFile) {
      return;
    }

    const interval = window.setInterval(() => {
      setUploadProgress((currentValue) => {
        if (currentValue >= 100) {
          window.clearInterval(interval);
          setStatus("uploaded");
          return 100;
        }

        return Math.min(currentValue + Math.random() * 14 + 8, 100);
      });
    }, 180);

    return () => window.clearInterval(interval);
  }, [selectedFile, setStatus, setUploadProgress, status]);

  const handleFileSelect = (file: File) => {
    if (!isValidDocument(file)) {
      setError(t("upload.invalidFile"));
      return;
    }

    setError("");
    setSelectedFile(file);
    setUploadProgress(0);
    setProcessingProgress(0);
    setStatus("uploading");
  };

  const handleFormatDocument = () => {
    setStatus("processing");
    navigate("/processing");
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <section className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
            {t("upload.eyebrow")}
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t("upload.title")}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            {t("upload.subtitle")}
          </p>
        </div>

        <FileUpload
          file={selectedFile}
          progress={uploadProgress}
          isUploading={status === "uploading"}
          error={error}
          onFileSelect={handleFileSelect}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="rounded-full"
            onClick={handleFormatDocument}
            disabled={!selectedFile || uploadProgress < 100}
          >
            {t("common.formatDocument")}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full"
            onClick={() => {
              setSelectedFile(null);
              setUploadProgress(0);
              setProcessingProgress(0);
              setStatus("idle");
              setError("");
            }}
          >
            {t("upload.replaceFile")}
          </Button>
        </div>
      </section>

      <aside className="space-y-5">
        <Card className="space-y-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[hsl(var(--accent-soft))] text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold">{t("upload.tipTitle")}</h2>
            <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              {t("common.supportedFormats")}
            </p>
          </div>
          <div className="space-y-3">
            {[t("upload.tipOne"), t("upload.tipTwo"), t("upload.tipThree")].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--border))] bg-white/50 p-4 dark:bg-slate-900/50"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                <p className="text-sm leading-6 text-[hsl(var(--foreground))]">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}
