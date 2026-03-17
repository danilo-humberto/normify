import { useRef, useState, type DragEvent } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/card";
import { cn } from "@/utils/cn";
import { formatFileSize } from "@/utils/file";

type FileUploadProps = {
  file: File | null;
  progress: number;
  isUploading: boolean;
  error?: string;
  onFileSelect: (file: File) => void;
};

export function FileUpload({
  file,
  progress,
  isUploading,
  error,
  onFileSelect,
}: FileUploadProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (candidate: File | undefined) => {
    if (candidate) {
      onFileSelect(candidate);
    }
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-4">
      <Card className="p-0">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "group relative flex min-h-[280px] w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[28px] border border-dashed border-transparent px-6 py-10 text-center transition-all duration-300",
            isDragging
              ? "bg-cyan-500/10"
              : "bg-[linear-gradient(180deg,rgba(6,182,212,0.08),rgba(255,255,255,0.02))]",
          )}
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[hsl(var(--accent-soft))] text-cyan-700 shadow-soft transition-transform duration-300 group-hover:-translate-y-1 dark:bg-cyan-500/15 dark:text-cyan-200">
            <UploadCloud className="h-9 w-9" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">
              {t("upload.areaTitle")}
            </h3>
            <p className="mx-auto max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              {t("upload.areaSubtitle")}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[hsl(var(--muted-foreground))]">
              {t("common.supportedFormats")}
            </p>
          </div>
        </button>
      </Card>

      <input
        ref={inputRef}
        type="file"
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </p>
      ) : null}

      {file ? (
        <Card className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--accent-soft))] text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{file.name}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {t("upload.fileReady")}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))]">
              <span>{t("upload.progressLabel")}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300",
                  isUploading && "animate-pulse-soft",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
