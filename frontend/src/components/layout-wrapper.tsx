import { Outlet } from "react-router-dom";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export function LayoutWrapper() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-5%] h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/15" />
        <div className="absolute right-[-6%] top-[18%] h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-200/30 blur-3xl dark:bg-sky-400/10" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
