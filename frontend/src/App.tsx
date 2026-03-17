import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { LandingPage } from "@/pages/landing-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { ProcessingPage } from "@/pages/processing-page";
import { ResultPage } from "@/pages/result-page";
import { UploadPage } from "@/pages/upload-page";

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutWrapper />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
