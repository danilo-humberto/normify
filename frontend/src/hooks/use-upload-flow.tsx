import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type FlowStatus = "idle" | "uploading" | "uploaded" | "processing" | "done";

type UploadFlowContextValue = {
  selectedFile: File | null;
  uploadProgress: number;
  processingProgress: number;
  status: FlowStatus;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  setUploadProgress: Dispatch<SetStateAction<number>>;
  setProcessingProgress: Dispatch<SetStateAction<number>>;
  setStatus: Dispatch<SetStateAction<FlowStatus>>;
  resetFlow: () => void;
};

const UploadFlowContext = createContext<UploadFlowContextValue | null>(null);

export function UploadFlowProvider({ children }: { children: ReactNode }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [status, setStatus] = useState<FlowStatus>("idle");

  const value = useMemo(
    () => ({
      selectedFile,
      uploadProgress,
      processingProgress,
      status,
      setSelectedFile,
      setUploadProgress,
      setProcessingProgress,
      setStatus,
      resetFlow: () => {
        setSelectedFile(null);
        setUploadProgress(0);
        setProcessingProgress(0);
        setStatus("idle");
      },
    }),
    [selectedFile, uploadProgress, processingProgress, status],
  );

  return <UploadFlowContext.Provider value={value}>{children}</UploadFlowContext.Provider>;
}

export function useUploadFlow() {
  const context = useContext(UploadFlowContext);

  if (!context) {
    throw new Error("useUploadFlow must be used within UploadFlowProvider");
  }

  return context;
}
