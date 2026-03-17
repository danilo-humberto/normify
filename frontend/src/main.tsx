import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import { ThemeProvider } from "@/hooks/use-theme";
import { UploadFlowProvider } from "@/hooks/use-upload-flow";
import "@/i18n";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UploadFlowProvider>
          <App />
        </UploadFlowProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
