export function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildFormattedFileName(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return `${fileName}-abnt.docx`;
  }

  const baseName = fileName.slice(0, lastDotIndex);
  const extension = fileName.slice(lastDotIndex);

  return `${baseName}-abnt${extension}`;
}

export function downloadMockFormattedFile(file: File) {
  const objectUrl = window.URL.createObjectURL(file);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = buildFormattedFileName(file.name);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  window.setTimeout(() => {
    window.URL.revokeObjectURL(objectUrl);
  }, 1000);
}
